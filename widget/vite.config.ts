import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [preact()],
	build: {
		lib: {
			entry: "src/index.tsx",
			name: "ReviseoWidget",
			fileName: "widget",
			formats: ["iife"],
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
	},
});
