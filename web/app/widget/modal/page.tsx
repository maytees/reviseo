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
	CheckIcon,
	ChevronRightIcon,
	ClockIcon,
	EyeIcon,
	GlobeIcon,
	Grid2X2,
	ImageIcon,
	LinkIcon,
	LocateFixedIcon,
	MousePointerClickIcon,
	PaletteIcon,
	PenLineIcon,
	SendIcon,
	SlidersHorizontalIcon,
	TextCursorInputIcon,
	Trash2Icon,
	TriangleAlertIcon,
	UploadIcon,
	XIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
	Fragment,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	useTransition,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { decideFeedbackApproval } from "@/app/(main)/client/dashboard/actions";
import { StyleChangeRows } from "@/components/style-change-rows";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { useConfetti } from "@/lib/hooks/use-confetti";
import { tryCatch } from "@/lib/try-catch";
import { type BrowserInfo, PRIORITY_CONFIG, TYPE_CONFIG } from "@/lib/types";
import {
	type FeedbackFormData,
	feedbackFormSchema,
	type ImageEditItem,
	type StyleEditItem,
	type TextEditItem,
} from "@/lib/validations";
import ExCanvas from "../_components/ExCanvas";
import { ensureStorageAccess } from "../lib/storage-access";
import {
	submitFeedbackForm,
	submitImageEdits,
	submitStyleEdits,
	submitTextEdits,
} from "./actions";

type SessionData = Awaited<ReturnType<typeof authClient.getSession>>["data"];

/** Edit records forwarded by the loader (its ids, not database ids). */
type ReviewEdit = TextEditItem & { id: string };
type StyleReviewEdit = StyleEditItem & { id: string };
type ImageReviewEdit = ImageEditItem & { id: string; previewUrl?: string };

/** What the image picker is replacing (loader-provided). */
type ImagePickContext = {
	originalSrc: string;
	naturalWidth: number;
	naturalHeight: number;
	isExisting: boolean;
};

/** The chosen replacement, before it's applied to the page. */
type ImageChoice = {
	displayUrl: string;
	key?: string;
	url?: string;
	naturalWidth?: number;
	naturalHeight?: number;
};

/** One saved submission, as served by /api/widget/edits for preview mode. */
type PreviewPanelItem = {
	id: string;
	title: string;
	type: "TEXT_EDIT" | "STYLE_EDIT" | "IMAGE_EDIT";
	approval: "DIRECT" | "PENDING" | "APPROVED" | "REJECTED";
	approvalNote?: string | null;
	pageUrl: string;
	createdAt: string;
	author: { id: string; name: string | null } | null;
	textEdits: {
		id: string;
		selector: string;
		originalText: string;
		suggestedText: string;
		pageUrl: string;
	}[];
	styleEdits: {
		id: string;
		selector: string;
		changes: { property: string; before: string; after: string }[];
		pageUrl: string;
	}[];
	imageEdits: {
		id: string;
		selector: string;
		originalSrc: string;
		newKey?: string | null;
		newUrl?: string | null;
		pageUrl: string;
		displayUrl?: string;
	}[];
};

type PreviewPanelViewer = {
	role: "lead" | "member" | "developer";
	userId: string;
};

