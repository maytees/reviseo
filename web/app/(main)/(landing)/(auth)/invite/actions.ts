"use server";

import { isBefore } from "date-fns";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import type { ApiResponse } from "@/lib/types";

export async function finalizeClientToken(
	token: string,
	clientName: string | null,
): Promise<ApiResponse> {
	const user = await requireUser();

	try {
		const invite = await prisma.invite.findUnique({
			where: { token },
		});

		if (!invite) {
			return { status: "error", message: "No invite with given token" };
		}

		// The invite may only be redeemed by the account whose email it was
		// sent to — holding the link is not enough.
		if (invite.email.toLowerCase() !== user.email.toLowerCase()) {
			return {
				status: "error",
				message:
					"This invite was sent to a different email address. Sign in with the invited email to accept it.",
			};
		}

		if (invite.expiresAt && isBefore(invite.expiresAt, new Date())) {
			return { status: "error", message: "Invite is expired" };
		}

		if (invite.status === "REVOKED") {
			return { status: "error", message: "Invite was revoked" };
		}

		if (invite.status === "ACCEPTED") {
			return { status: "error", message: "Invite already accepted" };
		}

		const existingWebsite = await prisma.website.findUnique({
			where: { id: invite.websiteId },
		});

		// Developer deleted website
		if (!existingWebsite) {
			return { status: "error", message: "Could not find website" };
		}

		if (user.id === existingWebsite.developerId) {
			return {
				status: "error",
				message: "Cannot invite yourself as a client!",
			};
		}

		// Join the website's client team with the role/permissions the invite
		// carries. Leads also stay on the legacy clientId pointer.
		await prisma.websiteClient.upsert({
			where: {
				websiteId_userId: { websiteId: existingWebsite.id, userId: user.id },
			},
			create: {
				websiteId: existingWebsite.id,
				userId: user.id,
				role: invite.clientRole,
				trusted: invite.trusted,
				canAnnotate: invite.canAnnotate,
				canText: invite.canText,
				canStyle: invite.canStyle,
				canImage: invite.canImage,
				invitedById: invite.invitedById,
			},
			update: {
				role: invite.clientRole,
				trusted: invite.trusted,
				canAnnotate: invite.canAnnotate,
				canText: invite.canText,
				canStyle: invite.canStyle,
				canImage: invite.canImage,
			},
		});

		if (invite.clientRole === "lead" && !existingWebsite.clientId) {
			await prisma.website.update({
				where: { id: existingWebsite.id },
				data: { client: { connect: { id: user.id } } },
			});
		}

		// Set invite to accepted
		await prisma.invite.update({
			where: { id: invite.id },
			data: { status: "ACCEPTED", acceptedAt: new Date() },
		});

		// First-time client accounts skip developer onboarding
		if (!user.name || clientName) {
			await prisma.user.update({
				where: { id: user.id },
				data: {
					...(clientName && !user.name ? { name: clientName } : {}),
					hasCompletedOnboarding: true,
				},
			});
		}

		return {
			status: "success",
			message: `You've been added to ${existingWebsite.name} as a client`,
		};
	} catch (e) {
		console.error("Failed to finalize client token:", e);
		return { status: "error", message: "Could not finalize client token" };
	}
}
