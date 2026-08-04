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
	CheckCircle2Icon,
	ChevronRightIcon,
	ClockIcon,
	GlobeIcon,
	Grid2X2,
	MousePointerClickIcon,
	PenLineIcon,
	SendIcon,
	TextCursorInputIcon,
	Trash2Icon,
} from "lucide-react";
import { motion } from "motion/react";
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
import { toast } from "sonner";
import { DiffText } from "@/components/text-edit-diff";
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
import { useConfetti } from "@/lib/hooks/use-confetti";
import { tryCatch } from "@/lib/try-catch";
import { type BrowserInfo, PRIORITY_CONFIG, TYPE_CONFIG } from "@/lib/types";
import {
	type FeedbackFormData,
	feedbackFormSchema,
	type TextEditItem,
} from "@/lib/validations";
import ExCanvas from "../_components/ExCanvas";
import { ensureStorageAccess } from "../lib/storage-access";
import { submitFeedbackForm, submitTextEdits } from "./actions";

type SessionData = Awaited<ReturnType<typeof authClient.getSession>>["data"];

/** Edit records forwarded by the loader (its ids, not database ids). */
type ReviewEdit = TextEditItem & { id: string };

const ReviseoModal = () => {
	const { data: hookSession } = authClient.useSession();
	// Session fetched manually after a Storage Access grant (cross-site
	// iframes) — the hook's initial fetch may predate cookie access.
	const [grantedSession, setGrantedSession] = useState<SessionData>(null);
	const session = hookSession ?? grantedSession;
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState<"canvas" | "form">("canvas");
	// Which experience the dialog is showing: the screenshot feedback flow,
	// the text-tool onboarding card, or the text-edit review list.
	const [view, setView] = useState<"feedback" | "guide" | "review">("feedback");
	const [textEdits, setTextEdits] = useState<ReviewEdit[]>([]);
	const [textNote, setTextNote] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [isPending, startTransition] = useTransition();
	const { triggerConfetti } = useConfetti();
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
			priority: "LOW",
			type: "IMPROVEMENT",
		},
	});

	const titleValue = useWatch({ control: form.control, name: "title" });
	const descriptionValue = useWatch({
		control: form.control,
		name: "description",
	});

	/** Hide the iframe (parent) and reset every piece of per-session state so
	 *  the next open starts fresh. */
	const closeAndReset = () => {
		setOpen(false);
		setSubmitted(false);
		setLoading(false);
		setStep("canvas");
		setView("feedback");
		setTextEdits([]);
		setTextNote("");
		setInitialData(undefined);
		sceneData.current = null;
		form.reset();
		setScreenshotMetadata({ timestamp: new Date(), url: null });
		window.parent.postMessage({ type: "CLOSE_FORM" }, "*");
	};

	function onSubmit(data: FeedbackFormData) {
		startTransition(async () => {
			try {
				const { exportToSvg } = await import("@excalidraw/excalidraw");
				if (!excalidrawApi) {
					return;
				}

				const dat = sceneData.current;

				if (!dat) {
					toast.error("Nothing to submit yet — the screenshot hasn't loaded.");
					return;
				}

				const { elements, files, appState } = dat;

				if (!elements || !initialData) {
					toast.error("Nothing to submit yet — the screenshot hasn't loaded.");
					return;
				}

				if (!screenshotMetadata.url || !screenshotMetadata.projectId) {
					toast.error("Missing page data. Close the widget and try again.");
					return;
				}

				if (!session?.user.id) {
					toast.error("You're signed out. Sign in and try again.");
					return;
				}

				const svg = await exportToSvg({
					elements,
					appState: { ...appState },
					files,
					exportPadding: 0,
				});

				const svgBlob = new Blob([svg.outerHTML], {
					type: "image/svg+xml",
				});

				const presignedResponse = await fetch("/api/s3/annotations", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						fileName: "annotation.svg",
						contentType: "image/svg+xml",
						size: svgBlob.size,
						projectId: screenshotMetadata.projectId,
					}),
				});

				if (!presignedResponse.ok) {
					toast.error(
						presignedResponse.status === 400
							? "Screenshot too large to upload — try annotating a smaller area."
							: "Couldn't start the upload. Please try again.",
					);
					return;
				}

				const { preSignedUrl, key } = await presignedResponse.json();

				const uploadResponse = await fetch(preSignedUrl, {
					method: "PUT",
					body: svgBlob,
					headers: {
						"Content-Type": "image/svg+xml",
					},
				});

				if (!uploadResponse.ok) {
					toast.error("Upload failed. Please try again.");
					return;
				}

				const { data: result, error } = await tryCatch(
					submitFeedbackForm(
						screenshotMetadata.url,
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
					toast.error("An unexpected error occurred. Please try again.");
					return;
				}

				if (result.status === "success") {
					// Show the success view (with confetti) instead of closing
					// immediately — closeAndReset runs on Done or auto-close.
					setSubmitted(true);
					triggerConfetti();
				} else {
					console.error(result.message);
					toast.error(result.message);
				}
			} catch (err) {
				console.error(err);
				toast.error("Something went wrong submitting your feedback.");
			}
		});
	}

	/** Onboarding done → the loader stores the flag and starts text mode. */
	const handleGuideDone = () => {
		closeAndReset();
		window.parent.postMessage({ type: "TEXT_GUIDE_DONE" }, "*");
	};

	/** Drop one edit from the batch (the loader restores that element). */
	const handleRemoveEdit = (id: string) => {
		window.parent.postMessage({ type: "TEXT_EDIT_REMOVED", id }, "*");
		const remaining = textEdits.filter((e) => e.id !== id);
		setTextEdits(remaining);
		if (remaining.length === 0) closeAndReset();
	};

	const handleSubmitTextEdits = () => {
		startTransition(async () => {
			if (!screenshotMetadata.projectId) {
				toast.error("Missing page data. Close the widget and try again.");
				return;
			}
			if (!session?.user.id) {
				toast.error("You're signed out. Sign in and try again.");
				return;
			}

			const { data: result, error } = await tryCatch(
				submitTextEdits(
					screenshotMetadata.projectId,
					{
						note: textNote || undefined,
						edits: textEdits.map(({ id: _id, ...edit }) => edit),
					},
					screenshotMetadata.browserInfo,
					screenshotMetadata.viewport,
				),
			);

			if (error) {
				console.error(error);
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				// The loader wipes its edit state and restores the page; the
				// success view (confetti) stays up until Done/auto-close.
				window.parent.postMessage({ type: "TEXT_SUBMITTED" }, "*");
				setSubmitted(true);
				triggerConfetti();
			} else {
				console.error(result.message);
				toast.error(result.message);
			}
		});
	};

	useEffect(() => {
		if (!open) {
			window.parent.postMessage({ type: "CLOSE_FORM" }, "*");
			return;
		}
	}, [open]);

	// Auto-close a few seconds after a successful submit (cleared if the
	// user closes manually first — closeAndReset flips `submitted`).
	// biome-ignore lint/correctness/useExhaustiveDependencies: closeAndReset is stable enough for this effect
	useEffect(() => {
		if (!submitted) return;
		const timer = window.setTimeout(() => {
			closeAndReset();
		}, 5000);
		return () => window.clearTimeout(timer);
	}, [submitted]);

	// Listen for SHOW_MODAL message and request data only when opening
	useEffect(() => {
		const recoverSession = () => {
			// Cross-site: the trigger already acquired the Storage Access
			// permission with a user gesture, so this resolves without a
			// prompt and lets this document's requests carry cookies too.
			void (async () => {
				await ensureStorageAccess();
				const { data } = await authClient.getSession();
				if (data) setGrantedSession(data);
			})();
		};

		const handleMessage = (event: MessageEvent) => {
			switch (event.data?.type) {
				case "SHOW_TEXT_GUIDE":
					setOpen(true);
					setSubmitted(false);
					setLoading(false);
					setView("guide");
					recoverSession();
					break;
				case "SHOW_TEXT_REVIEW":
					setOpen(true);
					setSubmitted(false);
					setLoading(false);
					setView("review");
					if (Array.isArray(event.data.edits)) {
						setTextEdits(event.data.edits);
					}
					recoverSession();
					// Page data carries projectId + browser info for submission.
					window.parent.postMessage({ type: "REQUEST_PAGE_DATA" }, "*");
					break;
				case "SHOW_MODAL":
					// Modal is being shown, request fresh data
					setOpen(true);
					setSubmitted(false);
					setView("feedback");
					recoverSession();
					window.parent.postMessage({ type: "REQUEST_PAGE_DATA" }, "*");
					window.parent.postMessage({ type: "REQUEST_PAGE_SCREENSHOT" }, "*");
					setLoading(true);
					break;
				case "PAGE_DATA_RESPONSE":
					setScreenshotMetadata((prev) => ({
						...prev,
						url: event.data.url || "",
						viewport: `${event.data.viewportWidth}x${event.data.viewportHeight}`,
						browserInfo: event.data.browserInfo,
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
				<Dialog
					modal={false}
					open={open}
					onOpenChange={(o) => {
						if (!o) closeAndReset();
					}}
				>
					<DialogContent
						onEscapeKeyDown={(e) => e.preventDefault()}
						className={
							submitted || view === "guide"
								? "rounded-2xl bg-card"
								: view === "review"
									? "flex max-h-[85vh] flex-col rounded-2xl bg-card sm:max-w-xl"
									: "overflow-y-scroll bg-card transition-all duration-500 ease-in-out"
						}
						// Fullscreen only for the annotate flow; success, the
						// text-tool guide, and the review list are compact cards.
						variant={
							submitted || view !== "feedback" ? "default" : "fullscreen"
						}
					>
						{submitted ? (
							<div className="flex flex-col items-center justify-center gap-6 px-4 py-10 text-center">
								<DialogTitle className="sr-only">
									Feedback Submitted
								</DialogTitle>
								<DialogDescription className="sr-only">
									Your feedback was submitted successfully.
								</DialogDescription>
								<motion.div
									initial={{ scale: 0, rotate: -30 }}
									animate={{ scale: 1, rotate: 0 }}
									transition={{ type: "spring", stiffness: 260, damping: 16 }}
									className="flex size-20 items-center justify-center rounded-full bg-emerald-500/10"
								>
									<CheckCircle2Icon className="size-11 text-emerald-500" />
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.15 }}
									className="flex flex-col gap-2"
								>
									<h2 className="font-bold font-caudex text-3xl">
										{view === "review" ? "Suggestions sent!" : "Feedback sent!"}
									</h2>
									<p className="max-w-sm text-muted-foreground">
										{view === "review"
											? "The team has been notified and will review your suggested copy changes shortly."
											: "The team has been notified and will review your feedback shortly. Thanks for helping make this site better."}
									</p>
								</motion.div>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.3 }}
									className="flex flex-col items-center gap-2"
								>
									<Button size="lg" onClick={closeAndReset}>
										Done
									</Button>
									<span className="text-muted-foreground text-xs">
										Closing automatically in a few seconds…
									</span>
								</motion.div>
							</div>
						) : view === "guide" ? (
							<div className="flex flex-col gap-6 px-1 py-3">
								<div className="flex flex-col items-center gap-3 text-center">
									<motion.div
										initial={{ scale: 0, rotate: -15 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{ type: "spring", stiffness: 260, damping: 16 }}
										className="flex size-14 items-center justify-center rounded-2xl bg-violet-500/10"
									>
										<TextCursorInputIcon className="size-7 text-violet-500" />
									</motion.div>
									<DialogTitle className="font-caudex text-2xl">
										Suggest text edits
									</DialogTitle>
									<DialogDescription className="max-w-sm">
										Fix typos and reword copy directly on the page — the team
										sees exactly what you want changed.
									</DialogDescription>
								</div>
								<ol className="flex flex-col gap-4">
									{(
										[
											[MousePointerClickIcon, "Click any text on the page"],
											[
												PenLineIcon,
												"Type your change — it previews live, right in place",
											],
											[SendIcon, "Save, repeat for more, then review & submit"],
										] as const
									).map(([Icon, label], i) => (
										<motion.li
											key={label}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.1 + i * 0.08 }}
											className="flex items-center gap-3"
										>
											<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
												<Icon className="size-4 text-foreground" />
											</span>
											<span className="text-sm">
												<span className="mr-1.5 font-semibold text-muted-foreground">
													{i + 1}.
												</span>
												{label}
											</span>
										</motion.li>
									))}
								</ol>
								<div className="flex flex-col items-center gap-2">
									<Button
										size="lg"
										className="w-full"
										onClick={handleGuideDone}
									>
										Got it — start editing
									</Button>
									<span className="text-muted-foreground text-xs">
										Press Esc anytime to exit edit mode
									</span>
								</div>
							</div>
						) : view === "review" ? (
							<>
								<DialogTitle>Review your text edits</DialogTitle>
								<DialogDescription>
									{textEdits.length === 1
										? "1 suggested change"
										: `${textEdits.length} suggested changes`}{" "}
									— remove any you don't want, add an optional note, then
									submit.
								</DialogDescription>
								<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-1">
									{textEdits.map((edit) => (
										<div
											key={edit.id}
											className="rounded-xl border border-border bg-background/50 p-3"
										>
											<div className="mb-2 flex items-center justify-between gap-2">
												<div className="flex min-w-0 items-center gap-2">
													<span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
														{edit.elementTag ?? "text"}
													</span>
													<span
														className="truncate text-muted-foreground text-xs"
														title={edit.pageUrl}
													>
														{getUrlPath(edit.pageUrl)}
													</span>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
													onClick={() => handleRemoveEdit(edit.id)}
													title="Remove this edit"
												>
													<Trash2Icon className="size-3.5" />
												</Button>
											</div>
											<DiffText
												original={edit.originalText}
												suggested={edit.suggestedText}
											/>
										</div>
									))}
									<Textarea
										value={textNote}
										onChange={(e) => setTextNote(e.target.value)}
										placeholder="Anything else the team should know? (optional)"
										className="min-h-20 resize-none"
										maxLength={6000}
										disabled={isPending}
									/>
								</div>
								<div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
									<Button
										variant="outline"
										disabled={isPending}
										onClick={() => setOpen(false)}
									>
										Keep editing
									</Button>
									<Button
										disabled={isPending || textEdits.length === 0}
										onClick={handleSubmitTextEdits}
									>
										<SendIcon className="size-4" />
										{isPending
											? "Submitting…"
											: textEdits.length === 1
												? "Submit 1 suggestion"
												: `Submit ${textEdits.length} suggestions`}
									</Button>
								</div>
							</>
						) : (
							<>
								<DialogTitle>Submit Feedback</DialogTitle>
								<DialogDescription>
									Draw on the screenshot to show the developer(s) what you'd
									like changed, then provide details about your feedback.
								</DialogDescription>
								{/* Mobile Stepper - Only visible on small screens */}
								<div className="mt-3 flex items-center gap-2 md:hidden">
									<div
										className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm ${step === "canvas" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
									>
										1
									</div>
									<ChevronRightIcon className="size-4 text-muted-foreground" />
									<div
										className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm ${step === "form" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
									>
										2
									</div>
									<span className="ml-2 font-medium text-sm">
										{step === "canvas" ? "Annotate" : "Details"}
									</span>
								</div>

								{/* Main Content Layout */}
								<div className="mt-3 flex h-full flex-col gap-3 md:flex-row">
									{/* Canvas - Always visible on desktop, conditional on mobile */}
									<div
										className={`min-h-0 flex-1 rounded-2xl border border-border ${step === "form" ? "hidden md:flex" : "flex"}`}
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
										className={`flex flex-col md:min-w-sm md:max-w-xs ${step === "canvas" ? "hidden md:flex" : "flex flex-1 overflow-y-scroll"} min-h-0`}
									>
										<CardContent className="flex min-h-0 flex-1 flex-col overflow-y-scroll md:overflow-visible">
											<form
												className="flex h-full flex-col"
												onSubmit={form.handleSubmit(onSubmit)}
												id={formId}
											>
												<FieldGroup className="flex min-h-0 flex-1 flex-col gap-4">
													<Controller
														name="title"
														control={form.control}
														render={({ field, fieldState }) => (
															<Field data-invalid={fieldState.invalid}>
																<div className="flex items-center justify-between">
																	<FieldLabel htmlFor={titleId}>
																		Title
																	</FieldLabel>
																	<span className="text-muted-foreground text-xs">
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
																className="flex min-h-0 flex-1 flex-col"
																data-invalid={fieldState.invalid}
															>
																<div className="flex items-center justify-between">
																	<FieldLabel htmlFor={descriptionId}>
																		Details (optional)
																	</FieldLabel>
																	<span className="text-muted-foreground text-xs">
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
												<div className="mt-4 flex flex-col gap-2">
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
															// className={step === "canvas" ? "hidden" : ""}
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
										className="mt-3 w-full md:hidden"
										size="lg"
									>
										Continue to Details
										<ChevronRightIcon className="ml-2 size-4" />
									</Button>
								)}

								<DialogFooter className="flex-col gap-3 border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
									{/* Screenshot Metadata */}
									<div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
										<div className="flex min-w-fit items-center gap-1.5">
											<ClockIcon className="size-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-xs">
												{formatDate(screenshotMetadata.timestamp)} at{" "}
												{formatTime(screenshotMetadata.timestamp)}
											</span>
										</div>
										<div className="flex max-w-3xs items-center gap-1.5">
											<GlobeIcon className="size-3.5 text-muted-foreground" />
											{screenshotMetadata.url ? (
												<span
													className="truncate text-muted-foreground text-xs"
													title={screenshotMetadata.url}
												>
													{getUrlPath(screenshotMetadata.url)}
												</span>
											) : (
												<span className="truncate text-muted-foreground text-xs">
													No URL Data
												</span>
											)}
										</div>
										<div className="flex max-w-3xs items-center gap-1.5">
											<Grid2X2 className="size-3.5 text-muted-foreground" />
											{screenshotMetadata.viewport ? (
												<span
													className="truncate text-muted-foreground text-xs"
													title={screenshotMetadata.viewport}
												>
													{getUrlPath(screenshotMetadata.viewport)}
												</span>
											) : (
												<span className="truncate text-muted-foreground text-xs">
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
										<span className="text-muted-foreground text-xs">
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
							</>
						)}
					</DialogContent>
				</Dialog>
			)}
		</Fragment>
	);
};

export default ReviseoModal;
