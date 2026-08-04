"use client";

import {
	SiAndroid,
	SiApple,
	SiGooglechrome,
	SiLinux,
	SiOpera,
	SiSafari,
} from "@icons-pack/react-simple-icons";
import {
	Calendar,
	CalendarClock,
	Camera,
	Clock,
	Download,
	Glasses,
	Globe,
	Hash,
	Laptop,
	Maximize,
	Monitor,
	PersonStanding,
	Smartphone,
	Tablet,
	Tv,
	Watch,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdgeLegacy, FaMicrosoft } from "react-icons/fa";
import { SiFirefoxbrowser } from "react-icons/si";
import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
import ImageEditList from "@/components/image-edit-list";
import StyleEditList from "@/components/style-edit-list";
import TextEditList from "@/components/text-edit-list";
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
	APPROVAL_CONFIG,
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

// Browser icon mapping
const BROWSER_ICON_MAP: Record<
	string,
	{
		icon: React.ComponentType<{ size?: number; className?: string }>;
		color: string;
	}
> = {
	chrome: { icon: SiGooglechrome, color: "#4285F4" },
	firefox: { icon: SiFirefoxbrowser, color: "#FF7139" },
	safari: { icon: SiSafari, color: "#006CFF" },
	edge: { icon: FaEdgeLegacy, color: "#0078D7" },
	opera: { icon: SiOpera, color: "#FF1B2D" },
};

// OS icon mapping
const OS_ICON_MAP: Record<
	string,
	{
		icon: React.ComponentType<{ size?: number; className?: string }>;
		color: string;
	}
> = {
	windows: { icon: FaMicrosoft, color: "#0078D6" },
	macos: { icon: SiApple, color: "#ffffff" },
	linux: { icon: SiLinux, color: "#FCC624" },
	android: { icon: SiAndroid, color: "#3DDC84" },
	ios: { icon: SiApple, color: "#000000" },
};

const getBrowserIcon = (browser?: string | null) => {
	if (!browser) return null;
	const browserLower = browser.toLowerCase();
	for (const [key, value] of Object.entries(BROWSER_ICON_MAP)) {
		if (browserLower.includes(key)) {
			return value;
		}
	}
	return null;
};

const getOSIcon = (os?: string | null) => {
	if (!os) return null;
	const osLower = os.toLowerCase();
	for (const [key, value] of Object.entries(OS_ICON_MAP)) {
		if (osLower.includes(key)) {
			return value;
		}
	}
	return null;
};

