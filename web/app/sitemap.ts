import moment from "moment";
import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/blog";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const articles = await getAllArticles();

	const blogEntries: MetadataRoute.Sitemap = articles.map(
		({ id, lastModified }) => ({
			url: `${env.BETTER_AUTH_URL}/blog/${id}`,
			lastModified: moment(lastModified).format("YYYY-MM-DD"),
		}),
	);

	return [
		{
			url: `${env.BETTER_AUTH_URL}/`,
		},
		{
			url: `${env.BETTER_AUTH_URL}/about`,
		},
		{
			url: `${env.BETTER_AUTH_URL}/privacy`,
		},
		{
			url: `${env.BETTER_AUTH_URL}/terms`,
		},
		{
			url: `${env.BETTER_AUTH_URL}/blog`,
		},
		{
			url: `${env.BETTER_AUTH_URL}/waitlist`,
		},
		...blogEntries,
	];
}
