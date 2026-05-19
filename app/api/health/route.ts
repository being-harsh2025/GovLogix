import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    // Check environment variables
    const dbConfigured =
      !!process.env.TURSO_DATABASE_URL && !!process.env.TURSO_AUTH_TOKEN;

    if (!dbConfigured) {
      return Response.json(
        {
          status: "error",
          message: "Database environment variables not configured",
          details:
            "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel environment settings",
        },
        { status: 503 },
      );
    }

    // Try to connect to database
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return Response.json(
      {
        status: "error",
        message,
        hint: "Check Vercel environment variables and database connectivity",
      },
      { status: 503 },
    );
  }
}
