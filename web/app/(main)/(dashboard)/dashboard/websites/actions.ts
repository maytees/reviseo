"use server";

import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import type { ApiResponse } from "@/lib/types";
import { PrismaClientKnownRequestError } from "@/prisma/generated/client/runtime/library";

export async function deleteWebsite(websiteId: string): Promise<ApiResponse> {
	await requireUser();

	try {
		// Verify the website belongs to the user
		const existingWebsite = await prisma.website.findUnique({
			where: {
				id: websiteId,
			},
		});

		if (!existingWebsite) {
			return {
				status: "error",
				message: "Website not found",
			};
		}

		// Update the website
		await prisma.website.delete({
			where: {
				id: websiteId,
			},
		});

		return {
			status: "success",
			message: "Website deleted successfully",
		};
	} catch (e: unknown) {
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
