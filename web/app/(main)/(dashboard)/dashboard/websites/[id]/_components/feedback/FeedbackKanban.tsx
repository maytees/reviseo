"use client";

import { Maximize2Icon } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import {
	type ComponentProps,
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Kanban,
	KanbanBoard,
	KanbanColumn,
	KanbanColumnContent,
	KanbanItem,
	KanbanItemHandle,
	type KanbanMoveEvent,
	KanbanOverlay,
} from "@/components/ui/kanban";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { tryCatch } from "@/lib/try-catch";
import {
	type FeedbackSelectAllPayload,
	PRIORITY_BADGE_MAP,
	PRIORITY_CONFIG,
	STATUS_CONFIG,
	TYPE_CONFIG,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import type { FeedbackStatus } from "@/prisma/generated/client/enums";
import { updateFeedbackStatus } from "./actions";

const COLUMNS = [
	"NEW",
	"IN_PROGRESS",
	"RESOLVED",
] as const satisfies readonly FeedbackStatus[];

// Static tint maps — Tailwind can't see dynamically-built class strings.
const STATUS_TINTS: Record<FeedbackStatus, { tile: string; icon: string }> = {
	NEW: { tile: "bg-blue-300/15", icon: "text-blue-500" },
	IN_PROGRESS: { tile: "bg-amber-300/15", icon: "text-amber-500" },
	RESOLVED: { tile: "bg-emerald-300/15", icon: "text-emerald-400" },
};

const COLUMN_EMPTY_COPY: Record<FeedbackStatus, string> = {
	NEW: "Nothing new",
	IN_PROGRESS: "Nothing in progress",
	RESOLVED: "Nothing resolved yet",
};

/** Optimistic status per feedback id. `settled` = server confirmed; pruned
 *  when fresh server props arrive. */
type Override = { status: FeedbackStatus; settled: boolean };

interface FeedbackKanbanProps {
	feedback: FeedbackSelectAllPayload[];
	openFeedback: (feedbackId: string) => void;
}

export default function FeedbackKanban({
	feedback,
	openFeedback,
}: FeedbackKanbanProps) {
	const router = useRouter();
	const [overrides, setOverrides] = useState<Map<string, Override>>(new Map());
	// Per-item drag generation: a stale persist result must not clobber a
	// newer drag of the same card.
	const epochRef = useRef<Map<string, number>>(new Map());
	const [, startTransition] = useTransition();

	// Fresh server data: drop settled overrides (server truth wins, including
	// a teammate's concurrent change) and overrides for deleted rows. Keep
	// in-flight ones so a background refresh can't snap a pending card back.
	useEffect(() => {
		setOverrides((prev) => {
			let changed = false;
			const next = new Map<string, Override>();
			for (const [id, override] of prev) {
				if (!override.settled && feedback.some((f) => f.id === id)) {
					next.set(id, override);
				} else {
					changed = true;
				}
			}
			return changed ? next : prev;
		});
	}, [feedback]);

	// Derived board: server props + overrides. All three keys ALWAYS present
	// (KanbanColumnContent throws on a missing key). Order = props order.
	const board = useMemo(() => {
		const next: Record<FeedbackStatus, FeedbackSelectAllPayload[]> = {
			NEW: [],
			IN_PROGRESS: [],
			RESOLVED: [],
		};
		for (const item of feedback) {
			next[overrides.get(item.id)?.status ?? item.status].push(item);
		}
		return next;
	}, [feedback, overrides]);

	const handleMove = ({
		activeContainer,
		overContainer,
		event,
	}: KanbanMoveEvent) => {
		const itemId = String(event.active.id);
		const from = activeContainer as FeedbackStatus;
		const to = overContainer as FeedbackStatus;

		// Card order inside a column isn't persisted — same-column drop = no-op.
		if (from === to) return;

		const epoch = (epochRef.current.get(itemId) ?? 0) + 1;
		epochRef.current.set(itemId, epoch);

		setOverrides((prev) =>
			new Map(prev).set(itemId, { status: to, settled: false }),
		);

		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				updateFeedbackStatus(itemId, to),
			);

			// A newer drag of this card owns its fate now.
			if (epochRef.current.get(itemId) !== epoch) return;

			if (error || result.status === "error") {
				// Rollback: drop the override — the card derives back to the
				// server's status. No manual splicing, no collision surface.
				setOverrides((prev) => {
					const next = new Map(prev);
					next.delete(itemId);
					return next;
				});
				toast.error(
					error
						? "An unexpected error occurred. Please try again."
						: result.message,
				);
				return;
			}

			setOverrides((prev) =>
				new Map(prev).set(itemId, { status: to, settled: true }),
			);
			toast.success(result.message);
			router.refresh();
		});
	};

	return (
		<Kanban
			value={board}
			// Controlled via onMove — the primitive never mutates our value.
			onValueChange={() => {}}
			getItemValue={(item) => item.id}
			onMove={handleMove}
			// Pointer drags must not move the page or the column under the user.
			// Layout compensation is separate from dnd-kit's edge auto-scroll.
			autoScroll={{ enabled: false, layoutShiftCompensation: false }}
			className="[overflow-anchor:none]"
		>
			<KanbanBoard className="grid auto-rows-auto items-start gap-4 sm:grid-cols-3">
				{COLUMNS.map((status) => (
					<BoardColumn
						key={status}
						status={status}
						items={board[status]}
						openFeedback={openFeedback}
					/>
				))}
			</KanbanBoard>
			{/* dnd-kit's drop animation scrolls an offscreen destination into
			    view. A status move should leave the user's viewport in place. */}
			<KanbanOverlay dropAnimation={null}>
				{({ value }) => {
					const item = feedback.find((f) => f.id === value);
					return item ? <BoardCardBody item={item} /> : null;
				}}
			</KanbanOverlay>
		</Kanban>
	);
}

