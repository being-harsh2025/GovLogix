import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

function initPrisma() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url || !token) {
    throw new Error(
      `Database not configured. URL: ${url ? "✓" : "✗"}, Token: ${token ? "✓" : "✗"}`
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

export function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = initPrisma();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy(
  {},
  {
    get(_, prop) {
      return (getPrismaClient() as any)[prop];
    },
  }
) as PrismaClient;
