"use client";

import { useState } from "react";
import Link from "next/link";

type BookingOnContainer = {
  id: string;
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  createdAt: string;
};

type Container = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  weightLimit: number;
  city: string;
  state: string;
  pricePerDay: number;
  isAvailable: boolean;
  description?: string;
  createdAt: string;
  bookings: BookingOnContainer[];
};

type LSP = {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  gstNumber: string;
  panNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  vehicleTypes: string;
  capacity: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionNote?: string;
  createdAt: string;
  containers: Container[];
};

const TYPE_ICONS: Record<string, string> = {
  SMALL: "📦", MEDIUM: "🗃️", LARGE: "🏭", REEFER: "❄️", HAZMAT: "⚠️",
};
const TYPE_LABELS: Record<string, string> = {
  SMALL: "Small", MEDIUM: "Medium", LARGE: "Large", REEFER: "Reefer (Cold)", HAZMAT: "Hazmat",
};

const STATUS_CONFIG = {
  PENDING:   { label: "Under Review",  color: "badge-pending",  icon: "⏳", desc: "Your application is being reviewed by the admin. You will be notified within 48 hours." },
  APPROVED:  { label: "Approved",      color: "badge-approved", icon: "✅", desc: "Your LSP registration is approved. You can now list containers and receive bookings." },
  REJECTED:  { label: "Rejected",      color: "badge-rejected", icon: "❌", desc: "Your application was not approved. See the note below for details." },
};

