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
	type StyleEditsSubmission,
	styleEditsSubmissionSchema,
	type TextEditsSubmission,
	textEditsSubmissionSchema,
} from "@/lib/validations";

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

		// Authorized submitters: the website's feedback client, or any member
		// of the workspace that owns the website.
		const isClient = existingWebsite.clientId === user.id;
		const isMember = !isClient
			? Boolean(
					await prisma.member.findUnique({
						where: {
							organizationId_userId: {
								organizationId: existingWebsite.organizationId,
								userId: user.id,
							},
						},
						select: { id: true },
					}),
				)
			: false;

		if (!isClient && !isMember) {
			return {
				status: "error",
				message: "You don't have access to submit feedback for this website",
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

		if (existingWebsite.developer.emailNotifications) {
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

		// Same rule as screenshot feedback: the website's client, or any
		// member of the owning workspace.
		const isClient = existingWebsite.clientId === user.id;
		const isMember = !isClient
			? Boolean(
					await prisma.member.findUnique({
						where: {
							organizationId_userId: {
								organizationId: existingWebsite.organizationId,
								userId: user.id,
							},
						},
						select: { id: true },
					}),
				)
			: false;

		if (!isClient && !isMember) {
			return {
				status: "error",
				message: "You don't have access to submit feedback for this website",
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

		if (existingWebsite.developer.emailNotifications) {
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

		// Same rule as the other feedback types: the website's client, or any
		// member of the owning workspace.
		const isClient = existingWebsite.clientId === user.id;
		const isMember = !isClient
			? Boolean(
					await prisma.member.findUnique({
						where: {
							organizationId_userId: {
								organizationId: existingWebsite.organizationId,
								userId: user.id,
							},
						},
						select: { id: true },
					}),
				)
			: false;

		if (!isClient && !isMember) {
			return {
				status: "error",
				message: "You don't have access to submit feedback for this website",
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

		if (existingWebsite.developer.emailNotifications) {
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
