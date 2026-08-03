"use server";

import { headers } from "next/headers";
import { requireUser } from "@/app/data/require-user";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { deleteObject, publicProfilePictureUrl } from "@/lib/storage";
import type { ApiResponse } from "@/lib/types";

export async function updateUserProfile(name: string): Promise<ApiResponse> {
	await requireUser();

	try {
		if (!name || name.trim().length === 0) {
			return {
				status: "error" as const,
				message: "Name cannot be empty",
			};
		}

		if (name.trim().length > 100) {
			return {
				status: "error" as const,
				message: "Name must be less than 100 characters",
			};
		}

		// Update user using Better Auth's updateUser API
		await auth.api.updateUser({
			headers: await headers(),
			body: {
				name: name.trim(),
			},
		});

		return {
			status: "success" as const,
			message: "Profile updated successfully",
		};
	} catch (error) {
		console.error("Error updating profile:", error);
		return {
			status: "error" as const,
			message: "An unexpected error occurred. Please try again.",
		};
	}
}

export async function toggleEmailNotifications(
	enabled: boolean,
): Promise<ApiResponse> {
	await requireUser();

	try {
		// Update emailNotifications using Better Auth's updateUser API
		await auth.api.updateUser({
			headers: await headers(),
			body: {
				emailNotifications: enabled,
			},
		});

		return {
			status: "success" as const,
			message: enabled
				? "Email notifications enabled"
				: "Email notifications disabled",
		};
	} catch (error) {
		console.error("Error toggling notifications:", error);
		return {
			status: "error" as const,
			message: "An unexpected error occurred. Please try again.",
		};
	}
}

export async function updateUserAvatar(imageUrl: string): Promise<ApiResponse> {
	const user = await requireUser();

	// Only accept URLs pointing at our own profile-pictures bucket, prefixed
	// with the caller's user id (matches the presign route's key scheme).
	const expectedPrefix = publicProfilePictureUrl(`${user.id}/`);
	if (!imageUrl.startsWith(expectedPrefix)) {
		return {
			status: "error" as const,
			message: "Invalid avatar URL",
		};
	}

	try {
		// Clean up the previous avatar object if it lived in our bucket.
		const bucketBase = publicProfilePictureUrl("");
		if (user.image?.startsWith(bucketBase)) {
			const oldKey = user.image.slice(bucketBase.length);
			if (oldKey && oldKey !== imageUrl.slice(bucketBase.length)) {
				await deleteObject(
					env.NEXT_PUBLIC_S3_BUCKET_NAME_PROFILE_PICTURES,
					oldKey,
				);
			}
		}

		// Update user image using Better Auth's updateUser API
		await auth.api.updateUser({
			headers: await headers(),
			body: {
				image: imageUrl,
			},
		});

		return {
			status: "success" as const,
			message: "Avatar updated successfully",
		};
	} catch (error) {
		console.error("Error updating avatar:", error);
		return {
			status: "error" as const,
			message: "An unexpected error occurred. Please try again.",
		};
	}
}
