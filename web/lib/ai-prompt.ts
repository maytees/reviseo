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

/** Group edits by page; page headers only when more than one page. */
function batchSections<T extends { pageUrl: string }>(
	edits: T[],
	renderBody: (edit: T) => string,
): string {
	const pages = [...new Set(edits.map((e) => e.pageUrl))];
	const total = edits.length;
	let index = 0;
	const section = (edit: T) => {
		index += 1;
		return `### Change ${index} of ${total}
${renderBody(edit)}`;
	};

	if (pages.length <= 1) {
		return edits.map(section).join("\n\n");
	}
	return pages
		.map((page) => {
			const pageEdits = edits.filter((e) => e.pageUrl === page);
			return `## Page: ${page}\n\n${pageEdits.map(section).join("\n\n")}`;
		})
		.join("\n\n");
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
