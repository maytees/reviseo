"use client";

import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type {
	AppState,
	BinaryFiles,
	ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeftIcon,
	ChevronRightIcon,
	ClockIcon,
	GlobeIcon,
	Grid2X2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	Fragment,
	useEffect,
	useId,
	useRef,
	useState,
	useTransition,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { tryCatch } from "@/lib/try-catch";
import { type BrowserInfo, PRIORITY_CONFIG, TYPE_CONFIG } from "@/lib/types";
import { type FeedbackFormData, feedbackFormSchema } from "@/lib/validations";
import ExCanvas from "../_components/ExCanvas";
import { submitFeedbackForm } from "./actions";

const ReviseoModal = () => {
	const { data: session } = authClient.useSession();
	const [open, setOpen] = useState(true);
	const [step, setStep] = useState<"canvas" | "form">("canvas");
	const [loading, setLoading] = useState<boolean>(false);
	const [isPending, startTransition] = useTransition();
	const [excalidrawApi, setExcalidrawApi] =
		useState<ExcalidrawImperativeAPI | null>(null);
	const [initialData, setInitialData] = useState<{
		elements?: ExcalidrawElement[];
		appState?: Partial<AppState>;
		files?: BinaryFiles;
		scrollToContent?: boolean;
	}>();

	// const [elements, setElements] = useState<ExcalidrawElement[]>();
	// const [files, setFiles] = useState<BinaryFiles>();
	// const [appState, setAppState] = useState<Partial<AppState>>();

	const sceneData = useRef<{
		elements: ExcalidrawElement[];
		files: BinaryFiles;
		appState: Partial<AppState>;
	}>(null);

	const [screenshotMetadata, setScreenshotMetadata] = useState<{
		timestamp: Date;
		url: string | null;
		image?: string;
		viewport?: string;
		browserInfo?: BrowserInfo;
		projectId?: string;
	}>({
		timestamp: new Date(),
		url: null,
	});

	const formId = useId();
	const titleId = useId();
	const descriptionId = useId();
	const priorityId = useId();
	const typeId = useId();

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const getUrlPath = (url: string) => {
		try {
			const urlObj = new URL(url);
			const path = `${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
			return path || "/";
		} catch {
			return url;
		}
	};

	const form = useForm<FeedbackFormData>({
		resolver: zodResolver(feedbackFormSchema),
		defaultValues: {
			title: "",
			description: "",
			priority: undefined,
			type: undefined,
		},
	});

	const titleValue = useWatch({ control: form.control, name: "title" });
	const descriptionValue = useWatch({
		control: form.control,
		name: "description",
	});

	function onSubmit(data: FeedbackFormData) {
		startTransition(async () => {
			const { exportToSvg } = await import("@excalidraw/excalidraw");
			if (!excalidrawApi) {
				return;
			}

			const dat = sceneData.current;

			if (!dat) {
				console.error("No Data");
				return;
			}

			const { elements, files, appState } = dat;

			if (!elements || !initialData) {
				return;
			}

			const svg = await exportToSvg({
				elements,
				appState: { ...appState },
				files,
				exportPadding: 0,
			});

			const svgString = svg.outerHTML;

			const svgBlob = new Blob([svgString], { type: "image/svg+xml" });

			const presignedResponse = await fetch("/api/s3/annotations", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fileName: "annotation.jpeg",
					contentType: "image/svg+xml",
					size: svgBlob.size,
				}),
			});

			if (!presignedResponse.ok) {
				throw new Error("Failed to get presigned URL");
			}

			const { preSignedUrl, key } = await presignedResponse.json();

			const uploadResponse = await fetch(preSignedUrl, {
				method: "PUT",
				body: svgBlob, // ← Your blob goes here!
				headers: {
					"Content-Type": "image/svg+xml",
				},
			});

			if (!uploadResponse.ok) {
				throw new Error("Upload to S3 failed");
			}

			if (!screenshotMetadata.url || !screenshotMetadata.projectId) {
				return;
			}

			if (!session?.user.id) {
				return;
			}

			const { data: result, error } = await tryCatch(
				submitFeedbackForm(
					screenshotMetadata.url,
					session?.user.id,
					data,
					screenshotMetadata.projectId,
					key,
					screenshotMetadata.viewport,
					screenshotMetadata.timestamp,
					screenshotMetadata.browserInfo,
				),
			);

			if (error) {
				console.error(error);
				window.parent.postMessage(
					{
						type: "An unexpected error occurred. Please try again.",
					},
					"*",
				);
				return;
			}

			if (result.status === "success") {
				window.parent.postMessage({ type: "CLOSE_FORM" }, "*");
				form.reset();
			} else if (result.status === "error") {
				console.error(result.message);
				window.parent.postMessage(
					{
						type: result.message,
					},
					"*",
				);
			}
		});
	}

	useEffect(() => {
		if (!open) {
			window.parent.postMessage({ type: "CLOSE_FORM" }, "*");
			return;
		}
	}, [open]);

	// Request page URL from parent window
	useEffect(() => {
		// Request URL from parent
		window.parent.postMessage({ type: "REQUEST_PAGE_DATA" }, "*");
		window.parent.postMessage({ type: "REQUEST_PAGE_SCREENSHOT" }, "*");
		setLoading(true);

		// Listen for URL response
		const handleMessage = (event: MessageEvent) => {
			switch (event.data?.type) {
				case "PAGE_DATA_RESPONSE":
					setScreenshotMetadata((prev) => ({
						...prev,
						url: event.data.url || "",
						viewport: `${event.data.viewportWidth}x${event.data.viewportHeight}`,
						browserInfo: event.data.browserInfo as BrowserInfo,
						projectId: event.data.projectId,
					}));
					break;
				case "PAGE_SCREENSHOT_RESPONSE":
					setScreenshotMetadata((prev) => ({
						...prev,
						image: event.data.image || null,
					}));
					setLoading(false);
					break;
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	return (
		<Fragment>
			{session?.user && (
				<Dialog open={true} onOpenChange={setOpen}>
					<DialogContent
						className="overflow-y-scroll bg-card"
						variant={"fullscreen"}
					>
						<DialogTitle>Submit Feedback</DialogTitle>
						<DialogDescription>
							Draw on the screenshot to show the developer(s) what you'd like
							changed, then provide details about your feedback.
						</DialogDescription>
						{/* Mobile Stepper - Only visible on small screens */}
						<div className="flex items-center gap-2 mt-3 md:hidden">
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step === "canvas" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
							>
								1
							</div>
							<ChevronRightIcon className="size-4 text-muted-foreground" />
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step === "form" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
							>
								2
							</div>
							<span className="ml-2 text-sm font-medium">
								{step === "canvas" ? "Annotate" : "Details"}
							</span>
						</div>

						{/* Main Content Layout */}
						<div className="flex flex-col h-full gap-3 mt-3 md:flex-row">
							{/* Canvas - Always visible on desktop, conditional on mobile */}
							<div
								className={`flex-1 min-h-0 border border-border rounded-2xl ${step === "form" ? "hidden md:flex" : "flex"}`}
							>
								<ExCanvas
									initialData={initialData}
									setInitialData={setInitialData}
									// excalidrawApi={excalidrawApi}
									setExcalidrawApi={setExcalidrawApi}
									imageUrl={screenshotMetadata.image}
									pending={loading || isPending}
									sceneData={sceneData}
									// setElements={setElements}
									// setAppState={setAppState}
									// setFiles={setFiles}
								/>
							</div>

							{/* Form - Side panel on desktop, full screen on mobile */}
							<Card
								className={`flex flex-col md:max-w-xs md:min-w-sm ${step === "canvas" ? "hidden md:flex" : "flex flex-1 overflow-y-scroll"} min-h-0`}
							>
								<CardContent className="flex flex-col flex-1 min-h-0 overflow-y-scroll md:overflow-visible">
									<form
										className="flex flex-col h-full"
										onSubmit={form.handleSubmit(onSubmit)}
										id={formId}
									>
										<FieldGroup className="flex flex-col flex-1 min-h-0 gap-4">
											<Controller
												name="title"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<div className="flex items-center justify-between">
															<FieldLabel htmlFor={titleId}>Title</FieldLabel>
															<span className="text-xs text-muted-foreground">
																{titleValue?.length || 0}/800
															</span>
														</div>
														<Input
															{...field}
															id={titleId}
															disabled={loading || isPending}
															aria-invalid={fieldState.invalid}
															placeholder="e.g., Make the header bigger"
															autoComplete="off"
														/>
														{fieldState.invalid && (
															<FieldError errors={[fieldState.error]} />
														)}
													</Field>
												)}
											/>
											<Controller
												name="description"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field
														className="flex flex-col flex-1 min-h-0"
														data-invalid={fieldState.invalid}
													>
														<div className="flex items-center justify-between">
															<FieldLabel htmlFor={descriptionId}>
																Details (optional)
															</FieldLabel>
															<span className="text-xs text-muted-foreground">
																{descriptionValue?.length || 0}/6000
															</span>
														</div>
														<Textarea
															disabled={loading || isPending}
															{...field}
															id={descriptionId}
															aria-invalid={fieldState.invalid}
															placeholder="Add any extra context or notes..."
															autoComplete="off"
															className="flex-1 resize-none"
														/>
														{<FieldError errors={[fieldState.error]} />}
													</Field>
												)}
											/>
											<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
												<Controller
													name="priority"
													control={form.control}
													render={({ field, fieldState }) => (
														<Field data-invalid={fieldState.invalid}>
															<FieldLabel htmlFor={priorityId}>
																Priority
															</FieldLabel>
															<Select
																disabled={isPending || loading}
																value={field.value}
																onValueChange={field.onChange}
															>
																<SelectTrigger
																	id={priorityId}
																	aria-invalid={fieldState.invalid}
																	className="w-full"
																>
																	<SelectValue placeholder="Select priority" />
																</SelectTrigger>
																<SelectContent>
																	{Object.entries(PRIORITY_CONFIG).map(
																		([key, config]) => {
																			const Icon = config.icon;
																			return (
																				<SelectItem key={key} value={key}>
																					<div className="flex items-center gap-2">
																						<Icon
																							className={`size-4 ${config.color}`}
																						/>
																						<span>{config.label}</span>
																					</div>
																				</SelectItem>
																			);
																		},
																	)}
																</SelectContent>
															</Select>
															{fieldState.invalid && (
																<FieldError errors={[fieldState.error]} />
															)}
														</Field>
													)}
												/>
												<Controller
													name="type"
													control={form.control}
													render={({ field, fieldState }) => (
														<Field data-invalid={fieldState.invalid}>
															<FieldLabel htmlFor={typeId}>Type</FieldLabel>
															<Select
																disabled={isPending || loading}
																value={field.value}
																onValueChange={field.onChange}
															>
																<SelectTrigger
																	id={typeId}
																	aria-invalid={fieldState.invalid}
																	className="w-full"
																>
																	<SelectValue placeholder="Select type" />
																</SelectTrigger>
																<SelectContent>
																	{Object.entries(TYPE_CONFIG).map(
																		([key, config]) => {
																			const Icon = config.icon;
																			return (
																				<SelectItem key={key} value={key}>
																					<div className="flex items-center gap-2">
																						<Icon
																							className={`size-4 ${config.color}`}
																						/>
																						<span>{config.label}</span>
																					</div>
																				</SelectItem>
																			);
																		},
																	)}
																</SelectContent>
															</Select>
															{fieldState.invalid && (
																<FieldError errors={[fieldState.error]} />
															)}
														</Field>
													)}
												/>
											</div>
										</FieldGroup>
										<div className="flex flex-col gap-2 mt-4">
											{/* Mobile: Back button when on form step */}
											{step === "form" && (
												<Button
													disabled={loading || isPending}
													type="button"
													variant="outline"
													onClick={() => setStep("canvas")}
													className="w-full md:hidden"
												>
													<ArrowLeftIcon className="mr-2 size-4" />
													Back to Canvas
												</Button>
											)}
											{/* Desktop: Close button, Mobile: conditional */}
											<DialogClose asChild>
												<Button
													disabled={loading || isPending}
													type="button"
													variant="outline"
													className={step === "canvas" ? "hidden" : ""}
													onClick={() => setOpen(false)}
												>
													Close
												</Button>
											</DialogClose>
											<Button
												disabled={loading || isPending}
												type="submit"
												form={formId}
											>
												Submit feedback
											</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						</div>

						{/* Mobile: Continue button when on canvas step */}
						{step === "canvas" && (
							<Button
								disabled={loading || isPending}
								onClick={() => setStep("form")}
								className="w-full mt-3 md:hidden"
								size="lg"
							>
								Continue to Details
								<ChevronRightIcon className="ml-2 size-4" />
							</Button>
						)}

						<DialogFooter className="flex-col gap-3 pt-4 sm:flex-row sm:justify-between sm:items-center border-border">
							{/* Screenshot Metadata */}
							<div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
								<div className="flex items-center gap-1.5 min-w-fit">
									<ClockIcon className="size-3.5 text-muted-foreground" />
									<span className="text-xs text-muted-foreground">
										{formatDate(screenshotMetadata.timestamp)} at{" "}
										{formatTime(screenshotMetadata.timestamp)}
									</span>
								</div>
								<div className="flex items-center gap-1.5 max-w-3xs">
									<GlobeIcon className="size-3.5 text-muted-foreground" />
									{screenshotMetadata.url ? (
										<span
											className="text-xs truncate text-muted-foreground "
											title={screenshotMetadata.url}
										>
											{getUrlPath(screenshotMetadata.url)}
										</span>
									) : (
										<span className="text-xs truncate text-muted-foreground">
											No URL Data
										</span>
									)}
								</div>
								<div className="flex items-center gap-1.5 max-w-3xs">
									<Grid2X2 className="size-3.5 text-muted-foreground" />
									{screenshotMetadata.viewport ? (
										<span
											className="text-xs truncate text-muted-foreground "
											title={screenshotMetadata.viewport}
										>
											{getUrlPath(screenshotMetadata.viewport)}
										</span>
									) : (
										<span className="text-xs truncate text-muted-foreground">
											No Viewport Data
										</span>
									)}
								</div>
							</div>
							{/* Reviseo Branding */}
							<div className="flex items-center gap-1.5">
								<Image
									src="/logo.svg"
									loading="eager"
									alt="Reviseo Logo"
									width={16}
									height={16}
								/>
								<span className="text-xs text-muted-foreground">
									Powered by{" "}
									<Link
										href="https://reviseo.app"
										target="_blank"
										rel="noopener noreferrer"
										className="font-medium text-foreground hover:underline"
									>
										Reviseo
									</Link>
								</span>
							</div>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</Fragment>
	);
};

export default ReviseoModal;
