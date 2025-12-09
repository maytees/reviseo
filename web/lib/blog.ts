"use server";

import { cacheLife } from "next/cache";
import { prisma } from "@/lib/db";
import type { BlogItem } from "./types";

/**
 * Converts database Article to BlogItem format
 * Maps database fields to the expected BlogItem structure
 */
function articleToBlogItem(article: {
	id: string;
	title: string;
	slug: string;
	content_markdown: string;
	content_html: string;
	meta_description: string;
	image_url: string | null;
	tags: string[];
	created_at: Date;
	received_at: Date;
}): BlogItem {
	// Use first tag as category, default to 'guide' if no tags
	const category = (article.tags[0] as "story" | "product" | "guide") ?? "guide";

	return {
		id: article.id,
		title: article.title,
		slug: article.slug,
		description: article.meta_description,
		cover: article.image_url ?? undefined,
		date: article.created_at,
		lastModified: article.received_at,
		category,
		// Default author values (can be enhanced later if needed)
		author: "Reviseo Team",
		authorImage: undefined,
		authorLinkedIn: "https://linkedin.com/company/reviseo",
		authorRole: "Content Team",
		seeMore: [], // Related articles can be added later
	};
}

/**
 * Get all articles sorted by creation date (newest first)
 * Cached for 24 hours
 */
export async function getAllArticles(): Promise<BlogItem[]> {
	"use cache";
	cacheLife("days");

	const articles = await prisma.article.findMany({
		orderBy: {
			created_at: "desc",
		},
	});

	return articles.map(articleToBlogItem);
}

/**
 * Get articles grouped by category
 * Cached for 24 hours
 */
export async function getCategorisedArticles(): Promise<
	Record<string, BlogItem[]>
> {
	"use cache";
	cacheLife("days");

	const allArticles = await getAllArticles();
	const categorisedArticles: Record<string, BlogItem[]> = {};

	for (const article of allArticles) {
		if (!categorisedArticles[article.category]) {
			categorisedArticles[article.category] = [];
		}
		categorisedArticles[article.category].push(article);
	}

	return categorisedArticles;
}

/**
 * Get a single article by ID or slug
 * Returns null if not found
 * Cached for 24 hours
 */
export async function getArticleData(
	idOrSlug: string,
): Promise<(BlogItem & { contentHtml: string; content: string }) | null> {
	"use cache";
	cacheLife("days");

	// Try to find by id first, then by slug
	const article = await prisma.article.findFirst({
		where: {
			OR: [{ id: idOrSlug }, { slug: idOrSlug }],
		},
	});

	if (!article) {
		return null;
	}

	const blogItem = articleToBlogItem(article);

	return {
		...blogItem,
		content: article.content_markdown,
		contentHtml: article.content_html,
	};
}
