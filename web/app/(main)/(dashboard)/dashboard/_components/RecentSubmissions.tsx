import { Globe, MessageCircle, PersonStanding } from "lucide-react";
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
	CardAction,
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
	PRIORITY_BADGE_MAP,
	PRIORITY_CONFIG,
	TYPE_BADGE_MAP,
	TYPE_CONFIG,
} from "@/lib/types";
import type { Prisma } from "@/prisma/generated/client";
import ScreenshotPreview from "./ScreenshotPreview";

const RecentSubmissions = async ({
	feedbacks,
}: {
	feedbacks?: Prisma.FeedbackGetPayload<{
		select: {
			id: true;
			websiteId: true;
			authorId: true;
			status: true;
			pageUrl: true;
			viewport: true;
			priority: true;
			timestamp: true;
			author: true;
			website: true;
			browser: true;
			screenshotKey: true;
			browserVersion: true;
			isMobile: true;
			os: true;
			createdAt: true;
			updatedAt: true;
			title: true;
			description: true;
			type: true;
		};
	}>[];
}) => {
	return (
		<Card>
			<CardHeader className="max-lg:px-4">
				<CardTitle>Recent Feedback</CardTitle>
				<CardDescription>
					Latest feedback submissions across all websites.
				</CardDescription>
				<CardAction>
					<Button size={"sm"} asChild variant={"outline"}>
						<Link href={`/dashboard/websites`}>See All Websites</Link>
					</Button>
				</CardAction>
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
									className="flex flex-col w-full p-2 border rounded-sm lg:flex-row lg:items-center lg:justify-between bg-background/30 shadow-2xs border-background/40"
								>
									<div className="flex flex-col w-full space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 lg:w-auto">
										<ScreenshotPreview
											app_url={env.BETTER_AUTH_URL}
											screenshotKey={feedback.screenshotKey}
										/>
										<div className="flex flex-col items-start justify-around gap-1">
											<div className="flex flex-row items-center gap-1">
												<p className="text-lg font-semibold lg:text-base">
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
															<Globe className="text-green-400 size-2.5" />
															<span className="text-sm truncate text-muted-foreground lg:text-xs">
																{feedback.website.name}
															</span>
														</div>
													</TooltipTrigger>
													<TooltipContent>{feedback.pageUrl}</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger>
														<div className="flex flex-row items-center gap-1">
															<PersonStanding className="text-blue-400 size-2.5" />
															<span className="text-sm truncate text-muted-foreground lg:text-xs">
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
									<div className="flex flex-row flex-wrap items-center w-full gap-2 mt-2 lg:flex-nowrap lg:justify-end lg:w-auto lg:mt-0">
										<Tooltip>
											<TooltipTrigger>
												<Badge
													variant={
														TYPE_BADGE_MAP[
															feedback.type as keyof typeof TYPE_BADGE_MAP
														] as BadgeVariantsType
													}
													className="hover:cursor-default"
													appearance={"outline"}
													size={"sm"}
												>
													{(() => {
														const TypeIcon =
															TYPE_CONFIG[
																feedback.type as keyof typeof TYPE_CONFIG
															].icon;
														return <TypeIcon />;
													})()}
												</Badge>
											</TooltipTrigger>
											<TooltipContent>
												{feedback.type.charAt(0) +
													feedback.type.substring(1).toLowerCase()}
											</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger>
												<Badge
													variant={
														PRIORITY_BADGE_MAP[
															feedback.priority as keyof typeof PRIORITY_BADGE_MAP
														] as BadgeVariantsType
													}
													className="hover:cursor-default"
													appearance={"outline"}
													size={"sm"}
												>
													{(() => {
														const PriorityIcon =
															PRIORITY_CONFIG[
																feedback.priority as keyof typeof PRIORITY_CONFIG
															].icon;
														return <PriorityIcon />;
													})()}
													{/* {feedback.priority.toLowerCase().charAt(0).toUpperCase() +
																	feedback.priority.substring(1).toLowerCase()} */}
												</Badge>
											</TooltipTrigger>
											<TooltipContent>
												{feedback.priority
													.toLowerCase()
													.charAt(0)
													.toUpperCase() +
													feedback.priority.substring(1).toLowerCase()}{" "}
												Priority
											</TooltipContent>
										</Tooltip>
										<Button asChild size={"sm"} variant={"outline"}>
											<Link href={`/dashboard/websites/${feedback.id}`}>
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
