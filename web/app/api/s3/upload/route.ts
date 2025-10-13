import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { env } from "@/lib/env";
import { S3 } from "@/lib/s3client";

const uploadImageSchema = z.object({
	fileName: z.string().min(1, { message: "Filename is required" }),
	contentType: z.string().min(1, { message: "Content type is required" }),
	size: z.number().min(1, { message: "Size is required" }),
	isImage: z.boolean(),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const validationResult = uploadImageSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{ error: validationResult.error.message },
				{ status: 400 },
			);
		}

		const { fileName, contentType, size } = validationResult.data;
		const uniqueKey = `${uuidv4()}-${fileName}`;

		const command = new PutObjectCommand({
			Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_UPLOADS,
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
			{ error: "Failed to upload file" },
			{ status: 500 },
		);
	}
}
