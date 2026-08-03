import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db";
import { requireMember } from "../require-member";

/** Members + pending invitations for the caller's active workspace. */
export const getTeamData = cache(async () => {
	const { user, organization, role } = await requireMember();

	const [members, invitations] = await Promise.all([
		prisma.member.findMany({
			where: { organizationId: organization.id },
			select: {
				id: true,
				role: true,
				createdAt: true,
				user: {
					select: { id: true, name: true, email: true, image: true },
				},
			},
			orderBy: { createdAt: "asc" },
		}),
		prisma.invitation.findMany({
			where: { organizationId: organization.id, status: "pending" },
			select: {
				id: true,
				email: true,
				role: true,
				status: true,
				expiresAt: true,
				user: { select: { name: true } },
			},
		}),
	]);

	return {
		currentUserId: user.id,
		currentRole: role,
		organization,
		members,
		invitations,
	};
});

export type TeamData = Awaited<ReturnType<typeof getTeamData>>;
