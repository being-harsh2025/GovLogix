import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// Read environment variables immediately
const DB_URL = process.env.TURSO_DATABASE_URL;
const DB_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!DB_URL) {
  console.error("❌ TURSO_DATABASE_URL is not set");
}
if (!DB_TOKEN) {
  console.error("❌ TURSO_AUTH_TOKEN is not set");
}

let cachedPrisma: PrismaClient | null = null;

export const prisma = new Proxy({}, {
  get(_, prop) {
    if (!cachedPrisma) {
      if (!DB_URL || !DB_TOKEN) {
        throw new Error(
          `Database credentials missing. URL: ${DB_URL ? "✓" : "✗"}, Token: ${DB_TOKEN ? "✓" : "✗"}. ` +
          `Check Vercel Settings > Environment Variables for TURSO_DATABASE_URL and TURSO_AUTH_TOKEN`
        );
      }

      cachedPrisma = new PrismaClient({
        adapter: new PrismaLibSQL(
          createClient({
            url: DB_URL,
            authToken: DB_TOKEN,
          }) as any
        ),
      } as any);
    }

    return (cachedPrisma as any)[prop];
  },
}) as PrismaClient;
