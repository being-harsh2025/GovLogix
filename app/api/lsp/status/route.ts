import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const lsp = await prisma.lSP.findUnique({
      where: { email },
      include: {
        containers: {
          orderBy: { createdAt: "desc" },
          include: {
            bookings: {
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                bookerName: true,
                bookerEmail: true,
                bookerPhone: true,
                startDate: true,
                endDate: true,
                totalAmount: true,
                status: true,
                paymentStatus: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!lsp) {
      return Response.json({ error: "No LSP found with this email" }, { status: 404 });
    }

    return Response.json(lsp);
  } catch (err) {
    console.error("[LSP Status GET]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
