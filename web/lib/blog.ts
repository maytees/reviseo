import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { BlogItem } from "./types";

const blogDirectory = path.join(process.cwd(), "blog");

const getSortedArticles = (): BlogItem[] => {
	const fileNames = fs.readdirSync(blogDirectory);

	const allArticlesData = fileNames.map((fileName) => {
		const id = fileName.replace(/\.md$/, "");

		const fullPath = path.join(blogDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, "utf-8");

		const matterResult = matter(fileContents);

		return {
			id,
			title: matterResult.data.title,
			date: matterResult.data.date,
			author: matterResult.data.author,
			category: matterResult.data.category,
			description: matterResult.data.description,
			cover: matterResult.data.cover,
			slug: matterResult.data.slug ?? id,
			authorImage: matterResult.data.authorImage,
			authorLinkedIn: matterResult.data.authorLinkedIn,
			seeMore: matterResult.data.seeMore,
			authorRole: matterResult.data.authorRole,
			lastModified: matterResult.data.lastModified,
		} satisfies BlogItem;
	});

	return allArticlesData.sort((a, b) => {
		const dateOne = a.date;
		const dateTwo = b.date;

		if (dateOne.isBefore(dateTwo)) {
			return -1;
		} else if (dateTwo.isAfter(dateOne)) {
			return 1;
		}

		return 0;
	});
};

export const getCategorisedArticles = (): Record<string, BlogItem[]> => {
	const sortedArticles = getSortedArticles();
	const categorisedArticles: Record<string, BlogItem[]> = {};
	sortedArticles.forEach((article) => {
		if (!categorisedArticles[article.category]) {
			categorisedArticles[article.category] = [];
		}

		categorisedArticles[article.category].push(article);
	});

	return categorisedArticles;
};

export const getAllArticles = (): BlogItem[] => {
	// Newest first for list views
	return [...getSortedArticles()].reverse();
};

export const getArticleData = async (
	id: string,
): Promise<(BlogItem & { contentHtml: string; content: string }) | null> => {
	let filePath = path.join(blogDirectory, `${id}.md`);
	let fileContents: string | null = null;

	if (fs.existsSync(filePath)) {
		fileContents = fs.readFileSync(filePath, "utf-8");
	} else {
		// Fallback: resolve by slug metadata
		const fileNames = fs.readdirSync(blogDirectory);
		for (const fileName of fileNames) {
			const candidatePath = path.join(blogDirectory, fileName);
			const candidate = fs.readFileSync(candidatePath, "utf-8");
			const matterResult = matter(candidate);
			if (matterResult.data?.slug === id) {
				filePath = candidatePath;
				fileContents = candidate;
				break;
			}
		}
		if (!fileContents) {
			return null;
		}
	}
	const matterResult = matter(fileContents);

	const processedContent = await remark()
		.use(html)
		.process(matterResult.content);

	const contentHtml = processedContent.toString();

	return {
		id,
		contentHtml,
		title: matterResult.data.title,
		category: matterResult.data.category,
		author: matterResult.data.author,
		description: matterResult.data.description,
		cover: matterResult.data.cover,
		slug: matterResult.data.slug ?? id,
		content: matterResult.content,
		authorImage: matterResult.data.authorImage,
		authorLinkedIn: matterResult.data.authorLinkedIn,
		authorRole: matterResult.data.authorRole,
		seeMore: matterResult.data.seeMore,
		lastModified: matterResult.data.lastModified,
		date: matterResult.data.date,
	};
};
