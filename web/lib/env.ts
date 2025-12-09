import { createEnv } from "@t3-oss/env-nextjs"; // or core package
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.url(),
		AUTH_GITHUB_CLIENT_ID: z.string().min(1),
		AUTH_GITHUB_SECRET: z.string().min(1),
		RESEND_API_KEY: z.string().min(1),
		// ARCJET_KEY: z.string().min(1),
		AWS_ACCESS_KEY_ID: z.string().min(1),
		AWS_SECRET_ACCESS_KEY: z.string().min(1),
		AWS_ENDPOINT_URL_S3: z.string().min(1),
		AWS_ENDPOINT_URL_IAM: z.string().min(1),
		AWS_REGION: z.string().min(1),
		ROUTER_TOKEN: z.string().min(1),
		ROUTER_ENDPOINT: z.url().min(1),
		POLAR_ACCESS_TOKEN: z.string().min(1),
		POLAR_WEBHOOK_SECRET: z.string().min(1),
		POLAR_STARTER_PLAN_PRODUCT_ID: z.string().min(1),
		POLAR_STARTER_YEARLY_PLAN_PRODUCT_ID: z.string().min(1),
		POLAR_PROFESSIONAL_PLAN_PRODUCT_ID: z.string().min(1),
		POLAR_PROFESSIONAL_YEARLY_PLAN_PRODUCT_ID: z.string().min(1),
		NODE_ENV: z
			.enum(["production", "preview", "development"])
			.default("development"),
		// STRIPE_SECRET_KEY: z.string().min(1),
		// STRIPE_WEBHOOK_SECRET: z.string().min(1),
	},

	client: {
		NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS: z.string().min(1),
		NEXT_PUBLIC_S3_BUCKET_NAME_ANNOTATIONS: z.string().min(1),
		NEXT_PUBLIC_S3_BUCKET_NAME_UPLOADS: z.string().min(1),
		NEXT_PUBLIC_S3_BUCKET_NAME_PROFILE_PICTURES: z.string().min(1),
		NEXT_PUBLIC_WIDGET_SCRIPT_URL: z.string().min(1),
		// NEXT_PUBLIC_SITE_URL: z.string().min(1),
	},

	// For Next.js >= 13.4.4, you only need to destructure client variables:
	experimental__runtimeEnv: {
		// NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
		NEXT_PUBLIC_S3_BUCKET_NAME_UPLOADS:
			process.env.NEXT_PUBLIC_S3_BUCKET_NAME_UPLOADS,
		NEXT_PUBLIC_S3_BUCKET_NAME_ANNOTATIONS:
			process.env.NEXT_PUBLIC_S3_BUCKET_NAME_ANNOTATIONS,
		NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS:
			process.env.NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS,
		NEXT_PUBLIC_S3_BUCKET_NAME_PROFILE_PICTURES:
			process.env.NEXT_PUBLIC_S3_BUCKET_NAME_PROFILE_PICTURES,
		NEXT_PUBLIC_WIDGET_SCRIPT_URL: process.env.NEXT_PUBLIC_WIDGET_SCRIPT_URL,
	},
});
