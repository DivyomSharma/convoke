import { PrismaClient } from "@prisma/client";

export const hasDatabaseUrl = Boolean(process.env.Convoke_PRISMA_DATABASE_URL);

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: hasDatabaseUrl ? (process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]) : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
