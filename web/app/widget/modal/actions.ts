"use server";

import moment from "moment";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import FeedbackNotificationEmail from "@/lib/email/dev-feedback-notification";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import type { ApiResponse, BrowserInfo } from "@/lib/types";
import {
	type FeedbackFormData,
	feedbackFormSchema,
	type ImageEditsSubmission,
	imageEditsSubmissionSchema,
	type StyleEditsSubmission,
	styleEditsSubmissionSchema,
	type TextEditsSubmission,
	textEditsSubmissionSchema,
} from "@/lib/validations";

type SubmissionTool = "annotate" | "text" | "style" | "image";

/** Who may submit, with which tools, and whether it needs lead approval.
 *  - workspace members, leads, trusted client members → DIRECT
 *  - regular client members → PENDING (lead approval queue)
 *  Returns null when the user has no access or lacks the tool permission. */
async function authorizeSubmission(
	userId: string,
	website: { id: string; organizationId: string; clientId: string | null },
	tool: SubmissionTool,
): Promise<{ approval: "DIRECT" | "PENDING" } | null> {
	const clientRow = await prisma.websiteClient.findUnique({
		where: { websiteId_userId: { websiteId: website.id, userId } },
	});

	if (clientRow) {
		const toolAllowed = {
			annotate: clientRow.canAnnotate,
			text: clientRow.canText,
			style: clientRow.canStyle,
			image: clientRow.canImage,
		}[tool];
		if (!toolAllowed) return null;
		const direct = clientRow.role === "lead" || clientRow.trusted;
		return { approval: direct ? "DIRECT" : "PENDING" };
	}

	// Legacy single-client pointer (pre-backfill rows)
	if (website.clientId === userId) return { approval: "DIRECT" };

	const membership = await prisma.member.findUnique({
		where: {
			organizationId_userId: {
				organizationId: website.organizationId,
				userId,
			},
		},
		select: { id: true },
	});
	return membership ? { approval: "DIRECT" } : null;
}

// Parent website URL, e.g clientsite.com
export async function submitFeedbackForm(
	pageUrl: string,
	values: FeedbackFormData,
	projectId: string,
	screenshotKey: string,
	viewport?: string,
	timestamp?: Date,
	browserInfo?: BrowserInfo,
): Promise<ApiResponse> {
	const user = await requireUser();

	const validation = feedbackFormSchema.safeParse(values);

	if (!validation.success) {
		return { status: "error", message: "Invalid form data" };
	}

	const { description, priority, title, type } = validation.data;

	try {
		const existingWebsite = await prisma.website.findUnique({
			where: { projectId },
			select: {
				clientId: true,
				name: true,
				id: true,
				organizationId: true,
				developer: {
					select: { email: true, name: true, emailNotifications: true },
				},
			},
		});

		if (!existingWebsite) {
			return { status: "error", message: "Could not find valid website" };
		}

		const authz = await authorizeSubmission(
			user.id,
			existingWebsite,
			"annotate",
		);
		if (!authz) {
			return {
				status: "error",
				message: "You don't have access to submit this type of feedback",
			};
		}

		const newFeedback = await prisma.feedback.create({
			data: {
				title,
				type,
				description,
				priority,
				screenshotKey,
				pageUrl,
				approval: authz.approval,
				viewport,
				browser: browserInfo?.browser,
				os: browserInfo?.os,
				browserVersion: browserInfo?.browserVersion,
				device: browserInfo?.device,
				timestamp,
				author: { connect: { id: user.id } },
				website: { connect: { id: existingWebsite.id } },
			},
		});

		if (
			authz.approval === "DIRECT" &&
			existingWebsite.developer.emailNotifications
		) {
			const emailResponse = await resend.emails.send({
				from: "Reviseo <info@reviseo.app>",
				to: [existingWebsite.developer.email],
				subject: `${existingWebsite.name} - New Feedback Submitted`,
				react: FeedbackNotificationEmail({
					developerName: existingWebsite.developer.name,
					feedbackTitle: title,
					feedbackType: type,
					priority: priority,
					pageUrl: pageUrl,
					description: description.substring(0, 249),
					submittedAt: moment(timestamp).format("MMMM Do YYYY, h:mm:ss a"),
					websiteName: existingWebsite.name,
					feedbackUrl: `${env.BETTER_AUTH_URL}/dashboard/websites/${existingWebsite.id}?open=${newFeedback.id}`,
					allFeedbackUrl: `${env.BETTER_AUTH_URL}/dashboard/websites/${existingWebsite.id}`,
					dashboardUrl: `${env.BETTER_AUTH_URL}/dashboard`,
				}),
			});

			if (emailResponse.error) {
				console.error(emailResponse);
			}
		}

		return { status: "success", message: "Successfully submitted feedback" };
	} catch (e) {
		console.error("Failed to submit feedback:\n", e);
		return { status: "error", message: "Failed to submit feedback" };
	}
}

