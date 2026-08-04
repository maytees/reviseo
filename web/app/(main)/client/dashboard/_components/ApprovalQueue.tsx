"use client";

import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ImageEditList from "@/components/image-edit-list";
import StyleEditList from "@/components/style-edit-list";
import TextEditList from "@/components/text-edit-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	type FeedbackSelectAllPayload,
	TYPE_BADGE_MAP,
	TYPE_CONFIG,
} from "@/lib/types";
import { decideFeedbackApproval } from "../actions";

const ApprovalCard = ({ item }: { item: FeedbackSelectAllPayload }) => {
	const router = useRouter();
	const [expanded, setExpanded] = useState(false);
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

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-border p-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 flex-col gap-0.5">
					<span className="truncate font-medium">{item.title}</span>
					<span className="text-muted-foreground text-xs">
						{item.author?.name || item.author?.email || "Teammate"} ·{" "}
						{moment(item.createdAt).fromNow()}
					</span>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<Badge variant={TYPE_BADGE_MAP[item.type]}>
						{TYPE_CONFIG[item.type].label}
					</Badge>
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
					{(item.type === "BUG" || item.type === "IMPROVEMENT") &&
						item.screenshotKey && (
							// biome-ignore lint/performance/noImgElement: streamed annotation
							<img
								src={`/api/s3/annotations/${item.screenshotKey}`}
								alt="Annotated screenshot"
								className="max-h-72 w-full rounded-lg border border-border object-contain"
							/>
						)}
				</div>
			)}

			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				<Textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder="Optional note for your teammate…"
					className="min-h-9 flex-1 resize-none"
					maxLength={2000}
					disabled={isPending}
				/>
				<div className="flex shrink-0 gap-2">
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
