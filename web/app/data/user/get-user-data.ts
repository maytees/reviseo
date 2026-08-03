import "server-only";

import { cache } from "react";
import { prisma as db } from "@/lib/db";
import { requireMember } from "../require-member";
import {
	feedbackSelect,
	userPublicSelect,
	websiteOverviewSelect,
} from "../selects";

/**
 * Dashboard data for the signed-in member's active workspace:
 * the user's public profile plus all websites owned by the organization.
 * (Named developerWebsites for backwards compatibility with existing UI.)
 */
export const getUserData = cache(async () => {
	const { user, organization, role } = await requireMember();

	const [profile, orgWebsites, clientWebsites] = await Promise.all([
		db.user.findUnique({
			where: { id: user.id },
			select: {
				...userPublicSelect,
				emailNotifications: true,
				subscription: { select: { status: true } },
			},
		}),
		db.website.findMany({
			where: { organizationId: organization.id },
			select: websiteOverviewSelect,
			orderBy: { createdAt: "desc" },
		}),
		db.website.findMany({
			where: { clientId: user.id },
			select: websiteOverviewSelect,
			orderBy: { createdAt: "desc" },
		}),
	]);

	if (!profile) return null;

	return {
		...profile,
		organization,
		orgRole: role,
		developerWebsites: orgWebsites,
		clientWebsites,
	};
});

export type UserDataType = Awaited<ReturnType<typeof getUserData>>;

/** Feedback authored by the signed-in user (client view). */
export const getOwnFeedback = cache(async () => {
	const { user } = await requireMember();

	return db.feedback.findMany({
		where: { authorId: user.id },
		select: feedbackSelect,
		orderBy: { createdAt: "desc" },
	});
});
