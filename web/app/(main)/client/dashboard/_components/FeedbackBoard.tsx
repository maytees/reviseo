"use client";

import { MousePointerClick } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	APPROVAL_CONFIG,
	type FeedbackSelectAllPayload,
	PRIORITY_BADGE_MAP,
	PRIORITY_CONFIG,
	STATUS_CONFIG,
	TYPE_CONFIG,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import FeedbackDetailDialog from "./FeedbackDetailDialog";

const COLUMNS = ["NEW", "IN_PROGRESS", "RESOLVED"] as const;
type ColumnStatus = (typeof COLUMNS)[number];

// Static tint maps — Tailwind can't see dynamically-built class strings.
const STATUS_TINTS: Record<ColumnStatus, { tile: string; icon: string }> = {
	NEW: { tile: "bg-blue-300/15", icon: "text-blue-500" },
	IN_PROGRESS: { tile: "bg-amber-300/15", icon: "text-amber-500" },
	RESOLVED: { tile: "bg-emerald-300/15", icon: "text-emerald-400" },
};
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

const COLUMN_EMPTY_COPY: Record<ColumnStatus, string> = {
	NEW: "Nothing new",
	IN_PROGRESS: "Nothing being worked on yet",
	RESOLVED: "Nothing resolved yet",
};

const RESOLVED_PREVIEW_COUNT = 5;

function initials(name?: string | null, email?: string | null) {
	const source = name?.trim() || email || "?";
	const parts = source.split(/\s+/).filter(Boolean);
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
	return source.slice(0, 2).toUpperCase();
}

type FeedbackBoardProps = {
	items: FeedbackSelectAllPayload[];
	rejectedItems: FeedbackSelectAllPayload[];
	viewerId: string;
	isLead: boolean;
};

