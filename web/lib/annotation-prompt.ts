export interface AnnotationPromptInput {
	title: string;
	description: string | null;
	pageUrl: string;
	type: string;
	priority: string;
	viewport?: string | null;
}

/** One annotated feedback item and its attached screenshot. */
export function annotationPrompt(feedback: AnnotationPromptInput): string {
	return `Implement this website feedback using the attached annotated screenshot as the visual reference.

Page: ${feedback.pageUrl}
Feedback: ${feedback.title}
Type: ${feedback.type === "BUG" ? "Bug" : "Improvement"}
Priority: ${feedback.priority.toLowerCase()}${feedback.viewport ? `\nCaptured viewport: ${feedback.viewport}` : ""}
${feedback.description ? `\nClient notes:\n${feedback.description}\n` : ""}
Instructions:
- Use the screenshot's annotations and the client notes to identify the requested changes.
- Locate the relevant page and components in the codebase, then implement this feedback at the source.
- Keep changes focused on this feedback and preserve unrelated content, styling, and behavior.
- If an annotation is ambiguous, ask for clarification before guessing.`;
}
