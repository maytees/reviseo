import "server-only";

import { prisma as db } from "@/lib/db";
import { requireUser } from "../require-user";

export async function getUserOnboardingData() {
	const user = await requireUser();

	const data = await db.user.findFirst({
		where: {
			id: user.id,
		},
		select: {
			name: true,
			email: true,
			developerWebsites: {
				select: {
					url: true,
					name: true,
				},
			},
		},
	});

	return data;
}

export type UserOnboardingDataType = Awaited<
	ReturnType<typeof getUserOnboardingData>
>;
