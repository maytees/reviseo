"use server";

import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";

/** Members joining an existing workspace skip developer onboarding. */
export async function skipOnboardingAfterJoin() {
	const user = await requireUser();

	await prisma.user.update({
		where: { id: user.id },
		data: { hasCompletedOnboarding: true },
	});
}
