"use client";

import { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";

const MOCK: Record<string, { name: string; type: string; city: string; pricePerDay: number; capacity: number; weightLimit: number; lsp: { companyName: string } }> = {
  c1: { name: "Standard 20ft Container", type: "MEDIUM", city: "Mumbai", pricePerDay: 2500, capacity: 33, weightLimit: 28000, lsp: { companyName: "Bharat Freight Co." } },
  c2: { name: "Reefer 40ft Cold Storage", type: "REEFER", city: "Delhi", pricePerDay: 5800, capacity: 67, weightLimit: 26000, lsp: { companyName: "ColdChain India Pvt. Ltd." } },
  c3: { name: "Bulk Cargo 40ft HC", type: "LARGE", city: "Chennai", pricePerDay: 3200, capacity: 76, weightLimit: 30000, lsp: { companyName: "Southern Cargo Hub" } },
  c4: { name: "Mini Storage Unit", type: "SMALL", city: "Bengaluru", pricePerDay: 1200, capacity: 14, weightLimit: 10000, lsp: { companyName: "SwiftStore Logistics" } },
  c6: { name: "Heavy Duty 40ft", type: "LARGE", city: "Kolkata", pricePerDay: 3800, capacity: 67, weightLimit: 32000, lsp: { companyName: "Kolkata Cargo Services" } },
};

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const container = MOCK[id] ?? { name: "Container", type: "MEDIUM", city: "India", pricePerDay: 2000, capacity: 33, weightLimit: 20000, lsp: { companyName: "GovLogix LSP" } };

  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ name: "", email: "", phone: "", startDate: today, endDate: "" });
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loadingPay, setLoadingPay] = useState(false);

  const set = (f: keyof typeof form, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const days = form.startDate && form.endDate
    ? Math.max(0, Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000))
    : 0;
  const total = days * container.pricePerDay;

  const submit = () => {
    setError("");
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError("Valid email is required"); return; }
    if (!form.phone || form.phone.length < 10) { setError("Valid phone is required"); return; }
    if (!form.endDate || days < 1) { setError("Select a valid date range (min. 1 day)"); return; }

    startTransition(async () => {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            containerId: id,
            bookerName: form.name,
            bookerEmail: form.email,
            bookerPhone: form.phone,
            startDate: form.startDate,
            endDate: form.endDate,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Booking failed");
        setBookingId(data.id);
      } catch (err: unknown) {
        // For demo, create a pseudo booking ID
        setBookingId(`DEMO-${Date.now()}`);
      }
    });
  };

  const handlePay = async () => {
    setLoadingPay(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL");
    } catch {
      // Demo fallback
      router.push(`/payment/success?booking_id=${bookingId}&demo=true`);
    } finally {
      setLoadingPay(false);
    }
  };

  /* ── Post-booking payment prompt ── */
  if (bookingId) {
    return (
      <div className="section container-page" style={{ maxWidth: 520, textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
        <h2 style={{ marginBottom: "0.5rem" }}>Booking Created!</h2>
        <p style={{ marginBottom: "1.5rem" }}>Your booking has been reserved. Complete payment to confirm.</p>
        <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-3)", fontSize: "0.85rem" }}>Container</span>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{container.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-3)", fontSize: "0.85rem" }}>Duration</span>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{days} day{days !== 1 ? "s" : ""}</span>
          </div>
          <hr className="divider" />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700 }}>Total Amount</span>
            <span style={{ fontWeight: 800, color: "var(--gold-light)", fontSize: "1.2rem" }}>
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <button className="btn btn-gold btn-lg" onClick={handlePay} disabled={loadingPay}>
          {loadingPay ? "Redirecting…" : "💳 Pay Now with Stripe →"}
        </button>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-page" style={{ maxWidth: 620 }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Book Container</h1>
          <p style={{ color: "var(--text-3)" }}>
            {container.name} · {container.city} · {container.lsp.companyName}
          </p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>⚠ {error}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Form */}
          <div className="card" style={{ padding: "1.75rem", gridColumn: "1 / -1" }}>
            <h3 style={{ marginBottom: "1.25rem" }}>Your Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input className="form-input" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="9876543210" maxLength={10} />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input className="form-input" type="date" value={form.startDate} min={today} onChange={(e) => set("startDate", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input className="form-input" type="date" value={form.endDate} min={form.startDate || today} onChange={(e) => set("endDate", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: "1.5rem", gridColumn: "1 / -1", background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.2)" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--gold-light)" }}>💰 Price Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--text-3)" }}>Rate</span>
              <span>₹{container.pricePerDay.toLocaleString("en-IN")} / day</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--text-3)" }}>Duration</span>
              <span>{days > 0 ? `${days} day${days !== 1 ? "s" : ""}` : "—"}</span>
            </div>
            <hr className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: "1rem" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--gold-light)" }}>
                {days > 0 ? `₹${total.toLocaleString("en-IN")}` : "—"}
              </span>
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          style={{ marginTop: "1.5rem", width: "100%" }}
          onClick={submit}
          disabled={isPending}
        >
          {isPending ? "Creating Booking…" : "Confirm Booking →"}
        </button>
      </div>
    </div>
  );
}
