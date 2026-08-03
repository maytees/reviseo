import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/db";
import { env } from "@/lib/env";

export async function getUserCurrentPlan() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) return { data: null, subscription: null };

	const data = await db.subscription.findFirst({
		where: {
			userId: session.user.id,
		},
		select: {
			status: true,
			planId: true,
			currentPeriodEnd: true,
			currentPeriodStart: true,
			polarSubId: true,
			userId: true,
		},
	});

	const subscriptionMap: Record<
		string,
		| "starter-monthly"
		| "starter-yearly"
		| "professional-monthly"
		| "professional-yearly"
	> = {};
	// Billing product IDs are optional (unset in local dev = billing disabled).
	if (env.POLAR_STARTER_PLAN_PRODUCT_ID)
		subscriptionMap[env.POLAR_STARTER_PLAN_PRODUCT_ID] = "starter-monthly";
	if (env.POLAR_STARTER_YEARLY_PLAN_PRODUCT_ID)
		subscriptionMap[env.POLAR_STARTER_YEARLY_PLAN_PRODUCT_ID] =
			"starter-yearly";
	if (env.POLAR_PROFESSIONAL_PLAN_PRODUCT_ID)
		subscriptionMap[env.POLAR_PROFESSIONAL_PLAN_PRODUCT_ID] =
			"professional-monthly";
	if (env.POLAR_PROFESSIONAL_YEARLY_PLAN_PRODUCT_ID)
		subscriptionMap[env.POLAR_PROFESSIONAL_YEARLY_PLAN_PRODUCT_ID] =
			"professional-yearly";

	const subscription = subscriptionMap[data?.planId as string] ?? null;

	return { data, subscription };
}

export type UserCurrentPlanType = Awaited<
	ReturnType<typeof getUserCurrentPlan>
>;
