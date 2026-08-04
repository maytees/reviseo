import { NextResponse } from "next/server";
import { getApiSession, userCanAccessWebsite } from "@/app/data/api-auth";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { getObject } from "@/lib/storage";

/** Replacement images from the widget's image-edit tool — readable by
 *  members of the owning workspace and the website's client. Keys become
 *  fetchable once their ImageEdit row exists (i.e. after submission);
 *  pre-submit previews use local object URLs in the modal instead. */
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ key: string }> },
) {
	const session = await getApiSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { key } = await params;

	const imageEdit = await prisma.imageEdit.findFirst({
		where: { newKey: key },
		select: {
			feedback: {
				select: {
					website: {
						select: { id: true, organizationId: true, clientId: true },
					},
				},
			},
		},
	});

	if (
		!imageEdit ||
		!(await userCanAccessWebsite(session.user.id, imageEdit.feedback.website))
	) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	try {
		const object = await getObject(
			env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGE_EDITS,
			key,
		);

		return new NextResponse(object.Body?.transformToWebStream(), {
			headers: {
				"Content-Type": object.ContentType || "image/png",
				...(object.ContentLength
					? { "Content-Length": object.ContentLength.toString() }
					: {}),
				"Cache-Control": "private, max-age=31536000, immutable",
				// User-supplied images may be SVG (script-capable) — neutralize
				// when opened as a top-level document.
				"Content-Security-Policy":
					"default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox",
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch (error) {
		console.error("Failed to fetch image edit:", error);
		return NextResponse.json(
			{ error: "Failed to fetch image" },
			{ status: 500 },
		);
	}
}
