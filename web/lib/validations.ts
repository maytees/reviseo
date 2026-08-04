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
export const textEditItemSchema = z.object({
	selector: z.string().min(1).max(1000),
	elementTag: z.string().max(50).optional(),
	originalText: z.string().min(1).max(2000),
	suggestedText: z.string().min(1).max(2000),
	pageUrl: z.string().url().max(2000),
});

export const textEditsSubmissionSchema = z.object({
	note: z.string().max(6000).optional(),
	edits: z
		.array(textEditItemSchema)
		.min(1, "No text edits to submit")
		.max(30, "Too many edits in one batch — submit and start a new one"),
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
