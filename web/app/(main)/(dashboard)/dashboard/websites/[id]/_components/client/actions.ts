"use server";

import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { v4 } from "uuid";
import { canManage, getAuthorizedWebsite } from "@/app/data/require-member";
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
	const authorized = await getAuthorizedWebsite(websiteId);

	if (!authorized || authorized.website.clientId !== clientId) {
		return { status: "error", message: "Website with client not found" };
	}

	if (!canManage(authorized.role)) {
		return {
			status: "error",
			message: "Only workspace owners and admins can remove clients",
		};
	}

	try {
		const details = await prisma.website.findUnique({
			where: { id: websiteId },
			select: {
				name: true,
				client: { select: { email: true, name: true } },
				developer: { select: { email: true, name: true } },
			},
		});

		if (!details?.client) {
			return { status: "error", message: "Website with client not found" };
		}

		await prisma.website.update({
			where: { id: websiteId },
			data: { client: { disconnect: true } },
		});

		if (sendEmail) {
			const emailResponse = await resend.emails.send({
				from: "Reviseo <info@reviseo.app>",
				to: [details.client.email],
				subject: "Reviseo - You've been removed!",
				react: ClientRemovalNotificationEmail({
					clientName: details.client.name,
					developerEmail: details.developer.email,
					developerName: details.developer.name,
					websiteName: details.name,
				}),
			});

			if (emailResponse.error) console.error(emailResponse);
		}

		revalidatePath(`/dashboard/websites/${websiteId}`);

		return { status: "success", message: "Client removed successfully" };
	} catch (e) {
		console.error("Failed to remove client:\n", e);
		return { status: "error", message: "Failed to remove client" };
	}
}

export async function resendInvite(
	inviteId: string,
	websiteId: string,
): Promise<ApiResponse> {
	const authorized = await getAuthorizedWebsite(websiteId);

	if (!authorized) {
		return { status: "error", message: "Website not found" };
	}

	try {
		const invite = await prisma.invite.findUnique({
			where: { id: inviteId, websiteId },
		});

		if (!invite) {
			return { status: "error", message: "Invite not found" };
		}

		if (invite.status === "ACCEPTED") {
			return {
				status: "error",
				message: "This invite has already been accepted",
			};
		}

		// Generate new token and extend expiration
		const newToken = v4();
		const newExpiresAt = addDays(new Date(), 7);

		await prisma.invite.update({
			where: { id: inviteId },
			data: {
				token: newToken,
				expiresAt: newExpiresAt,
				status: "PENDING", // Reset to pending if it was revoked
			},
		});

		// Extract client name from email (before @)
		const clientName = invite.email.split("@")[0];

		const email = await resend.emails.send({
			from: "Reviseo <onboarding@reviseo.app>",
			to: [invite.email],
			subject: "Reviseo - You have an invite!",
			react: ClientInviteEmail({
				clientName,
				inviteUrl: `${env.BETTER_AUTH_URL}/invite?token=${newToken}&clientName=${encodeURIComponent(clientName)}`,
				developerName: authorized.user.name,
				websiteName: authorized.website.name,
				websiteUrl: authorized.website.url,
			}),
		});

		if (email.error) {
			return { status: "error", message: "Failed to send email" };
		}

		revalidatePath(`/dashboard/websites/${websiteId}`);

		return { status: "success", message: "Invite resent successfully" };
	} catch (error) {
		console.error("Failed to resend invite:", error);
		return { status: "error", message: "Failed to resend invite" };
	}
}

export async function revokeInvite(
	inviteId: string,
	websiteId: string,
): Promise<ApiResponse> {
	const authorized = await getAuthorizedWebsite(websiteId);

	if (!authorized) {
		return { status: "error", message: "Website not found" };
	}

	try {
		await prisma.invite.update({
			where: { id: inviteId, websiteId },
			data: { status: "REVOKED" },
		});

		revalidatePath(`/dashboard/websites/${websiteId}`);

		return { status: "success", message: "Invite revoked successfully" };
	} catch (error) {
		console.error("Failed to revoke invite:", error);
		return { status: "error", message: "Failed to revoke invite" };
	}
}
