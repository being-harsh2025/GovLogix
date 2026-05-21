import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendLSPRegistrationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  // Guard: check DB env vars before touching Prisma
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error("[LSP Register] Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
    return Response.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

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

    // Send confirmation email (non-blocking)
    try {
      await sendLSPRegistrationEmail(email, ownerName, lsp.id);
    } catch (emailErr) {
      console.error("[LSP Register] Email send failed:", emailErr);
    }

    return Response.json({ id: lsp.id, message: "Registration submitted successfully" }, { status: 201 });
  } catch (err: unknown) {
    console.error("[LSP Register]", err);
    // Never expose raw Prisma/DB errors to the client
    return Response.json({ error: "Registration failed. Please try again." }, { status: 500 });
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
