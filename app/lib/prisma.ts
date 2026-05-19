import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

let cachedPrisma: PrismaClient | undefined;

function makePrisma(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Database configuration missing. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN."
    );
  }

  const libsql = createClient({
    url,
    authToken: token,
  });
  const adapter = new PrismaLibSQL(libsql as any);
  return new PrismaClient({
    adapter,
  } as any);
}

export function getPrisma(): PrismaClient {
  if (!cachedPrisma) {
    cachedPrisma = makePrisma();
  }
  return cachedPrisma;
}

// Lazy export - only initializes when accessed
export const prisma = new Proxy({} as any, {
  get: (target, prop) => {
    const client = getPrisma();
    return client[prop as keyof PrismaClient];
  },
}) as PrismaClient;
