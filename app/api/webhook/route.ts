import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { sendBookingConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key", { apiVersion: "2026-04-22.dahlia" as any });

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature")!;
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[Webhook] Signature verification failed", err);
    return new Response("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
        include: {
          container: { select: { name: true, city: true } },
        },
      });

      // Send booking confirmation email (non-blocking)
      try {
        await sendBookingConfirmationEmail(
          booking.bookerEmail,
          booking.bookerName,
          booking.id,
          booking.container.name,
          booking.container.city,
          booking.startDate.toISOString(),
          booking.endDate.toISOString(),
          booking.totalAmount
        );
      } catch (emailErr) {
        console.error("[Webhook] Booking confirmation email failed:", emailErr);
      }
    }
  }

  return Response.json({ received: true });
}
