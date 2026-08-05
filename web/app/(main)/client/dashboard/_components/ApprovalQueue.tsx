"use client";

import {
	CheckIcon,
	ChevronDownIcon,
	MessageSquarePlusIcon,
	XIcon,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ImageEditList from "@/components/image-edit-list";
import StyleEditList from "@/components/style-edit-list";
import TextEditList from "@/components/text-edit-list";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type FeedbackSelectAllPayload,
	TYPE_BADGE_MAP,
	TYPE_CONFIG,
} from "@/lib/types";
import { cn } from "@/lib/utils";

import { decideFeedbackApproval } from "../actions";

// Static tint map — Tailwind can't see dynamically-built class strings.
const TYPE_TINTS: Record<
	FeedbackSelectAllPayload["type"],
	{ tile: string; icon: string }
> = {
	BUG: { tile: "bg-red-300/15", icon: "text-red-500" },
	IMPROVEMENT: { tile: "bg-blue-300/15", icon: "text-blue-500" },
	TEXT_EDIT: { tile: "bg-violet-300/15", icon: "text-violet-500" },
	STYLE_EDIT: { tile: "bg-fuchsia-300/15", icon: "text-fuchsia-500" },
	IMAGE_EDIT: { tile: "bg-cyan-300/15", icon: "text-cyan-500" },
};

function initials(name?: string | null, email?: string | null) {
	const source = name?.trim() || email || "?";
	const parts = source.split(/\s+/).filter(Boolean);
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
	return source.slice(0, 2).toUpperCase();
}

const ApprovalCard = ({ item }: { item: FeedbackSelectAllPayload }) => {
	const router = useRouter();
	const [expanded, setExpanded] = useState(false);
	const [showNote, setShowNote] = useState(false);
	const [note, setNote] = useState("");
	const [isPending, startTransition] = useTransition();

	const decide = (decision: "APPROVED" | "REJECTED") => {
		startTransition(async () => {
			const result = await decideFeedbackApproval(
				item.id,
				decision,
				note || undefined,
			);
			if (result.status === "error") toast.error(result.message);
			else {
				toast.success(result.message);
				router.refresh();
			}
		});
	};

	const typeConfig = TYPE_CONFIG[item.type];
	const TypeIcon = typeConfig.icon;
	const tint = TYPE_TINTS[item.type];
	const hasScreenshot =
		(item.type === "BUG" || item.type === "IMPROVEMENT") && item.screenshotKey;

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-border p-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 items-center gap-3">
					{hasScreenshot ? (
						// biome-ignore lint/performance/noImgElement: streamed annotation
						<img
							src={`/api/s3/annotations/${item.screenshotKey}`}
							alt="Annotated screenshot"
							className="aspect-video w-20 shrink-0 rounded-md border border-border object-cover"
						/>
					) : (
						<div
							className={cn(
								"flex size-10 shrink-0 items-center justify-center rounded-md",
								tint.tile,
							)}
						>
							<TypeIcon className={cn("size-4.5", tint.icon)} />
						</div>
					)}
					<div className="flex min-w-0 flex-col gap-1">
						<span className="truncate font-medium">{item.title}</span>
						<span className="flex items-center gap-1.5 text-muted-foreground text-xs">
							<Avatar className="size-4.5">
								<AvatarFallback className="text-[0.55rem]">
									{initials(item.author?.name, item.author?.email)}
								</AvatarFallback>
							</Avatar>
							{item.author?.name || item.author?.email || "Teammate"} ·{" "}
							{moment(item.createdAt).fromNow()}
						</span>
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-1.5">
					<Tooltip>
						<TooltipTrigger asChild>
							<Badge
								variant={TYPE_BADGE_MAP[item.type]}
								appearance="outline"
								size="sm"
							>
								<TypeIcon className="size-3" />
							</Badge>
						</TooltipTrigger>
						<TooltipContent>{typeConfig.label}</TooltipContent>
					</Tooltip>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setExpanded((v) => !v)}
					>
						<ChevronDownIcon
							className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
						/>
						{expanded ? "Hide" : "Preview"}
					</Button>
				</div>
			</div>

			{expanded && (
				<div className="flex flex-col gap-2">
					{item.description && (
						<p className="text-muted-foreground text-sm">{item.description}</p>
					)}
					{item.type === "TEXT_EDIT" && (
						<TextEditList edits={item.textEdits} readOnly />
					)}
					{item.type === "STYLE_EDIT" && (
						<StyleEditList edits={item.styleEdits} readOnly />
					)}
					{item.type === "IMAGE_EDIT" && (
						<ImageEditList edits={item.imageEdits} readOnly />
					)}
					{hasScreenshot && (
						// biome-ignore lint/performance/noImgElement: streamed annotation
						<img
							src={`/api/s3/annotations/${item.screenshotKey}`}
							alt="Annotated screenshot"
							className="max-h-72 w-full rounded-lg border border-border object-contain"
						/>
					)}
				</div>
			)}

			{showNote && (
				<Textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder="Optional note for your teammate…"
					className="min-h-9 resize-none"
					maxLength={2000}
					disabled={isPending}
					autoFocus
				/>
			)}

			<div className="flex flex-wrap items-center justify-end gap-2">
				{!showNote && (
					<Button
						variant="ghost"
						size="sm"
						className="mr-auto"
						disabled={isPending}
						onClick={() => setShowNote(true)}
					>
						<MessageSquarePlusIcon className="size-4" />
						Add a note
					</Button>
				)}
				<Button
					variant="outline"
					className="text-destructive hover:text-destructive"
					disabled={isPending}
					onClick={() => decide("REJECTED")}
				>
					<XIcon className="size-4" />
					Reject
				</Button>
				<Button disabled={isPending} onClick={() => decide("APPROVED")}>
					<CheckIcon className="size-4" />
					Approve &amp; send
				</Button>
			</div>
		</div>
	);
};

/** Lead-only: submissions from team members awaiting a decision. Approval
 *  is the moment the developer gets notified. */
const ApprovalQueue = ({ items }: { items: FeedbackSelectAllPayload[] }) => (
	<div className="flex flex-col gap-3">
		{items.map((item) => (
			<ApprovalCard key={item.id} item={item} />
		))}
	</div>
);

export default ApprovalQueue;
