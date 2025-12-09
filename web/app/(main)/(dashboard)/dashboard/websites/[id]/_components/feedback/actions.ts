"use server";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import type { ApiResponse } from "@/lib/types";
import type { FeedbackStatus } from "@/prisma/generated/client/enums";

export async function updateFeedbackStatus(
	id: string,
	// TODO: Is website id really necessary??
	websiteId: string,
	value: FeedbackStatus,
): Promise<ApiResponse> {
	await requireUser();

	try {
		// Verify the website belongs to the user
		const existingFeedback = await prisma.feedback.findUnique({
			where: {
				id,
				websiteId,
			},
		});

		if (!existingFeedback) {
			return {
				status: "error",
				message: "Could not find feedback with id",
			};
		}

		const update = await prisma.feedback.update({
			where: {
				id,
				websiteId,
			},
			data: {
				status: value,
			},
		});

		if (!update) {
			return {
				status: "error",
				message: `Failed to update: ${update}`,
			};
		}

		return {
			status: "success",
			message: "Feedback status updated successfully!",
		};
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			switch (e.code) {
				default:
					return {
						status: "error",
						message: `Failed to update feedback: ${e.code}`,
					};
			}
		}

		console.error("Failed to update feedback status:\n", e);
		return {
			status: "error",
			message: `Failed to update feedback status`,
		};
	}
}

export async function deleteFeedback(feedbackId: string): Promise<ApiResponse> {
	await requireUser();

	try {
		const existingFeedback = await prisma.feedback.findUnique({
			where: {
				id: feedbackId,
			},
		});

		if (!existingFeedback) {
			return {
				status: "error",
				message: "Feedback not found",
			};
		}

		try {
			await fetch(`${env.BETTER_AUTH_URL}/api/s3/annotations/delete`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					key: existingFeedback.screenshotKey,
				}),
			});
		} catch (error) {
			console.error("Failed to delete feedback screenshot from s3: ", error);
		}

		// Update the website
		await prisma.feedback.delete({
			where: {
				id: feedbackId,
			},
		});

		return {
			status: "success",
			message: "Feedback deleted successfully",
		};
		// biome-ignore lint/suspicious/noExplicitAny: prisma 7
	} catch (e: any) {
		if (e instanceof PrismaClientKnownRequestError) {
			switch (e.code) {
				default:
					return {
						status: "error",
						message: `Failed to update feedback: ${e.code}`,
					};
			}
		}

		console.error("Failed to delete feedback:\n", e);
		return {
			status: "error",
			message: `Failed to delete feedback`,
		};
	}
}