const FeedbackTable = ({
	website,
	open,
}: {
	website: WebsiteDataTypeNonNullable;
	open: string | string[] | undefined;
}) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [isImageZoomed, setIsImageZoomed] = useState(false);

	// TODO: Not found modal
	const [_, setNotFoundOpen] = useState(false);
	const router = useRouter();
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

		// router.replace(`${pathname}?${nextSearchParams}`);
		router.replace(`/dashboard/websites/${website.id}?${nextSearchParams}`);
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
		<div className="h-full w-full">
			<DataTable
				columns={columns}
				data={website.feedback}
				openFeedback={openFeedbackModal}
			/>
			<Dialog
				modal
				open={modalOpen}
				onOpenChange={(shouldOpen) => {
					if (!shouldOpen && isImageZoomed) {
						return;
					}

					setModalOpen(!modalOpen);
				}}
			>
				{selectedFeedback ? (
					<DialogContent className="overflow-y-scroll" variant={"feedback"}>
						<DialogHeader>
							<DialogTitle className="text-2xl">Feedback Details</DialogTitle>
							<DialogDescription>
								See in detail what your client needs done, and the tools you can
								use
							</DialogDescription>
						</DialogHeader>
						{selectedFeedback.type === "TEXT_EDIT" ? (
							<>
								<div className="my-2 flex w-full flex-row items-center justify-between">
									<div>
										<h2 className="font-semibold text-lg">
											Suggested Text Edits
										</h2>
										<p className="text-muted-foreground text-xs">
											Review each change, copy the new text, then mark it
											applied or rejected
										</p>
									</div>
								</div>
								<TextEditList edits={selectedFeedback.textEdits} />
							</>
						) : selectedFeedback.type === "STYLE_EDIT" ? (
							<>
								<div className="my-2 flex w-full flex-row items-center justify-between">
									<div>
										<h2 className="font-semibold text-lg">
											Suggested Style Changes
										</h2>
										<p className="text-muted-foreground text-xs">
											Review each change, copy it as CSS, then mark it applied
											or rejected
										</p>
									</div>
								</div>
								<StyleEditList edits={selectedFeedback.styleEdits} />
							</>
						) : selectedFeedback.type === "IMAGE_EDIT" ? (
							<>
								<div className="my-2 flex w-full flex-row items-center justify-between">
									<div>
										<h2 className="font-semibold text-lg">
											Suggested Image Replacements
										</h2>
										<p className="text-muted-foreground text-xs">
											Review each replacement, grab the new image, then mark it
											applied or rejected
										</p>
									</div>
								</div>
								<ImageEditList edits={selectedFeedback.imageEdits} />
							</>
						) : (
							selectedFeedback.screenshotKey && (
								<>
									<div className="my-2 flex w-full flex-row items-center justify-between">
										<div>
											<h2 className="font-semibold text-lg">Annotated Image</h2>
											<p className="text-muted-foreground text-xs">
												Click on image to expand
											</p>
										</div>

										<Tooltip>
											<TooltipTrigger asChild>
												<Button asChild variant={"ghost"} mode={"icon"}>
													<Link
														href={`/api/s3/annotations/${selectedFeedback.screenshotKey}`}
														download={`${selectedFeedback.id}-${selectedFeedback.timestamp}`}
														target="_blank"
													>
														<Download />
													</Link>
												</Button>
											</TooltipTrigger>
											<TooltipContent>Download (SVG)</TooltipContent>
										</Tooltip>
									</div>

									<div className="rounded-sm border border-card bg-card/30 p-3">
										<ScreenshotPreview
											app_url=""
											className="rounded-sm lg:w-full"
											screenshotKey={selectedFeedback.screenshotKey}
											onZoomChange={setIsImageZoomed}
										/>
									</div>
								</>
							)
						)}

						<div className="flex flex-row items-center justify-between">
							<div>
								<h2 className="mt-5 font-semibold text-lg">Title</h2>
								<div className="mt-1 text-muted-foreground text-xs">
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
								{(() => {
									const approvalConfig =
										APPROVAL_CONFIG[selectedFeedback.approval];
									return approvalConfig ? (
										<Tooltip>
											<TooltipTrigger>
												<Badge
													variant={approvalConfig.badge}
													appearance="outline"
													size="lg"
													className="hover:cursor-default"
												>
													{approvalConfig.label}
												</Badge>
											</TooltipTrigger>
											<TooltipContent>
												{selectedFeedback.approval === "PENDING"
													? "The client's lead hasn't approved this yet"
													: selectedFeedback.approval === "REJECTED"
														? (selectedFeedback.approvalNote ??
															"Rejected by the client lead")
														: "Approved by the client lead"}
											</TooltipContent>
										</Tooltip>
									) : null;
								})()}
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
												{TYPE_CONFIG[selectedFeedback.type].label}
											</span>
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										{TYPE_CONFIG[selectedFeedback.type].label}
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

						<h2 className="font-semibold text-lg">Description</h2>
						<div className="mt-1 text-muted-foreground text-xs">
							<p className="font-mono">
								{selectedFeedback.description || "No description provided"}
							</p>
						</div>

						<div className="my-4" />

						<h2 className="mb-2 font-semibold text-lg">Extra Info</h2>
						<p className="mb-4 font-mono text-muted-foreground text-xs">
							Additional technical details and metadata about this feedback
						</p>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{/* Author Information */}
							{selectedFeedback.author && (
								<div className="flex flex-col gap-2 md:col-span-2">
									<h3 className="flex items-center gap-2 font-medium text-sm">
										<PersonStanding className="size-4" />
										Submitted By
									</h3>
									<div className="flex items-center gap-3 rounded-md border bg-card/30 p-3">
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
											<span className="font-medium text-sm">
												{selectedFeedback.author.name}
											</span>
											<span className="text-muted-foreground text-xs">
												{selectedFeedback.author.email}
											</span>
										</div>
									</div>
								</div>
							)}

							{/* Page URL */}
							<div className="flex flex-col gap-2 md:col-span-2">
								<h3 className="flex items-center gap-2 font-medium text-sm">
									<Globe className="size-4" />
									Page URL
								</h3>
								<div className="rounded-md border bg-card/30 p-3">
									<Link
										href={selectedFeedback.pageUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="break-all text-primary text-xs hover:underline"
									>
										{selectedFeedback.pageUrl}
									</Link>
								</div>
							</div>

							{/* Browser Information */}
							<div className="flex flex-col gap-2">
								<h3 className="flex items-center gap-2 font-medium text-sm">
									<Globe className="size-4" />
									Browser
								</h3>
								<div className="rounded-md border bg-card/30 p-3">
									<div className="flex items-center gap-2">
										{(() => {
											const browserIcon = getBrowserIcon(
												selectedFeedback.browser,
											);
											if (browserIcon) {
												const BrowserIconComponent = browserIcon.icon;
												return (
													<div className="flex size-8 items-center justify-center rounded-full border border-border bg-background">
														<span style={{ color: browserIcon.color }}>
															<BrowserIconComponent size={16} />
														</span>
													</div>
												);
											}
											return (
												<div className="flex size-8 items-center justify-center rounded-full border border-border bg-background">
													<Globe className="size-4 text-muted-foreground" />
												</div>
											);
										})()}
										<span className="text-muted-foreground text-xs">
											{selectedFeedback.browser ||
												"Browser information not available"}{" "}
											{selectedFeedback.browserVersion &&
												`v${selectedFeedback.browserVersion}`}
										</span>
									</div>
								</div>
							</div>

							{/* Operating System */}
							<div className="flex flex-col gap-2">
								<h3 className="flex items-center gap-2 font-medium text-sm">
									<Monitor className="size-4" />
									Operating System
								</h3>
								<div className="rounded-md border bg-card/30 p-3">
									<div className="flex items-center gap-2">
										{(() => {
											const osIcon = getOSIcon(selectedFeedback.os);
											if (osIcon) {
												const OSIconComponent = osIcon.icon;
												return (
													<div className="flex size-8 items-center justify-center rounded-full border border-border bg-background">
														<span style={{ color: osIcon.color }}>
															<OSIconComponent size={16} />
														</span>
													</div>
												);
											}
											return (
												<div className="flex size-8 items-center justify-center rounded-full border border-border bg-background">
													<Monitor className="size-4 text-muted-foreground" />
												</div>
											);
										})()}
										<span className="text-muted-foreground text-xs">
											{selectedFeedback.os ||
												"Operating system information not available"}
										</span>
									</div>
								</div>
							</div>

							{/* Device Type */}
							<div className="flex flex-col gap-2">
								<h3 className="flex items-center gap-2 font-medium text-sm">
									<Smartphone className="size-4" />
									Device Type
								</h3>
								<div className="rounded-md border bg-card/30 p-3">
									<div className="flex items-center gap-2">
										{(() => {
											const device = selectedFeedback.device?.toLowerCase();
											let DeviceIcon = Monitor;
											let colorClass = "text-emerald-500";

											if (
												device?.includes("mobile") ||
												device?.includes("phone")
											) {
												DeviceIcon = Smartphone;
												colorClass = "text-blue-400";
											} else if (device?.includes("tablet")) {
												DeviceIcon = Tablet;
												colorClass = "text-purple-400";
											} else if (device?.includes("desktop")) {
												DeviceIcon = Monitor;
												colorClass = "text-gray-400";
											} else if (device?.includes("console")) {
												DeviceIcon = Laptop;
												colorClass = "text-indigo-400";
											} else if (
												device?.includes("smarttv") ||
												device?.includes("tv")
											) {
												DeviceIcon = Tv;
												colorClass = "text-red-400";
											} else if (
												device?.includes("wearable") ||
												device?.includes("watch")
											) {
												DeviceIcon = Watch;
												colorClass = "text-green-400";
											} else if (
												device?.includes("xr") ||
												device?.includes("vr")
											) {
												DeviceIcon = Glasses;
												colorClass = "text-cyan-400";
											} else if (device?.includes("embedded")) {
												DeviceIcon = Monitor;
												colorClass = "text-orange-400";
											}

											return (
												<div className="flex size-8 items-center justify-center rounded-full border border-border bg-background">
													<DeviceIcon className={`size-4 ${colorClass}`} />
												</div>
											);
										})()}
										<span className="text-muted-foreground text-xs">
											{selectedFeedback.device || "Unknown device"}
										</span>
									</div>
								</div>
							</div>

							{/* Viewport */}
							<div className="flex flex-col gap-2">
								<h3 className="flex items-center gap-2 font-medium text-sm">
									<Maximize className="size-4" />
									Viewport Size
								</h3>
								<div className="rounded-md border bg-card/30 p-3">
									<div className="flex items-center gap-2">
										<Maximize className="size-4 text-muted-foreground" />
										<span className="text-muted-foreground text-xs">
											{selectedFeedback.viewport ||
												"Viewport size not available"}
										</span>
									</div>
								</div>
							</div>

							{/* Timestamps */}
							<div className="flex flex-col gap-2 md:col-span-2">
								<h3 className="flex items-center gap-2 font-medium text-sm">
									<Clock className="size-4" />
									Timestamps
								</h3>
								<div className="space-y-3 rounded-md border bg-card/30 p-3">
									{/* <div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<CalendarPlus className="text-green-600 size-4" />
											<span className="text-xs font-medium text-muted-foreground">
												Created:
											</span>
										</div>
										<span className="text-xs text-muted-foreground">
											{moment(selectedFeedback.createdAt).format(
												"MMM Do YYYY, h:mm:ss a",
											)}
										</span>
									</div> */}
									{selectedFeedback.timestamp && (
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Camera className="size-4 text-blue-600" />
												<span className="font-medium text-muted-foreground text-xs">
													Captured:
												</span>
											</div>
											<span className="text-muted-foreground text-xs">
												{moment(selectedFeedback.timestamp).format(
													"MMM Do YYYY, h:mm:ss a",
												)}
											</span>
										</div>
									)}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<CalendarClock className="size-4 text-amber-600" />
											<span className="font-medium text-muted-foreground text-xs">
												Updated:
											</span>
										</div>
										<span className="text-muted-foreground text-xs">
											{moment(selectedFeedback.updatedAt).format(
												"MMM Do YYYY, h:mm:ss a",
											)}
										</span>
									</div>
								</div>
							</div>

							{/* Feedback ID */}
							<div className="flex flex-col gap-2 md:col-span-2">
								<h3 className="flex items-center gap-2 font-medium text-sm">
									<Hash className="size-4" />
									Feedback ID
								</h3>
								<div className="rounded-md border bg-card/30 p-3">
									<code className="text-muted-foreground text-xs">
										{selectedFeedback.id}
									</code>
								</div>
							</div>
						</div>
					</DialogContent>
				) : (
					<DialogContent className="overflow-y-scroll" variant={"feedback"}>
						<DialogHeader>
							<DialogTitle className="text-2xl">Feedback Details</DialogTitle>
							<DialogDescription>
								Hang tight while we present what your client needs done.
							</DialogDescription>
						</DialogHeader>
						<div className="my-2 flex w-full flex-row items-center justify-between">
							<div>
								<h2 className="font-semibold text-lg">Annotated Image</h2>
								<p className="text-muted-foreground text-xs">
									Click on image to expand
								</p>
							</div>
						</div>

						<div className="rounded-sm border border-card bg-card/30 p-3">
							<Skeleton className="h-[400px] w-full rounded-sm" />
						</div>

						<div className="flex flex-row items-center justify-between">
							<div className="flex-1">
								<h2 className="mt-5 font-semibold text-lg">Title</h2>
								<div className="mt-1">
									<Skeleton className="h-4 w-3/4" />
								</div>
							</div>
						</div>
					</DialogContent>
				)}
			</Dialog>
		</div>
	);
};

export default FeedbackTable;
