import "server-only";

import { prisma as db } from "@/lib/db";
import { requireUser } from "../require-user";

// id -> website id
// developer -> developer id
export async function getWebsiteByIdAndDevId(id: string) {
	const user = await requireUser();

	const data = await db.website.findUnique({
		where: {
			id,
			developerId: user.id,
		},
		select: {
			url: true,
			screenshotUrl: true,
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
					isMobile: true,
					os: true,
					createdAt: true,
					updatedAt: true,
					title: true,
					description: true,
					type: true,
				},
			},
		},
	});

	return data;
}

export type WebsiteDataType = Awaited<
	ReturnType<typeof getWebsiteByIdAndDevId>
>;

export type WebsiteDataTypeNonNullable = NonNullable<WebsiteDataType>;
