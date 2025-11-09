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

// lib/utils/widget-script.ts (or utils/widget-script.ts)

import { env } from "@/lib/env";

/**
 * Generates the Reviseo widget installation script
 * @param projectId - The unique project identifier
 * @returns The complete script tag as a string
 */
export function generateWidgetScript(projectId: string): string {
	const scriptSrc =
		env.NEXT_PUBLIC_WIDGET_SCRIPT_URL || "./dist/widget.iife.js";

	return `<script>window.ReviseoConfig = { projectId: "${projectId}" }, function (e, t) { if (e.__Reviseo) return; e.__Reviseo = {}; const i = t.createElement("script"); i.src = "${scriptSrc}"; const n = t.getElementsByTagName("script")[0]; n.parentNode.insertBefore(i, n) }(window, document);</script>`;
}

/**
 * Generates a minified version (removes unnecessary spaces)
 */
export function generateWidgetScriptMinified(projectId: string): string {
	const scriptSrc =
		env.NEXT_PUBLIC_WIDGET_SCRIPT_URL || "./dist/widget.iife.js";

	return `<script>window.ReviseoConfig={projectId:"${projectId}"},function(e,t){if(e.__Reviseo)return;e.__Reviseo={};const i=t.createElement("script");i.src="${scriptSrc}";const n=t.getElementsByTagName("script")[0];n.parentNode.insertBefore(i,n)}(window,document);</script>`;
}

/**
 * Generates a formatted version with proper indentation
 */
export function generateWidgetScriptFormatted(projectId: string): string {
	const scriptSrc =
		env.NEXT_PUBLIC_WIDGET_SCRIPT_URL || "./dist/widget.iife.js";

	return `<script>
  window.ReviseoConfig = { projectId: "${projectId}" }, 
  function (e, t) { 
    if (e.__Reviseo) return; 
    e.__Reviseo = {}; 
    const i = t.createElement("script"); 
    i.src = "${scriptSrc}"; 
    const n = t.getElementsByTagName("script")[0]; 
    n.parentNode.insertBefore(i, n) 
  }(window, document);
</script>`;
}

export function fetchSetSiteScreenshot(websiteUrl: string, websiteId: string) {
	fetch(`${env.BETTER_AUTH_URL}/api/s3/screenshot`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			url: websiteUrl,
			websiteId,
		}),
	}).catch((error) => {
		// Log error but don't block the response
		console.error("Failed to trigger screenshot:", error);
	});
}
