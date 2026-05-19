import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Database credentials not configured. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables."
    );
  }

  return new PrismaClient({
    adapter: new PrismaLibSQL(
      createClient({
        url,
        authToken: token,
      }) as any
    ),
  } as any);
}

export const prisma =
  globalForPrisma.prisma ||
  new Proxy({} as any, {
    get: (target, prop) => {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient();
      }
      return (globalForPrisma.prisma as any)[prop];
    },
  });
