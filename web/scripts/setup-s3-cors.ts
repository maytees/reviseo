/**
 * Apply CORS rules to the S3/Tigris buckets so the browser can use
 * presigned uploads from the app origins (annotation SVGs, avatars).
 *
 * Run with production credentials (from Vercel env):
 *
 *   AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… \
 *   AWS_ENDPOINT_URL_S3=https://t3.storage.dev AWS_REGION=auto \
 *   bun scripts/setup-s3-cors.ts reviseo-annotations-prod reviseo-profile-pictures-prod
 *
 * Pass the bucket names to configure as arguments.
 */
import {
	GetBucketCorsCommand,
	PutBucketCorsCommand,
	S3Client,
} from "@aws-sdk/client-s3";

const ALLOWED_ORIGINS = [
	"https://www.reviseo.app",
	"https://reviseo.app",
	"http://localhost:3000",
];

const buckets = process.argv.slice(2);
if (buckets.length === 0) {
	console.error("Usage: bun scripts/setup-s3-cors.ts <bucket> [bucket…]");
	process.exit(1);
}

const s3 = new S3Client({
	region: process.env.AWS_REGION ?? "auto",
	endpoint: process.env.AWS_ENDPOINT_URL_S3,
});

for (const bucket of buckets) {
	await s3.send(
		new PutBucketCorsCommand({
			Bucket: bucket,
			CORSConfiguration: {
				CORSRules: [
					{
						AllowedOrigins: ALLOWED_ORIGINS,
						AllowedMethods: ["GET", "PUT", "HEAD"],
						AllowedHeaders: ["*"],
						ExposeHeaders: ["ETag"],
						MaxAgeSeconds: 3600,
					},
				],
			},
		}),
	);

	const check = await s3.send(new GetBucketCorsCommand({ Bucket: bucket }));
	console.log(
		`${bucket}: CORS applied →`,
		JSON.stringify(check.CORSRules?.[0]?.AllowedOrigins),
	);
}

console.log("Done.");
