"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function completeOnboarding() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	try {
		// Update user's onboarding status
		await prisma.user.update({
			where: { id: session.user.id },
			data: { hasCompletedOnboarding: true },
		});
	} catch (e) {
		console.error(e);
	} finally {
		await redirect("/dashboard");
	}
}
