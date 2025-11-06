"use client";

import {
	Calendar,
	Chrome,
	Clock,
	Download,
	Globe,
	Hash,
	Maximize,
	Monitor,
	PersonStanding,
	Smartphone,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type FeedbackSelectAllPayload,
	PRIORITY_BADGE_MAP,
	PRIORITY_CONFIG,
	TYPE_BADGE_MAP,
	TYPE_CONFIG,
} from "@/lib/types";
import ScreenshotPreview from "../../../../_components/ScreenshotPreview";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import SelectStatus from "./SelectStatus";

const FeedbackTable = ({
	website,
	open,
}: {
	website: WebsiteDataTypeNonNullable;
	open: string | string[] | undefined;
}) => {
	const [modalOpen, setModalOpen] = useState(false);
	// TODO: Not found modal
	const [_, setNotFoundOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [selectedFeedback, setSelectedFeedback] =
		useState<FeedbackSelectAllPayload | null>(null);

	const openFeedbackModal = (feedbackId: string) => {
		const feedback = website.feedback.find((f) => f.id === feedbackId);
		if (!feedback) {
			setNotFoundOpen(true);
			return;
		}

		setSelectedFeedback(feedback);
		setModalOpen(true);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: goon
	useEffect(() => {
		const nextSearchParams = new URLSearchParams(searchParams.toString());
		nextSearchParams.delete("open");

		router.replace(`${pathname}?${nextSearchParams}`);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: goon
	useEffect(() => {
		if (!open) return;

		const feedback = website.feedback.find((f) => f.id === open);

		if (!feedback) {
			setNotFoundOpen(true);
			return;
		}

		setSelectedFeedback(feedback);
		setModalOpen(true);
	}, [open]);

	const closeFeedbackModal = () => {
		setModalOpen(false);
		setSelectedFeedback(null);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: goon
	useEffect(() => {
		if (!modalOpen && !open) {
			closeFeedbackModal();
		}
	}, [modalOpen]);

	return (
		<div className="w-full h-full">
			<DataTable
				columns={columns}
				data={website.feedback}
				openFeedback={openFeedbackModal}
			/>
			<Dialog open={modalOpen} onOpenChange={setModalOpen}>
				{selectedFeedback ? (
					<DialogContent className="overflow-y-scroll" variant={"feedback"}>
						<DialogHeader>
							<DialogTitle className="text-2xl">Feedback Details</DialogTitle>
							<DialogDescription>
								See in detail what your client needs done, and the tools you can
								use
							</DialogDescription>
						</DialogHeader>
						<div className="flex flex-row items-center justify-between w-full my-2">
							<div>
								<h2 className="text-lg font-semibold">Annotated Image</h2>
								<p className="text-xs text-muted-foreground">
									Click on image to expand
								</p>
							</div>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button asChild variant={"ghost"} mode={"icon"}>
										<Link
											href={`/api/s3/annotations/${selectedFeedback.screenshotKey}`}
											download={`${selectedFeedback.id}-${selectedFeedback.timestamp}`}
										>
											<Download />
										</Link>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Download (SVG)</TooltipContent>
							</Tooltip>
						</div>

						<div className="p-3 border rounded-sm bg-card/30 border-card">
							<ScreenshotPreview
								app_url=""
								className="rounded-sm lg:w-full"
								screenshotKey={selectedFeedback.screenshotKey}
							/>
						</div>

						<div className="flex flex-row items-center justify-between">
							<div>
								<h2 className="mt-5 text-lg font-semibold">Title</h2>
								<div className="mt-1 text-xs text-muted-foreground">
									<p className="font-mono">{selectedFeedback.title}</p>
								</div>
							</div>

							<div className="flex flex-row gap-2">
								{/* <Tooltip>
									<TooltipTrigger>
										<Badge
											variant={
												STATUS_BADGE_MAP[
													selectedFeedback.status
												] as BadgeVariantsType
											}
											appearance="outline"
											size="lg"
											className="hover:cursor-default"
										>
											{(() => {
												const StatusIcon =
													STATUS_CONFIG[selectedFeedback.status].icon;
												return <StatusIcon />;
											})()}
											<span className="hidden md:block">
												{STATUS_CONFIG[selectedFeedback.status].label}
											</span>
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										{selectedFeedback.status
											.toLowerCase()
											.charAt(0)
											.toUpperCase() +
											selectedFeedback.status.substring(1).toLowerCase()}{" "}
										Status
									</TooltipContent>
								</Tooltip> */}
								<Tooltip>
									<TooltipTrigger>
										<Badge
											variant={TYPE_BADGE_MAP[selectedFeedback.type]}
											className="hover:cursor-default"
											appearance={"outline"}
											size={"lg"}
										>
											{(() => {
												const TypeIcon =
													TYPE_CONFIG[selectedFeedback.type].icon;
												return <TypeIcon />;
											})()}

											<span className="hidden md:block">
												{selectedFeedback.type.charAt(0) +
													selectedFeedback.type.substring(1).toLowerCase()}
											</span>
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										{selectedFeedback.type
											.toLowerCase()
											.charAt(0)
											.toUpperCase() +
											selectedFeedback.type.substring(1).toLowerCase()}{" "}
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger>
										<Badge
											variant={PRIORITY_BADGE_MAP[selectedFeedback.priority]}
											className="hover:cursor-default"
											appearance={"outline"}
											size={"lg"}
										>
											{(() => {
												const PriorityIcon =
													PRIORITY_CONFIG[selectedFeedback.priority].icon;
												return <PriorityIcon />;
											})()}
											<span className="hidden md:block">
												{selectedFeedback.priority.charAt(0) +
													selectedFeedback.priority.substring(1).toLowerCase()}
											</span>
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										{selectedFeedback.priority
											.toLowerCase()
											.charAt(0)
											.toUpperCase() +
											selectedFeedback.priority.substring(1).toLowerCase()}{" "}
										Priority
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger>
										<Badge
											variant={"outline"}
											className="hover:cursor-default"
											appearance={"outline"}
											size={"lg"}
										>
											<Calendar />
											<span className="hidden md:block">
												{moment(selectedFeedback.createdAt).fromNow()}
											</span>
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										Created{" "}
										{moment(selectedFeedback.createdAt).format("MMM Do YYYY")}
									</TooltipContent>
								</Tooltip>

								<SelectStatus feedback={selectedFeedback} />
							</div>
						</div>

						<div className="my-4" />

						<h2 className="text-lg font-semibold">Description</h2>
						<div className="mt-1 text-xs text-muted-foreground">
							<p className="font-mono">
								{selectedFeedback.description || "No description provided"}
							</p>
						</div>

						<div className="my-4" />

						<h2 className="mb-2 text-lg font-semibold">Extra Info</h2>
						<p className="mb-4 font-mono text-xs text-muted-foreground">
							Additional technical details and metadata about this feedback
						</p>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{/* Author Information */}
							{selectedFeedback.author && (
								<div className="flex flex-col gap-2 md:col-span-2">
									<h3 className="flex items-center gap-2 text-sm font-medium">
										<PersonStanding className="size-4" />
										Submitted By
									</h3>
									<div className="flex items-center gap-3 p-3 border rounded-md bg-card/30">
										<Avatar className="size-10">
											<AvatarImage
												src={selectedFeedback.author.image || undefined}
												alt={selectedFeedback.author.name}
											/>
											<AvatarFallback>
												{selectedFeedback.author.name
													.split(" ")
													.map((n) => n[0])
													.join("")
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<span className="text-sm font-medium">
												{selectedFeedback.author.name}
											</span>
											<span className="text-xs text-muted-foreground">
												{selectedFeedback.author.email}
											</span>
										</div>
									</div>
								</div>
							)}

							{/* Page URL */}
							<div className="flex flex-col gap-2 md:col-span-2">
								<h3 className="flex items-center gap-2 text-sm font-medium">
									<Globe className="size-4" />
									Page URL
								</h3>
								<div className="p-3 border rounded-md bg-card/30">
									<Link
										href={selectedFeedback.pageUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs break-all text-primary hover:underline"
									>
										{selectedFeedback.pageUrl}
									</Link>
								</div>
							</div>

							{/* Browser Information */}
							<div className="flex flex-col gap-2">
								<h3 className="flex items-center gap-2 text-sm font-medium">
									<Chrome className="size-4" />
									Browser
								</h3>
								<div className="p-3 border rounded-md bg-card/30">
									<span className="text-xs text-muted-foreground">
										{selectedFeedback.browser ||
											"Browser information not available"}{" "}
										{selectedFeedback.browserVersion &&
											`v${selectedFeedback.browserVersion}`}
									</span>
								</div>
							</div>

							{/* Operating System */}
							<div className="flex flex-col gap-2">
								<h3 className="flex items-center gap-2 text-sm font-medium">
									<Monitor className="size-4" />
									Operating System
								</h3>
								<div className="p-3 border rounded-md bg-card/30">
									<span className="text-xs text-muted-foreground">
										{selectedFeedback.os ||
											"Operating system information not available"}
									</span>
								</div>
							</div>

							{/* Device Type */}
							<div className="flex flex-col gap-2">
								<h3 className="flex items-center gap-2 text-sm font-medium">
									<Smartphone className="size-4" />
									Device Type
								</h3>
								<div className="p-3 border rounded-md bg-card/30">
									<span className="text-xs text-muted-foreground">
										{selectedFeedback.isMobile !== null &&
										selectedFeedback.isMobile !== undefined
											? selectedFeedback.isMobile
												? "Mobile"
												: "Desktop"
											: "Device type not available"}
									</span>
								</div>
							</div>

							{/* Viewport */}
							<div className="flex flex-col gap-2">
								<h3 className="flex items-center gap-2 text-sm font-medium">
									<Maximize className="size-4" />
									Viewport Size
								</h3>
								<div className="p-3 border rounded-md bg-card/30">
									<span className="text-xs text-muted-foreground">
										{selectedFeedback.viewport || "Viewport size not available"}
									</span>
								</div>
							</div>

							{/* Timestamps */}
							<div className="flex flex-col gap-2 md:col-span-2">
								<h3 className="flex items-center gap-2 text-sm font-medium">
									<Clock className="size-4" />
									Timestamps
								</h3>
								<div className="p-3 space-y-2 border rounded-md bg-card/30">
									<div className="flex justify-between">
										<span className="text-xs text-muted-foreground">
											Created:
										</span>
										<span className="text-xs text-muted-foreground">
											{moment(selectedFeedback.createdAt).format(
												"MMM Do YYYY, h:mm:ss a",
											)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-xs text-muted-foreground">
											Updated:
										</span>
										<span className="text-xs text-muted-foreground">
											{moment(selectedFeedback.updatedAt).format(
												"MMM Do YYYY, h:mm:ss a",
											)}
										</span>
									</div>
									{selectedFeedback.timestamp && (
										<div className="flex justify-between">
											<span className="text-xs text-muted-foreground">
												Captured:
											</span>
											<span className="text-xs text-muted-foreground">
												{moment(selectedFeedback.timestamp).format(
													"MMM Do YYYY, h:mm:ss a",
												)}
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Feedback ID */}
							<div className="flex flex-col gap-2 md:col-span-2">
								<h3 className="flex items-center gap-2 text-sm font-medium">
									<Hash className="size-4" />
									Feedback ID
								</h3>
								<div className="p-3 border rounded-md bg-card/30">
									<code className="text-xs text-muted-foreground">
										{selectedFeedback.id}
									</code>
								</div>
							</div>
						</div>

						<div className="pb-96"></div>
					</DialogContent>
				) : (
					<DialogContent className="overflow-y-scroll" variant={"feedback"}>
						<DialogHeader>
							<DialogTitle className="text-2xl">Feedback Details</DialogTitle>
							<DialogDescription>
								Hang tight while we present what your client needs done.
							</DialogDescription>
						</DialogHeader>
						<div className="flex flex-row items-center justify-between w-full my-2">
							<div>
								<h2 className="text-lg font-semibold">Annotated Image</h2>
								<p className="text-xs text-muted-foreground">
									Click on image to expand
								</p>
							</div>
						</div>

						<div className="p-3 border rounded-sm bg-card/30 border-card">
							<Skeleton className="w-full h-[400px] rounded-sm" />
						</div>

						<div className="flex flex-row items-center justify-between">
							<div className="flex-1">
								<h2 className="mt-5 text-lg font-semibold">Title</h2>
								<div className="mt-1">
									<Skeleton className="w-3/4 h-4" />
								</div>
							</div>
						</div>

						<div className="pb-96"></div>
					</DialogContent>
				)}
			</Dialog>
		</div>
	);
};

export default FeedbackTable;
