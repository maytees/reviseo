"use client";

import { CheckIcon, LoaderCircleIcon, SparklesIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type AnnotationPromptInput,
	annotationPrompt,
} from "@/lib/annotation-prompt";
import { copyAnnotationPrompt } from "@/lib/copy-annotation-prompt";

export function CopyAnnotationPromptButton({
	feedback,
}: {
	feedback: AnnotationPromptInput & { screenshotKey: string };
}) {
	const [busy, setBusy] = useState(false);
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const copyText = async () => {
		try {
			await navigator.clipboard.writeText(annotationPrompt(feedback));
			toast.success("Prompt text copied");
		} catch {
			toast.error("Couldn't copy the prompt text. Check clipboard access.");
		}
	};

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	const copy = async () => {
		if (busy) return;
		setBusy(true);
		try {
			await copyAnnotationPrompt(feedback);
			setCopied(true);
			toast.success("AI prompt and annotated screenshot copied", {
				description:
					"If your AI app pastes only the image, copy the prompt text separately.",
				action: { label: "Copy text", onClick: copyText },
				duration: 8000,
			});
			timer.current = setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			toast.error(
				error instanceof Error && error.name !== "NotAllowedError"
					? error.message
					: "Couldn't copy. Allow clipboard access and try again.",
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline" size="sm" disabled={busy} onClick={copy}>
					{busy ? (
						<LoaderCircleIcon className="size-3.5 animate-spin" />
					) : copied ? (
						<CheckIcon className="size-3.5 text-emerald-500" />
					) : (
						<SparklesIcon className="size-3.5" />
					)}
					{busy
						? "Preparing image…"
						: copied
							? "Copied"
							: "Copy AI prompt + image"}
				</Button>
			</TooltipTrigger>
			<TooltipContent className="max-w-64">
				Copy this feedback and its screenshot together. What pastes depends on
				the app receiving it.
			</TooltipContent>
		</Tooltip>
	);
}
