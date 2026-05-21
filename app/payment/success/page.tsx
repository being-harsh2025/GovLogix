"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const isDemo = searchParams.get("demo") === "true";

  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div
      className="section"
      style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}
    >
      <div
        className="container-page"
        style={{ maxWidth: 560, textAlign: "center", margin: "0 auto" }}
      >
        {/* Success icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(16,185,129,0.15)",
            border: "2px solid rgba(16,185,129,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            margin: "0 auto 1.5rem",
          }}
        >
          ✅
        </div>

        <h1 style={{ marginBottom: "0.75rem", color: "#34d399" }}>Payment Successful!</h1>
        <p style={{ marginBottom: "0.5rem", color: "var(--text-2)" }}>
          Your booking has been confirmed. You will receive a confirmation on your registered email.
        </p>

        {isDemo && (
          <div className="alert alert-info" style={{ margin: "1rem 0", textAlign: "left" }}>
            ℹ️ This was a demo booking. In production, Stripe will process the real payment.
          </div>
        )}

        {bookingId && (
          <div
            className="card"
            style={{
              padding: "1.25rem",
              margin: "1.5rem 0",
              background: "rgba(16,185,129,0.05)",
              borderColor: "rgba(16,185,129,0.2)",
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
            <Link href={`/booking/${bookingId}`} className="btn btn-primary">
              View Booking Details →
            </Link>
          )}
          <Link href="/my-bookings" className="btn btn-ghost">
            My Bookings
          </Link>
          <Link href="/containers" className="btn btn-ghost">
            Browse More
          </Link>
        </div>

        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.8rem",
            color: "var(--text-3)",
          }}
        >
          Need help? Contact support at{" "}
          <a href="mailto:support@govlogix.in" style={{ color: "var(--blue-light)" }}>
            support@govlogix.in
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="section" style={{ textAlign: "center" }}>Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
