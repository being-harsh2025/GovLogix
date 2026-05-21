import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        container: {
          select: {
            name: true,
            type: true,
            city: true,
            state: true,
            capacity: true,
            weightLimit: true,
            pricePerDay: true,
            location: true,
          },
        },
        lsp: {
          select: {
            companyName: true,
            city: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json(booking);
  } catch (err) {
    console.error("[Booking GET by ID]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
