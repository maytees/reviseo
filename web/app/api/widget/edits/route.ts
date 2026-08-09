import { NextResponse } from "next/server";
import { getApiSession, getWebsiteClient } from "@/app/data/api-auth";
import { prisma } from "@/lib/db";

/** Preview mode asks: which suggested changes may the *signed-in* viewer
 *  replay on this site? Identity comes from the session, never the body.
 *  Scope mirrors the client dashboard:
 *  - lead: own submissions (any approval) + teammates' DIRECT/APPROVED/
 *    PENDING (their queue) — teammates' REJECTED stays private
 *  - member / legacy client: own submissions only
 *  - workspace (org) member: everything DIRECT/APPROVED, read-only
 *  Per-edit rows the developer already APPLIED/REJECTED are filtered out —
 *  preview shows outstanding suggestions. */
export async function POST(request: Request) {
	const session = await getApiSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	let projectId: unknown;
	try {
		({ projectId } = await request.json());
	} catch {
		return NextResponse.json({ error: "Invalid body" }, { status: 400 });
	}
	if (typeof projectId !== "string" || !projectId) {
		return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
	}

	const website = await prisma.website.findUnique({
		where: { projectId },
		select: { id: true, organizationId: true, clientId: true },
	});
	if (!website) {
		return NextResponse.json({ error: "Could not find site" }, { status: 404 });
	}

	const userId = session.user.id;
	const clientRow = await getWebsiteClient(userId, website.id);
	const isLegacyClient = website.clientId === userId;

	let role: "lead" | "member" | "developer";
	if (clientRow) {
		role = clientRow.role === "lead" ? "lead" : "member";
	} else if (isLegacyClient) {
		// Legacy pointer behaves like a lead (their submissions are DIRECT)
		role = "lead";
	} else {
		const membership = await prisma.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: website.organizationId,
					userId,
				},
			},
			select: { id: true },
		});
		if (!membership) {
			return NextResponse.json(
				{ error: "Could not find site" },
				{ status: 404 },
			);
		}
		role = "developer";
	}

	const approvalScope =
		role === "lead"
			? {
					OR: [
						{ authorId: userId },
						{
							authorId: { not: userId },
							approval: {
								in: ["DIRECT", "APPROVED", "PENDING"] as (
									| "DIRECT"
									| "APPROVED"
									| "PENDING"
								)[],
							},
						},
					],
				}
			: role === "member"
				? { authorId: userId }
				: {
						approval: {
							in: ["DIRECT", "APPROVED"] as ("DIRECT" | "APPROVED")[],
						},
					};

	const feedback = await prisma.feedback.findMany({
		where: {
			websiteId: website.id,
			type: { in: ["TEXT_EDIT", "STYLE_EDIT", "IMAGE_EDIT"] },
			...approvalScope,
		},
		select: {
			id: true,
			title: true,
			type: true,
			approval: true,
			approvalNote: true,
			pageUrl: true,
			createdAt: true,
			author: { select: { id: true, name: true } },
			textEdits: {
				where: { status: "PENDING" },
				select: {
					id: true,
					selector: true,
					originalText: true,
					suggestedText: true,
					pageUrl: true,
				},
				orderBy: { createdAt: "asc" },
			},
			styleEdits: {
				where: { status: "PENDING" },
				select: {
					id: true,
					selector: true,
					changes: true,
					pageUrl: true,
				},
				orderBy: { createdAt: "asc" },
			},
			imageEdits: {
				where: { status: "PENDING" },
				select: {
					id: true,
					selector: true,
					originalSrc: true,
					newKey: true,
					newUrl: true,
					pageUrl: true,
				},
				orderBy: { createdAt: "asc" },
			},
		},
		orderBy: { createdAt: "desc" },
		take: 100,
	});

	// Drop submissions whose every edit row is already decided by the dev.
	const items = feedback.filter(
		(f) =>
			f.textEdits.length > 0 ||
			f.styleEdits.length > 0 ||
			f.imageEdits.length > 0,
	);

	return NextResponse.json(
		{ items, viewer: { role, userId } },
		{ status: 200 },
	);
}
