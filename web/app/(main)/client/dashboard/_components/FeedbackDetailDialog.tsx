"use client";

import { ExternalLinkIcon } from "lucide-react";
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
			<DialogContent variant="feedback" className="overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="pr-6 text-left">{item.title}</DialogTitle>
					<div className="flex flex-wrap items-center gap-2 pt-1">
						<Badge
							variant={TYPE_BADGE_MAP[item.type]}
							appearance="outline"
							size="lg"
						>
							<TypeIcon className="size-3.5" />
							{typeConfig.label}
						</Badge>
						<Badge
							variant={PRIORITY_BADGE_MAP[item.priority]}
							appearance="outline"
							size="lg"
						>
							<PriorityIcon className="size-3.5" />
							{priorityConfig.label}
						</Badge>
						<Badge
							variant={STATUS_BADGE_MAP[item.status]}
							appearance="outline"
							size="lg"
						>
							<StatusIcon className="size-3.5" />
							{statusConfig.label}
						</Badge>
						{approvalConfig && (
							<Badge
								variant={approvalConfig.badge}
								appearance="light"
								size="lg"
							>
								{approvalConfig.label}
							</Badge>
						)}
						<Badge variant="outline" appearance="outline" size="lg">
							{moment(item.createdAt).fromNow()}
						</Badge>
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

				<p className="text-muted-foreground text-sm">
					{item.description || "No description provided."}
				</p>

				<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
					<a
						href={item.pageUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1 hover:text-foreground"
					>
						{item.pageUrl}
						<ExternalLinkIcon className="size-3" />
					</a>
					{environment && <span>{environment}</span>}
				</div>
			</DialogContent>
		</Dialog>
	);
}
