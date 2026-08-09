import { z } from "zod";

// Onboarding Forms
export const websiteSchema = z.object({
	websiteName: z.string().min(1, "Website name is required"),
	websiteUrl: z
		.string()
		.min(1, "Website URL is required")
		.url("Please enter a valid URL")
		.refine(
			(url) => url.startsWith("http://") || url.startsWith("https://"),
			"URL must start with http:// or https://",
		),
});

export const clientSchema = z.object({
	clientName: z.string().min(1, "Client name is required"),
	clientEmail: z
		.string()
		.min(1, "Client email is required")
		.email("Please enter a valid email address"),
});

// Feedback Form
export const feedbackFormSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required!")
		.max(800, "Title cannot exceed 800 characters!"),
	description: z
		.string()
		.max(6000, "Description cannot exceed 6,000 characters!"),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
		message: "Priority is required!",
	}),
	type: z.enum(["BUG", "IMPROVEMENT"], {
		message: "Type is required!",
	}),
});

// Text-edit tool (widget): one batch of suggested copy changes.
// Ceilings here are abuse guards, not usage limits — set far above anything
// a real edit produces so clients are never blocked mid-flow.
export const textEditItemSchema = z.object({
	selector: z
		.string()
		.min(1)
		.max(8000, "This element's position on the page is too complex to record"),
	elementTag: z.string().max(50).optional(),
	originalText: z
		.string()
		.min(1)
		.max(
			100000,
			"The selected text block is too large to store — try a smaller section",
		),
	suggestedText: z
		.string()
		.min(1)
		.max(100000, "The replacement text is too long to store"),
	pageUrl: z.string().url().max(2000),
});

export const textEditsSubmissionSchema = z.object({
	note: z.string().max(6000).optional(),
	edits: z
		.array(textEditItemSchema)
		.min(1, "No text edits to submit")
		.max(200, "Too many edits in one batch — submit and start a new one"),
});

// Style-edit tool (widget): one batch of suggested style changes.
export const styleChangeSchema = z.object({
	// Longhand kebab-case CSS property, e.g. "font-size"
	property: z
		.string()
		.min(1)
		.max(60)
		.regex(/^[a-z-]+$/),
	// Values can run long (gradients, shadows, font stacks)
	before: z.string().max(2000),
	after: z.string().min(1, "A style value is empty").max(2000),
});

export const styleEditItemSchema = z.object({
	selector: z
		.string()
		.min(1)
		.max(8000, "This element's position on the page is too complex to record"),
	elementTag: z.string().max(50).optional(),
	pageUrl: z.string().url().max(2000),
	changes: z.array(styleChangeSchema).min(1).max(50),
});

export const styleEditsSubmissionSchema = z.object({
	note: z.string().max(6000).optional(),
	edits: z
		.array(styleEditItemSchema)
		.min(1, "No style changes to submit")
		.max(200, "Too many changes in one batch — submit and start a new one"),
});

// Image-edit tool (widget): one batch of image replacements.
export const imageEditItemSchema = z
	.object({
		selector: z
			.string()
			.min(1)
			.max(
				8000,
				"This element's position on the page is too complex to record",
			),
		pageUrl: z.string().url().max(2000),
		// As rendered on the page — may be relative-resolved, data:, or an
		// inline base64 image (which can be very large)
		originalSrc: z.string().min(1).max(500000),
		// Replacement: bucket key (upload/paste) or remote URL.
		newKey: z.string().min(1).max(300).optional(),
		newUrl: z.string().url().max(2000).optional(),
	})
	.refine((v) => Boolean(v.newKey) !== Boolean(v.newUrl), {
		message: "Provide exactly one of newKey or newUrl",
	});

export const imageEditsSubmissionSchema = z.object({
	note: z.string().max(6000).optional(),
	edits: z
		.array(imageEditItemSchema)
		.min(1, "No image replacements to submit")
		.max(
			100,
			"Too many replacements in one batch — submit and start a new one",
		),
});

// Waitlist form
export const waitlistSchema = z.object({
	email: z.email(),
});

export type WebsiteFormData = z.infer<typeof websiteSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;
export type WaitlistFormData = z.infer<typeof waitlistSchema>;
export type TextEditItem = z.infer<typeof textEditItemSchema>;
export type TextEditsSubmission = z.infer<typeof textEditsSubmissionSchema>;
export type StyleChange = z.infer<typeof styleChangeSchema>;
export type StyleEditItem = z.infer<typeof styleEditItemSchema>;
export type StyleEditsSubmission = z.infer<typeof styleEditsSubmissionSchema>;
export type ImageEditItem = z.infer<typeof imageEditItemSchema>;
export type ImageEditsSubmission = z.infer<typeof imageEditsSubmissionSchema>;
