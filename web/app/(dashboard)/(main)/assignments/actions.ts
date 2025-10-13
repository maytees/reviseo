// app/actions/update-assignment-status.ts
"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/data/require-user";
import { prisma as db } from "@/lib/db";
import type { ApiResponse } from "@/lib/types";

export async function updateAssignmentStatus(
	assignmentId: string,
	newStatus: "todo" | "in_progress" | "completed",
): Promise<ApiResponse> {
	const user = await requireUser();

	try {
		await db.assignment.update({
			where: {
				id: assignmentId,
				userId: user.id,
			},
			data: {
				status: newStatus,
			},
		});

		revalidatePath("/assignments");
		return {
			status: "success",
			message: "Updated Status",
		};
	} catch (error) {
		console.error("Failed to update assignment status:", error);
		return { status: "error", message: "Failed to update assignment" };
	}
}
