import preact from "@preact/preset-vite";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [preact()],
	build: {
		lib: {
			entry: "src/index.tsx",
			name: "FeedbackWidget",
			fileName: "feedback-widget",
			formats: ["iife"],
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
		cssCodeSplit: false,
	},
	css: {
		postcss: {
			plugins: [tailwindcss()],
		},
	},
	define: {
		"process.env.IS_PREACT": JSON.stringify("true"),
		"process.env.NODE_ENV": JSON.stringify("production"),
		"process.env": JSON.stringify({}),
	},
});
