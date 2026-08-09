import { NextResponse } from "next/server";
import { getApiSession, getWebsiteClient } from "@/app/data/api-auth";
import { prisma } from "@/lib/db";

const ALL_CAPABILITIES = {
	annotate: true,
	text: true,
	style: true,
	image: true,
	preview: true,
};

/** Widget trigger asks: may the *signed-in* user leave feedback on this
 *  project, and with which tools? Identity comes from the session, never
 *  the request body. Client-team members get their per-tool permissions;
 *  leads and workspace members get everything. */
export async function POST(request: Request) {
	const session = await getApiSession();
	if (!session) {
		return NextResponse.json(
			{ error: "Unauthorized", allowed: false },
			{ status: 401 },
		);
	}

	let projectId: unknown;
	try {
		({ projectId } = await request.json());
	} catch {
		return NextResponse.json(
			{ error: "Invalid body", allowed: false },
			{ status: 400 },
		);
	}

	if (typeof projectId !== "string" || !projectId) {
		return NextResponse.json(
			{ error: "Missing projectId", allowed: false },
			{ status: 400 },
		);
	}

	const website = await prisma.website.findUnique({
		where: { projectId },
		select: { id: true, organizationId: true, clientId: true },
	});

	if (!website) {
		return NextResponse.json(
			{ error: "Could not find site", allowed: false },
			{ status: 404 },
		);
	}

	const clientRow = await getWebsiteClient(session.user.id, website.id);
	if (clientRow) {
		return NextResponse.json(
			{
				allowed: true,
				capabilities: {
					annotate: clientRow.canAnnotate,
					text: clientRow.canText,
					style: clientRow.canStyle,
					image: clientRow.canImage,
					// Previewing suggestions needs no per-tool permission
					preview: true,
				},
			},
			{ status: 200 },
		);
	}

	// Legacy single-client pointer (pre-backfill rows)
	if (website.clientId === session.user.id) {
		return NextResponse.json(
			{ allowed: true, capabilities: ALL_CAPABILITIES },
			{ status: 200 },
		);
	}

	const membership = await prisma.member.findUnique({
		where: {
			organizationId_userId: {
				organizationId: website.organizationId,
				userId: session.user.id,
			},
		},
		select: { id: true },
	});

	if (!membership) {
		return NextResponse.json(
			{ error: "Could not find site", allowed: false },
			{ status: 404 },
		);
	}

	return NextResponse.json(
		{ allowed: true, capabilities: ALL_CAPABILITIES },
		{ status: 200 },
	);
}
