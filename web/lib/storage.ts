import "server-only";

import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";
import { S3 } from "./s3client";

/** Presigned PUT URL for a direct browser upload. */
export async function presignUpload(opts: {
	bucket: string;
	key: string;
	contentType: string;
	size: number;
	expiresIn?: number;
}) {
	const command = new PutObjectCommand({
		Bucket: opts.bucket,
		Key: opts.key,
		ContentType: opts.contentType,
		ContentLength: opts.size,
	});
	return getSignedUrl(S3, command, { expiresIn: opts.expiresIn ?? 360 });
}

/** Delete an object; errors are logged, not thrown (best-effort cleanup). */
export async function deleteObject(bucket: string, key: string) {
	try {
		await S3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
	} catch (error) {
		console.error(`Failed to delete s3://${bucket}/${key}:`, error);
	}
}

/** Fetch an object for streaming back to the client. */
export async function getObject(bucket: string, key: string) {
	return S3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
}

/** Upload a buffer server-side. */
export async function putObject(
	bucket: string,
	key: string,
	body: Buffer,
	contentType: string,
) {
	await S3.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: body,
			ContentType: contentType,
		}),
	);
}

/** Public URL for a profile picture (bucket has public read access).
 *  Path-style for MinIO/local, virtual-host style for Tigris/T3. */
export function publicProfilePictureUrl(key: string) {
	const bucket = env.NEXT_PUBLIC_S3_BUCKET_NAME_PROFILE_PICTURES;
	if (env.S3_FORCE_PATH_STYLE) {
		return `${env.AWS_ENDPOINT_URL_S3}/${bucket}/${key}`;
	}
	const endpointHost = new URL(env.AWS_ENDPOINT_URL_S3).host;
	return `https://${bucket}.${endpointHost}/${key}`;
}
