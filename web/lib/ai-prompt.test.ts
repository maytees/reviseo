import assert from "node:assert/strict";
import { test } from "node:test";
import {
	getWebsiteTextEdits,
	type TextEditFeedbackPromptInput,
	textEditsPrompt,
	websiteTextEditsPrompt,
} from "./ai-prompt";

type Feedback = TextEditFeedbackPromptInput;
type TextEdit = Feedback["textEdits"][number];

const website = {
	websiteName: "Example Studio",
	websiteUrl: "https://example.com",
};

function edit(overrides: Partial<TextEdit> = {}): TextEdit {
	return {
		selector: "#headline",
		elementTag: "h1",
		originalText: "Original headline",
		suggestedText: "Requested headline",
		pageUrl: "https://example.com/pricing",
		status: "PENDING",
		...overrides,
	};
}

function feedback(overrides: Partial<Feedback> = {}): Feedback {
	return {
		id: "feedback-pricing",
		title: "Pricing copy",
		description: "Keep the current offer and change only the headline.",
		status: "NEW",
		approval: "DIRECT",
		textEdits: [edit()],
		...overrides,
	};
}

test("aggregates pending and applied edits only from direct or approved TODO feedback", () => {
	const feedbackStatuses: Feedback["status"][] = [
		"NEW",
		"IN_PROGRESS",
		"RESOLVED",
	];
	const approvals: Feedback["approval"][] = [
		"DIRECT",
		"APPROVED",
		"PENDING",
		"REJECTED",
	];
	const editStatuses: TextEdit["status"][] = ["PENDING", "APPLIED", "REJECTED"];
	const submissions = feedbackStatuses.flatMap((status) =>
		approvals.map((approval) =>
			feedback({
				id: `feedback-${status}-${approval}`,
				status,
				approval,
				textEdits: editStatuses.map((editStatus) =>
					edit({
						selector: `#${status}-${approval}-${editStatus}`,
						status: editStatus,
					}),
				),
			}),
		),
	);
	const before = structuredClone(submissions);

	assert.deepEqual(
		getWebsiteTextEdits(submissions).map(({ selector }) => selector),
		[
			"#NEW-DIRECT-PENDING",
			"#NEW-DIRECT-APPLIED",
			"#NEW-APPROVED-PENDING",
			"#NEW-APPROVED-APPLIED",
		],
	);
	assert.deepEqual(submissions, before, "copying must not mutate feedback");
});

test("omits in-progress and resolved requests and their context from the copied prompt", () => {
	const prompt = websiteTextEditsPrompt({
		...website,
		feedback: [
			feedback(),
			feedback({
				id: "in-progress-request",
				title: "In-progress headline",
				description: "In-progress context",
				status: "IN_PROGRESS",
				textEdits: [
					edit({
						selector: "#in-progress",
						suggestedText: "In-progress requested text",
					}),
				],
			}),
			feedback({
				id: "resolved-request",
				title: "Resolved headline",
				description: "Resolved context",
				status: "RESOLVED",
				approval: "APPROVED",
				textEdits: [
					edit({
						selector: "#resolved",
						suggestedText: "Resolved requested text",
					}),
				],
			}),
		],
	});

	assert.match(prompt, /following 1 text change across/);
	assert.ok(prompt.includes("#headline"));
	assert.doesNotMatch(prompt, /in-progress|In-progress|resolved|Resolved/);
});

test("updates copyable edits as feedback moves out of TODO and back", () => {
	const submission = feedback();
	assert.equal(getWebsiteTextEdits([submission]).length, 1);

	for (const status of ["IN_PROGRESS", "RESOLVED"] as const) {
		submission.status = status;
		assert.deepEqual(getWebsiteTextEdits([submission]), []);
		assert.match(
			websiteTextEditsPrompt({ ...website, feedback: [submission] }),
			/following 0 text changes across/,
		);
	}

	submission.status = "NEW";
	assert.equal(getWebsiteTextEdits([submission]).length, 1);
	assert.match(
		websiteTextEditsPrompt({ ...website, feedback: [submission] }),
		/following 1 text change across/,
	);
});

test("has no copyable edits for empty or non-actionable feedback", () => {
	assert.deepEqual(getWebsiteTextEdits([]), []);
	assert.deepEqual(
		getWebsiteTextEdits([
			feedback({ textEdits: [] }),
			feedback({ textEdits: [edit({ status: "REJECTED" })] }),
			feedback({ approval: "PENDING" }),
			feedback({ approval: "REJECTED" }),
		]),
		[],
	);
});

