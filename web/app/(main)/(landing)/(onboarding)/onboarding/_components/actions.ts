"use server";

import { addDays } from "date-fns";
import { v4 } from "uuid";
import {
	createWebsite,
	updateWebsite,
} from "@/app/(main)/(dashboard)/dashboard/websites/actions";
import { getAuthorizedWebsite } from "@/app/data/require-member";
import { prisma } from "@/lib/db";
import ClientInviteEmail from "@/lib/email/client-invite-email";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import type { ApiResponse } from "@/lib/types";
import type { ClientFormData, WebsiteFormData } from "@/lib/validations";
import { clientSchema } from "@/lib/validations";

export async function inviteClient({
	clientName,
	clientEmail,
	websiteId,
	websiteName,
	websiteUrl,
}: ClientFormData &
	WebsiteFormData & { websiteId: string }): Promise<ApiResponse> {
	const validation = clientSchema.safeParse({ clientName, clientEmail });
	if (!validation.success) {
		return { status: "error", message: "Invalid client details" };
	}

	const authorized = await getAuthorizedWebsite(websiteId);
	if (!authorized) {
		return { status: "error", message: "Could not find website" };
	}
	const { user, website } = authorized;

	if (user.email === clientEmail) {
		return { status: "error", message: "Cannot invite yourself!" };
	}

	// TODO: Allow multiple clients
	if (website.clientId) {
		return { status: "error", message: "Website already has client!" };
	}

	const token = v4();

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
			from: "Reviseo <onboarding@reviseo.app>",
			to: [clientEmail],
			subject: "Reviseo - You have an invite!",
			react: ClientInviteEmail({
				clientName,
				inviteUrl: `${env.BETTER_AUTH_URL}/invite?token=${token}&clientName=${encodeURIComponent(clientName)}`,
				developerName: user.name,
				websiteName: website.name || websiteName,
				websiteUrl: website.url || websiteUrl,
			}),
		});

		if (!email.error)
			return {
				status: "success",
				message: "Succesfully sent invite to client",
			};

		// Delete invite, since invite didn't send
		await prisma.invite.delete({ where: { id: invite.id } });

		return { status: "error", message: "Failed to send email" };
	} catch (e) {
		console.error("Failed to send email:\n", e);
		return { status: "error", message: "Failed to create invite" };
	}
}

// Thin wrappers so onboarding steps share the central website actions.
export async function createWebsiteOnboarding(input: WebsiteFormData) {
	return createWebsite(input);
}

export async function updateWebsiteOnboarding(
	input: WebsiteFormData & { websiteId: string },
) {
	return updateWebsite(input);
}
