// Demo seed for screenshotting the client-team pipeline locally.
// Creates a lead + member on the Example Site and one PENDING submission
// from the member. Idempotent. Run: pnpm dlx tsx prisma/seed-demo-team.ts
import { randomUUID } from "node:crypto";
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

async function upsertUser(email: string, name: string) {
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return existing;
	return prisma.user.create({
		data: {
			id: randomUUID(),
			email,
			name,
			emailVerified: true,
			role: "client",
			hasCompletedOnboarding: true,
		},
	});
}

async function main() {
	const website = await prisma.website.findFirst({
		where: { name: "Example Site" },
		select: { id: true, name: true },
	});
	if (!website) throw new Error("Example Site not found");

	const lead = await upsertUser("lead@local.test", "Lena Lead");
	const member = await upsertUser("member@local.test", "Max Member");

	await prisma.websiteClient.upsert({
		where: { websiteId_userId: { websiteId: website.id, userId: lead.id } },
		create: { websiteId: website.id, userId: lead.id, role: "lead" },
		update: { role: "lead" },
	});
	await prisma.websiteClient.upsert({
		where: { websiteId_userId: { websiteId: website.id, userId: member.id } },
		create: {
			websiteId: website.id,
			userId: member.id,
			role: "member",
			trusted: false,
			canStyle: false, // lead disabled the style tool for this member
			invitedById: lead.id,
		},
		update: { role: "member", trusted: false, canStyle: false },
	});

	// One pending submission from the member (awaiting the lead's approval)
	const existingPending = await prisma.feedback.findFirst({
		where: {
			websiteId: website.id,
			authorId: member.id,
			approval: "PENDING",
		},
		select: { id: true },
	});
	if (!existingPending) {
		await prisma.feedback.create({
			data: {
				title: "2 text edits on /",
				type: "TEXT_EDIT",
				priority: "LOW",
				approval: "PENDING",
				pageUrl: "http://localhost:5500/",
				website: { connect: { id: website.id } },
				author: { connect: { id: member.id } },
				textEdits: {
					create: [
						{
							selector: "#home p:nth-of-type(1)",
							elementTag: "p",
							originalText:
								"Unleash unstoppable energy with zero sugar, all-natural ingredients, and explosive flavor.",
							suggestedText:
								"Unleash unstoppable energy with zero sugar, all-natural ingredients, and unforgettable flavor.",
							pageUrl: "http://localhost:5500/",
						},
						{
							selector: "#home h1",
							elementTag: "h1",
							originalText: "Fuel Your Fire.",
							suggestedText: "Fuel Your Day.",
							pageUrl: "http://localhost:5500/",
						},
					],
				},
			},
		});
	}

	console.log(
		JSON.stringify({ websiteId: website.id, lead: lead.email, member: member.email }),
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
