import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const S3 = new S3Client({
	region: env.AWS_REGION,
	endpoint: env.AWS_ENDPOINT_URL_S3,
	// MinIO (local dev) requires path-style; Tigris/T3 uses virtual-host style.
	forcePathStyle: env.S3_FORCE_PATH_STYLE,
});
