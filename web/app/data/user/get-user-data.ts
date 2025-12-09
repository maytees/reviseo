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
			emailNotifications: true,
			hasCompletedOnboarding: true,
			role: true,
			developerWebsites: {
				select: {
					id: true,
					url: true,
					screenshotKey: true,
					name: true,
					invites: true,
					projectId: true,
					widgetInstalled: true,
					verifiedAt: true,
					developerId: true,
					clientId: true,
					createdAt: true,
					updatedAt: true,
					client: {
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
						},
					},
					feedback: {
						select: {
							id: true,
							websiteId: true,
							authorId: true,
							status: true,
							pageUrl: true,
							screenshotKey: true,
							viewport: true,
							priority: true,
							timestamp: true,
							author: true,
							website: true,
							browser: true,
							browserVersion: true,
							device: true,
							os: true,
							createdAt: true,
							updatedAt: true,
							title: true,
							description: true,
							type: true,
						},
					},
				},
			},
			clientWebsites: {
				select: {
					id: true,
					url: true,
					screenshotKey: true,
					name: true,
					invites: true,
					projectId: true,
					widgetInstalled: true,
					verifiedAt: true,
					developerId: true,
					clientId: true,
					createdAt: true,
					updatedAt: true,
					client: {
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
						},
					},
					feedback: {
						select: {
							id: true,
							websiteId: true,
							authorId: true,
							status: true,
							pageUrl: true,
							screenshotKey: true,
							viewport: true,
							priority: true,
							timestamp: true,
							author: true,
							website: true,
							browser: true,
							browserVersion: true,
							device: true,
							os: true,
							createdAt: true,
							updatedAt: true,
							title: true,
							description: true,
							type: true,
						},
					},
				},
			},
			feedback: {
				select: {
					id: true,
					websiteId: true,
					authorId: true,
					status: true,
					pageUrl: true,
					screenshotKey: true,
					viewport: true,
					priority: true,
					timestamp: true,
					author: true,
					website: true,
					browser: true,
					browserVersion: true,
					device: true,
					os: true,
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
			subscription: {
				select: {
					status: true,
					// TODO: Get other fields
				},
			},
		},
	});

	return data;
}

export type UserDataType = Awaited<ReturnType<typeof getUserData>>;
