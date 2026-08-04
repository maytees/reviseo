import {
	Globe,
	MessageCircle,
	PaletteIcon,
	PersonStanding,
	TextCursorInputIcon,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { Badge, type BadgeVariantsType } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { env } from "@/lib/env";
import {
	type FeedbackSelectAllPayload,
	PRIORITY_BADGE_MAP,
	PRIORITY_CONFIG,
	TYPE_BADGE_MAP,
	TYPE_CONFIG,
} from "@/lib/types";
import ScreenshotPreview from "./ScreenshotPreview";

const RecentSubmissions = async ({
	feedbacks,
}: {
	feedbacks?: FeedbackSelectAllPayload[];
}) => {
	return (
		<Card>
			<CardHeader className="max-lg:px-4">
				<CardTitle>Recent Feedback</CardTitle>
				<CardDescription className="max-w-[80%]">
					Latest feedback submissions across all websites. Open a feedback card
					to view more details or modify it.
				</CardDescription>
			</CardHeader>
			<CardContent className="max-lg:px-4">
				{feedbacks && feedbacks.length !== 0 ? (
					<div className="flex flex-col gap-2 max-lg:gap-4">
						{/* Gets first 5 latest */}
						{feedbacks
							.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
							.splice(0, 5)
							.map((feedback) => (
								<div
									key={feedback.id}
									className="flex w-full flex-col rounded-sm border border-background/40 bg-background/30 p-2 shadow-2xs lg:flex-row lg:items-center lg:justify-between"
								>
									<div className="flex w-full flex-col space-y-2 lg:w-auto lg:flex-row lg:space-x-2 lg:space-y-0">
										{feedback.screenshotKey ? (
											<ScreenshotPreview
												app_url={env.BETTER_AUTH_URL}
												screenshotKey={feedback.screenshotKey}
											/>
										) : feedback.type === "STYLE_EDIT" ? (
											// Edit-tool feedback has no screenshot.
											<div className="flex aspect-video h-auto w-full items-center justify-center rounded bg-fuchsia-500/10 lg:w-20">
												<PaletteIcon className="size-5 text-fuchsia-500" />
											</div>
										) : (
											<div className="flex aspect-video h-auto w-full items-center justify-center rounded bg-violet-500/10 lg:w-20">
												<TextCursorInputIcon className="size-5 text-violet-500" />
											</div>
										)}
										<div className="flex flex-col items-start justify-around gap-1">
											<div className="flex flex-row items-center gap-1">
												<p className="font-semibold text-lg lg:text-base">
													{feedback.title}
												</p>
												<Badge variant={"outline"} size={"sm"}>
													{moment(feedback.createdAt).fromNow()}
												</Badge>
											</div>
											<div className="flex flex-row items-center gap-2">
												<Tooltip>
													<TooltipTrigger>
														<div className="flex flex-row items-center gap-1">
															<Globe className="size-2.5 text-green-400" />
															<span className="truncate text-muted-foreground text-sm lg:text-xs">
																{feedback.website.name}
															</span>
														</div>
													</TooltipTrigger>
													<TooltipContent>{feedback.pageUrl}</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger>
														<div className="flex flex-row items-center gap-1">
															<PersonStanding className="size-2.5 text-blue-400" />
															<span className="truncate text-muted-foreground text-sm lg:text-xs">
																{feedback.author?.name}
															</span>
														</div>
													</TooltipTrigger>
													<TooltipContent>
														{feedback.author?.email}
													</TooltipContent>
												</Tooltip>
											</div>
										</div>
									</div>
									<div className="mt-2 flex w-full flex-row flex-wrap items-center gap-2 lg:mt-0 lg:w-auto lg:flex-nowrap lg:justify-end">
										<Tooltip>
											<TooltipTrigger>
												<Badge
													variant={TYPE_BADGE_MAP[feedback.type]}
													className="hover:cursor-default"
													appearance={"outline"}
													size={"sm"}
												>
													{(() => {
														const TypeIcon = TYPE_CONFIG[feedback.type].icon;
														return <TypeIcon />;
													})()}
												</Badge>
											</TooltipTrigger>
											<TooltipContent>
												{TYPE_CONFIG[feedback.type].label}
											</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger>
												<Badge
													variant={
														PRIORITY_BADGE_MAP[
															feedback.priority
														] as BadgeVariantsType
													}
													className="hover:cursor-default"
													appearance={"outline"}
													size={"sm"}
												>
													{(() => {
														const PriorityIcon =
															PRIORITY_CONFIG[feedback.priority].icon;
														return <PriorityIcon />;
													})()}
													{/* {feedback.priority.toLowerCase().charAt(0).toUpperCase() +
																	feedback.priority.substring(1).toLowerCase()} */}
												</Badge>
											</TooltipTrigger>
											<TooltipContent>
												{PRIORITY_CONFIG[feedback.priority].label} Priority
											</TooltipContent>
										</Tooltip>
										{/* <SwitchStatusSelect status={feedback.status} /> */}
										<Button asChild size={"sm"} variant={"outline"}>
											<Link
												href={`/dashboard/websites/${feedback.websiteId}?open=${feedback.id}`}
											>
												Open
											</Link>
										</Button>
									</div>
								</div>
							))}
					</div>
				) : (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<MessageCircle />
							</EmptyMedia>
							<EmptyTitle>No Feedback</EmptyTitle>
							<EmptyDescription>
								Your clients havent submitted any bugs or improvements on any of
								your websites.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				)}
			</CardContent>
		</Card>
	);
};

export default RecentSubmissions;
