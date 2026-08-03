import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// cacheComponents: true,
	turbopack: {
		// Silence multi-lockfile workspace-root inference warning
		root: __dirname,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.google.com",
			},
			{
				protocol: "https",
				hostname: "via.placeholder.com",
			},
			{
				protocol: "https",
				hostname: "images.squarespace-cdn.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "inst-fs-pdx-prod.inscloudgate.net",
			},
			{
				protocol: "https",
				hostname: "placehold.co",
			},
			{
				protocol: "https",
				hostname: "avatar.vercel.sh",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "reviseo-site-screenshots.t3.storage.dev",
			},
			{
				protocol: "https",
				hostname: "reviseo-profile-pictures.t3.storage.dev",
			},
			{
				protocol: "https",
				hostname: "reviseo-annotations.fly.storage.tigris.dev",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
			},
			{
				protocol: "https",
				hostname: "localhost",
				port: "3000",
			},
			{
				protocol: "https",
				hostname: "cdn.outrank.so",
			},
		],
	},
	// this shopws with the widget, which is why its false
	devIndicators: false,
	outputFileTracingIncludes: {
		"/app/api/**": ["./node_modules/@sparticuz/chromium/bin/**"],
	},
};

export default nextConfig;
