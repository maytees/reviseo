"use client";

import { CheckIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Copies an AI-assistant prompt to the clipboard. `getPrompt` is lazy so
 *  batch prompts are only composed on click. Icon-only (card style) when no
 *  label is given. */
export function CopyAiPromptButton({
	getPrompt,
	label,
	tooltip = "Copy AI prompt",
	disabled,
	className,
}: {
	getPrompt: () => string;
	label?: string;
	tooltip?: string;
	disabled?: boolean;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(getPrompt());
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			toast.error("Couldn't copy to clipboard");
		}
	};

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant={label ? "outline" : "ghost"}
					size={label ? "sm" : "icon"}
					className={cn(!label && "size-7", className)}
					disabled={disabled}
					onClick={copy}
				>
					{copied ? (
						<CheckIcon className="size-3.5 text-emerald-500" />
					) : (
						<SparklesIcon className="size-3.5" />
					)}
					{label}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
	);
}
