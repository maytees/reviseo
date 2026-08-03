import { NextResponse } from "next/server";
import { getApiSession, userCanAccessWebsite } from "@/app/data/api-auth";
import { prisma } from "@/lib/db";

/** Widget trigger asks: may the *signed-in* user leave feedback on this
 *  project? Identity comes from the session, never the request body. */
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
		select: { organizationId: true, clientId: true },
	});

	if (!website || !(await userCanAccessWebsite(session.user.id, website))) {
		return NextResponse.json(
			{ error: "Could not find site", allowed: false },
			{ status: 404 },
		);
	}

	return NextResponse.json({ allowed: true }, { status: 200 });
}
