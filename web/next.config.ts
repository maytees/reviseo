import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: [
			"www.google.com",
			"images.squarespace-cdn.com",
			"images.unsplash.com",
			"inst-fs-pdx-prod.inscloudgate.net",
		],
	},
	// this shopws with the widget, which is why its false
	devIndicators: false,
};

export default nextConfig;
