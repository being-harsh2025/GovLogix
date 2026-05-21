"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Booking = {
  id: string;
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  stripeSession: string | null;
  createdAt: string;
  updatedAt: string;
  container: {
    name: string;
    type: string;
    city: string;
    state: string;
    capacity: number;
    weightLimit: number;
    pricePerDay: number;
    location: string;
  };
  lsp: { companyName: string; city: string; phone: string; email: string };
};

const TYPE_ICONS: Record<string, string> = {
  SMALL: "📦", MEDIUM: "🗃️", LARGE: "🏭", REEFER: "❄️", HAZMAT: "⚠️",
};
const TYPE_LABELS: Record<string, string> = {
  SMALL: "Small", MEDIUM: "Medium", LARGE: "Large", REEFER: "Reefer (Cold)", HAZMAT: "Hazmat",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
}
function formatDateTime(d: string) {
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function getDays(start: string, end: string) {
  return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
}

// Timeline steps derived from booking state
function getTimeline(booking: Booking) {
  const steps = [
    {
      key: "created",
      label: "Booking Created",
      desc: "Your booking request was submitted.",
      icon: "📝",
      done: true,
      time: booking.createdAt,
    },
    {
      key: "payment",
      label: "Payment",
      desc:
        booking.paymentStatus === "PAID"
          ? "Payment received successfully."
          : booking.paymentStatus === "REFUNDED"
          ? "Payment was refunded."
          : "Awaiting payment to confirm booking.",
      icon: booking.paymentStatus === "PAID" ? "✅" : booking.paymentStatus === "REFUNDED" ? "↩️" : "💳",
      done: booking.paymentStatus !== "UNPAID",
      active: booking.paymentStatus === "UNPAID" && booking.status !== "CANCELLED",
      time: booking.paymentStatus !== "UNPAID" ? booking.updatedAt : null,
    },
    {
      key: "confirmed",
      label: "Booking Confirmed",
      desc: "Container reserved and confirmed for your dates.",
      icon: "🎉",
      done: booking.status === "CONFIRMED" || booking.status === "COMPLETED",
      active: booking.paymentStatus === "PAID" && booking.status === "CONFIRMED",
      time: booking.status === "CONFIRMED" || booking.status === "COMPLETED" ? booking.updatedAt : null,
    },
    {
      key: "active",
      label: "Container In Use",
      desc: `Active from ${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}.`,
      icon: "🚛",
      done: booking.status === "COMPLETED",
      active: booking.status === "CONFIRMED" && new Date() >= new Date(booking.startDate),
      time: booking.status === "COMPLETED" ? booking.endDate : null,
    },
    {
      key: "completed",
      label: "Completed",
      desc: "Booking period ended.",
      icon: "🏁",
      done: booking.status === "COMPLETED",
      time: booking.status === "COMPLETED" ? booking.endDate : null,
    },
  ];

  // If cancelled, replace with a cancelled step
  if (booking.status === "CANCELLED") {
    return [
      steps[0],
      {
        key: "cancelled",
        label: "Booking Cancelled",
        desc: "This booking was cancelled.",
        icon: "❌",
        done: true,
        time: booking.updatedAt,
      },
    ];
  }

  return steps;
}

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        if (!res.ok) throw new Error("Booking not found");
        const data = await res.json();
        setBooking(data);
      } catch {
        setError("Booking not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handlePay = async () => {
    if (!booking) return;
    setPayLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL");
    } catch {
      alert("Payment initiation failed. Please try again.");
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container-page" style={{ maxWidth: 800 }}>
          <div className="skeleton" style={{ height: 40, width: 300, marginBottom: "2rem" }} />
          <div className="skeleton" style={{ height: 200, marginBottom: "1rem" }} />
          <div className="skeleton" style={{ height: 300 }} />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="section">
        <div className="container-page" style={{ maxWidth: 800, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <h2 style={{ marginBottom: "0.5rem" }}>Booking Not Found</h2>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-3)" }}>
            {error || "This booking ID does not exist."}
          </p>
          <Link href="/my-bookings" className="btn btn-primary">
            ← Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const days = getDays(booking.startDate, booking.endDate);
  const timeline = getTimeline(booking);

  const statusColors: Record<string, string> = {
    PENDING: "badge-pending",
    CONFIRMED: "badge-approved",
    CANCELLED: "badge-rejected",
    COMPLETED: "badge-info",
  };
  const payColors: Record<string, string> = {
    UNPAID: "badge-unpaid",
    PAID: "badge-paid",
    REFUNDED: "badge-info",
  };

  return (
    <div className="section">
      <div className="container-page" style={{ maxWidth: 860 }}>
        {/* Back link */}
        <Link
          href="/my-bookings"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-3)",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          ← Back to My Bookings
        </Link>

        {/* Page header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>Booking Details</h1>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "var(--text-3)",
              }}
            >
              ID: {booking.id}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className={`badge ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
            <span className={`badge ${payColors[booking.paymentStatus]}`}>
              {booking.paymentStatus}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Container info */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ marginBottom: "1.25rem", fontSize: "1rem" }}>
                {TYPE_ICONS[booking.container.type] ?? "📦"} Container
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  fontSize: "0.875rem",
                }}
              >
                <InfoRow label="Name" value={booking.container.name} />
                <InfoRow label="Type" value={TYPE_LABELS[booking.container.type] ?? booking.container.type} />
                <InfoRow label="Location" value={`${booking.container.city}, ${booking.container.state}`} />
                <InfoRow label="Capacity" value={`${booking.container.capacity} m³`} />
                <InfoRow label="Max Weight" value={`${(booking.container.weightLimit / 1000).toFixed(1)} T`} />
                <InfoRow label="Rate" value={`₹${booking.container.pricePerDay.toLocaleString("en-IN")} / day`} />
              </div>
            </div>

            {/* Booking dates & amount */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ marginBottom: "1.25rem", fontSize: "1rem" }}>📅 Booking Period</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  fontSize: "0.875rem",
                  marginBottom: "1.25rem",
                }}
              >
                <InfoRow label="Start Date" value={formatDate(booking.startDate)} />
                <InfoRow label="End Date" value={formatDate(booking.endDate)} />
                <InfoRow label="Duration" value={`${days} day${days !== 1 ? "s" : ""}`} />
                <InfoRow label="Booked On" value={formatDateTime(booking.createdAt)} />
              </div>
              <div
                style={{
                  background: "rgba(245,158,11,0.06)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: 8,
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600 }}>Total Amount</span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "var(--gold-light)",
                  }}
                >
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Booker info */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ marginBottom: "1.25rem", fontSize: "1rem" }}>👤 Booker Details</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  fontSize: "0.875rem",
                }}
              >
                <InfoRow label="Name" value={booking.bookerName} />
                <InfoRow label="Phone" value={booking.bookerPhone} />
                <InfoRow label="Email" value={booking.bookerEmail} span />
              </div>
            </div>

            {/* LSP info */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ marginBottom: "1.25rem", fontSize: "1rem" }}>🏢 Logistics Provider</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  fontSize: "0.875rem",
                }}
              >
                <InfoRow label="Company" value={booking.lsp.companyName} />
                <InfoRow label="City" value={booking.lsp.city} />
                <InfoRow label="Phone" value={booking.lsp.phone} />
                <InfoRow label="Email" value={booking.lsp.email} />
              </div>
            </div>
          </div>

          {/* Right column — Timeline + Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Pay Now CTA */}
            {booking.paymentStatus === "UNPAID" && booking.status !== "CANCELLED" && (
              <div
                className="card"
                style={{
                  padding: "1.5rem",
                  background: "rgba(245,158,11,0.06)",
                  borderColor: "rgba(245,158,11,0.25)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>💳</div>
                <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>Payment Pending</h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-3)",
                    marginBottom: "1.25rem",
                  }}
                >
                  Complete payment to confirm your booking.
                </p>
                <button
                  className="btn btn-gold"
                  style={{ width: "100%" }}
                  onClick={handlePay}
                  disabled={payLoading}
                >
                  {payLoading ? "Redirecting…" : "Pay ₹" + booking.totalAmount.toLocaleString("en-IN") + " →"}
                </button>
              </div>
            )}

            {/* Status Timeline */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ marginBottom: "1.5rem", fontSize: "1rem" }}>📍 Tracking Timeline</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {timeline.map((step, i) => (
                  <div key={step.key} style={{ display: "flex", gap: "1rem" }}>
                    {/* Connector line + dot */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          background: step.done
                            ? "rgba(16,185,129,0.15)"
                            : step.active
                            ? "rgba(245,158,11,0.15)"
                            : "rgba(255,255,255,0.04)",
                          border: step.done
                            ? "2px solid rgba(16,185,129,0.5)"
                            : step.active
                            ? "2px solid rgba(245,158,11,0.5)"
                            : "2px solid var(--border)",
                          flexShrink: 0,
                        }}
                      >
                        {step.icon}
                      </div>
                      {i < timeline.length - 1 && (
                        <div
                          style={{
                            width: 2,
                            flex: 1,
                            minHeight: 24,
                            background: step.done
                              ? "rgba(16,185,129,0.3)"
                              : "var(--border)",
                            margin: "4px 0",
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ paddingBottom: i < timeline.length - 1 ? "1.25rem" : 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: step.done
                            ? "var(--text-1)"
                            : step.active
                            ? "var(--gold-light)"
                            : "var(--text-3)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {step.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-3)",
                          lineHeight: 1.5,
                        }}
                      >
                        {step.desc}
                      </div>
                      {step.time && (
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-3)",
                            marginTop: "0.25rem",
                            opacity: 0.7,
                          }}
                        >
                          {formatDateTime(step.time)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stripe session ref */}
            {booking.stripeSession && (
              <div
                className="card"
                style={{ padding: "1rem 1.25rem", fontSize: "0.78rem" }}
              >
                <div style={{ color: "var(--text-3)", marginBottom: 4 }}>Stripe Session</div>
                <div
                  style={{
                    fontFamily: "monospace",
                    color: "var(--text-2)",
                    wordBreak: "break-all",
                  }}
                >
                  {booking.stripeSession}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div style={span ? { gridColumn: "1 / -1" } : {}}>
      <div style={{ color: "var(--text-3)", fontSize: "0.78rem", marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 600, color: "var(--text-1)" }}>{value}</div>
    </div>
  );
}
