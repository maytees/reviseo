import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./db";

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export function nullToUndefined<T>(value: T | null): T | undefined {
	return value === null ? undefined : value;
}

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

/**
 * Checks if a user has the developer role.
 *
 * @param userId - The ID of the user to check.
 * @returns True if the user is a developer, false otherwise.
 */
export async function isDeveloper(userId: string): Promise<boolean> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { role: true },
	});

	if (!user) {
		throw new Error("Invalid User ID");
	}

	return user.role === "developer";
}

/**
 * Checks if a user has the client role.
 *
 * @param userId - The ID of the user to check.
 * @returns True if the user is a client, false otherwise.
 */
export async function isClient(userId: string): Promise<boolean> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { role: true },
	});

	if (!user) {
		throw new Error("Invalid User ID");
	}

	return user.role === "client";
}
