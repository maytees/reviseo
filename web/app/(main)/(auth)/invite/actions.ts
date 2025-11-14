"use server";

import { isBefore } from "date-fns";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import type { ApiResponse } from "@/lib/types";

export async function finalizeClientToken(
	token: string,
	clientName: string | null,
): Promise<ApiResponse> {
	// This SHOULD give the client
	// ?TODO?: Check make sure its client
	const user = await requireUser();
	// const client = await isClient(user.id);
	// const dev = await isDeveloper(user.id);

	// console.log(client, "client");
	// console.log(dev, "dev");

	// console.log(user.id);

	// if (!client) {
	// 	return {
	// 		status: "error",
	// 		message: "Must be on a client account to accept website invitations",
	// 	};
	// }

	try {
		const invite = await prisma.invite.findUnique({
			where: {
				token,
			},
		});

		if (!invite) {
			return {
				status: "error",
				message: "No invite with given token",
			};
		}

		if (invite.expiresAt && isBefore(invite.expiresAt, new Date())) {
			return {
				status: "error",
				message: "Invite is expired",
			};
		}

		if (invite.status === "REVOKED") {
			return {
				status: "error",
				message: "Invite was revoked",
			};
		}

		if (invite.status === "ACCEPTED") {
			return {
				status: "error",
				message: "Invite already accepted",
			};
		}

		const invitedUser = await prisma.user.findUnique({
			where: {
				email: invite.email,
			},
		});

		if (!invitedUser) {
			return {
				status: "error",
				message: "Email used is not the same as the one invited",
			};
		}

		const existingWebsite = await prisma.website.findUnique({
			where: {
				id: invite.websiteId,
			},
		});

		// Developer deleted website
		if (!existingWebsite) {
			return {
				status: "error",
				message: "Could not find website",
			};
		}

		if (user.id === existingWebsite.developerId) {
			return {
				status: "error",
				message: "Cannot invite yourself as a client!",
			};
		}

		await prisma.website.update({
			where: {
				id: existingWebsite.id,
			},
			data: {
				client: {
					connect: {
						// Might be problematic since we're not checking that the connected user is the client
						id: user.id,
					},
				},
			},
		});

		// Set invite to accepted
		await prisma.invite.update({
			where: {
				id: invite.id,
			},
			data: {
				status: "ACCEPTED",
			},
		});

		if (!invitedUser.name)
			await prisma.user.update({
				where: {
					id: invitedUser.id,
				},
				data: {
					name: clientName || "No Name",
				},
			});

		return {
			status: "success",
			message: `You've been added to ${existingWebsite.name} as a client`,
		};
	} catch (e) {
		console.log(e);
		return {
			status: "error",
			message: "Could not finalize client token",
		};
	}
}
