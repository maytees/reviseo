"use server";

import { revalidatePath } from "next/cache";
import {
	canManage,
	getAuthorizedWebsite,
	requireMember,
} from "@/app/data/require-member";
import { prisma } from "@/lib/db";
import { isPrismaError } from "@/lib/db-errors";
import { env } from "@/lib/env";
import { deleteObject } from "@/lib/storage";
import type { ApiResponse } from "@/lib/types";
import { websiteSchema } from "@/lib/validations";

export async function createWebsite(input: {
	websiteName: string;
	websiteUrl: string;
}): Promise<ApiResponse<{ projectId: string; websiteId: string }>> {
	const { user, organization } = await requireMember();

	const validation = websiteSchema.safeParse(input);
	if (!validation.success) {
		return { status: "error", message: "Invalid website details" };
	}
	const { websiteName, websiteUrl } = validation.data;

	try {
		const newWebsite = await prisma.website.create({
			data: {
				name: websiteName,
				url: websiteUrl,
				organizationId: organization.id,
				developerId: user.id,
			},
		});

		// Site-preview screenshot capture is currently disabled (puppeteer
		// removed) — new websites show the fallback preview.

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/websites");

		return {
			status: "success",
			message: "Created website successfully",
			data: { projectId: newWebsite.projectId, websiteId: newWebsite.id },
		};
	} catch (e) {
		if (isPrismaError(e, "P2002")) {
			return {
				status: "error",
				message: "Your workspace already has a website with this URL",
			};
		}
		console.error("Failed to create website:\n", e);
		return { status: "error", message: "Failed to create website" };
	}
}

export async function updateWebsite(input: {
	websiteId: string;
	websiteName: string;
	websiteUrl: string;
}): Promise<ApiResponse> {
	const validation = websiteSchema.safeParse({
		websiteName: input.websiteName,
		websiteUrl: input.websiteUrl,
	});
	if (!validation.success) {
		return { status: "error", message: "Invalid website details" };
	}
	const { websiteName, websiteUrl } = validation.data;

	const authorized = await getAuthorizedWebsite(input.websiteId);
	if (!authorized) {
		return { status: "error", message: "Website not found" };
	}

	try {
		const urlChanged = authorized.website.url !== websiteUrl;

		await prisma.website.update({
			where: { id: input.websiteId },
			data: { name: websiteName, url: websiteUrl },
		});

		// URL changed → drop the stale preview (recapture disabled: puppeteer
		// removed; the site falls back to the placeholder preview).
		if (urlChanged && authorized.website.screenshotKey) {
			await deleteObject(
				env.NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS,
				authorized.website.screenshotKey,
			);
			await prisma.website.update({
				where: { id: input.websiteId },
				data: { screenshotKey: null },
			});
		}

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/websites");
		revalidatePath(`/dashboard/websites/${input.websiteId}`);

		return { status: "success", message: "Website updated successfully" };
	} catch (e) {
		if (isPrismaError(e, "P2002")) {
			return {
				status: "error",
				message: "Your workspace already has a website with this URL",
			};
		}
		console.error("Failed to update website:\n", e);
		return { status: "error", message: "Failed to update website" };
	}
}

export async function deleteWebsite(websiteId: string): Promise<ApiResponse> {
	const authorized = await getAuthorizedWebsite(websiteId);

	if (!authorized) {
		return { status: "error", message: "Website not found" };
	}

	if (!canManage(authorized.role)) {
		return {
			status: "error",
			message: "Only workspace owners and admins can delete websites",
		};
	}

	try {
		if (authorized.website.screenshotKey) {
			await deleteObject(
				env.NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS,
				authorized.website.screenshotKey,
			);
		}

		// Best-effort cleanup of annotation objects for this website's feedback
		const feedback = await prisma.feedback.findMany({
			where: { websiteId },
			select: { screenshotKey: true },
		});
		await Promise.all(
			feedback.map((f) =>
				deleteObject(
					env.NEXT_PUBLIC_S3_BUCKET_NAME_ANNOTATIONS,
					f.screenshotKey,
				),
			),
		);

		// Cascade deletes feedback rows and invites
		await prisma.website.delete({ where: { id: websiteId } });

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/websites");

		return { status: "success", message: "Website deleted successfully" };
	} catch (e) {
		console.error("Failed to delete website:\n", e);
		return { status: "error", message: "Failed to delete website" };
	}
}
