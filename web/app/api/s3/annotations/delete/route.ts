import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { S3 } from "@/lib/s3client";

export async function DELETE(request: Request) {
	try {
		const { key } = await request.json();

		if (!key) {
			return NextResponse.json({ error: "Key is required" }, { status: 400 });
		}

		const command = new DeleteObjectCommand({
			Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_ANNOTATIONS,
			Key: key,
		});

		await S3.send(command);

		return NextResponse.json(
			{ message: "Feedback annotation deleted successfully" },
			{ status: 200 },
		);
	} catch {
		return NextResponse.json(
			{ error: "Failed to delete feedback annotation" },
			{ status: 500 },
		);
	}
}
