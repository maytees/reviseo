import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { getApiSession, userCanAccessWebsite } from "@/app/data/api-auth";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { presignUpload } from "@/lib/storage";

const uploadAnnotationSchema = z.object({
	fileName: z.string().min(1, { message: "Filename is required" }),
	contentType: z.literal("image/svg+xml"),
	// Annotation SVGs embed the page screenshot as base64 — allow up to 15MB.
	size: z
		.number()
		.min(1)
		.max(15 * 1024 * 1024),
	// The widget project the annotation belongs to (authorization scope).
	projectId: z.string().min(1),
});

export async function POST(request: Request) {
	const session = await getApiSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const validation = uploadAnnotationSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.message },
				{ status: 400 },
			);
		}

		const { fileName, contentType, size, projectId } = validation.data;

		// Only the website's client or a member of the owning workspace may
		// upload annotations for it.
		const website = await prisma.website.findUnique({
			where: { projectId },
			select: { organizationId: true, clientId: true },
		});

		if (!website || !(await userCanAccessWebsite(session.user.id, website))) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const uniqueKey = `${uuidv4()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "")}`;
		const preSignedUrl = await presignUpload({
			bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_ANNOTATIONS,
			key: uniqueKey,
			contentType,
			size,
		});

		return NextResponse.json({ preSignedUrl, key: uniqueKey }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: "Failed to create annotation upload" },
			{ status: 500 },
		);
	}
}
