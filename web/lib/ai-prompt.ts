// Composers for "Copy AI prompt": turn recorded text/style edits into a
// prompt a developer pastes into an AI coding assistant. Pure text assembly —
// content passes through verbatim (multiline preserved, nothing escaped
// beyond picking a safe code fence).

import { styleEditToCss } from "@/components/style-change-rows";
import type { StyleChange } from "@/lib/validations";

export interface TextEditPromptInput {
	selector: string;
	elementTag: string | null;
	originalText: string;
	suggestedText: string;
	pageUrl: string;
}

export interface TextEditFeedbackPromptInput {
	id: string;
	title: string;
	description: string | null;
	status: "NEW" | "IN_PROGRESS" | "RESOLVED";
	approval: "DIRECT" | "PENDING" | "APPROVED" | "REJECTED";
	textEdits: (TextEditPromptInput & {
		status: "PENDING" | "APPLIED" | "REJECTED";
	})[];
}

interface WebsiteTextEditPromptInput extends TextEditPromptInput {
	status: "PENDING" | "APPLIED";
	feedbackId: string;
	feedbackTitle: string;
	feedbackDescription: string | null;
}

export interface StyleEditPromptInput {
	selector: string;
	elementTag: string | null;
	pageUrl: string;
	changes: StyleChange[];
}

/** Fence whose backtick run is longer than any run inside content (min 3),
 *  so arbitrary content can never break out. */
function codeFence(content: string, lang = ""): string {
	const longestRun = content
		.match(/`+/g)
		?.reduce((max, run) => Math.max(max, run.length), 0);
	const fence = "`".repeat(Math.max(3, (longestRun ?? 0) + 1));
	return `${fence}${lang}\n${content}\n${fence}`;
}

const TEXT_RULES = `Rules:
- Change only this text. Do not modify surrounding markup, attributes, styles, or any other copy.
- Preserve the file's existing formatting and indentation.
- If the text appears in more than one place, change the occurrence rendered by the selector above.`;

const STYLE_RULES = `Rules:
- Update the element's existing styling at its source (stylesheet, CSS module, Tailwind classes, or inline styles) instead of appending a new override, where possible.
- Change only the properties listed. Do not alter other styles, markup, or text.`;

function textEditBody(edit: TextEditPromptInput): string {
	return `Element: <${edit.elementTag ?? "unknown"}>, matched by the CSS selector:
${edit.selector}

Current text (locate this exact text in the codebase):
${codeFence(edit.originalText)}

Replace it with exactly:
${codeFence(edit.suggestedText)}`;
}

function styleEditBody(edit: StyleEditPromptInput): string {
	const changeLines = edit.changes
		.map((c) => `- ${c.property}: ${c.before || "(unset)"} -> ${c.after}`)
		.join("\n");
	return `Element: <${edit.elementTag ?? "unknown"}>, matched by the CSS selector:
${edit.selector}

Properties to change (current value -> desired value):
${changeLines}

Equivalent CSS (for reference):
${codeFence(styleEditToCss(edit.selector, edit.changes), "css")}`;
}

export function textEditPrompt(edit: TextEditPromptInput): string {
	return `Update the text content of one element on this page: ${edit.pageUrl}

${textEditBody(edit)}

${TEXT_RULES}`;
}

export function styleEditPrompt(edit: StyleEditPromptInput): string {
	return `Apply a style change to one element on this page: ${edit.pageUrl}

${styleEditBody(edit)}

${STYLE_RULES}`;
}

/** Group edits by page; single-page batches can opt into a page header. */
function batchSections<T extends { pageUrl: string }>(
	edits: T[],
	renderBody: (edit: T) => string,
	alwaysShowPages = false,
): string {
	const pages = [...new Set(edits.map((e) => e.pageUrl))];
	const total = edits.length;
	let index = 0;
	const section = (edit: T) => {
		index += 1;
		return `### Change ${index} of ${total}
${renderBody(edit)}`;
	};

	if (pages.length <= 1 && !alwaysShowPages) {
		return edits.map(section).join("\n\n");
	}
	return pages
		.map((page) => {
			const pageEdits = edits.filter((e) => e.pageUrl === page);
			return `## Page: ${page}\n\n${pageEdits.map(section).join("\n\n")}`;
		})
		.join("\n\n");
}

/** Text edits from TODO/New feedback, independent of table/board filters. */
export function getWebsiteTextEdits(
	feedback: TextEditFeedbackPromptInput[],
): WebsiteTextEditPromptInput[] {
	return feedback.flatMap((submission) => {
		if (
			submission.status !== "NEW" ||
			(submission.approval !== "DIRECT" && submission.approval !== "APPROVED")
		) {
			return [];
		}
		return submission.textEdits.flatMap((edit) =>
			edit.status === "REJECTED"
				? []
				: [
						{
							...edit,
							status: edit.status,
							feedbackId: submission.id,
							feedbackTitle: submission.title,
							feedbackDescription: submission.description,
						},
					],
		);
	});
}

export function websiteTextEditsPrompt(args: {
	websiteName: string;
	websiteUrl: string;
	feedback: TextEditFeedbackPromptInput[];
}): string {
	const edits = getWebsiteTextEdits(args.feedback);
	const n = edits.length;
	return `Apply the following ${n} text change${n === 1 ? "" : "s"} across the website "${args.websiteName}" (${args.websiteUrl}). These are all non-rejected text edits from direct or approved feedback in the TODO (New) column for this website.

${batchSections(
	edits,
	(edit) => `Feedback: "${edit.feedbackTitle}" (ID: ${edit.feedbackId})
Edit status: ${edit.status === "APPLIED" ? "Already marked applied; verify the requested text is present" : "Pending"}${edit.feedbackDescription ? `\nFeedback context:\n${codeFence(edit.feedbackDescription)}` : ""}

${textEditBody(edit)}`,
	true,
)}

Rules for every change:
- Apply each text change exactly as specified — no rewording or formatting improvements.
- Use each page URL, CSS selector, and exact current text to locate the intended occurrence.
- Some edits may already be applied. Verify them and avoid making duplicate changes.
- Feedback descriptions provide context; implement only the explicit text replacements listed above.
- If requests conflict for the same element, identify the conflict and ask for clarification instead of choosing silently.
- Do not modify surrounding markup, attributes, styles, or any other copy.
- Preserve each file's existing formatting and indentation.`;
}

export function textEditsPrompt(args: {
	feedbackTitle: string;
	edits: TextEditPromptInput[];
}): string {
	const n = args.edits.length;
	return `A client requested the following ${n} text change${n === 1 ? "" : "s"} on their website (feedback: "${args.feedbackTitle}"). Apply all of them.

${batchSections(args.edits, textEditBody)}

Rules for every change:
- Apply each change exactly as specified and nothing else — no rewording, no formatting "improvements".
- Do not touch any markup, styles, or copy that is not listed above.
- Preserve each file's existing formatting and indentation.`;
}

export function styleEditsPrompt(args: {
	feedbackTitle: string;
	edits: StyleEditPromptInput[];
}): string {
	const n = args.edits.length;
	return `A client requested the following ${n} style change${n === 1 ? "" : "s"} on their website (feedback: "${args.feedbackTitle}"). Apply all of them.

${batchSections(args.edits, styleEditBody)}

Rules for every change:
- Update existing styling at its source instead of appending overrides, where possible.
- Change only the properties listed for each element. Do not alter other styles, markup, or text.`;
}
