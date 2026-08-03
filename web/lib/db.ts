import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/client/client";
import { env } from "./env";

// Neon's serverless driver only works against Neon; use the plain pg
// adapter for local/any-other Postgres.
const adapter = env.DATABASE_URL.includes("neon.tech")
	? new PrismaNeon({ connectionString: env.DATABASE_URL })
	: new PrismaPg({ connectionString: env.DATABASE_URL });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
