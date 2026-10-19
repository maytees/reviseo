import type { Metadata } from "next";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import { DashboardChooser } from "./_components/DashboardChooser";

export const metadata: Metadata = {
	title: "Choose your dashboard",
};

export default async function ChooseDashboardPage() {
	const user = await requireUser();
	const [workspaceCount, reviewWebsiteCount] = await Promise.all([
		prisma.member.count({ where: { userId: user.id } }),
		prisma.website.count({
			where: {
				OR: [{ clientId: user.id }, { clients: { some: { userId: user.id } } }],
			},
		}),
	]);

	return (
		<DashboardChooser
			email={user.email}
			workspaceCount={workspaceCount}
			reviewWebsiteCount={reviewWebsiteCount}
			// A client can also be a workspace member. Membership, rather than
			// their original signup role, determines whether they can enter it.
			canAccessWorkspace={workspaceCount > 0 || user.role !== "client"}
			needsOnboarding={!user.hasCompletedOnboarding}
		/>
	);
}