/** Submit a batch of suggested copy changes captured by the widget's
 *  text-edit tool. Creates one TEXT_EDIT feedback grouping the edits. */
export async function submitTextEdits(
	projectId: string,
	submission: TextEditsSubmission,
	browserInfo?: BrowserInfo,
	viewport?: string,
): Promise<ApiResponse> {
	const user = await requireUser();

	const validation = textEditsSubmissionSchema.safeParse(submission);
	if (!validation.success) {
		return { status: "error", message: "Invalid text edits" };
	}

	const { edits, note } = validation.data;

	try {
		const existingWebsite = await prisma.website.findUnique({
			where: { projectId },
			select: {
				clientId: true,
				name: true,
				id: true,
				organizationId: true,
				developer: {
					select: { email: true, name: true, emailNotifications: true },
				},
			},
		});

		if (!existingWebsite) {
			return { status: "error", message: "Could not find valid website" };
		}

		const authz = await authorizeSubmission(user.id, existingWebsite, "text");
		if (!authz) {
			return {
				status: "error",
				message: "You don't have access to submit this type of feedback",
			};
		}

		const pageUrl = edits[0].pageUrl;
		const pagePath = (() => {
			try {
				return new URL(pageUrl).pathname || "/";
			} catch {
				return pageUrl;
			}
		})();
		const title =
			edits.length === 1
				? `Text edit on ${pagePath}`
				: `${edits.length} text edits on ${pagePath}`;

		const newFeedback = await prisma.feedback.create({
			data: {
				title,
				type: "TEXT_EDIT",
				description: note || null,
				priority: "LOW",
				approval: authz.approval,
				pageUrl,
				viewport,
				browser: browserInfo?.browser,
				os: browserInfo?.os,
				browserVersion: browserInfo?.browserVersion,
				device: browserInfo?.device,
				author: { connect: { id: user.id } },
				website: { connect: { id: existingWebsite.id } },
				textEdits: {
					create: edits.map((edit) => ({
						selector: edit.selector,
						elementTag: edit.elementTag,
						originalText: edit.originalText,
						suggestedText: edit.suggestedText,
						pageUrl: edit.pageUrl,
					})),
				},
			},
		});

		if (
			authz.approval === "DIRECT" &&
			existingWebsite.developer.emailNotifications
		) {
			const emailResponse = await resend.emails.send({
				from: "Reviseo <info@reviseo.app>",
				to: [existingWebsite.developer.email],
				subject: `${existingWebsite.name} - New Text Edits Suggested`,
				react: FeedbackNotificationEmail({
					developerName: existingWebsite.developer.name,
					feedbackTitle: title,
					feedbackType: "TEXT_EDIT",
					priority: "LOW",
					pageUrl,
					description: (
						note ||
						edits
							.map((e) => `"${e.originalText}" → "${e.suggestedText}"`)
							.join(" · ")
					).substring(0, 249),
					submittedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
					websiteName: existingWebsite.name,
					feedbackUrl: `${env.BETTER_AUTH_URL}/dashboard/websites/${existingWebsite.id}?open=${newFeedback.id}`,
					allFeedbackUrl: `${env.BETTER_AUTH_URL}/dashboard/websites/${existingWebsite.id}`,
					dashboardUrl: `${env.BETTER_AUTH_URL}/dashboard`,
				}),
			});

			if (emailResponse.error) {
				console.error(emailResponse);
			}
		}

		return { status: "success", message: "Text edits submitted" };
	} catch (e) {
		console.error("Failed to submit text edits:\n", e);
		return { status: "error", message: "Failed to submit text edits" };
	}
}

