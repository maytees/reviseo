import { NextResponse } from "next/server";
import { getApiSession, userCanAccessWebsite } from "@/app/data/api-auth";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { getObject } from "@/lib/storage";

/** Feedback annotation images — readable by members of the owning workspace
 *  and the website's client. Served with a strict CSP + download-safe headers
 *  because annotations are user-supplied SVG (script-capable). */
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ key: string }> },
) {
	const session = await getApiSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { key } = await params;

	const feedback = await prisma.feedback.findFirst({
		where: { screenshotKey: key },
		select: {
			website: { select: { id: true, organizationId: true, clientId: true } },
		},
	});

	if (
		!feedback ||
		!(await userCanAccessWebsite(session.user.id, feedback.website))
	) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	try {
		const object = await getObject(
			env.NEXT_PUBLIC_S3_BUCKET_NAME_ANNOTATIONS,
			key,
		);

		return new NextResponse(object.Body?.transformToWebStream(), {
			headers: {
				"Content-Type": object.ContentType || "image/svg+xml",
				...(object.ContentLength
					? { "Content-Length": object.ContentLength.toString() }
					: {}),
				"Cache-Control": "private, max-age=31536000, immutable",
				// Neutralize scripts inside user-supplied SVG when the file is
				// opened as a top-level document.
				"Content-Security-Policy":
					"default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox",
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch (error) {
		console.error("Failed to fetch annotation:", error);
		return NextResponse.json(
			{ error: "Failed to fetch image" },
			{ status: 500 },
		);
	}
}
