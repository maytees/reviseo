"use client";

import { CheckIcon, CodeIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateStyleEditStatus } from "@/app/(main)/(dashboard)/dashboard/websites/[id]/_components/feedback/actions";
import {
	parseStyleChanges,
	StyleChangeRows,
	styleEditToCss,
} from "@/components/style-change-rows";
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

export type StyleEditPayload = FeedbackSelectAllPayload["styleEdits"][number];

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

const StyleEditCard = ({
	edit,
	readOnly,
}: {
	edit: StyleEditPayload;
	readOnly: boolean;
}) => {
	const [status, setStatus] = useState<TextEditStatus>(edit.status);
	const [isPending, startTransition] = useTransition();
	const [copied, setCopied] = useState(false);

	const changes = parseStyleChanges(edit.changes);

	const handleStatusChange = (value: TextEditStatus) => {
		const previous = status;
		setStatus(value);
		startTransition(async () => {
			const result = await updateStyleEditStatus(edit.id, value);
			if (result.status === "error") {
				setStatus(previous);
				toast.error(result.message);
			}
		});
	};

	const copyCss = async () => {
		try {
			await navigator.clipboard.writeText(
				styleEditToCss(edit.selector, changes),
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
				<div className="flex min-w-0 items-center gap-2">
					<span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
						{edit.elementTag ?? "element"}
					</span>
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
				</div>
				<div className="flex shrink-0 items-center gap-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-7"
								onClick={copyCss}
							>
								{copied ? (
									<CheckIcon className="size-3.5 text-emerald-500" />
								) : (
									<CodeIcon className="size-3.5" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>Copy as CSS</TooltipContent>
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
			<div className="mb-2 truncate font-mono text-muted-foreground text-xs">
				{edit.selector}
			</div>
			<StyleChangeRows changes={changes} />
		</div>
	);
};

/** Suggested style changes of a STYLE_EDIT feedback. `readOnly` hides the
 *  status controls (client portal); the dashboard gets the full toolset. */
const StyleEditList = ({
	edits,
	readOnly = false,
}: {
	edits: StyleEditPayload[];
	readOnly?: boolean;
}) => {
	if (edits.length === 0) return null;
	return (
		<div className="flex flex-col gap-2">
			{edits.map((edit) => (
				<StyleEditCard key={edit.id} edit={edit} readOnly={readOnly} />
			))}
		</div>
	);
};

export default StyleEditList;