export default function FeedbackBoard({
	items,
	rejectedItems,
	viewerId,
	isLead,
}: FeedbackBoardProps) {
	const [selected, setSelected] = useState<FeedbackSelectAllPayload | null>(
		null,
	);
	const [showAllResolved, setShowAllResolved] = useState(false);
	const [websiteFilter, setWebsiteFilter] = useState<string | null>(null);

	const websiteOptions = (() => {
		const seen = new Map<string, string>();
		for (const item of [...items, ...rejectedItems]) {
			seen.set(item.website.id, item.website.name);
		}
		return [...seen.entries()].map(([id, name]) => ({ id, name }));
	})();

	const visible = websiteFilter
		? items.filter((item) => item.website.id === websiteFilter)
		: items;
	const visibleRejected = websiteFilter
		? rejectedItems.filter((item) => item.website.id === websiteFilter)
		: rejectedItems;

	if (items.length === 0 && rejectedItems.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<MousePointerClick />
					</EmptyMedia>
					<EmptyTitle>No feedback yet</EmptyTitle>
					<EmptyDescription>
						Visit one of your websites and click the Reviseo button to submit
						your first feedback.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="flex flex-col gap-5">
			{websiteOptions.length > 1 && (
				<div className="flex flex-wrap items-center gap-1.5">
					<Button
						variant={websiteFilter === null ? "secondary" : "ghost"}
						size="sm"
						onClick={() => setWebsiteFilter(null)}
					>
						All websites
					</Button>
					{websiteOptions.map((website) => (
						<Button
							key={website.id}
							variant={websiteFilter === website.id ? "secondary" : "ghost"}
							size="sm"
							onClick={() =>
								setWebsiteFilter(
									websiteFilter === website.id ? null : website.id,
								)
							}
						>
							{website.name}
						</Button>
					))}
				</div>
			)}

			{/* Rejected items never reached the developer — they need the
			    author's attention, not a lifecycle column. */}
			{visibleRejected.length > 0 && (
				<div className="flex flex-col gap-2">
					<span className="font-caudex font-semibold text-destructive text-sm">
						Needs changes
					</span>
					{visibleRejected.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setSelected(item)}
							className="flex flex-col gap-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-left transition-colors hover:border-destructive/60"
						>
							<span className="font-medium text-sm">{item.title}</span>
							<span className="text-muted-foreground text-xs">
								{item.website.name} · {moment(item.createdAt).fromNow()}
							</span>
							{item.approvalNote && (
								<span className="text-destructive text-xs">
									Note from your team lead: {item.approvalNote}
								</span>
							)}
						</button>
					))}
				</div>
			)}

			<div className="grid gap-4 lg:grid-cols-3">
				{COLUMNS.map((status) => {
					const config = STATUS_CONFIG[status];
					const StatusIcon = config.icon;
					const tint = STATUS_TINTS[status];
					const columnItems = visible.filter((item) => item.status === status);
					const truncated =
						status === "RESOLVED" &&
						!showAllResolved &&
						columnItems.length > RESOLVED_PREVIEW_COUNT;
					const shown = truncated
						? columnItems.slice(0, RESOLVED_PREVIEW_COUNT)
						: columnItems;

					return (
						<div key={status} className="flex flex-col gap-3">
							<div className="flex items-center gap-2.5">
								<div
									className={cn(
										"flex size-7 items-center justify-center rounded-md",
										tint.tile,
									)}
								>
									<StatusIcon className={cn("size-4", tint.icon)} />
								</div>
								<span className="font-caudex font-semibold">
									{config.label}
								</span>
								<Badge variant="outline" size="sm">
									{columnItems.length}
								</Badge>
							</div>

							{columnItems.length === 0 ? (
								<p className="rounded-lg border border-border border-dashed px-3 py-6 text-center text-muted-foreground text-xs">
									{COLUMN_EMPTY_COPY[status]}
								</p>
							) : (
								<ul className="flex flex-col gap-2">
									{shown.map((item) => {
										const typeConfig = TYPE_CONFIG[item.type];
										const TypeIcon = typeConfig.icon;
										const typeTint = TYPE_TINTS[item.type];
										const priorityConfig = PRIORITY_CONFIG[item.priority];
										const PriorityIcon = priorityConfig.icon;
										const approvalConfig = APPROVAL_CONFIG[item.approval];
										const isTeammate =
											isLead && item.author && item.author.id !== viewerId;

										return (
											<li key={item.id}>
												<button
													type="button"
													onClick={() => setSelected(item)}
													className="flex w-full items-start gap-3 rounded-lg border border-border bg-background/30 p-3 text-left transition-colors hover:border-foreground/20"
												>
													<div
														className={cn(
															"flex size-9 shrink-0 items-center justify-center rounded-md",
															typeTint.tile,
														)}
													>
														<TypeIcon className={cn("size-4", typeTint.icon)} />
													</div>
													<div className="flex min-w-0 flex-1 flex-col gap-1.5">
														<span className="line-clamp-2 font-medium text-sm leading-snug">
															{item.title}
														</span>
														<span className="text-muted-foreground text-xs">
															{item.website.name} ·{" "}
															{moment(item.createdAt).fromNow()}
														</span>
														<div className="flex flex-wrap items-center gap-1.5">
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
																<TooltipContent>
																	{priorityConfig.label} priority
																</TooltipContent>
															</Tooltip>
															{approvalConfig && (
																<Badge
																	variant={approvalConfig.badge}
																	appearance="light"
																	size="sm"
																>
																	{approvalConfig.label}
																</Badge>
															)}
															{isTeammate && item.author && (
																<Tooltip>
																	<TooltipTrigger asChild>
																		<Avatar className="size-5">
																			<AvatarFallback className="text-[0.6rem]">
																				{initials(
																					item.author.name,
																					item.author.email,
																				)}
																			</AvatarFallback>
																		</Avatar>
																	</TooltipTrigger>
																	<TooltipContent>
																		{item.author.name || item.author.email}
																	</TooltipContent>
																</Tooltip>
															)}
														</div>
													</div>
												</button>
											</li>
										);
									})}
								</ul>
							)}

							{status === "RESOLVED" &&
								columnItems.length > RESOLVED_PREVIEW_COUNT && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setShowAllResolved(!showAllResolved)}
									>
										{showAllResolved
											? "Show fewer"
											: `Show all ${columnItems.length} resolved`}
									</Button>
								)}
						</div>
					);
				})}
			</div>

			<FeedbackDetailDialog
				item={selected}
				onOpenChange={(open) => {
					if (!open) setSelected(null);
				}}
			/>
		</div>
	);
}
