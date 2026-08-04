import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Session for API route handlers — returns null instead of redirecting,
 *  so routes can respond 401 JSON rather than a 307 to /login. */
export async function getApiSession() {
	return auth.api.getSession({ headers: await headers() });
}

/** The user's client-team row for a website, or null. */
export async function getWebsiteClient(userId: string, websiteId: string) {
	return prisma.websiteClient.findUnique({
		where: { websiteId_userId: { websiteId, userId } },
	});
}

/** True when the user is a member of the org that owns the website, or on
 *  the website's client team (lead or member). The legacy single-client
 *  pointer is still honored for rows that predate the team backfill. */
export async function userCanAccessWebsite(
	userId: string,
	website: { id: string; organizationId: string; clientId?: string | null },
): Promise<boolean> {
	if (website.clientId === userId) return true;

	const clientRow = await getWebsiteClient(userId, website.id);
	if (clientRow) return true;

	const membership = await prisma.member.findUnique({
		where: {
			organizationId_userId: {
				organizationId: website.organizationId,
				userId,
			},
		},
		select: { id: true },
	});

	return Boolean(membership);
}
