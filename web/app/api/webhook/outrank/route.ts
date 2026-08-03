import { timingSafeEqual } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

const articleSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	slug: z.string().min(1),
	content_markdown: z.string(),
	content_html: z.string(),
	meta_description: z.string(),
	image_url: z.string().nullish(),
	tags: z.array(z.string()).default([]),
	created_at: z.coerce.date(),
});

function tokenMatches(provided: string): boolean {
	const expected = Buffer.from(env.OUTRANK_ACCESS_TOKEN);
	const actual = Buffer.from(provided);
	return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function POST(req: NextRequest) {
	// Verify the access token (constant-time comparison)
	const authHeader = req.headers.get("authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const token = authHeader.split(" ")[1];
	if (!token || !tokenMatches(token)) {
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}

	let payload: unknown;
	try {
		payload = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const parsed = z
		.object({
			event_type: z.string(),
			data: z.object({ articles: z.array(articleSchema) }),
		})
		.safeParse(payload);

	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid payload shape" },
			{ status: 400 },
		);
	}

	if (parsed.data.event_type === "publish_articles") {
		for (const article of parsed.data.data.articles) {
			// Explicit field mapping — never mass-assign webhook payloads
			const data = {
				id: article.id,
				title: article.title,
				slug: article.slug,
				content_markdown: article.content_markdown,
				content_html: article.content_html,
				meta_description: article.meta_description,
				image_url: article.image_url ?? null,
				tags: article.tags,
				created_at: article.created_at,
			};

			await prisma.article.upsert({
				where: { id: article.id },
				create: data,
				update: data,
			});
		}
	}

	return NextResponse.json({ success: true });
}