const BOOKING_STATUS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pending",   color: "badge-pending"  },
  CONFIRMED: { label: "Confirmed", color: "badge-approved" },
  CANCELLED: { label: "Cancelled", color: "badge-rejected" },
  COMPLETED: { label: "Completed", color: "badge-info"     },
};
const PAY_STATUS: Record<string, { label: string; color: string }> = {
  UNPAID:   { label: "Unpaid",   color: "badge-unpaid" },
  PAID:     { label: "Paid",     color: "badge-paid"   },
  REFUNDED: { label: "Refunded", color: "badge-info"   },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function getDays(start: string, end: string) {
  return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
}

export default function LSPDashboardPage() {
  const [email, setEmail] = useState("");
  const [lsp, setLsp] = useState<LSP | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [expandedContainer, setExpandedContainer] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);
    setLsp(null);
    try {
      const res = await fetch(`/api/lsp/status?email=${encodeURIComponent(trimmed)}`);
      if (res.status === 404) {
        setLsp(null);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch LSP data");
      const data = await res.json();
      setLsp(data);
    } catch {
      setError("Could not load your LSP data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Aggregate stats
  const totalContainers = lsp?.containers.length ?? 0;
  const totalBookings = lsp?.containers.reduce((s, c) => s + c.bookings.length, 0) ?? 0;
  const totalRevenue = lsp?.containers.reduce(
    (s, c) => s + c.bookings.filter((b) => b.paymentStatus === "PAID").reduce((ss, b) => ss + b.totalAmount, 0),
    0
  ) ?? 0;
  const pendingBookings = lsp?.containers.reduce(
    (s, c) => s + c.bookings.filter((b) => b.status === "PENDING").length,
    0
  ) ?? 0;

  const sc = lsp ? STATUS_CONFIG[lsp.status] : null;
  let vehicleTypes: string[] = [];
  if (lsp?.vehicleTypes) {
    try { vehicleTypes = JSON.parse(lsp.vehicleTypes); } catch { vehicleTypes = [lsp.vehicleTypes]; }
  }

  return (
    <div className="section">
      <div className="container-page" style={{ maxWidth: 960 }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>🏢 LSP Dashboard</h1>
          <p style={{ color: "var(--text-3)" }}>
            View your registration status, containers, and incoming bookings.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch}>
          <div
            className="card"
            style={{
              padding: "1.5rem",
              marginBottom: "2rem",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div className="form-group" style={{ flex: 1, minWidth: 240 }}>
              <label className="form-label">Registered Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="your@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: 160 }}
            >
              {loading ? "Loading…" : "🔍 View Dashboard"}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>⚠ {error}</div>
        )}

        {/* Not found */}
        {searched && !loading && !lsp && !error && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p style={{ marginBottom: "0.5rem" }}>No LSP registration found for</p>
            <p style={{ fontWeight: 600, color: "var(--text-2)" }}>{email}</p>
            <Link href="/lsp/register" className="btn btn-primary btn-sm" style={{ marginTop: "1.5rem" }}>
              Register as LSP →
            </Link>
          </div>
        )}

        {/* Dashboard */}
        {lsp && sc && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Registration Status Banner */}
            <div
              className="card"
              style={{
                padding: "1.5rem",
                background: lsp.status === "APPROVED"
                  ? "rgba(16,185,129,0.06)"
                  : lsp.status === "REJECTED"
                  ? "rgba(239,68,68,0.06)"
                  : "rgba(245,158,11,0.06)",
                borderColor: lsp.status === "APPROVED"
                  ? "rgba(16,185,129,0.25)"
                  : lsp.status === "REJECTED"
                  ? "rgba(239,68,68,0.25)"
                  : "rgba(245,158,11,0.25)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{sc.icon}</span>
                    <h2 style={{ fontSize: "1.2rem" }}>{lsp.companyName}</h2>
                    <span className={`badge ${sc.color}`}>{sc.label}</span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-3)", maxWidth: 520 }}>{sc.desc}</p>
                  {lsp.status === "REJECTED" && lsp.rejectionNote && (
                    <div className="alert alert-error" style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
                      <strong>Reason:</strong> {lsp.rejectionNote}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-3)", textAlign: "right" }}>
                  <div>Registered on</div>
                  <div style={{ fontWeight: 600, color: "var(--text-2)" }}>{formatDate(lsp.createdAt)}</div>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: "0.72rem" }}>ID: {lsp.id.slice(0, 16)}…</div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            {lsp.status === "APPROVED" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                {[
                  { label: "Containers Listed", value: totalContainers, icon: "📦" },
                  { label: "Total Bookings", value: totalBookings, icon: "📋" },
                  { label: "Pending Bookings", value: pendingBookings, icon: "⏳" },
                  { label: "Revenue Earned", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💰" },
                ].map((s) => (
                  <div key={s.label} className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--gold-light)" }}>{s.value}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Company Details */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "1.25rem" }}>📄 Registration Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", fontSize: "0.875rem" }}>
                {[
                  { label: "Owner / Director", value: lsp.ownerName },
                  { label: "Phone", value: lsp.phone },
                  { label: "Email", value: lsp.email },
                  { label: "GST Number", value: lsp.gstNumber },
                  { label: "PAN Number", value: lsp.panNumber },
                  { label: "City", value: lsp.city },
                  { label: "State", value: lsp.state },
                  { label: "PIN Code", value: lsp.pincode },
                  { label: "Fleet Capacity", value: `${lsp.capacity} tonnes` },
                ].map((r) => (
                  <div key={r.label}>
                    <div style={{ color: "var(--text-3)", fontSize: "0.78rem", marginBottom: 2 }}>{r.label}</div>
                    <div style={{ fontWeight: 600, color: "var(--text-1)" }}>{r.value}</div>
                  </div>
                ))}
                <div>
                  <div style={{ color: "var(--text-3)", fontSize: "0.78rem", marginBottom: 2 }}>Vehicle Types</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: 4 }}>
                    {vehicleTypes.map((v) => (
                      <span key={v} className="badge badge-info" style={{ fontSize: "0.7rem" }}>{v}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Containers & Bookings */}
            {lsp.status === "APPROVED" && (
              <div>
                <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
                  📦 Your Containers {totalContainers > 0 && `(${totalContainers})`}
                </h3>

                {totalContainers === 0 ? (
                  <div className="card" style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-3)" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📭</div>
                    <p>No containers listed yet.</p>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                      Contact admin to add containers to your account.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {lsp.containers.map((c) => {
                      const isExpanded = expandedContainer === c.id;
                      return (
                        <div key={c.id} className="card" style={{ padding: "1.5rem" }}>
                          {/* Container header */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "0.75rem",
                              cursor: "pointer",
                            }}
                            onClick={() => setExpandedContainer(isExpanded ? null : c.id)}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <span style={{ fontSize: "1.5rem" }}>{TYPE_ICONS[c.type] ?? "📦"}</span>
                              <div>
                                <div style={{ fontWeight: 700 }}>{c.name}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>
                                  {TYPE_LABELS[c.type]} · {c.city}, {c.state} · ₹{c.pricePerDay.toLocaleString("en-IN")}/day
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <span className={`badge ${c.isAvailable ? "badge-approved" : "badge-pending"}`}>
                                {c.isAvailable ? "Available" : "Booked"}
                              </span>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>
                                {c.bookings.length} booking{c.bookings.length !== 1 ? "s" : ""}
                              </span>
                              <span style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>
                                {isExpanded ? "▲" : "▼"}
                              </span>
                            </div>
                          </div>

                          {/* Bookings list */}
                          {isExpanded && (
                            <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
                              {c.bookings.length === 0 ? (
                                <p style={{ color: "var(--text-3)", fontSize: "0.875rem", textAlign: "center", padding: "1rem 0" }}>
                                  No bookings on this container yet.
                                </p>
                              ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                  <div style={{ fontSize: "0.8rem", color: "var(--text-3)", fontWeight: 600, marginBottom: "0.25rem" }}>
                                    BOOKINGS
                                  </div>
                                  {c.bookings.map((b) => {
                                    const days = getDays(b.startDate, b.endDate);
                                    const bs = BOOKING_STATUS[b.status];
                                    const ps = PAY_STATUS[b.paymentStatus];
                                    return (
                                      <div
                                        key={b.id}
                                        style={{
                                          background: "rgba(255,255,255,0.02)",
                                          border: "1px solid var(--border)",
                                          borderRadius: 8,
                                          padding: "1rem",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "flex-start",
                                          flexWrap: "wrap",
                                          gap: "0.75rem",
                                        }}
                                      >
                                        <div>
                                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{b.bookerName}</div>
                                          <div style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 2 }}>
                                            {b.bookerEmail} · {b.bookerPhone}
                                          </div>
                                          <div style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 4 }}>
                                            {formatDate(b.startDate)} → {formatDate(b.endDate)} ({days} day{days !== 1 ? "s" : ""})
                                          </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                          <div style={{ fontWeight: 800, color: "var(--gold-light)", fontSize: "1rem", marginBottom: 6 }}>
                                            ₹{b.totalAmount.toLocaleString("en-IN")}
                                          </div>
                                          <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                                            <span className={`badge ${bs.color}`} style={{ fontSize: "0.68rem" }}>{bs.label}</span>
                                            <span className={`badge ${ps.color}`} style={{ fontSize: "0.68rem" }}>{ps.label}</span>
                                          </div>
                                          <div style={{ fontSize: "0.7rem", color: "var(--text-3)", marginTop: 4 }}>
                                            {formatDate(b.createdAt)}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Pending state guidance */}
            {lsp.status === "PENDING" && (
              <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⏳</div>
                <h3 style={{ marginBottom: "0.5rem" }}>Application Under Review</h3>
                <p style={{ color: "var(--text-3)", maxWidth: 420, margin: "0 auto" }}>
                  Our team is reviewing your application. Once approved, you will be able to list containers and start receiving bookings.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
