import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
import { PrismaClient } from "@/prisma/generated/client/client";

dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
