import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Reviseo - Visual Feedback for Web Freelancers",
		short_name: "Reviseo",
		description:
			"Stop guessing what clients want. Collect visual feedback with annotated screenshots directly on your website.",
		start_url: "/",
		display: "standalone",
		background_color: "#fff",
		theme_color: "#fff",
		icons: [
			{
				src: "/logo.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
		],
	};
}
