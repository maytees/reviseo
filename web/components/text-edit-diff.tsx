"use client";

import { diffWords } from "@/lib/text-diff";

/** Word-level diff rendering: original words struck red, new words green.
 *  Shared by the widget review modal, dashboard, and client portal. */
export const DiffText = ({
	original,
	suggested,
}: {
	original: string;
	suggested: string;
}) => (
	<p className="text-sm leading-relaxed">
		{diffWords(original, suggested).map((segment, i) => {
			if (segment.kind === "removed") {
				return (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: static diff render
						key={i}
						className="rounded-sm bg-red-500/10 px-0.5 text-red-600 line-through decoration-red-400 dark:text-red-400"
					>
						{segment.text}
					</span>
				);
			}
			if (segment.kind === "added") {
				return (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: static diff render
						key={i}
						className="rounded-sm bg-emerald-500/10 px-0.5 font-medium text-emerald-700 dark:text-emerald-400"
					>
						{segment.text}
					</span>
				);
			}
			// biome-ignore lint/suspicious/noArrayIndexKey: static diff render
			return <span key={i}>{segment.text}</span>;
		})}
	</p>
);
