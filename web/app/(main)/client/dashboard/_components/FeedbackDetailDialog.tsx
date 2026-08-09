"use client";

import { ExternalLinkIcon, EyeIcon } from "lucide-react";
import moment from "moment";
import ScreenshotPreview from "@/app/(main)/(dashboard)/dashboard/_components/ScreenshotPreview";
import ImageEditList from "@/components/image-edit-list";
import StyleEditList from "@/components/style-edit-list";
import TextEditList from "@/components/text-edit-list";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	APPROVAL_CONFIG,
	type FeedbackSelectAllPayload,
	PRIORITY_BADGE_MAP,
	PRIORITY_CONFIG,
	STATUS_BADGE_MAP,
	STATUS_CONFIG,
	TYPE_BADGE_MAP,
	TYPE_CONFIG,
} from "@/lib/types";

type FeedbackDetailDialogProps = {
	item: FeedbackSelectAllPayload | null;
	onOpenChange: (open: boolean) => void;
};

export default function FeedbackDetailDialog({
	item,
	onOpenChange,
}: FeedbackDetailDialogProps) {
	if (!item) {
		return null;
	}

	const typeConfig = TYPE_CONFIG[item.type];
	const TypeIcon = typeConfig.icon;
	const statusConfig = STATUS_CONFIG[item.status];
	const StatusIcon = statusConfig.icon;
	const priorityConfig = PRIORITY_CONFIG[item.priority];
	const PriorityIcon = priorityConfig.icon;
	const approvalConfig = APPROVAL_CONFIG[item.approval];

	const environment = [
		item.browser && `${item.browser} ${item.browserVersion ?? ""}`.trim(),
		item.os,
		item.device,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<Dialog open onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[85vh] gap-4 overflow-y-auto sm:max-w-2xl">
				<DialogHeader className="gap-2">
					<DialogTitle className="pr-6 text-left">{item.title}</DialogTitle>
					<div className="flex flex-wrap items-center gap-1.5">
						<Badge variant={TYPE_BADGE_MAP[item.type]} appearance="outline">
							<TypeIcon className="size-3" />
							{typeConfig.label}
						</Badge>
						<Badge
							variant={PRIORITY_BADGE_MAP[item.priority]}
							appearance="outline"
						>
							<PriorityIcon className="size-3" />
							{priorityConfig.label}
						</Badge>
						<Badge variant={STATUS_BADGE_MAP[item.status]} appearance="outline">
							<StatusIcon className="size-3" />
							{statusConfig.label}
						</Badge>
						{approvalConfig && (
							<Badge variant={approvalConfig.badge} appearance="light">
								{approvalConfig.label}
							</Badge>
						)}
						<span className="text-muted-foreground text-xs">
							{moment(item.createdAt).fromNow()}
						</span>
					</div>
				</DialogHeader>

				{item.approval === "REJECTED" && item.approvalNote && (
					<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
						<span className="font-medium text-destructive">
							Note from your team lead:
						</span>{" "}
						{item.approvalNote}
					</div>
				)}

				{(item.type === "BUG" || item.type === "IMPROVEMENT") &&
					item.screenshotKey && (
						<ScreenshotPreview app_url="" screenshotKey={item.screenshotKey} />
					)}
				{item.type === "TEXT_EDIT" && item.textEdits.length > 0 && (
					<TextEditList edits={item.textEdits} readOnly />
				)}
				{item.type === "STYLE_EDIT" && item.styleEdits.length > 0 && (
					<StyleEditList edits={item.styleEdits} readOnly />
				)}
				{item.type === "IMAGE_EDIT" && item.imageEdits.length > 0 && (
					<ImageEditList edits={item.imageEdits} readOnly />
				)}

				{item.description && (
					<p className="text-muted-foreground text-sm">{item.description}</p>
				)}

				<div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-border/60 border-t pt-3 text-muted-foreground text-xs">
					<a
						href={item.pageUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex min-w-0 items-center gap-1 hover:text-foreground"
					>
						<span className="truncate">{item.pageUrl}</span>
						<ExternalLinkIcon className="size-3 shrink-0" />
					</a>
					{environment && <span>{environment}</span>}
					{(item.type === "TEXT_EDIT" ||
						item.type === "STYLE_EDIT" ||
						item.type === "IMAGE_EDIT") && (
						<a
							// Opens the live page with the widget in preview mode,
							// focused on this submission.
							href={`${item.pageUrl.split("#")[0]}#reviseo-preview=${item.id}`}
							target="_blank"
							rel="noopener noreferrer"
							className="ml-auto inline-flex items-center gap-1 font-medium text-primary hover:underline"
						>
							<EyeIcon className="size-3.5" />
							Preview on site
						</a>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