/** Submit a batch of suggested style changes captured by the widget's
 *  style-edit tool. Creates one STYLE_EDIT feedback grouping the edits. */
export async function submitStyleEdits(
	projectId: string,
	submission: StyleEditsSubmission,
	browserInfo?: BrowserInfo,
	viewport?: string,
): Promise<ApiResponse> {
	const user = await requireUser();

	const validation = styleEditsSubmissionSchema.safeParse(submission);
	if (!validation.success) {
		return { status: "error", message: "Invalid style changes" };
	}

	const { edits, note } = validation.data;

	try {
		const existingWebsite = await prisma.website.findUnique({
			where: { projectId },
			select: {
				clientId: true,
				name: true,
				id: true,
				organizationId: true,
				developer: {
					select: { email: true, name: true, emailNotifications: true },
				},
			},
		});

		if (!existingWebsite) {
			return { status: "error", message: "Could not find valid website" };
		}

		const authz = await authorizeSubmission(user.id, existingWebsite, "style");
		if (!authz) {
			return {
				status: "error",
				message: "You don't have access to submit this type of feedback",
			};
		}

		const pageUrl = edits[0].pageUrl;
		const pagePath = (() => {
			try {
				return new URL(pageUrl).pathname || "/";
			} catch {
				return pageUrl;
			}
		})();
		const title =
			edits.length === 1
				? `Style change on ${pagePath}`
				: `${edits.length} style changes on ${pagePath}`;

		const newFeedback = await prisma.feedback.create({
			data: {
				title,
				type: "STYLE_EDIT",
				description: note || null,
				priority: "LOW",
				approval: authz.approval,
				pageUrl,
				viewport,
				browser: browserInfo?.browser,
				os: browserInfo?.os,
				browserVersion: browserInfo?.browserVersion,
				device: browserInfo?.device,
				author: { connect: { id: user.id } },
				website: { connect: { id: existingWebsite.id } },
				styleEdits: {
					create: edits.map((edit) => ({
						selector: edit.selector,
						elementTag: edit.elementTag,
						pageUrl: edit.pageUrl,
						changes: edit.changes,
					})),
				},
			},
		});

		if (
			authz.approval === "DIRECT" &&
			existingWebsite.developer.emailNotifications
		) {
			const emailResponse = await resend.emails.send({
				from: "Reviseo <info@reviseo.app>",
				to: [existingWebsite.developer.email],
				subject: `${existingWebsite.name} - New Style Changes Suggested`,
				react: FeedbackNotificationEmail({
					developerName: existingWebsite.developer.name,
					feedbackTitle: title,
					feedbackType: "STYLE_EDIT",
					priority: "LOW",
					pageUrl,
					description: (
						note ||
						edits
							.map(
								(e) =>
									`${e.elementTag ?? "element"}: ${e.changes
										.map((c) => c.property)
										.join(", ")}`,
							)
							.join(" · ")
					).substring(0, 249),
					submittedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
					websiteName: existingWebsite.name,
					feedbackUrl: `${env.BETTER_AUTH_URL}/dashboard/websites/${existingWebsite.id}?open=${newFeedback.id}`,
					allFeedbackUrl: `${env.BETTER_AUTH_URL}/dashboard/websites/${existingWebsite.id}`,
					dashboardUrl: `${env.BETTER_AUTH_URL}/dashboard`,
				}),
			});

			if (emailResponse.error) {
				console.error(emailResponse);
			}
		}

		return { status: "success", message: "Style changes submitted" };
	} catch (e) {
		console.error("Failed to submit style edits:\n", e);
		return { status: "error", message: "Failed to submit style changes" };
	}
}

