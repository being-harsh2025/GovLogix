"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/* ─── Types ──────────────────────────────────────────── */
type Step = 1 | 2 | 3 | 4;

interface FormData {
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
  vehicleTypes: string[];
  capacity: string;
}

const VEHICLE_OPTIONS = [
  "Truck",
  "Container Truck",
  "Mini Truck",
  "Tempo",
  "Flatbed",
  "Refrigerated",
  "Tanker",
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman & Nicobar",
  "Lakshadweep",
  "Dadra & Nagar Haveli",
];

const STEPS = ["Company Info", "Legal Details", "Address", "Fleet Details"];

/* ─── Component ──────────────────────────────────────── */
export default function LSPRegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [refId, setRefId] = useState("");

  const [form, setForm] = useState<FormData>({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    gstNumber: "",
    panNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    vehicleTypes: [],
    capacity: "",
  });

  const set = (field: keyof FormData, val: string) =>
    setForm((f) => ({ ...f, [field]: val }));

  const toggleVehicle = (v: string) =>
    setForm((f) => ({
      ...f,
      vehicleTypes: f.vehicleTypes.includes(v)
        ? f.vehicleTypes.filter((x) => x !== v)
        : [...f.vehicleTypes, v],
    }));

  const nextStep = () => {
    setError("");
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 4) as Step);
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const validateStep = () => {
    if (step === 1) {
      if (!form.companyName.trim()) {
        setError("Company name is required");
        return false;
      }
      if (!form.ownerName.trim()) {
        setError("Owner name is required");
        return false;
      }
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
        setError("Valid email is required");
        return false;
      }
      if (!form.phone.trim() || form.phone.length < 10) {
        setError("Valid 10-digit phone is required");
        return false;
      }
    }
    if (step === 2) {
      if (!form.gstNumber.trim() || form.gstNumber.length !== 15) {
        setError("Valid 15-character GST number is required");
        return false;
      }
      if (!form.panNumber.trim() || form.panNumber.length !== 10) {
        setError("Valid 10-character PAN is required");
        return false;
      }
    }
    if (step === 3) {
      if (!form.address.trim()) {
        setError("Address is required");
        return false;
      }
      if (!form.city.trim()) {
        setError("City is required");
        return false;
      }
      if (!form.state) {
        setError("State is required");
        return false;
      }
      if (!form.pincode.trim() || form.pincode.length !== 6) {
        setError("Valid 6-digit PIN code is required");
        return false;
      }
    }
    if (step === 4) {
      if (form.vehicleTypes.length === 0) {
        setError("Select at least one vehicle type");
        return false;
      }
      if (!form.capacity || parseInt(form.capacity) < 1) {
        setError("Enter a valid capacity");
        return false;
      }
    }
    return true;
  };

  const submit = () => {
    setError("");
    if (!validateStep()) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/lsp/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            vehicleTypes: JSON.stringify(form.vehicleTypes),
            capacity: parseInt(form.capacity),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");
        setRefId(data.id);
        setSuccess(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        // Never show raw DB/internal errors to the user
        setError(
          msg.includes("Database not configured") || msg.includes("URL_INVALID") || msg.includes("TURSO")
            ? "Service temporarily unavailable. Please try again later."
            : msg
        );
      }
    });
  };

  /* ── Success Screen ── */
  if (success) {
    return (
      <div
        className="section container-page"
        style={{ maxWidth: 560, textAlign: "center" }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
        <h2 style={{ marginBottom: "0.5rem" }}>Application Submitted!</h2>
        <p style={{ marginBottom: "1.5rem" }}>
          Your LSP registration is under review. You&apos;ll receive a decision
          within 48 hours on <strong>{form.email}</strong>.
        </p>
        <div
          className="card"
          style={{
            padding: "1.25rem",
            marginBottom: "1.5rem",
            background: "rgba(16,185,129,0.06)",
            borderColor: "rgba(16,185,129,0.2)",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-3)",
              marginBottom: "0.25rem",
            }}
          >
            Reference ID
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: "var(--gold-light)",
              fontSize: "1.1rem",
            }}
          >
            {refId}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-page" style={{ maxWidth: 680 }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            LSP Registration
          </h1>
          <p>
            Register your company as a Logistics Service Provider on GovLogix.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="steps">
          {STEPS.map((label, i) => {
            const num = (i + 1) as Step;
            const isDone = step > num;
            const isActive = step === num;
            return (
              <div
                key={label}
                className="step-item"
                style={{ flex: i < STEPS.length - 1 ? "1" : "0" }}
              >
                <div
                  className={`step-num ${isDone ? "done" : isActive ? "active" : ""}`}
                >
                  {isDone ? "✓" : num}
                </div>
                <span className={`step-label ${isActive ? "active" : ""}`}>
                  {label}
                </span>
                {i < STEPS.length - 1 && <div className="step-connector" />}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
            ⚠ {error}
            {error.includes("Database credentials") && (
              <div style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
                <p>
                  🔧 <strong>Setup Required:</strong> The database needs to be
                  configured.
                </p>
                <a
                  href="/setup"
                  style={{ color: "var(--blue-light)", fontWeight: 500 }}
                >
                  → View Setup Instructions →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Form Card */}
        <div className="card" style={{ padding: "2rem" }}>
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <h3>Company Information</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    className="form-input"
                    value={form.companyName}
                    onChange={(e) => set("companyName", e.target.value)}
                    placeholder="Sharma Logistics Pvt. Ltd."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Owner / Director Name *</label>
                  <input
                    className="form-input"
                    value={form.ownerName}
                    onChange={(e) => set("ownerName", e.target.value)}
                    placeholder="Rajesh Sharma"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    className="form-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="contact@company.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    className="form-input"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Legal Details */}
          {step === 2 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <h3>Legal & Tax Details</h3>
              <div className="form-group">
                <label className="form-label">
                  GST Number (15 characters) *
                </label>
                <input
                  className="form-input"
                  style={{
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                  value={form.gstNumber}
                  onChange={(e) =>
                    set("gstNumber", e.target.value.toUpperCase())
                  }
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  PAN Number (10 characters) *
                </label>
                <input
                  className="form-input"
                  style={{
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                  value={form.panNumber}
                  onChange={(e) =>
                    set("panNumber", e.target.value.toUpperCase())
                  }
                  placeholder="AAAAA0000A"
                  maxLength={10}
                />
              </div>
              <div className="alert alert-info" style={{ fontSize: "0.82rem" }}>
                ℹ These details will be verified against government records.
                Ensure accuracy to avoid delays.
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <h3>Registered Address</h3>
              <div className="form-group">
                <label className="form-label">Full Address *</label>
                <textarea
                  className="form-textarea"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Building, Street, Area"
                  style={{ minHeight: 80 }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    className="form-input"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Mumbai"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input
                    className="form-input"
                    type="number"
                    value={form.pincode}
                    onChange={(e) => set("pincode", e.target.value)}
                    placeholder="400001"
                    maxLength={6}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <select
                  className="form-select"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                >
                  <option value="">— Select State —</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Fleet */}
          {step === 4 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <h3>Fleet &amp; Capacity</h3>
              <div className="form-group">
                <label className="form-label">
                  Vehicle Types Available * (select all that apply)
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.6rem",
                    marginTop: "0.4rem",
                  }}
                >
                  {VEHICLE_OPTIONS.map((v) => {
                    const sel = form.vehicleTypes.includes(v);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => toggleVehicle(v)}
                        className="btn btn-sm"
                        style={{
                          background: sel
                            ? "rgba(26,86,219,0.2)"
                            : "rgba(255,255,255,0.04)",
                          border: sel
                            ? "1px solid rgba(59,130,246,0.6)"
                            : "1px solid rgba(255,255,255,0.08)",
                          color: sel ? "var(--blue-light)" : "var(--text-2)",
                          fontWeight: sel ? 600 : 400,
                        }}
                      >
                        {sel ? "✓ " : ""}
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Total Fleet Capacity (in tonnes) *
                </label>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => set("capacity", e.target.value)}
                  placeholder="e.g. 500"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2rem",
              gap: "1rem",
            }}
          >
            <button
              type="button"
              className="btn btn-ghost"
              onClick={prevStep}
              disabled={step === 1}
            >
              ← Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={submit}
                disabled={isPending}
              >
                {isPending ? "Submitting…" : "Submit Application ✓"}
              </button>
            )}
          </div>
        </div>

        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--text-3)",
            textAlign: "center",
            marginTop: "1.5rem",
          }}
        >
          Already registered?{" "}
          <a href="/admin" style={{ color: "var(--blue-light)" }}>
            Check status in Admin Portal
          </a>
        </p>
      </div>
    </div>
  );
}
