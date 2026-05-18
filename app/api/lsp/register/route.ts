import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName, ownerName, email, phone,
      gstNumber, panNumber, address, city, state, pincode,
      vehicleTypes, capacity,
    } = body;

    // Basic validation
    if (!companyName || !ownerName || !email || !phone || !gstNumber || !panNumber || !address || !city || !state || !pincode) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check duplicate email
    const existing = await prisma.lSP.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "An LSP with this email already exists" }, { status: 409 });
    }

    const lsp = await prisma.lSP.create({
      data: {
        companyName,
        ownerName,
        email,
        phone,
        gstNumber,
        panNumber,
        address,
        city,
        state,
        pincode,
        vehicleTypes: typeof vehicleTypes === "string" ? vehicleTypes : JSON.stringify(vehicleTypes),
        capacity: Number(capacity),
        status: "PENDING",
      },
    });

    return Response.json({ id: lsp.id, message: "Registration submitted successfully" }, { status: 201 });
  } catch (err: unknown) {
    console.error("[LSP Register]", err);
    return Response.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const lsps = await prisma.lSP.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        companyName: true,
        ownerName: true,
        email: true,
        phone: true,
        gstNumber: true,
        status: true,
        city: true,
        state: true,
        createdAt: true,
      },
    });
    return Response.json(lsps);
  } catch (err) {
    console.error("[LSP GET]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
