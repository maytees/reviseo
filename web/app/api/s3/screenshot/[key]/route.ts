import { NextResponse } from "next/server";
import { getApiSession, userCanAccessWebsite } from "@/app/data/api-auth";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { getObject } from "@/lib/storage";

/** Site preview screenshots — readable by members of the owning workspace
 *  and the website's client. Streams the object (no full buffering). */
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ key: string }> },
) {
	const session = await getApiSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { key } = await params;

	const website = await prisma.website.findFirst({
		where: { screenshotKey: key },
		select: { organizationId: true, clientId: true },
	});

	if (!website || !(await userCanAccessWebsite(session.user.id, website))) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	try {
		const object = await getObject(
			env.NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS,
			key,
		);

		return new NextResponse(object.Body?.transformToWebStream(), {
			headers: {
				"Content-Type": object.ContentType || "image/png",
				...(object.ContentLength
					? { "Content-Length": object.ContentLength.toString() }
					: {}),
				"Cache-Control": "private, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("Failed to fetch screenshot:", error);
		return NextResponse.json(
			{ error: "Failed to fetch image" },
			{ status: 500 },
		);
	}
}
