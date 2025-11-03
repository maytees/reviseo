import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { requireUser } from "@/app/data/require-user";
import { env } from "@/lib/env";
import { S3 } from "@/lib/s3client";

const uploadAnnotationSchema = z.object({
	fileName: z.string().min(1, { message: "Filename is required" }),
	contentType: z.literal("image/svg+xml"), // Or z.enum(["image/jpeg", "image/jpg"])
	size: z
		.number()
		.min(1)
		.max(5 * 1024 * 1024), // 5MB max for example
});

export async function POST(request: Request) {
	await requireUser();

	try {
		const body = await request.json();
		const validation = uploadAnnotationSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{
					error: validation.error.message,
				},
				{
					status: 400,
				},
			);
		}

		const { fileName, contentType, size } = validation.data;

		const uniqueKey = `${uuidv4()}-${fileName}`;
		const command = new PutObjectCommand({
			Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_ANNOTATIONS,
			Key: uniqueKey,
			ContentType: contentType,
			ContentLength: size,
		});

		const preSignedUrl = await getSignedUrl(S3, command, { expiresIn: 360 }); // Expire sin 6 minutes

		const response = {
			preSignedUrl,
			key: uniqueKey,
		};

		return NextResponse.json(response, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: "Failed to upload annotation" },
			{ status: 500 },
		);
	}
}
