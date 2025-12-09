// app/api/webhook/outrank/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
	// Verify the access token
	const authHeader = req.headers.get("authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const token = authHeader.split(" ")[1];
	if (token !== env.OUTRANK_ACCESS_TOKEN) {
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}

	// Parse the payload
	const payload = await req.json();

	if (payload.event_type === "publish_articles") {
		for (const article of payload.data.articles) {
			// Store each article - pick your method:

			// Option 1: Database (Prisma, Drizzle, etc.)
        await prisma.article.upsert({
				where: { id: article.id },
				create: article,
				update: article,
			});

			// Option 2: If using something like Vercel KV or Upstash
			// await kv.set(`article:${article.slug}`, article);

			console.log(`Received article: ${article.title}`);
		}
	}

	return NextResponse.json({ success: true });
}
