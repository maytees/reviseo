import {
	generateWidgetScriptFormatted,
	generateWidgetScriptInnerJs,
	generateWidgetScriptMinified,
} from "./utils";

export type WidgetGuideIcon =
	| "html"
	| "nextjs"
	| "react"
	| "vue"
	| "nuxt"
	| "wordpress"
	| "shopify";

export type WidgetGuide = {
	value: string;
	label: string;
	icon: WidgetGuideIcon;
	filename: string;
	language: string;
	code: string;
	instructions: string[];
};

export type WidgetConfig = { position?: string; theme?: string };

/**
 * Platform install guides for the widget snippet. Shared by the public
 * /docs page (projectId = "YOUR_PROJECT_ID") and each website's Widget tab
 * (real projectId + configured position/theme baked in).
 */
export function buildWidgetGuides(
	projectId: string,
	config?: WidgetConfig,
): WidgetGuide[] {
	const formatted = generateWidgetScriptFormatted(projectId, config);
	const minified = generateWidgetScriptMinified(projectId, config);
	const innerJs = generateWidgetScriptInnerJs(projectId, config);
	const isPlaceholder = projectId === "YOUR_PROJECT_ID";
	const replaceNote = isPlaceholder
		? "Replace YOUR_PROJECT_ID with the project ID from your dashboard."
		: "The snippet already contains this website's project ID.";

	const nextjsSnippet = `// app/layout.tsx
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="reviseo-widget" strategy="afterInteractive">
          {\`${innerJs.replaceAll("`", "\\`")}\`}
        </Script>
      </body>
    </html>
  );
}`;

	const nuxtSnippet = `// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          innerHTML: \`${innerJs.replaceAll("`", "\\`")}\`,
          type: "text/javascript",
        },
      ],
    },
  },
});`;

	return [
		{
			value: "html",
			label: "HTML",
			icon: "html",
			filename: "index.html",
			language: "html",
			code: formatted,
			instructions: [
				"Open the HTML file for every page you want feedback on (or your shared layout/template).",
				"Paste the snippet just before the closing </head> tag.",
				replaceNote,
			],
		},
		{
			value: "nextjs",
			label: "Next.js",
			icon: "nextjs",
			filename: "app/layout.tsx",
			language: "tsx",
			code: nextjsSnippet,
			instructions: [
				"Add the snippet to your root layout with next/script so it loads on every page.",
				'strategy="afterInteractive" keeps it out of the critical path.',
				replaceNote,
			],
		},
		{
			value: "react",
			label: "React / Vite",
			icon: "react",
			filename: "index.html",
			language: "html",
			code: formatted,
			instructions: [
				"Vite apps have a static index.html at the project root — paste the snippet before </head> there.",
				"The widget loads independently of your React bundle, so no component changes are needed.",
				replaceNote,
			],
		},
		{
			value: "vue",
			label: "Vue",
			icon: "vue",
			filename: "index.html",
			language: "html",
			code: formatted,
			instructions: [
				"For Vite-based Vue apps, paste the snippet before </head> in index.html.",
				replaceNote,
			],
		},
		{
			value: "nuxt",
			label: "Nuxt",
			icon: "nuxt",
			filename: "nuxt.config.ts",
			language: "typescript",
			code: nuxtSnippet,
			instructions: [
				"Register the script globally via app.head in nuxt.config.ts.",
				replaceNote,
			],
		},
		{
			value: "wordpress",
			label: "WordPress",
			icon: "wordpress",
			filename: "header snippet",
			language: "html",
			code: minified,
			instructions: [
				"Easiest: install a header-script plugin (e.g. WPCode) and add the snippet to the site header.",
				"Alternatively, edit your theme's header.php and paste the snippet before </head> — note theme updates can overwrite this.",
				replaceNote,
			],
		},
		{
			value: "shopify",
			label: "Shopify",
			icon: "shopify",
			filename: "layout/theme.liquid",
			language: "html",
			code: minified,
			instructions: [
				"In your Shopify admin, go to Online Store → Themes → Edit code.",
				"Open layout/theme.liquid and paste the snippet before </head>.",
				replaceNote,
			],
		},
	];
}
