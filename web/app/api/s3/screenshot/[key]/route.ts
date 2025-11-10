import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/require-user";
import { env } from "@/lib/env";
import { S3 } from "@/lib/s3client";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ key: string }> },
) {
	await requireUser();

	try {
		const { key } = await params;

		const command = new GetObjectCommand({
			Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS,
			Key: key,
		});

		const response = await S3.send(command);

		// Convert the Body to a Buffer
		const chunks = [];
		// biome-ignore lint/suspicious/noExplicitAny: goon
		for await (const chunk of response.Body as any) {
			chunks.push(chunk);
		}
		const buffer = Buffer.concat(chunks);

		// Return as response with proper headers
		return new NextResponse(buffer, {
			headers: {
				"Content-Type": response.ContentType || "image/jpeg",
				"Content-Length":
					response.ContentLength?.toString() || buffer.length.toString(),
				"Cache-Control": "private, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("Failed to fetch image:", error);
		return NextResponse.json(
			{ error: "Failed to fetch image" },
			{ status: 500 },
		);
	}
}
