import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Full session (user + session record) or redirect to /login. */
export const requireSession = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	return session;
});

export type OrgRole = "owner" | "admin" | "member";

/** Roles allowed to perform destructive/administrative operations. */
export function canManage(role: string | null | undefined): boolean {
	return role === "owner" || role === "admin";
}

/**
 * The signed-in user's active organization membership. Falls back to their
 * first membership when the session has no active org; redirects to
 * onboarding when the user belongs to no organization at all.
 */
export const requireMember = cache(async () => {
	const session = await requireSession();
	const activeOrgId = session.session.activeOrganizationId;

	let membership = activeOrgId
		? await prisma.member.findUnique({
				where: {
					organizationId_userId: {
						organizationId: activeOrgId,
						userId: session.user.id,
					},
				},
				include: { organization: true },
			})
		: null;

	// Session's active org may be stale (e.g. removed from that org) or unset
	// (older session) — fall back to the user's first membership and heal the
	// session row so Better Auth's own org endpoints see the active org too.
	if (!membership) {
		membership = await prisma.member.findFirst({
			where: { userId: session.user.id },
			orderBy: { createdAt: "asc" },
			include: { organization: true },
		});

		if (membership) {
			await prisma.session.update({
				where: { id: session.session.id },
				data: { activeOrganizationId: membership.organizationId },
			});
		}
	}

	// Self-heal: developers with no workspace at all (e.g. declined an org
	// invitation after signup) get a personal one created lazily.
	if (!membership) {
		if (session.user.role === "client") {
			redirect("/client/dashboard");
		}

		const user = session.user;
		const slugBase = (user.name || user.email.split("@")[0])
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");

		const organization = await prisma.organization.create({
			data: {
				id: crypto.randomUUID(),
				name: `${user.name || "My"} Workspace`,
				slug: `${slugBase || "workspace"}-${user.id.slice(0, 6)}`,
				createdAt: new Date(),
				members: {
					create: {
						id: crypto.randomUUID(),
						userId: user.id,
						role: "owner",
						createdAt: new Date(),
					},
				},
			},
		});

		await prisma.session.update({
			where: { id: session.session.id },
			data: { activeOrganizationId: organization.id },
		});

		return { user, organization, role: "owner" as OrgRole };
	}

	return {
		user: session.user,
		organization: membership.organization,
		role: membership.role as OrgRole,
	};
});

/**
 * Load a website only if it belongs to the caller's active organization.
 * Returns null when the website doesn't exist or isn't theirs — callers
 * must treat null as "not found" (never reveal existence).
 */
export async function getAuthorizedWebsite(websiteId: string) {
	const { user, organization, role } = await requireMember();

	const website = await prisma.website.findFirst({
		where: { id: websiteId, organizationId: organization.id },
	});

	if (!website) return null;

	return { user, organization, role, website };
}
