import "server-only";

import type { Prisma } from "@/prisma/generated/client/client";

/** Public-safe user fields (never sessions/accounts/tokens). */
export const userPublicSelect = {
	id: true,
	name: true,
	email: true,
	emailVerified: true,
	image: true,
	createdAt: true,
	updatedAt: true,
	hasCompletedOnboarding: true,
	role: true,
} satisfies Prisma.UserSelect;

export const feedbackSelect = {
	id: true,
	websiteId: true,
	authorId: true,
	status: true,
	pageUrl: true,
	screenshotKey: true,
	viewport: true,
	priority: true,
	timestamp: true,
	browser: true,
	browserVersion: true,
	device: true,
	os: true,
	createdAt: true,
	updatedAt: true,
	title: true,
	description: true,
	type: true,
	author: { select: userPublicSelect },
	// Slim website ref for list rows (name/link only — no recursion)
	website: { select: { id: true, name: true, url: true } },
} satisfies Prisma.FeedbackSelect;

export const websiteSelect = {
	id: true,
	url: true,
	screenshotKey: true,
	name: true,
	invites: true,
	projectId: true,
	widgetInstalled: true,
	verifiedAt: true,
	organizationId: true,
	developerId: true,
	clientId: true,
	createdAt: true,
	updatedAt: true,
	client: { select: userPublicSelect },
	feedback: {
		select: feedbackSelect,
		orderBy: { createdAt: "desc" as const },
	},
} satisfies Prisma.WebsiteSelect;

/** Dashboard overview variant: recent feedback only + counts, instead of
 *  every feedback row for every website. */
export const websiteOverviewSelect = {
	...websiteSelect,
	feedback: {
		select: feedbackSelect,
		orderBy: { createdAt: "desc" as const },
		take: 15,
	},
	_count: { select: { feedback: true } },
} satisfies Prisma.WebsiteSelect;
