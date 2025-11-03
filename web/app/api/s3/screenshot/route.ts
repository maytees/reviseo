import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { S3 } from "@/lib/s3client";

export async function POST(request: Request) {
	try {
		const { url, websiteId } = await request.json();

		if (!url || !websiteId) {
			return NextResponse.json(
				{ error: "URL and websiteId are required" },
				{ status: 400 },
			);
		}

		// Take screenshot (replace with your screenshot logic)
		const screenshotResponse = await fetch(
			`${env.BETTER_AUTH_URL}/api/puppeteer?url=${encodeURIComponent(url)}`,
		);

		if (!screenshotResponse.ok) {
			throw new Error("Failed to capture screenshot");
		}

		// Get the blob/buffer from screenshot
		const screenshotBuffer = await screenshotResponse.arrayBuffer();
		const buffer = Buffer.from(screenshotBuffer);

		// Generate unique key for S3
		const uniqueKey = `screenshots/${uuidv4()}.jpeg`;

		// Upload directly to S3
		const command = new PutObjectCommand({
			Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS,
			Key: uniqueKey,
			Body: buffer,
			ContentType: "image/jpeg",
		});

		await S3.send(command);

		// Construct the S3 URL
		const screenshotUrl = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS}.t3.storage.dev/${uniqueKey}`;
		// Or if you use CloudFront: `https://your-cloudfront-domain/${uniqueKey}`

		// Update the website with the screenshot URL
		await prisma.website.update({
			where: { id: websiteId },
			data: { screenshotUrl },
		});

		return NextResponse.json({ screenshotUrl }, { status: 200 });
	} catch (error) {
		console.error("Failed to upload screenshot:", error);
		return NextResponse.json(
			{ error: "Failed to upload screenshot" },
			{ status: 500 },
		);
	}
}