test("groups pages across submissions and retains exact text and feedback context", () => {
	const homePage = "https://example.com/?campaign=autumn#hero";
	const submissions = [
		feedback({ textEdits: [edit({ selector: "#pricing-first" })] }),
		feedback({
			id: "feedback-home",
			title: "Homepage headline",
			description: "Keep ‘Studio’ capitalized.\nDo not change the subheading.",
			approval: "APPROVED",
			textEdits: [
				edit({
					selector: "main > h1[data-title]",
					pageUrl: homePage,
					originalText: "Welcome, everyone!\nExplore <our> work.",
					suggestedText:
						"Welcome to Studio — let's create.\nExplore <our> work.",
				}),
			],
		}),
		feedback({
			id: "feedback-pricing-second",
			title: "Pricing details",
			description: null,
			textEdits: [edit({ selector: "#pricing-second" })],
		}),
	];
	const prompt = websiteTextEditsPrompt({ ...website, feedback: submissions });
	const pricingStart = prompt.indexOf("## Page: https://example.com/pricing");
	const homeStart = prompt.indexOf(`## Page: ${homePage}`);

	assert.match(prompt, /following 3 text changes/);
	assert.equal(prompt.match(/^## Page:/gm)?.length, 2);
	assert.ok(pricingStart >= 0 && pricingStart < homeStart);
	assert.ok(prompt.indexOf("#pricing-first") < homeStart);
	assert.ok(prompt.indexOf("#pricing-second") < homeStart);
	assert.ok(prompt.indexOf("main > h1[data-title]") > homeStart);
	for (const submission of submissions) {
		assert.ok(prompt.includes(submission.title));
		assert.ok(prompt.includes(submission.id));
		if (submission.description) {
			assert.ok(prompt.includes(submission.description));
		}
		for (const textEdit of submission.textEdits) {
			assert.ok(prompt.includes(textEdit.originalText));
			assert.ok(prompt.includes(textEdit.suggestedText));
		}
	}
	assert.match(prompt, /### Change 3 of 3/);
});

test("retains the actual page URL when all edits belong to a single page", () => {
	const prompt = websiteTextEditsPrompt({
		...website,
		feedback: [feedback()],
	});

	assert.match(prompt, /following 1 text change across/);
	assert.ok(prompt.includes('website "Example Studio" (https://example.com)'));
	assert.ok(prompt.includes("## Page: https://example.com/pricing"));
});

test("includes applied edits with instructions to verify rather than duplicate them", () => {
	const prompt = websiteTextEditsPrompt({
		...website,
		feedback: [
			feedback({
				textEdits: [
					edit({ selector: "#pending" }),
					edit({ selector: "#applied", status: "APPLIED" }),
				],
			}),
		],
	});

	assert.match(prompt, /following 2 text changes/);
	assert.ok(prompt.includes("#pending"));
	assert.ok(prompt.includes("Edit status: Pending"));
	assert.ok(prompt.includes("#applied"));
	assert.ok(
		prompt.includes(
			"Edit status: Already marked applied; verify the requested text is present",
		),
	);
	assert.ok(prompt.includes("avoid making duplicate changes"));
});

test("preserves conflicting requests instead of silently deduplicating them", () => {
	const submissions = [
		feedback({
			id: "first-request",
			textEdits: [edit({ suggestedText: "First proposed headline" })],
		}),
		feedback({
			id: "second-request",
			textEdits: [edit({ suggestedText: "Second proposed headline" })],
		}),
	];
	const prompt = websiteTextEditsPrompt({ ...website, feedback: submissions });

	assert.equal(getWebsiteTextEdits(submissions).length, 2);
	assert.ok(prompt.includes("First proposed headline"));
	assert.ok(prompt.includes("Second proposed headline"));
	assert.ok(prompt.includes("first-request"));
	assert.ok(prompt.includes("second-request"));
	assert.ok(prompt.includes("identify the conflict and ask for clarification"));
});

test("preserves long multiline content and uses fences that contain embedded backticks", () => {
	const originalText = "Before\n```markdown\nembedded code\n```\nEnd";
	const suggestedText =
		"Long client copy. ".repeat(10_000) +
		"\n\nKeep these `````` backticks.\nFinal line — preserved.";
	const description = "Keep this context:\n````\nwith backticks.";
	const prompt = websiteTextEditsPrompt({
		...website,
		feedback: [
			feedback({
				description,
				textEdits: [edit({ originalText, suggestedText })],
			}),
		],
	});

	assert.ok(suggestedText.length > 100_000);
	assert.ok(
		prompt.includes(`${"`".repeat(4)}\n${originalText}\n${"`".repeat(4)}`),
	);
	assert.ok(
		prompt.includes(`${"`".repeat(7)}\n${suggestedText}\n${"`".repeat(7)}`),
	);
	assert.ok(
		prompt.includes(`${"`".repeat(5)}\n${description}\n${"`".repeat(5)}`),
	);
});

test("keeps the existing single-submission prompt unchanged", () => {
	assert.equal(
		textEditsPrompt({
			feedbackTitle: "Homepage copy",
			edits: [
				edit({
					selector: "#hero h1",
					originalText: "Hello",
					suggestedText: "Welcome",
				}),
			],
		}),
		`A client requested the following 1 text change on their website (feedback: "Homepage copy"). Apply all of them.

### Change 1 of 1
Element: <h1>, matched by the CSS selector:
#hero h1

Current text (locate this exact text in the codebase):
\`\`\`
Hello
\`\`\`

Replace it with exactly:
\`\`\`
Welcome
\`\`\`

Rules for every change:
- Apply each change exactly as specified and nothing else — no rewording, no formatting "improvements".
- Do not touch any markup, styles, or copy that is not listed above.
- Preserve each file's existing formatting and indentation.`,
	);
});
