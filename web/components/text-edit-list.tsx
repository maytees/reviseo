"use client";

import {
	CheckIcon,
	CopyIcon,
	ExternalLinkIcon,
	SquareDashedMousePointerIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateTextEditStatus } from "@/app/(main)/(dashboard)/dashboard/websites/[id]/_components/feedback/actions";
import { DiffText } from "@/components/text-edit-diff";
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

export type TextEditPayload = FeedbackSelectAllPayload["textEdits"][number];

const STATUS_BADGE: Record<
	TextEditStatus,
	"warning" | "success" | "destructive"
> = {
	PENDING: "warning",
	APPLIED: "success",
	REJECTED: "destructive",
};

/** Chrome/Edge scroll-to-text deep link straight to the sentence on the
 *  live page. Word-boundary truncation — mid-word prefixes don't match. */
const scrollToTextUrl = (pageUrl: string, originalText: string) => {
	const fragment = originalText.split(" ").slice(0, 8).join(" ");
	return `${pageUrl}#:~:text=${encodeURIComponent(fragment)}`;
};

const getUrlPath = (url: string) => {
	try {
		const u = new URL(url);
		return `${u.pathname}${u.search}` || "/";
	} catch {
		return url;
	}
};

const TextEditCard = ({
	edit,
	readOnly,
}: {
	edit: TextEditPayload;
	readOnly: boolean;
}) => {
	const [status, setStatus] = useState<TextEditStatus>(edit.status);
	const [isPending, startTransition] = useTransition();
	const [copied, setCopied] = useState(false);

	const handleStatusChange = (value: TextEditStatus) => {
		const previous = status;
		setStatus(value);
		startTransition(async () => {
			const result = await updateTextEditStatus(edit.id, value);
			if (result.status === "error") {
				setStatus(previous);
				toast.error(result.message);
			}
		});
	};

	const copySuggested = async () => {
		try {
			await navigator.clipboard.writeText(edit.suggestedText);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {
			toast.error("Couldn't copy to clipboard");
		}
	};

	const copySelector = async () => {
		try {
			await navigator.clipboard.writeText(edit.selector);
			toast.success("Selector copied");
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
						{edit.elementTag ?? "text"}
					</span>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href={scrollToTextUrl(edit.pageUrl, edit.originalText)}
								target="_blank"
								rel="noopener noreferrer"
								className="flex min-w-0 items-center gap-1 text-muted-foreground text-xs hover:text-foreground hover:underline"
							>
								<span className="truncate">{getUrlPath(edit.pageUrl)}</span>
								<ExternalLinkIcon className="size-3 shrink-0" />
							</Link>
						</TooltipTrigger>
						<TooltipContent>
							Open the page scrolled to this text (Chrome/Edge)
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="flex shrink-0 items-center gap-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-7"
								onClick={copySuggested}
							>
								{copied ? (
									<CheckIcon className="size-3.5 text-emerald-500" />
								) : (
									<CopyIcon className="size-3.5" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>Copy suggested text</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-7"
								onClick={copySelector}
							>
								<SquareDashedMousePointerIcon className="size-3.5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Copy CSS selector</TooltipContent>
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
			<DiffText original={edit.originalText} suggested={edit.suggestedText} />
		</div>
	);
};

/** Suggested copy changes of a TEXT_EDIT feedback. `readOnly` hides the
 *  status controls (client portal); the dashboard gets the full toolset. */
const TextEditList = ({
	edits,
	readOnly = false,
}: {
	edits: TextEditPayload[];
	readOnly?: boolean;
}) => {
	if (edits.length === 0) return null;
	return (
		<div className="flex flex-col gap-2">
			{edits.map((edit) => (
				<TextEditCard key={edit.id} edit={edit} readOnly={readOnly} />
			))}
		</div>
	);
};

export default TextEditList;
