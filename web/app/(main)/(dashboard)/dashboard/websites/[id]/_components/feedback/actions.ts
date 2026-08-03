"use server";

import { revalidatePath } from "next/cache";
import { requireMember } from "@/app/data/require-member";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { deleteObject } from "@/lib/storage";
import type { ApiResponse } from "@/lib/types";
import type { FeedbackStatus } from "@/prisma/generated/client/enums";

/** Load feedback only when its website belongs to the caller's active org. */
async function getAuthorizedFeedback(feedbackId: string) {
	const { organization } = await requireMember();

	return prisma.feedback.findFirst({
		where: {
			id: feedbackId,
			website: { organizationId: organization.id },
		},
		select: { id: true, websiteId: true, screenshotKey: true },
	});
}

export async function updateFeedbackStatus(
	id: string,
	value: FeedbackStatus,
): Promise<ApiResponse> {
	try {
		const feedback = await getAuthorizedFeedback(id);

		if (!feedback) {
			return { status: "error", message: "Feedback not found" };
		}

		await prisma.feedback.update({
			where: { id },
			data: { status: value },
		});

		revalidatePath(`/dashboard/websites/${feedback.websiteId}`);

		return {
			status: "success",
			message: "Feedback status updated successfully!",
		};
	} catch (e) {
		console.error("Failed to update feedback status:\n", e);
		return { status: "error", message: "Failed to update feedback status" };
	}
}

export async function deleteFeedback(feedbackId: string): Promise<ApiResponse> {
	try {
		const feedback = await getAuthorizedFeedback(feedbackId);

		if (!feedback) {
			return { status: "error", message: "Feedback not found" };
		}

		await deleteObject(
			env.NEXT_PUBLIC_S3_BUCKET_NAME_ANNOTATIONS,
			feedback.screenshotKey,
		);

		await prisma.feedback.delete({ where: { id: feedbackId } });

		revalidatePath(`/dashboard/websites/${feedback.websiteId}`);

		return { status: "success", message: "Feedback deleted successfully" };
	} catch (e) {
		console.error("Failed to delete feedback:\n", e);
		return { status: "error", message: "Failed to delete feedback" };
	}
}
