import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Session for API route handlers — returns null instead of redirecting,
 *  so routes can respond 401 JSON rather than a 307 to /login. */
export async function getApiSession() {
	return auth.api.getSession({ headers: await headers() });
}

/** True when the user is a member of the org that owns the website, or the
 *  website's feedback client. */
export async function userCanAccessWebsite(
	userId: string,
	website: { organizationId: string; clientId: string | null },
): Promise<boolean> {
	if (website.clientId === userId) return true;

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
