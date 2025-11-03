"use server";

import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
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

	// TODO: Add image url
	const { description, priority, title, type } = validation.data;

	try {
		const existingWebsite = await prisma.website.findUnique({
			where: {
				projectId,
				// url: websiteUrl,
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

		await prisma.feedback.create({
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
				isMobile: browserInfo?.isMobile,
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
