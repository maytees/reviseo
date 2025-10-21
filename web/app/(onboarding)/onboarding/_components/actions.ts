"use server";

import { addDays } from "date-fns";
import { v4 } from "uuid";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import ClientInviteEmail from "@/lib/email/client-invite-email";
import { env } from "@/lib/env";
import { getDomain } from "@/lib/getDomain";
import { resend } from "@/lib/resend";
import type { ApiResponse } from "@/lib/types";
import type { ClientFormData, WebsiteFormData } from "@/lib/validations";
import { PrismaClientKnownRequestError } from "@/prisma/generated/client/runtime/library";

export async function inviteClient({
	clientName,
	clientEmail,
	websiteId,
	websiteName,
	websiteUrl,
}: ClientFormData &
	WebsiteFormData & { websiteId: string }): Promise<ApiResponse> {
	const user = await requireUser();
	const token = v4();

	if (user.email === clientEmail) {
		return {
			status: "error",
			message: "Cannot invite yourself!",
		};
	}

	try {
		// Create invite
		const invite = await prisma.invite.create({
			data: {
				email: clientEmail,
				token,
				// Expires in 7 days
				expiresAt: addDays(new Date(), 7),
				websiteId,
			},
		});

		// Send invite
		const email = await resend.emails.send({
			// TODO: Use reviseo domain
			from: "Reviseo <onboarding@reviseo.app>",
			to: [clientEmail],
			subject: "Reviseo - You have an invite!",
			react: ClientInviteEmail({
				clientName,
				inviteUrl: `${env.BETTER_AUTH_URL}/invite?token=${token}`,
				// TODO: Fix fields
				developerName: user.name,
				websiteName,
				websiteUrl,
			}),
		});

		if (!email.error)
			return {
				status: "success",
				message: "Succesfully sent invite to client",
			};

		// Delete invite, since invite didn't send
		await prisma.invite.delete({
			where: {
				id: invite.id,
			},
		});

		return {
			status: "error",
			message: "Failed to send email",
		};
	} catch (e) {
		console.error("Failed to send email:\n", e);

		return {
			status: "error",
			message: `Failed to create invite`,
		};
	}
}

export async function createWebsiteOnboarding({
	websiteName,
	websiteUrl,
}: WebsiteFormData): Promise<
	ApiResponse<{
		projectId: string;
		websiteId: string;
	}>
> {
	const user = await requireUser();
	const url = getDomain(websiteUrl);

	try {
		const newWebsite = await prisma.website.create({
			data: {
				name: websiteName,
				url: websiteUrl,
				developerId: user.id,
			},
		});

		return {
			status: "success",
			data: {
				projectId: newWebsite.projectId,
				websiteId: newWebsite.id,
			},
			message: "Created website successfully",
		};
	} catch (e: unknown) {
		if (e instanceof PrismaClientKnownRequestError) {
			switch (e.code) {
				case "P2002": {
					return {
						status: "error",
						message: `Website domain ${url} already taken!`,
					};
				}
				default:
					return {
						status: "error",
						message: `Failed to create website: ${e.code}`,
					};
			}
		}

		console.error("Failed to create website:\n", e);
		return {
			status: "error",
			message: `Failed to create website`,
		};
	}
}

export async function updateWebsiteOnboarding({
	websiteId,
	websiteName,
	websiteUrl,
}: WebsiteFormData & { websiteId: string }): Promise<ApiResponse> {
	const user = await requireUser();
	const url = getDomain(websiteUrl);

	try {
		// Verify the website belongs to the user
		const existingWebsite = await prisma.website.findFirst({
			where: {
				id: websiteId,
				developerId: user.id,
			},
		});

		if (!existingWebsite) {
			return {
				status: "error",
				message: "Website not found or unauthorized",
			};
		}

		// Update the website
		await prisma.website.update({
			where: {
				id: websiteId,
			},
			data: {
				name: websiteName,
				url: websiteUrl,
			},
		});

		return {
			status: "success",
			message: "Website updated successfully",
		};
	} catch (e: unknown) {
		if (e instanceof PrismaClientKnownRequestError) {
			switch (e.code) {
				case "P2002": {
					return {
						status: "error",
						message: `Website domain ${url} already taken!`,
					};
				}
				default:
					return {
						status: "error",
						message: `Failed to update website: ${e.code}`,
					};
			}
		}

		console.error("Failed to update website:\n", e);
		return {
			status: "error",
			message: `Failed to update website`,
		};
	}
}