/** Submit a batch of image replacements captured by the widget's image-edit
 *  tool. Creates one IMAGE_EDIT feedback grouping the edits. */
export async function submitImageEdits(
	projectId: string,
	submission: ImageEditsSubmission,
	browserInfo?: BrowserInfo,
	viewport?: string,
): Promise<ApiResponse> {
	const user = await requireUser();

	const validation = imageEditsSubmissionSchema.safeParse(submission);
	if (!validation.success) {
		return { status: "error", message: "Invalid image replacements" };
	}

	const { edits, note } = validation.data;

	try {
		const existingWebsite = await prisma.website.findUnique({
			where: { projectId },
			select: {
				clientId: true,
				name: true,
				id: true,
				organizationId: true,
				developer: {
					select: { email: true, name: true, emailNotifications: true },
				},
			},
		});

		if (!existingWebsite) {
			return { status: "error", message: "Could not find valid website" };
		}

		const authz = await authorizeSubmission(user.id, existingWebsite, "image");
		if (!authz) {
			return {
				status: "error",
				message: "You don't have access to submit this type of feedback",
			};
		}

		const pageUrl = edits[0].pageUrl;
		const pagePath = (() => {
			try {
				return new URL(pageUrl).pathname || "/";
			} catch {
				return pageUrl;
			}
		})();
		const title =
			edits.length === 1
				? `Image replacement on ${pagePath}`
				: `${edits.length} image replacements on ${pagePath}`;

		const newFeedback = await prisma.feedback.create({
			data: {
				title,
				type: "IMAGE_EDIT",
				description: note || null,
				priority: "LOW",
				approval: authz.approval,
				pageUrl,
				viewport,
				browser: browserInfo?.browser,
				os: browserInfo?.os,
				browserVersion: browserInfo?.browserVersion,
				device: browserInfo?.device,
				author: { connect: { id: user.id } },
				website: { connect: { id: existingWebsite.id } },
				imageEdits: {
					create: edits.map((edit) => ({
						selector: edit.selector,
						pageUrl: edit.pageUrl,
						originalSrc: edit.originalSrc,
						newKey: edit.newKey,
						newUrl: edit.newUrl,
					})),
				},
			},
		});

		if (
			authz.approval === "DIRECT" &&
			existingWebsite.developer.emailNotifications
		) {
			const emailResponse = await resend.emails.send({
				from: "Reviseo <info@reviseo.app>",
				to: [existingWebsite.developer.email],
				subject: `${existingWebsite.name} - New Image Replacements Suggested`,
				react: FeedbackNotificationEmail({
					developerName: existingWebsite.developer.name,
					feedbackTitle: title,
					feedbackType: "IMAGE_EDIT",
					priority: "LOW",
					pageUrl,
					description: (note || title).substring(0, 249),
					submittedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
					websiteName: existingWebsite.name,
					feedbackUrl: `${env.BETTER_AUTH_URL}/dashboard/websites/${existingWebsite.id}?open=${newFeedback.id}`,
					allFeedbackUrl: `${env.BETTER_AUTH_URL}/dashboard/websites/${existingWebsite.id}`,
					dashboardUrl: `${env.BETTER_AUTH_URL}/dashboard`,
				}),
			});

			if (emailResponse.error) {
				console.error(emailResponse);
			}
		}

		return { status: "success", message: "Image replacements submitted" };
	} catch (e) {
		console.error("Failed to submit image edits:\n", e);
		return { status: "error", message: "Failed to submit image replacements" };
	}
}
