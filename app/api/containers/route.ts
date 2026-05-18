import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const city = searchParams.get("city");
  const available = searchParams.get("available");

  try {
    const containers = await prisma.container.findMany({
      where: {
        ...(type && { type: type as never }),
        ...(city && { city: { contains: city } }),
        ...(available === "true" && { isAvailable: true }),
        lsp: { status: "APPROVED" },
      },
      include: {
        lsp: { select: { companyName: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(containers);
  } catch (err) {
    console.error("[Containers GET]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lspId, name, type, capacity, weightLimit, location, city, state, pricePerDay, description } = body;

    const lsp = await prisma.lSP.findUnique({ where: { id: lspId } });
    if (!lsp || lsp.status !== "APPROVED") {
      return Response.json({ error: "LSP not found or not approved" }, { status: 403 });
    }

    const container = await prisma.container.create({
      data: { lspId, name, type, capacity: Number(capacity), weightLimit: Number(weightLimit), location, city, state, pricePerDay: Number(pricePerDay), description },
    });

    return Response.json(container, { status: 201 });
  } catch (err) {
    console.error("[Container POST]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
