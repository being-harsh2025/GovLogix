"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function CancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  return (
    <div
      className="section"
      style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}
    >
      <div
        className="container-page"
        style={{ maxWidth: 520, textAlign: "center", margin: "0 auto" }}
      >
        {/* Cancel icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(245,158,11,0.12)",
            border: "2px solid rgba(245,158,11,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            margin: "0 auto 1.5rem",
          }}
        >
          ⚠️
        </div>

        <h1 style={{ marginBottom: "0.75rem" }}>Payment Cancelled</h1>
        <p style={{ marginBottom: "1rem", color: "var(--text-2)" }}>
          Your payment was not completed. Your booking is still reserved — you can retry payment at any time.
        </p>

        {bookingId && (
          <div
            className="card"
            style={{
              padding: "1.25rem",
              margin: "1.5rem 0",
              background: "rgba(245,158,11,0.04)",
              borderColor: "rgba(245,158,11,0.2)",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "var(--text-3)", marginBottom: 4 }}>
              Booking Reference
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                color: "var(--text-1)",
                wordBreak: "break-all",
              }}
            >
              {bookingId}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "1.5rem",
          }}
        >
          {bookingId && !bookingId.startsWith("DEMO-") && (
            <Link href={`/booking/${bookingId}`} className="btn btn-gold">
              Retry Payment →
            </Link>
          )}
          <Link href="/my-bookings" className="btn btn-ghost">
            My Bookings
          </Link>
          <Link href="/containers" className="btn btn-ghost">
            Browse Containers
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="section" style={{ textAlign: "center" }}>Loading…</div>}>
      <CancelContent />
    </Suspense>
  );
}
