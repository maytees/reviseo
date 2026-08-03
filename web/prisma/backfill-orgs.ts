/**
 * One-time backfill: gives every developer/admin user without an organization
 * a personal workspace, and moves their websites into it.
 *
 * Run with:  pnpm dlx tsx prisma/backfill-orgs.ts   (or: bun prisma/backfill-orgs.ts)
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client/client";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
	const users = await prisma.user.findMany({
		where: {
			role: { not: "client" },
			members: { none: {} },
		},
		select: { id: true, name: true, email: true },
	});

	console.log(`Backfilling organizations for ${users.length} user(s)…`);

	for (const user of users) {
		const slugBase = (user.name || user.email.split("@")[0])
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");

		const org = await prisma.organization.create({
			data: {
				id: crypto.randomUUID(),
				name: `${user.name || "My"} Workspace`,
				slug: `${slugBase || "workspace"}-${user.id.slice(0, 6)}`,
				createdAt: new Date(),
				members: {
					create: {
						id: crypto.randomUUID(),
						userId: user.id,
						role: "owner",
						createdAt: new Date(),
					},
				},
			},
		});

		// Adopt websites the user created
		const adopted = await prisma.website.updateMany({
			where: { developerId: user.id },
			data: { organizationId: org.id },
		});

		console.log(
			`  ${user.email}: org ${org.slug} (${adopted.count} website(s) adopted)`,
		);
	}

	console.log("Done.");
}

main().finally(() => prisma.$disconnect());
