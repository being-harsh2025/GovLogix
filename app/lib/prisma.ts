import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

let cachedPrisma: PrismaClient | null = null;

function createPrismaInstance(): PrismaClient {
  const dbUrl = process.env.TURSO_DATABASE_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl) {
    throw new Error(
      "Missing environment variable: TURSO_DATABASE_URL. Please set it in Vercel Settings > Environment Variables."
    );
  }

  if (!dbToken) {
    throw new Error(
      "Missing environment variable: TURSO_AUTH_TOKEN. Please set it in Vercel Settings > Environment Variables."
    );
  }

  return new PrismaClient({
    adapter: new PrismaLibSQL(
      createClient({
        url: dbUrl,
        authToken: dbToken,
      }) as any
    ),
  } as any);
}

// Singleton pattern with lazy initialization
export const prisma = (() => {
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        if (!cachedPrisma) {
          cachedPrisma = createPrismaInstance();
        }
        return (cachedPrisma as any)[prop];
      },
    }
  );
})() as PrismaClient;
