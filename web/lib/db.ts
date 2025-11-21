import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/prisma/generated/client/client";
import { env } from "./env";

const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