const previewPathOf = (url: string) => {
	try {
		return new URL(url).pathname;
	} catch {
		return url;
	}
};

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
	const [view, setView] = useState<
		| "feedback"
		| "guide"
		| "review"
		| "styleGuide"
		| "styleReview"
		| "imageGuide"
		| "imagePicker"
		| "imageReview"
		| "previewGuide"
		| "previewPanel"
	>("feedback");
	const [textEdits, setTextEdits] = useState<ReviewEdit[]>([]);
	const [styleEdits, setStyleEdits] = useState<StyleReviewEdit[]>([]);
	const [imageEdits, setImageEdits] = useState<ImageReviewEdit[]>([]);
	const [imagePick, setImagePick] = useState<ImagePickContext | null>(null);
	const [imageChoice, setImageChoice] = useState<ImageChoice | null>(null);
	const [imageBusy, setImageBusy] = useState(false);
	const [imageUrlInput, setImageUrlInput] = useState("");
	const [textNote, setTextNote] = useState("");
	// Preview mode: fetched submissions + panel state (mirrored from loader)
	const [previewItems, setPreviewItems] = useState<PreviewPanelItem[]>([]);
	const [previewViewer, setPreviewViewer] = useState<PreviewPanelViewer | null>(
		null,
	);
	const [previewProjectId, setPreviewProjectId] = useState<string | null>(null);
	const [previewMissing, setPreviewMissing] = useState<string[]>([]);
	const [previewDisabled, setPreviewDisabled] = useState<string[]>([]);
	const [previewPageUrl, setPreviewPageUrl] = useState<string>("");
	const [previewNoteId, setPreviewNoteId] = useState<string | null>(null);
	const [previewNote, setPreviewNote] = useState("");
	const [previewBusy, setPreviewBusy] = useState(false);
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
		setStyleEdits([]);
		setImageEdits([]);
		setImagePick(null);
		setImageChoice(null);
		setImageBusy(false);
		setImageUrlInput("");
		setTextNote("");
		// Preview data (items/viewer/projectId) survives on purpose — the
		// panel reopens instantly while the engine stays active on the page.
		setPreviewNoteId(null);
		setPreviewNote("");
		setPreviewBusy(false);
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

	const handlePreviewGuideDone = () => {
		closeAndReset();
		window.parent.postMessage({ type: "PREVIEW_GUIDE_DONE" }, "*");
	};

	/** Fetch preview data for the loader. Runs on this (reviseo) origin so
	 *  the request carries the session cookie; bucket-hosted replacement
	 *  images are resolved to data URLs here for the same reason — the
	 *  customer page can't send cookies to the serve route. */
	const fetchPreview = useCallback(async (projectId: string) => {
		try {
			await ensureStorageAccess();
			const res = await fetch("/api/widget/edits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ projectId }),
			});
			if (!res.ok) {
				window.parent.postMessage(
					{ type: "PREVIEW_ERROR", status: res.status },
					"*",
				);
				return;
			}
			const data = (await res.json()) as {
				items: PreviewPanelItem[];
				viewer: PreviewPanelViewer;
			};

			for (const item of data.items) {
				for (const edit of item.imageEdits) {
					if (!edit.newKey) {
						edit.displayUrl = edit.newUrl ?? undefined;
						continue;
					}
					try {
						const imageRes = await fetch(
							`/api/s3/image-edits/${encodeURIComponent(edit.newKey)}`,
						);
						if (!imageRes.ok) continue;
						const blob = await imageRes.blob();
						edit.displayUrl = await new Promise<string>((resolve, reject) => {
							const reader = new FileReader();
							reader.onload = () => resolve(reader.result as string);
							reader.onerror = reject;
							reader.readAsDataURL(blob);
						});
					} catch {
						// Missing image → the engine lists the edit as not locatable
					}
				}
			}

			setPreviewItems(data.items);
			setPreviewViewer(data.viewer);
			setPreviewProjectId(projectId);
			window.parent.postMessage(
				{ type: "PREVIEW_DATA", items: data.items, viewer: data.viewer },
				"*",
			);
		} catch {
			window.parent.postMessage({ type: "PREVIEW_ERROR", status: 0 }, "*");
		}
	}, []);

	/** Lead decides a pending submission right from the preview panel. */
	const handlePreviewDecision = (
		item: PreviewPanelItem,
		decision: "APPROVED" | "REJECTED",
	) => {
		setPreviewBusy(true);
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				decideFeedbackApproval(
					item.id,
					decision,
					previewNoteId === item.id && previewNote ? previewNote : undefined,
				),
			);
			setPreviewBusy(false);
			if (error || result?.status === "error") {
				toast.error(result?.message ?? "Something went wrong. Try again.");
				return;
			}
			toast.success(decision === "APPROVED" ? "Approved and sent" : "Rejected");
			setPreviewNoteId(null);
			setPreviewNote("");
			// Refresh both this panel and the page overlay
			if (previewProjectId) void fetchPreview(previewProjectId);
		});
	};

	const handleStyleGuideDone = () => {
		closeAndReset();
		window.parent.postMessage({ type: "STYLE_GUIDE_DONE" }, "*");
	};

	/** Drop one style edit from the batch (the loader restores it). */
	const handleRemoveStyleEdit = (id: string) => {
		window.parent.postMessage({ type: "STYLE_EDIT_REMOVED", id }, "*");
		const remaining = styleEdits.filter((e) => e.id !== id);
		setStyleEdits(remaining);
		if (remaining.length === 0) closeAndReset();
	};

	const handleSubmitStyleEdits = () => {
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
				submitStyleEdits(
					screenshotMetadata.projectId,
					{
						note: textNote || undefined,
						edits: styleEdits.map(({ id: _id, ...edit }) => edit),
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
				window.parent.postMessage({ type: "STYLE_SUBMITTED" }, "*");
				setSubmitted(true);
				triggerConfetti();
			} else {
				console.error(result.message);
				toast.error(result.message);
			}
		});
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

	const handleImageGuideDone = () => {
		closeAndReset();
		window.parent.postMessage({ type: "IMAGE_GUIDE_DONE" }, "*");
	};

	/** Upload a picked/pasted/dropped file and stage it as the choice. The
	 *  page preview travels as a data URL — the customer page can't read our
	 *  blob URLs or send our cookies. */
	const handleImageFile = (file: File) => {
		const allowed = [
			"image/png",
			"image/jpeg",
			"image/webp",
			"image/gif",
			"image/svg+xml",
		];
		if (!allowed.includes(file.type)) {
			toast.error("Use a PNG, JPEG, WebP, GIF, or SVG image.");
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			toast.error("Image is too large — 10MB max.");
			return;
		}
		if (!screenshotMetadata.projectId) {
			toast.error("Missing page data. Close the widget and try again.");
			return;
		}
		const projectId = screenshotMetadata.projectId;

		setImageBusy(true);
		void (async () => {
			try {
				const presignedResponse = await fetch("/api/s3/image-edits", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						fileName: file.name || "pasted-image",
						contentType: file.type,
						size: file.size,
						projectId,
					}),
				});
				if (!presignedResponse.ok) {
					toast.error("Couldn't start the upload. Please try again.");
					return;
				}
				const { preSignedUrl, key } = await presignedResponse.json();

				const uploadResponse = await fetch(preSignedUrl, {
					method: "PUT",
					body: file,
					headers: { "Content-Type": file.type },
				});
				if (!uploadResponse.ok) {
					toast.error("Upload failed. Please try again.");
					return;
				}

				const dataUrl = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result as string);
					reader.onerror = () => reject(reader.error);
					reader.readAsDataURL(file);
				});

				const dims = await new Promise<{ w: number; h: number }>((resolve) => {
					const img = new window.Image();
					img.onload = () =>
						resolve({ w: img.naturalWidth, h: img.naturalHeight });
					img.onerror = () => resolve({ w: 0, h: 0 });
					img.src = dataUrl;
				});

				setImageChoice({
					displayUrl: dataUrl,
					key,
					naturalWidth: dims.w,
					naturalHeight: dims.h,
				});
			} catch (err) {
				console.error(err);
				toast.error("Something went wrong uploading the image.");
			} finally {
				setImageBusy(false);
			}
		})();
	};

	const handleImageUrl = () => {
		const url = imageUrlInput.trim();
		if (!/^https?:\/\//.test(url)) {
			toast.error("Enter a full image URL (https://…).");
			return;
		}
		setImageBusy(true);
		const img = new window.Image();
		img.onload = () => {
			setImageChoice({
				displayUrl: url,
				url,
				naturalWidth: img.naturalWidth,
				naturalHeight: img.naturalHeight,
			});
			setImageBusy(false);
		};
		img.onerror = () => {
			// Not previewable here (hotlink protection etc.) — still usable.
			setImageChoice({ displayUrl: url, url });
			setImageBusy(false);
		};
		img.src = url;
	};

	const handleImageApply = () => {
		if (!imageChoice) return;
		window.parent.postMessage(
			{
				type: "IMAGE_APPLY",
				displayUrl: imageChoice.displayUrl,
				key: imageChoice.key,
				url: imageChoice.url,
			},
			"*",
		);
		closeAndReset();
	};

	const handleImagePickCancel = () => {
		window.parent.postMessage({ type: "IMAGE_PICK_CANCELLED" }, "*");
		closeAndReset();
	};

	const handleImagePickRevert = () => {
		window.parent.postMessage({ type: "IMAGE_PICK_REVERTED" }, "*");
		closeAndReset();
	};

	/** Drop one image edit from the batch (the loader restores it). */
	const handleRemoveImageEdit = (id: string) => {
		window.parent.postMessage({ type: "IMAGE_EDIT_REMOVED", id }, "*");
		const remaining = imageEdits.filter((e) => e.id !== id);
		setImageEdits(remaining);
		if (remaining.length === 0) closeAndReset();
	};

	const handleSubmitImageEdits = () => {
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
				submitImageEdits(
					screenshotMetadata.projectId,
					{
						note: textNote || undefined,
						edits: imageEdits.map(
							({ id: _id, previewUrl: _previewUrl, ...edit }) => edit,
						),
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
				window.parent.postMessage({ type: "IMAGE_SUBMITTED" }, "*");
				setSubmitted(true);
				triggerConfetti();
			} else {
				console.error(result.message);
				toast.error(result.message);
			}
		});
	};

	// Clipboard paste while the image picker is open.
	useEffect(() => {
		if (view !== "imagePicker") return;
		const onPaste = (e: ClipboardEvent) => {
			const file = [...(e.clipboardData?.items ?? [])]
				.find((item) => item.type.startsWith("image/"))
				?.getAsFile();
			if (file) {
				e.preventDefault();
				handleImageFile(file);
			}
		};
		window.addEventListener("paste", onPaste);
		return () => window.removeEventListener("paste", onPaste);
		// biome-ignore lint/correctness/useExhaustiveDependencies: handleImageFile is recreated per render but stable in behavior
	}, [view]);

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
				case "SHOW_STYLE_GUIDE":
					setOpen(true);
					setSubmitted(false);
					setLoading(false);
					setView("styleGuide");
					recoverSession();
					break;
				case "SHOW_PREVIEW_GUIDE":
					setOpen(true);
					setSubmitted(false);
					setLoading(false);
					setView("previewGuide");
					recoverSession();
					break;
				case "SHOW_PREVIEW_PANEL":
					setOpen(true);
					setSubmitted(false);
					setLoading(false);
					setView("previewPanel");
					if (typeof event.data.url === "string") {
						setPreviewPageUrl(event.data.url);
					}
					recoverSession();
					break;
				case "PREVIEW_FETCH":
					if (typeof event.data.projectId === "string") {
						recoverSession();
						void fetchPreview(event.data.projectId);
					}
					break;
				case "PREVIEW_STATE":
					if (Array.isArray(event.data.missingIds)) {
						setPreviewMissing(event.data.missingIds as string[]);
					}
					if (Array.isArray(event.data.disabledIds)) {
						setPreviewDisabled(event.data.disabledIds as string[]);
					}
					if (typeof event.data.url === "string") {
						setPreviewPageUrl(event.data.url);
					}
					break;
				case "SHOW_STYLE_REVIEW":
					setOpen(true);
					setSubmitted(false);
					setLoading(false);
					setView("styleReview");
					if (Array.isArray(event.data.edits)) {
						setStyleEdits(event.data.edits);
					}
					recoverSession();
					window.parent.postMessage({ type: "REQUEST_PAGE_DATA" }, "*");
					break;
				case "SHOW_IMAGE_GUIDE":
					setOpen(true);
					setSubmitted(false);
					setLoading(false);
					setView("imageGuide");
					recoverSession();
					break;
				case "SHOW_IMAGE_PICKER":
					setOpen(true);
					setSubmitted(false);
					setLoading(false);
					setView("imagePicker");
					setImagePick({
						originalSrc:
							typeof event.data.originalSrc === "string"
								? event.data.originalSrc
								: "",
						naturalWidth:
							typeof event.data.naturalWidth === "number"
								? event.data.naturalWidth
								: 0,
						naturalHeight:
							typeof event.data.naturalHeight === "number"
								? event.data.naturalHeight
								: 0,
						isExisting: event.data.isExisting === true,
					});
					setImageChoice(null);
					setImageUrlInput("");
					recoverSession();
					window.parent.postMessage({ type: "REQUEST_PAGE_DATA" }, "*");
					break;
				case "SHOW_IMAGE_REVIEW":
					setOpen(true);
					setSubmitted(false);
					setLoading(false);
					setView("imageReview");
					if (Array.isArray(event.data.edits)) {
						setImageEdits(event.data.edits);
					}
					recoverSession();
					window.parent.postMessage({ type: "REQUEST_PAGE_DATA" }, "*");
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
	}, [fetchPreview]);

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
							submitted ||
							view === "guide" ||
							view === "styleGuide" ||
							view === "imageGuide" ||
							view === "previewGuide" ||
							view === "imagePicker"
								? "rounded-2xl bg-card"
								: view === "review" ||
										view === "styleReview" ||
										view === "imageReview" ||
										view === "previewPanel"
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
										{view === "review" ||
										view === "styleReview" ||
										view === "imageReview"
											? "Suggestions sent!"
											: "Feedback sent!"}
									</h2>
									<p className="max-w-sm text-muted-foreground">
										{view === "review"
											? "The team has been notified and will review your suggested copy changes shortly."
											: view === "styleReview"
												? "The team has been notified and will review your suggested style changes shortly."
												: view === "imageReview"
													? "The team has been notified and will review your suggested image replacements shortly."
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
						) : view === "imageGuide" ? (
							<div className="flex flex-col gap-6 px-1 py-3">
								<div className="flex flex-col items-center gap-3 text-center">
									<motion.div
										initial={{ scale: 0, rotate: -15 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{ type: "spring", stiffness: 260, damping: 16 }}
										className="flex size-14 items-center justify-center rounded-2xl bg-cyan-500/10"
									>
										<ImageIcon className="size-7 text-cyan-500" />
									</motion.div>
									<DialogTitle className="font-caudex text-2xl">
										Replace images
									</DialogTitle>
									<DialogDescription className="max-w-sm">
										Swap any image on the page for your own — the team sees
										exactly which image goes where.
									</DialogDescription>
								</div>
								<ol className="flex flex-col gap-4">
									{(
										[
											[MousePointerClickIcon, "Click any image on the page"],
											[
												UploadIcon,
												"Upload, paste, or link the replacement image",
											],
											[
												SendIcon,
												"See it in place, repeat, then review & submit",
											],
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
										onClick={handleImageGuideDone}
									>
										Got it — start replacing
									</Button>
									<span className="text-muted-foreground text-xs">
										Press Esc anytime to exit image mode
									</span>
								</div>
							</div>
						) : view === "previewGuide" ? (
							<div className="flex flex-col gap-6 px-1 py-3">
								<div className="flex flex-col items-center gap-3 text-center">
									<motion.div
										initial={{ scale: 0, rotate: -15 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{ type: "spring", stiffness: 260, damping: 16 }}
										className="flex size-14 items-center justify-center rounded-2xl bg-primary/10"
									>
										<EyeIcon className="size-7 text-primary" />
									</motion.div>
									<DialogTitle className="font-caudex text-2xl">
										Preview changes
									</DialogTitle>
									<DialogDescription className="max-w-sm">
										See your team's suggested edits applied to the live page —
										before the developer ships them.
									</DialogDescription>
								</div>
								<ol className="flex flex-col gap-4">
									{(
										[
											[
												EyeIcon,
												"Suggested text, style, and image changes render in place",
											],
											[
												MousePointerClickIcon,
												"Hover any outlined element to see who suggested what",
											],
											[
												SlidersHorizontalIcon,
												"Open the Changes panel to toggle, approve, or reject",
											],
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
										onClick={handlePreviewGuideDone}
									>
										Got it — show me
									</Button>
									<span className="text-muted-foreground text-xs">
										Nothing is changed for real — press Esc anytime to exit
									</span>
								</div>
							</div>
						) : view === "previewPanel" ? (
							(() => {
								const currentPath = previewPathOf(previewPageUrl);
								const editPages = (item: PreviewPanelItem) => [
									...item.textEdits.map((e) => e.pageUrl),
									...item.styleEdits.map((e) => e.pageUrl),
									...item.imageEdits.map((e) => e.pageUrl),
								];
								const onThisPage = (item: PreviewPanelItem) =>
									editPages(item).some((u) => previewPathOf(u) === currentPath);
								const visible = previewItems.filter(
									(item) => item.approval !== "REJECTED",
								);
								const pendingForMe = visible.filter(
									(item) =>
										previewViewer?.role === "lead" &&
										item.approval === "PENDING" &&
										item.author?.id !== previewViewer.userId,
								);
								const rest = visible.filter(
									(item) => !pendingForMe.includes(item),
								);
								const herePreview = rest.filter(onThisPage);
								const elsewhere = rest.filter((item) => !onThisPage(item));

								const itemRow = (
									item: PreviewPanelItem,
									options: { decidable: boolean },
								) => {
									const typeConfig = TYPE_CONFIG[item.type];
									const TypeIcon = typeConfig.icon;
									const missing = previewMissing.includes(item.id);
									const disabled = previewDisabled.includes(item.id);
									const located = onThisPage(item) && !missing;
									return (
										<div
											key={item.id}
											className="flex flex-col gap-2 rounded-lg border border-border p-3"
										>
											<div className="flex items-start justify-between gap-2">
												<div className="flex min-w-0 items-center gap-2.5">
													<span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
														<TypeIcon
															className={`size-4 ${typeConfig.color}`}
														/>
													</span>
													<div className="flex min-w-0 flex-col">
														<span className="truncate font-medium text-sm">
															{item.title}
														</span>
														<span className="truncate text-muted-foreground text-xs">
															{item.author?.id === previewViewer?.userId
																? "You"
																: item.author?.name || "Teammate"}
															{item.approval === "PENDING"
																? " · awaiting approval"
																: item.approval === "APPROVED"
																	? " · approved"
																	: ""}
														</span>
													</div>
												</div>
												<div className="flex shrink-0 items-center gap-1.5">
													{located && (
														<Button
															variant="ghost"
															size="sm"
															onClick={() =>
																window.parent.postMessage(
																	{
																		type: "PREVIEW_FOCUS",
																		feedbackId: item.id,
																	},
																	"*",
																)
															}
														>
															<LocateFixedIcon className="size-4" />
															Show me
														</Button>
													)}
													{onThisPage(item) && (
														<Switch
															size="sm"
															checked={!disabled}
															onCheckedChange={(on) =>
																window.parent.postMessage(
																	{
																		type: "PREVIEW_TOGGLE",
																		feedbackId: item.id,
																		on,
																	},
																	"*",
																)
															}
														/>
													)}
												</div>
											</div>
											{missing && (
												<p className="flex items-center gap-1.5 text-amber-500 text-xs">
													<TriangleAlertIcon className="size-3.5" />
													Couldn't find this element — the page may have changed
													since the suggestion.
												</p>
											)}
											{options.decidable && (
												<div className="flex flex-col gap-2">
													{previewNoteId === item.id ? (
														<Textarea
															value={previewNote}
															onChange={(e) => setPreviewNote(e.target.value)}
															placeholder="Optional note for your teammate…"
															className="min-h-9 resize-none"
															maxLength={2000}
															disabled={previewBusy || isPending}
														/>
													) : (
														<Button
															variant="ghost"
															size="sm"
															className="self-start"
															disabled={previewBusy || isPending}
															onClick={() => {
																setPreviewNoteId(item.id);
																setPreviewNote("");
															}}
														>
															Add a note
														</Button>
													)}
													<div className="flex justify-end gap-2">
														<Button
															variant="outline"
															size="sm"
															className="text-destructive hover:text-destructive"
															disabled={previewBusy || isPending}
															onClick={() =>
																handlePreviewDecision(item, "REJECTED")
															}
														>
															<XIcon className="size-4" />
															Reject
														</Button>
														<Button
															size="sm"
															disabled={previewBusy || isPending}
															onClick={() =>
																handlePreviewDecision(item, "APPROVED")
															}
														>
															<CheckIcon className="size-4" />
															Approve &amp; send
														</Button>
													</div>
												</div>
											)}
										</div>
									);
								};

								return (
									<>
										<div className="space-y-1">
											<DialogTitle>Suggested changes</DialogTitle>
											<DialogDescription>
												{visible.length === 0
													? "Nothing to preview yet — suggestions your team submits will show up here."
													: `Toggle changes on the page${previewViewer?.role === "lead" ? ", and approve or reject what your team sent" : ""}.`}
											</DialogDescription>
										</div>
										<div className="-mx-1 flex flex-col gap-4 overflow-y-auto p-1">
											{pendingForMe.length > 0 && (
												<div className="flex flex-col gap-2">
													<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
														Needs your approval
													</span>
													{pendingForMe.map((item) =>
														itemRow(item, { decidable: true }),
													)}
												</div>
											)}
											{herePreview.length > 0 && (
												<div className="flex flex-col gap-2">
													<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
														On this page
													</span>
													{herePreview.map((item) =>
														itemRow(item, { decidable: false }),
													)}
												</div>
											)}
											{elsewhere.length > 0 && (
												<div className="flex flex-col gap-2">
													<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
														Other pages
													</span>
													{elsewhere.map((item) => (
														<div
															key={item.id}
															className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
														>
															<span className="truncate text-sm">
																{item.title}
															</span>
															<a
																className="shrink-0 text-primary text-xs hover:underline"
																href={`${item.pageUrl.split("#")[0]}#reviseo-preview=${item.id}`}
															>
																{previewPathOf(item.pageUrl)}
															</a>
														</div>
													))}
												</div>
											)}
										</div>
										<Button variant="outline" onClick={closeAndReset}>
											Back to the page
										</Button>
									</>
								);
							})()
						) : view === "imagePicker" ? (
							<>
								<div className="space-y-1">
									<DialogTitle>Replace this image</DialogTitle>
									<DialogDescription>
										Upload a file, paste from your clipboard, or link an image
										URL.
									</DialogDescription>
								</div>
								<div className="flex flex-col gap-4 py-1">
									{/* Current vs replacement */}
									<div className="flex items-center justify-center gap-3">
										<div className="flex flex-col items-center gap-1.5">
											<span className="text-muted-foreground text-xs">
												Current
											</span>
											{/* biome-ignore lint/performance/noImgElement: arbitrary external source */}
											<img
												src={imagePick?.originalSrc}
												alt="Current"
												className="h-28 w-40 rounded-lg border border-border object-cover"
											/>
											{imagePick && imagePick.naturalWidth > 0 && (
												<span className="text-muted-foreground text-xs">
													{imagePick.naturalWidth}×{imagePick.naturalHeight}
												</span>
											)}
										</div>
										<span className="text-muted-foreground">→</span>
										<div className="flex flex-col items-center gap-1.5">
											<span className="text-muted-foreground text-xs">
												Replacement
											</span>
											{imageChoice ? (
												// biome-ignore lint/performance/noImgElement: data URL / arbitrary source
												<img
													src={imageChoice.displayUrl}
													alt="Replacement"
													className="h-28 w-40 rounded-lg border border-border object-cover"
												/>
											) : (
												<div className="flex h-28 w-40 items-center justify-center rounded-lg border border-border border-dashed">
													<ImageIcon className="size-6 text-muted-foreground" />
												</div>
											)}
											{imageChoice &&
											imageChoice.naturalWidth &&
											imageChoice.naturalWidth > 0 ? (
												<span className="text-muted-foreground text-xs">
													{imageChoice.naturalWidth}×{imageChoice.naturalHeight}
												</span>
											) : (
												<span className="text-muted-foreground text-xs">
													&nbsp;
												</span>
											)}
										</div>
									</div>

									{imageChoice?.naturalWidth &&
										imagePick &&
										imagePick.naturalWidth > 0 &&
										(imageChoice.naturalWidth !== imagePick.naturalWidth ||
											imageChoice.naturalHeight !==
												imagePick.naturalHeight) && (
											<p className="text-center text-amber-600 text-xs dark:text-amber-500">
												Different dimensions than the original — it may be
												cropped or stretched on the page.
											</p>
										)}

									{/* Upload */}
									<label
										className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-border border-dashed p-4 transition-colors hover:border-primary/60 hover:bg-muted/40"
										onDragOver={(e) => e.preventDefault()}
										onDrop={(e) => {
											e.preventDefault();
											const file = e.dataTransfer.files?.[0];
											if (file) handleImageFile(file);
										}}
									>
										<UploadIcon className="size-5 text-muted-foreground" />
										<span className="font-medium text-sm">
											{imageBusy
												? "Uploading…"
												: "Drop an image, click to browse, or paste"}
										</span>
										<span className="text-muted-foreground text-xs">
											PNG, JPEG, WebP, GIF, or SVG — 10MB max
										</span>
										<input
											type="file"
											accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
											className="hidden"
											disabled={imageBusy}
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) handleImageFile(file);
												e.target.value = "";
											}}
										/>
									</label>

									{/* URL */}
									<div className="flex items-center gap-2">
										<Input
											value={imageUrlInput}
											onChange={(e) => setImageUrlInput(e.target.value)}
											placeholder="https://example.com/image.png"
											disabled={imageBusy}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleImageUrl();
												}
											}}
										/>
										<Button
											type="button"
											variant="outline"
											disabled={imageBusy || !imageUrlInput.trim()}
											onClick={handleImageUrl}
										>
											<LinkIcon className="size-4" />
											Use URL
										</Button>
									</div>
								</div>
								<div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
									{imagePick?.isExisting && (
										<Button
											variant="ghost"
											className="text-destructive hover:text-destructive sm:mr-auto"
											disabled={imageBusy}
											onClick={handleImagePickRevert}
										>
											Revert to original
										</Button>
									)}
									<Button
										variant="outline"
										disabled={imageBusy}
										onClick={handleImagePickCancel}
									>
										Cancel
									</Button>
									<Button
										disabled={imageBusy || !imageChoice}
										onClick={handleImageApply}
									>
										Apply to page
									</Button>
								</div>
							</>
						) : view === "imageReview" ? (
							<>
								<div className="space-y-1">
									<DialogTitle>Review your image replacements</DialogTitle>
									<DialogDescription>
										{imageEdits.length === 1
											? "1 image replaced"
											: `${imageEdits.length} images replaced`}{" "}
										— remove any you don't want, add an optional note, then
										submit.
									</DialogDescription>
								</div>
								{/* p-1 keeps focus outlines from clipping at scroll edges */}
								<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-1">
									{imageEdits.map((edit) => (
										<div
											key={edit.id}
											className="rounded-xl border border-border bg-background/50 p-3"
										>
											<div className="mb-2 flex items-center justify-between gap-2">
												<span
													className="truncate text-muted-foreground text-xs"
													title={edit.pageUrl}
												>
													{getUrlPath(edit.pageUrl)}
												</span>
												<Button
													variant="ghost"
													size="icon"
													className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
													onClick={() => handleRemoveImageEdit(edit.id)}
													title="Remove this replacement"
												>
													<Trash2Icon className="size-3.5" />
												</Button>
											</div>
											<div className="flex items-center justify-center gap-3">
												{/* biome-ignore lint/performance/noImgElement: arbitrary external source */}
												<img
													src={edit.originalSrc}
													alt="Original"
													className="h-20 w-32 rounded-lg border border-border object-cover"
												/>
												<span className="text-muted-foreground">→</span>
												{edit.previewUrl || edit.newUrl ? (
													// biome-ignore lint/performance/noImgElement: data URL / arbitrary source
													<img
														src={edit.previewUrl ?? edit.newUrl}
														alt="Replacement"
														className="h-20 w-32 rounded-lg border border-border object-cover"
													/>
												) : (
													<div className="flex h-20 w-32 flex-col items-center justify-center gap-1 rounded-lg border border-border border-dashed">
														<ImageIcon className="size-4 text-muted-foreground" />
														<span className="px-1 text-center text-[10px] text-muted-foreground">
															Uploaded (preview gone after reload)
														</span>
													</div>
												)}
											</div>
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
										Keep replacing
									</Button>
									<Button
										disabled={isPending || imageEdits.length === 0}
										onClick={handleSubmitImageEdits}
									>
										<SendIcon className="size-4" />
										{isPending
											? "Submitting…"
											: imageEdits.length === 1
												? "Submit 1 suggestion"
												: `Submit ${imageEdits.length} suggestions`}
									</Button>
								</div>
							</>
						) : view === "styleGuide" ? (
							<div className="flex flex-col gap-6 px-1 py-3">
								<div className="flex flex-col items-center gap-3 text-center">
									<motion.div
										initial={{ scale: 0, rotate: -15 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{ type: "spring", stiffness: 260, damping: 16 }}
										className="flex size-14 items-center justify-center rounded-2xl bg-fuchsia-500/10"
									>
										<PaletteIcon className="size-7 text-fuchsia-500" />
									</motion.div>
									<DialogTitle className="font-caudex text-2xl">
										Suggest style changes
									</DialogTitle>
									<DialogDescription className="max-w-sm">
										Tweak colors, sizes, and spacing directly on the page — the
										team sees exactly what you want changed.
									</DialogDescription>
								</div>
								<ol className="flex flex-col gap-4">
									{(
										[
											[MousePointerClickIcon, "Click any element on the page"],
											[
												SlidersHorizontalIcon,
												"Adjust colors, fonts, and spacing — it previews live",
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
										onClick={handleStyleGuideDone}
									>
										Got it — start styling
									</Button>
									<span className="text-muted-foreground text-xs">
										Press Esc anytime to exit style mode
									</span>
								</div>
							</div>
						) : view === "styleReview" ? (
							<>
								<div className="space-y-1">
									<DialogTitle>Review your style changes</DialogTitle>
									<DialogDescription>
										{styleEdits.length === 1
											? "1 element changed"
											: `${styleEdits.length} elements changed`}{" "}
										— remove any you don't want, add an optional note, then
										submit.
									</DialogDescription>
								</div>
								{/* p-1 keeps focus outlines from clipping at scroll edges */}
								<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-1">
									{styleEdits.map((edit) => (
										<div
											key={edit.id}
											className="rounded-xl border border-border bg-background/50 p-3"
										>
											<div className="mb-2 flex items-center justify-between gap-2">
												<div className="flex min-w-0 items-center gap-2">
													<span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
														{edit.elementTag ?? "element"}
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
													onClick={() => handleRemoveStyleEdit(edit.id)}
													title="Remove this change"
												>
													<Trash2Icon className="size-3.5" />
												</Button>
											</div>
											<StyleChangeRows changes={edit.changes} />
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
										Keep styling
									</Button>
									<Button
										disabled={isPending || styleEdits.length === 0}
										onClick={handleSubmitStyleEdits}
									>
										<SendIcon className="size-4" />
										{isPending
											? "Submitting…"
											: styleEdits.length === 1
												? "Submit 1 suggestion"
												: `Submit ${styleEdits.length} suggestions`}
									</Button>
								</div>
							</>
						) : view === "review" ? (
							<>
								<div className="space-y-1">
									<DialogTitle>Review your text edits</DialogTitle>
									<DialogDescription>
										{textEdits.length === 1
											? "1 suggested change"
											: `${textEdits.length} suggested changes`}{" "}
										— remove any you don't want, add an optional note, then
										submit.
									</DialogDescription>
								</div>
								{/* p-1 keeps focus outlines from clipping at scroll edges */}
								<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-1">
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
