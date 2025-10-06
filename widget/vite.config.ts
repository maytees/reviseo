import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tailwindcss(), preact()],
	build: {
		lib: {
			entry: "src/index.tsx",
			name: "FeedbackWidget",
			fileName: "feedback-widget",
			formats: ["iife"], // Important: single file bundle
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
	},
});
