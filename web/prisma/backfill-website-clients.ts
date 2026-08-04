// One-time migration helper: turn each Website.clientId (legacy single
// client) into a WebsiteClient lead row. Safe to re-run — existing rows are
// skipped. Run with: pnpm tsx prisma/backfill-website-clients.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	console.error("DATABASE_URL is not set");
	process.exit(1);
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
});

async function main() {
	const websites = await prisma.website.findMany({
		where: { clientId: { not: null } },
		select: { id: true, clientId: true, name: true },
	});

	let created = 0;
	for (const website of websites) {
		if (!website.clientId) continue;
		const existing = await prisma.websiteClient.findUnique({
			where: {
				websiteId_userId: {
					websiteId: website.id,
					userId: website.clientId,
				},
			},
			select: { id: true },
		});
		if (existing) continue;

		await prisma.websiteClient.create({
			data: {
				websiteId: website.id,
				userId: website.clientId,
				role: "lead",
			},
		});
		created++;
		console.log(`lead row created for "${website.name}"`);
	}

	console.log(
		`Done: ${created} lead row(s) created, ${websites.length} website(s) checked.`,
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