function BoardColumn({
	status,
	items,
	openFeedback,
}: {
	status: FeedbackStatus;
	items: FeedbackSelectAllPayload[];
	openFeedback: (feedbackId: string) => void;
}) {
	const config = STATUS_CONFIG[status];
	const StatusIcon = config.icon;
	const tint = STATUS_TINTS[status];

	return (
		// No KanbanColumnHandle rendered — status columns are fixed.
		<KanbanColumn
			value={status}
			className="flex h-[min(68dvh,42rem)] min-h-72 min-w-0 flex-col gap-3 rounded-xl border border-border bg-muted/20 p-3"
		>
			<div className="flex shrink-0 items-center gap-2.5">
				<div
					className={cn(
						"flex size-7 items-center justify-center rounded-md",
						tint.tile,
					)}
				>
					<StatusIcon className={cn("size-4", tint.icon)} />
				</div>
				<span className="font-caudex font-semibold">{config.label}</span>
				<Badge variant="outline" size="sm">
					{items.length}
				</Badge>
			</div>
			<KanbanColumnContent
				value={status}
				reorderable={false}
				className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-y-contain pr-1 [overflow-anchor:none] [scrollbar-gutter:stable]"
			>
				{items.length === 0 && (
					<p className="rounded-lg border border-border border-dashed px-3 py-6 text-center text-muted-foreground text-xs">
						{COLUMN_EMPTY_COPY[status]}
					</p>
				)}
				{items.map((item) => (
					<BoardCard key={item.id} item={item} openFeedback={openFeedback} />
				))}
			</KanbanColumnContent>
		</KanbanColumn>
	);
}

