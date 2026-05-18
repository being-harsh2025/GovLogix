import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { containerId, bookerName, bookerEmail, bookerPhone, startDate, endDate } = body;

    const container = await prisma.container.findUnique({ where: { id: containerId } });
    if (!container) return Response.json({ error: "Container not found" }, { status: 404 });
    if (!container.isAvailable) return Response.json({ error: "Container not available" }, { status: 409 });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 1) return Response.json({ error: "Invalid date range" }, { status: 400 });

    const totalAmount = days * container.pricePerDay;

    const booking = await prisma.booking.create({
      data: {
        containerId,
        lspId: container.lspId,
        bookerName,
        bookerEmail,
        bookerPhone,
        startDate: start,
        endDate: end,
        totalAmount,
        status: "PENDING",
        paymentStatus: "UNPAID",
      },
    });

    return Response.json(booking, { status: 201 });
  } catch (err) {
    console.error("[Bookings POST]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const email = new URL(request.url).searchParams.get("email");
  try {
    const bookings = await prisma.booking.findMany({
      where: email ? { bookerEmail: email } : {},
      include: { container: { select: { name: true, type: true, city: true } } },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(bookings);
  } catch (err) {
    console.error("[Bookings GET]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
