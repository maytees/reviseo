"use client";

import { CopyAiPromptButton } from "@/components/copy-ai-prompt-button";
import {
	getWebsiteTextEdits,
	type TextEditFeedbackPromptInput,
	websiteTextEditsPrompt,
} from "@/lib/ai-prompt";

/** Copies TODO/New feedback from the authorized payload, across view filters. */
export function CopyAllTextEditsButton({
	website,
}: {
	website: {
		name: string;
		url: string;
		feedback: TextEditFeedbackPromptInput[];
	};
}) {
	const count = getWebsiteTextEdits(website.feedback).length;

	return (
		<CopyAiPromptButton
			getPrompt={() =>
				websiteTextEditsPrompt({
					websiteName: website.name,
					websiteUrl: website.url,
					feedback: website.feedback,
				})
			}
			label={`Copy TODO text edits (${count})`}
			tooltip={
				count === 0
					? "No text edits to copy from direct or approved TODO (New) feedback"
					: "One AI prompt for text edits in TODO (New) feedback. In Progress, Resolved, rejected edits, and feedback awaiting approval are excluded."
			}
			disabled={count === 0}
		/>
	);
}
