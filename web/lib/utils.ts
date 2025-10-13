import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
