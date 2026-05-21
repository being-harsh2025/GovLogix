import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

let cachedPrisma: PrismaClient | null = null;

function createPrismaClient(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  const DB_URL = url === "undefined" ? undefined : url;
  const DB_TOKEN = token === "undefined" ? undefined : token;

  if (!DB_URL || !DB_TOKEN) {
    throw new Error(
      `Database not configured. Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to your environment variables (Vercel → Settings → Environment Variables).`
    );
  }

  return new PrismaClient({
    adapter: new PrismaLibSQL({
      url: DB_URL,
      authToken: DB_TOKEN,
    }) as any,
  } as any);
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (!cachedPrisma) {
      cachedPrisma = createPrismaClient();
    }
    return (cachedPrisma as any)[prop];
  },
});
