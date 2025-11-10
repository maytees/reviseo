"use server";

import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
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

		// Delete the screenshot from S3 if it exists
		if (existingWebsite.screenshotKey) {
			try {
				await fetch(`${env.BETTER_AUTH_URL}/api/s3/screenshot/delete`, {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						key: existingWebsite.screenshotKey,
					}),
				});
			} catch (error) {
				console.error("Failed to delete screenshot from S3:", error);
				// Continue with website deletion even if screenshot deletion fails
			}
		}

		// Delete the website (this will cascade delete feedback and invites)
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
						message: `Failed to delete website: ${e.code}`,
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
