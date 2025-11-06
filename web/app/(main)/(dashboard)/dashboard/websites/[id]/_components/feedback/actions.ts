"use server";

import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import type { ApiResponse } from "@/lib/types";
import type { FeedbackStatus } from "@/prisma/generated/client";
import { PrismaClientKnownRequestError } from "@/prisma/generated/client/runtime/library";

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
	} catch (e: unknown) {
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
