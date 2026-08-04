"use client";

import { CheckIcon, DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateImageEditStatus } from "@/app/(main)/(dashboard)/dashboard/websites/[id]/_components/feedback/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type FeedbackSelectAllPayload,
	TEXT_EDIT_STATUS_CONFIG,
} from "@/lib/types";
import type { TextEditStatus } from "@/prisma/generated/client/enums";

export type ImageEditPayload = FeedbackSelectAllPayload["imageEdits"][number];

const STATUS_BADGE: Record<
	TextEditStatus,
	"warning" | "success" | "destructive"
> = {
	PENDING: "warning",
	APPLIED: "success",
	REJECTED: "destructive",
};

const getUrlPath = (url: string) => {
	try {
		const u = new URL(url);
		return `${u.pathname}${u.search}` || "/";
	} catch {
		return url;
	}
};

/** Where the replacement image lives: our bucket (via the serve route) or
 *  the remote URL the client linked. */
const replacementUrl = (edit: ImageEditPayload) =>
	edit.newKey ? `/api/s3/image-edits/${edit.newKey}` : (edit.newUrl ?? "");

const ImageEditCard = ({
	edit,
	readOnly,
}: {
	edit: ImageEditPayload;
	readOnly: boolean;
}) => {
	const [status, setStatus] = useState<TextEditStatus>(edit.status);
	const [isPending, startTransition] = useTransition();
	const [copied, setCopied] = useState(false);

	const handleStatusChange = (value: TextEditStatus) => {
		const previous = status;
		setStatus(value);
		startTransition(async () => {
			const result = await updateImageEditStatus(edit.id, value);
			if (result.status === "error") {
				setStatus(previous);
				toast.error(result.message);
			}
		});
	};

	const copyReplacementUrl = async () => {
		try {
			const url = replacementUrl(edit);
			await navigator.clipboard.writeText(
				url.startsWith("/") ? `${window.location.origin}${url}` : url,
			);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {
			toast.error("Couldn't copy to clipboard");
		}
	};

	const statusConfig = TEXT_EDIT_STATUS_CONFIG[status];
	const StatusIcon = statusConfig.icon;

	return (
		<div className="rounded-lg border border-border bg-card/30 p-3">
			<div className="mb-2 flex flex-wrap items-center justify-between gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href={edit.pageUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex min-w-0 items-center gap-1 text-muted-foreground text-xs hover:text-foreground hover:underline"
						>
							<span className="truncate">{getUrlPath(edit.pageUrl)}</span>
							<ExternalLinkIcon className="size-3 shrink-0" />
						</Link>
					</TooltipTrigger>
					<TooltipContent>Open the page</TooltipContent>
				</Tooltip>
				<div className="flex shrink-0 items-center gap-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-7"
								onClick={copyReplacementUrl}
							>
								{copied ? (
									<CheckIcon className="size-3.5 text-emerald-500" />
								) : (
									<DownloadIcon className="size-3.5" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>Copy replacement image URL</TooltipContent>
					</Tooltip>
					{readOnly ? (
						<Badge variant={STATUS_BADGE[status]} className="ml-1">
							<StatusIcon className="mr-1 size-3" />
							{statusConfig.label}
						</Badge>
					) : (
						<Select
							value={status}
							onValueChange={(v) => handleStatusChange(v as TextEditStatus)}
							disabled={isPending}
						>
							<SelectTrigger className="ml-1 h-7 w-[7.5rem] text-xs" size="sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{(
									Object.entries(TEXT_EDIT_STATUS_CONFIG) as [
										TextEditStatus,
										(typeof TEXT_EDIT_STATUS_CONFIG)[TextEditStatus],
									][]
								).map(([key, config]) => {
									const Icon = config.icon;
									return (
										<SelectItem key={key} value={key}>
											<div className="flex items-center gap-2">
												<Icon className={`size-3.5 ${config.color}`} />
												<span>{config.label}</span>
											</div>
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					)}
				</div>
			</div>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<div className="flex flex-col items-center gap-1">
					<span className="text-muted-foreground text-xs">Original</span>
					{/* biome-ignore lint/performance/noImgElement: arbitrary external source */}
					<img
						src={edit.originalSrc}
						alt="Original"
						className="h-24 w-36 rounded-lg border border-border object-cover"
					/>
				</div>
				<span className="text-muted-foreground">→</span>
				<div className="flex flex-col items-center gap-1">
					<span className="text-muted-foreground text-xs">Replacement</span>
					{/* biome-ignore lint/performance/noImgElement: bucket-served / arbitrary source */}
					<img
						src={replacementUrl(edit)}
						alt="Replacement"
						className="h-24 w-36 rounded-lg border border-border object-cover"
					/>
				</div>
			</div>
		</div>
	);
};

/** Image replacements of an IMAGE_EDIT feedback. `readOnly` hides the
 *  status controls (client portal); the dashboard gets the full toolset. */
const ImageEditList = ({
	edits,
	readOnly = false,
}: {
	edits: ImageEditPayload[];
	readOnly?: boolean;
}) => {
	if (edits.length === 0) return null;
	return (
		<div className="flex flex-col gap-2">
			{edits.map((edit) => (
				<ImageEditCard key={edit.id} edit={edit} readOnly={readOnly} />
			))}
		</div>
	);
};

export default ImageEditList;
