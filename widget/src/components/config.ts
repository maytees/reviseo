export const config = {
	appUrl:
		import.meta.env.MODE === "production"
			? (import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL ??
				import.meta.env.VITE_APP_URL!)
			: "localhost:3000",
	social: {
		github: "https://github.com/akash3444/shadcn-ui-blocks",
		twitter: "https://twitter.com/shadcnui_blocks",
	},
};
