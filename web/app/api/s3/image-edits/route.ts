import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { getApiSession, userCanAccessWebsite } from "@/app/data/api-auth";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { presignUpload } from "@/lib/storage";

const uploadImageEditSchema = z.object({
	fileName: z.string().min(1, { message: "Filename is required" }),
	contentType: z.enum([
		"image/png",
		"image/jpeg",
		"image/webp",
		"image/gif",
		"image/svg+xml",
	]),
	size: z
		.number()
		.min(1)
		.max(10 * 1024 * 1024),
	// The widget project the replacement belongs to (authorization scope).
	projectId: z.string().min(1),
});

/** Presigned PUT for a replacement image from the widget's image-edit tool.
 *  Uploads happen from the modal iframe (our origin), so the bucket's CORS
 *  allowlist never needs customer domains. */
export async function POST(request: Request) {
	const session = await getApiSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const validation = uploadImageEditSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.message },
				{ status: 400 },
			);
		}

		const { fileName, contentType, size, projectId } = validation.data;

		// Only the website's client or a member of the owning workspace may
		// upload replacement images for it.
		const website = await prisma.website.findUnique({
			where: { projectId },
			select: { id: true, organizationId: true, clientId: true },
		});

		if (!website || !(await userCanAccessWebsite(session.user.id, website))) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const uniqueKey = `${uuidv4()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "")}`;
		const preSignedUrl = await presignUpload({
			bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGE_EDITS,
			key: uniqueKey,
			contentType,
			size,
		});

		return NextResponse.json({ preSignedUrl, key: uniqueKey }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: "Failed to create upload URL" },
			{ status: 500 },
		);
	}
}
