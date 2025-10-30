import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/verify-request", "/onboarding"],
			},
		],
		sitemap: `${env.BETTER_AUTH_URL}/sitemap.xml`,
	};
}