function BoardCard({
	item,
	openFeedback,
}: {
	item: FeedbackSelectAllPayload;
	openFeedback: (feedbackId: string) => void;
}) {
	// Click-vs-drag guard: dnd-kit doesn't reliably suppress the click that
	// follows a short drag released over the origin. Mirror the sensor's
	// 10px activation distance deterministically.
	const downPos = useRef<{ x: number; y: number } | null>(null);

	return (
		<KanbanItem value={item.id} className="shrink-0">
			<KanbanItemHandle asChild>
				{/* biome-ignore lint/a11y/noStaticElementInteractions: drag handle wraps the card; keyboard users open details via the Maximize button and drag via the keyboard sensor */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: see above — Enter/Space on the focused card starts a keyboard drag, so a key handler here would conflict */}
				<div
					className="group/card cursor-grab rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:cursor-grabbing"
					onPointerDown={(e) => {
						downPos.current = { x: e.clientX, y: e.clientY };
					}}
					onClick={(e) => {
						const down = downPos.current;
						if (
							down &&
							Math.hypot(e.clientX - down.x, e.clientY - down.y) >= 10
						) {
							return; // was a drag, not a click
						}
						openFeedback(item.id);
					}}
				>
					<BoardCardBody item={item}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="size-6 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/card:opacity-100"
									aria-label="Open details"
									onPointerDown={(e) => e.stopPropagation()}
									onClick={(e) => {
										e.stopPropagation();
										openFeedback(item.id);
									}}
								>
									<Maximize2Icon className="size-3.5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Open details</TooltipContent>
						</Tooltip>
					</BoardCardBody>
				</div>
			</KanbanItemHandle>
		</KanbanItem>
	);
}

/** Card visuals, shared by the live card and the drag overlay clone. */
function BoardCardBody({
	item,
	children,
}: {
	item: FeedbackSelectAllPayload;
	children?: ComponentProps<"div">["children"];
}) {
	const priorityConfig = PRIORITY_CONFIG[item.priority];
	const PriorityIcon = priorityConfig.icon;
	const typeConfig = TYPE_CONFIG[item.type];
	const TypeIcon = typeConfig.icon;
	const editCount =
		item.type === "TEXT_EDIT"
			? item.textEdits.length
			: item.type === "STYLE_EDIT"
				? item.styleEdits.length
				: item.type === "IMAGE_EDIT"
					? item.imageEdits.length
					: null;
	const pending = item.approval === "PENDING";

	return (
		<div className="flex flex-col gap-2 rounded-lg border border-border bg-background/30 p-3 transition-colors hover:border-foreground/20">
			<div className="flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs">
				<TypeIcon
					aria-hidden="true"
					className={cn("size-3.5 shrink-0", typeConfig.color)}
				/>
				<span className="truncate">{typeConfig.label}</span>
				{editCount !== null && (
					<span className="ml-auto shrink-0 tabular-nums">
						{editCount} {editCount === 1 ? "edit" : "edits"}
					</span>
				)}
			</div>
			{item.screenshotKey && (
				// Plain img on purpose: ScreenshotPreview's zoom would fight the
				// drag handle. pointer-events-none keeps drags smooth.
				// biome-ignore lint/performance/noImgElement: streamed annotation
				<img
					src={`/api/s3/annotations/${item.screenshotKey}`}
					alt=""
					className="pointer-events-none aspect-video w-full rounded object-cover"
					draggable={false}
				/>
			)}

			<div className={cn("flex flex-col gap-1", pending && "opacity-60")}>
				<div className="flex items-start justify-between gap-2">
					<span className="line-clamp-2 font-medium text-sm leading-snug">
						{item.title}
					</span>
					{children}
				</div>
				{pending && (
					<Badge variant="warning" size="sm" className="self-start">
						Awaiting client approval
					</Badge>
				)}
				{item.approval === "REJECTED" && (
					<Badge variant="destructive" size="sm" className="self-start">
						Rejected by client lead
					</Badge>
				)}
			</div>

			<div className="flex items-center justify-between gap-2">
				<span className="truncate text-muted-foreground text-xs">
					{item.author?.name || item.author?.email || "No author"}
					{" · "}
					{moment(item.createdAt).fromNow()}
				</span>
				<Tooltip>
					<TooltipTrigger asChild>
						<Badge
							variant={PRIORITY_BADGE_MAP[item.priority]}
							appearance="outline"
							size="sm"
						>
							<PriorityIcon className="size-3" />
						</Badge>
					</TooltipTrigger>
					<TooltipContent>{priorityConfig.label} priority</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
