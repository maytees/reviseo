"use server";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { v4 } from "uuid";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import ClientInviteEmail from "@/lib/email/client-invite-email";
import ClientRemovalNotificationEmail from "@/lib/email/client-removal-notification";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import type { ApiResponse } from "@/lib/types";

export async function removeClientFromSite(
	websiteId: string,
	clientId: string,
	sendEmail: boolean,
): Promise<ApiResponse> {
	await requireUser();

	try {
		const existingWebsite = await prisma.website.findUnique({
			where: {
				id: websiteId,
				clientId,
			},
			select: {
				client: {
					select: { email: true, name: true },
				},
				developer: {
					select: {
						email: true,
						name: true,
					},
				},
				name: true,
			},
		});

		if (!existingWebsite || !existingWebsite.client) {
			return {
				status: "error",
				message: "Website with client not found",
			};
		}

		// Remove the client
		await prisma.website.update({
			where: {
				id: websiteId,
				clientId,
			},
			data: {
				client: {
					disconnect: true,
				},
			},
		});

		if (sendEmail) {
			const emailResponse = await resend.emails.send({
				from: "Reviseo <info@reviseo.app>",
				to: [existingWebsite.client.email],
				subject: "Reviseo - You've been removed!",
				react: ClientRemovalNotificationEmail({
					clientName: existingWebsite.client.name,
					developerEmail: existingWebsite.developer.email,
					developerName: existingWebsite.developer.name,
					websiteName: existingWebsite.name,
				}),
			});

			if (emailResponse.error) console.error(emailResponse);
		}

		return {
			status: "success",
			message: "Client removed successfully",
		};
	} catch (e: unknown) {
		if (e instanceof PrismaClientKnownRequestError) {
			switch (e.code) {
				default:
					return {
						status: "error",
						message: `Failed to remove client: ${e.code}`,
					};
			}
		}

		console.error("Failed to remove client:\n", e);
		return {
			status: "error",
			message: `Failed to remove client`,
		};
	}
}

export async function resendInvite(
	inviteId: string,
	websiteId: string,
): Promise<ApiResponse> {
	const user = await requireUser();

	try {
		// Verify the website belongs to the user
		const website = await prisma.website.findUnique({
			where: {
				id: websiteId,
				developerId: user.id,
			},
		});

		if (!website) {
			return {
				status: "error",
				message: "Website not found or unauthorized",
			};
		}

		// Get the invite
		const invite = await prisma.invite.findUnique({
			where: {
				id: inviteId,
				websiteId,
			},
		});

		if (!invite) {
			return {
				status: "error",
				message: "Invite not found",
			};
		}

		// Check if invite is already accepted
		if (invite.status === "ACCEPTED") {
			return {
				status: "error",
				message: "This invite has already been accepted",
			};
		}

		// Generate new token and extend expiration
		const newToken = v4();
		const newExpiresAt = addDays(new Date(), 7);

		// Update the invite
		await prisma.invite.update({
			where: {
				id: inviteId,
			},
			data: {
				token: newToken,
				expiresAt: newExpiresAt,
				status: "PENDING", // Reset to pending if it was revoked
			},
		});

		// Extract client name from email (before @)
		const clientName = invite.email.split("@")[0];

		// Resend the email
		const email = await resend.emails.send({
			from: "Reviseo <onboarding@reviseo.app>",
			to: [invite.email],
			subject: "Reviseo - You have an invite!",
			react: ClientInviteEmail({
				clientName,
				inviteUrl: `${env.BETTER_AUTH_URL}/invite?token=${newToken}&clientName=${clientName}`,
				developerName: user.name,
				websiteName: website.name,
				websiteUrl: website.url,
			}),
		});

		if (email.error) {
			return {
				status: "error",
				message: "Failed to send email",
			};
		}

		revalidatePath(`/dashboard/websites/${websiteId}`);

		return {
			status: "success",
			message: "Invite resent successfully",
		};
	} catch (error) {
		console.error("Failed to resend invite:", error);
		return {
			status: "error",
			message: "Failed to resend invite",
		};
	}
}

export async function revokeInvite(
	inviteId: string,
	websiteId: string,
): Promise<ApiResponse> {
	const user = await requireUser();

	try {
		// Verify the website belongs to the user
		const website = await prisma.website.findUnique({
			where: {
				id: websiteId,
				developerId: user.id,
			},
		});

		if (!website) {
			return {
				status: "error",
				message: "Website not found or unauthorized",
			};
		}

		// Update the invite status to revoked
		await prisma.invite.update({
			where: {
				id: inviteId,
				websiteId,
			},
			data: {
				status: "REVOKED",
			},
		});

		revalidatePath(`/dashboard/websites/${websiteId}`);

		return {
			status: "success",
			message: "Invite revoked successfully",
		};
	} catch (error) {
		console.error("Failed to revoke invite:", error);
		return {
			status: "error",
			message: "Failed to revoke invite",
		};
	}
}
