"use server";

import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import {
	type CreateAssignmentSchemaType,
	createAssignmentSchema,
} from "@/lib/schemas/assignmentSchema";
import type { ApiResponse } from "@/lib/types";

export async function createAssignment(
	values: CreateAssignmentSchemaType,
): Promise<ApiResponse> {
	const session = await requireUser();

	try {
		const validation = createAssignmentSchema.safeParse(values);

		if (!validation.success) {
			return {
				status: "error",
				message: "Invalid Form Data",
			};
		}

		await prisma.assignment.create({
			data: {
				userId: session.id,
				...validation.data,
			},
		});

		return {
			status: "success",
			message: "Assignment created succesfully",
		};
	} catch {
		return {
			status: "error",
			message: "Failed to create assignment",
		};
	}
}
