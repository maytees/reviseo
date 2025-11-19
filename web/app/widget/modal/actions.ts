"use server";

import moment from "moment";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import FeedbackNotificationEmail from "@/lib/email/dev-feedback-notification";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import type { ApiResponse, BrowserInfo } from "@/lib/types";
import { type FeedbackFormData, feedbackFormSchema } from "@/lib/validations";
import { PrismaClientKnownRequestError } from "@/prisma/generated/client/runtime/library";

// Parent website URL, e.g clientsite.com
export async function submitFeedbackForm(
	pageUrl: string,
	authorId: string,
	values: FeedbackFormData,
	projectId: string,
	screenshotKey: string,
	viewport?: string,
	timestamp?: Date,
	browserInfo?: BrowserInfo,
): Promise<ApiResponse> {
	const user = await requireUser();

	if (authorId !== user.id) {
		return {
			status: "error",
			message: "Missmatched accounts author != user",
		};
	}

	const validation = feedbackFormSchema.safeParse(values);

	if (!validation.success) {
		return {
			status: "error",
			message: "Invalid form data",
		};
	}

	const { description, priority, title, type } = validation.data;

	try {
		const existingWebsite = await prisma.website.findUnique({
			where: {
				projectId,
				// url: websiteUrl,
			},
			select: {
				clientId: true,
				name: true,
				id: true,
				developerId: true,
				developer: {
					select: {
						email: true,
						name: true,
						emailNotifications: true,
					},
				},
				client: {
					select: {
						email: true,
					},
				},
			},
		});

		if (
			existingWebsite?.clientId !== user.id &&
			existingWebsite?.developerId !== user.id
		) {
			console.error(user.id);
			console.error(existingWebsite?.clientId, "client id");
			console.error(existingWebsite?.developerId, "dev id");
			console.error(
				existingWebsite?.clientId !== user.id &&
					existingWebsite?.developerId !== user.id,
				"is condition",
			);
			return {
				status: "error",
				message: "Could not find valid website (1)",
			};
		}

		if (!existingWebsite) {
			console.error(projectId, pageUrl, user.id);

			return {
				status: "error",
				message: "Could not find valid website",
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
				author: {
					connect: {
						id: authorId,
					},
				},
				website: {
					connect: {
						id: existingWebsite.id,
					},
				},
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

		return {
			status: "success",
			message: "Successfully submitted feedback",
		};
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			switch (e.code) {
				default:
					return {
						status: "error",
						message: `Failed to update website: ${e.code}`,
					};
			}
		}

		console.error("Failed to delete website:\n", e);
		return {
			status: "error",
			message: `Failed to delete website`,
		};
	}
}
