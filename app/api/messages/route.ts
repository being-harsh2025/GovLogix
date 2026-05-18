import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const fromLspId = url.searchParams.get("from");
  const toLspId = url.searchParams.get("to");
  try {
    const messages = await prisma.message.findMany({
      where: fromLspId && toLspId
        ? {
            OR: [
              { fromLspId, toLspId },
              { fromLspId: toLspId, toLspId: fromLspId },
            ],
          }
        : {},
      orderBy: { createdAt: "asc" },
      include: {
        from: { select: { companyName: true } },
        to:   { select: { companyName: true } },
      },
    });
    return Response.json(messages);
  } catch (err) {
    console.error("[Messages GET]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fromLspId, toLspId, content } = await request.json();
    if (!fromLspId || !toLspId || !content?.trim()) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }
    const message = await prisma.message.create({
      data: { fromLspId, toLspId, content },
      include: {
        from: { select: { companyName: true } },
        to:   { select: { companyName: true } },
      },
    });
    return Response.json(message, { status: 201 });
  } catch (err) {
    console.error("[Messages POST]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
