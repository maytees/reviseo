import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { getApiSession } from "@/app/data/api-auth";
import { env } from "@/lib/env";
import { presignUpload, publicProfilePictureUrl } from "@/lib/storage";

const AVATAR_CONTENT_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
] as const;

const uploadAvatarSchema = z.object({
	fileName: z.string().min(1, { message: "Filename is required" }),
	contentType: z.enum(AVATAR_CONTENT_TYPES),
	// Avatars: 4MB max
	size: z
		.number()
		.min(1)
		.max(4 * 1024 * 1024),
});

/** Presigned upload for the signed-in user's profile picture. */
export async function POST(request: Request) {
	const session = await getApiSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const validationResult = uploadAvatarSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{ error: validationResult.error.message },
				{ status: 400 },
			);
		}

		const { fileName, contentType, size } = validationResult.data;
		// Key is namespaced by user id so one user can't guess-overwrite others.
		const uniqueKey = `${session.user.id}/${uuidv4()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "")}`;

		const preSignedUrl = await presignUpload({
			bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_PROFILE_PICTURES,
			key: uniqueKey,
			contentType,
			size,
		});

		return NextResponse.json(
			{
				preSignedUrl,
				key: uniqueKey,
				publicUrl: publicProfilePictureUrl(uniqueKey),
			},
			{ status: 200 },
		);
	} catch {
		return NextResponse.json(
			{ error: "Failed to create upload" },
			{ status: 500 },
		);
	}
}
