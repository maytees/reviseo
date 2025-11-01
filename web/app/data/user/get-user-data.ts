import "server-only";

import { prisma as db } from "@/lib/db";
import { requireUser } from "../require-user";

export async function getUserData() {
	const user = await requireUser();

	const data = await db.user.findUnique({
		where: {
			id: user.id,
		},
		select: {
			id: true,
			name: true,
			email: true,
			emailVerified: true,
			image: true,
			createdAt: true,
			updatedAt: true,
			hasCompletedOnboarding: true,
			role: true,
			developerWebsites: {
				select: {
					id: true,
					url: true,
					name: true,
					projectId: true,
					widgetInstalled: true,
					verifiedAt: true,
					developerId: true,
					screenshotUrl: true,
					clientId: true,
					createdAt: true,
					updatedAt: true,
					feedback: true,
					client: true,
				},
			},
			clientWebsites: {
				select: {
					id: true,
					url: true,
					screenshotUrl: true,
					name: true,
					projectId: true,
					widgetInstalled: true,
					verifiedAt: true,
					developerId: true,
					clientId: true,
					createdAt: true,
					updatedAt: true,
				},
			},
			feedback: {
				select: {
					id: true,
					websiteId: true,
					authorId: true,
					status: true,
					pageUrl: true,
					screenshotSvgUrl: true,
					annotatedSvg: true,
					userAgent: true,
					viewportJson: true,
					createdAt: true,
					updatedAt: true,
					title: true,
					description: true,
					type: true,
				},
			},
			sessions: {
				select: {
					id: true,
					expiresAt: true,
					token: true,
					createdAt: true,
					updatedAt: true,
					ipAddress: true,
					userAgent: true,
					impersonatedBy: true,
				},
			},
			accounts: {
				select: {
					id: true,
					accountId: true,
					providerId: true,
					accessTokenExpiresAt: true,
					refreshTokenExpiresAt: true,
					scope: true,
					createdAt: true,
					updatedAt: true,
				},
			},
		},
	});

	return data;
}

export type UserDataType = Awaited<ReturnType<typeof getUserData>>;
