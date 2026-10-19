"use client";

import { CopyAiPromptButton } from "@/components/copy-ai-prompt-button";
import {
	getWebsiteTextEdits,
	type TextEditFeedbackPromptInput,
	websiteTextEditsPrompt,
} from "@/lib/ai-prompt";

/** Uses the complete, authorized website payload, independent of view filters. */
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
			label={`Copy all text edits (${count})`}
			tooltip={
				count === 0
					? "No text edits to copy from direct or approved feedback"
					: "One AI prompt for every text edit on this website, including applied edits. Rejected edits and feedback awaiting approval are excluded."
			}
			disabled={count === 0}
		/>
	);
}
