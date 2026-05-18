import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" as any });

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { container: { select: { name: true, city: true } } },
    });

    if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });
    if (booking.paymentStatus === "PAID") return Response.json({ error: "Already paid" }, { status: 409 });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Container Booking — ${booking.container.name}`,
              description: `${booking.container.city} | ${new Date(booking.startDate).toLocaleDateString("en-IN")} – ${new Date(booking.endDate).toLocaleDateString("en-IN")}`,
            },
            unit_amount: Math.round(booking.totalAmount * 100), // paise
          },
          quantity: 1,
        },
      ],
      customer_email: booking.bookerEmail,
      metadata: { bookingId: booking.id },
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${baseUrl}/payment/cancel?booking_id=${booking.id}`,
    });

    // Store session reference
    await prisma.booking.update({
      where: { id: bookingId },
      data: { stripeSession: session.id },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[Checkout POST]", err);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
