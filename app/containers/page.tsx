"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  lsp: { companyName: string; city: string };
};

const TYPE_ICONS: Record<string, string> = {
  SMALL: "📦", MEDIUM: "🗃️", LARGE: "🏭", REEFER: "❄️", HAZMAT: "⚠️",
};
const TYPE_LABELS: Record<string, string> = {
  SMALL: "Small", MEDIUM: "Medium", LARGE: "Large", REEFER: "Reefer (Cold)", HAZMAT: "Hazmat",
};

const MOCK_CONTAINERS: Container[] = [
  { id: "c1", name: "Standard 20ft Container", type: "MEDIUM", capacity: 33, weightLimit: 28000, city: "Mumbai", state: "Maharashtra", pricePerDay: 2500, isAvailable: true, description: "Clean, weather-proof 20ft container in the JNPT logistics zone.", lsp: { companyName: "Bharat Freight Co.", city: "Mumbai" } },
  { id: "c2", name: "Reefer 40ft Cold Storage", type: "REEFER", capacity: 67, weightLimit: 26000, city: "Delhi", state: "Delhi", pricePerDay: 5800, isAvailable: true, description: "Temperature-controlled (-18°C to +20°C) for perishables and pharma.", lsp: { companyName: "ColdChain India Pvt. Ltd.", city: "Delhi" } },
  { id: "c3", name: "Bulk Cargo 40ft HC", type: "LARGE", capacity: 76, weightLimit: 30000, city: "Chennai", state: "Tamil Nadu", pricePerDay: 3200, isAvailable: true, description: "High-cube container for bulk commodities near Chennai port.", lsp: { companyName: "Southern Cargo Hub", city: "Chennai" } },
  { id: "c4", name: "Mini Storage Unit", type: "SMALL", capacity: 14, weightLimit: 10000, city: "Bengaluru", state: "Karnataka", pricePerDay: 1200, isAvailable: true, description: "Compact container ideal for small-batch e-commerce warehousing.", lsp: { companyName: "SwiftStore Logistics", city: "Bengaluru" } },
  { id: "c5", name: "Hazmat Class A Container", type: "HAZMAT", capacity: 33, weightLimit: 20000, city: "Surat", state: "Gujarat", pricePerDay: 6500, isAvailable: false, description: "UN-certified container for Class A hazardous materials.", lsp: { companyName: "SafeHaul Chemicals", city: "Surat" } },
  { id: "c6", name: "Heavy Duty 40ft", type: "LARGE", capacity: 67, weightLimit: 32000, city: "Kolkata", state: "West Bengal", pricePerDay: 3800, isAvailable: true, description: "Reinforced steel container for heavy industrial equipment.", lsp: { companyName: "Kolkata Cargo Services", city: "Kolkata" } },
];

export default function ContainersPage() {
  const [containers, setContainers] = useState<Container[]>(MOCK_CONTAINERS);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ type: "", city: "", available: "" });

  useEffect(() => {
    const fetchContainers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter.type) params.set("type", filter.type);
        if (filter.city) params.set("city", filter.city);
        if (filter.available) params.set("available", filter.available);

        const res = await fetch(`/api/containers?${params}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setContainers(data);
        }
      } catch {
        // keep mock data
      } finally {
        setLoading(false);
      }
    };
    fetchContainers();
  }, [filter]);

  const displayed = containers.filter((c) => {
    if (filter.type && c.type !== filter.type) return false;
    if (filter.city && !c.city.toLowerCase().includes(filter.city.toLowerCase())) return false;
    if (filter.available === "true" && !c.isAvailable) return false;
    return true;
  });

  return (
    <div className="section">
      <div className="container-page">
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>Available Containers</h1>
          <p>Browse verified container spaces from approved LSPs across India.</p>
        </div>

        {/* Filters */}
        <div
          className="card"
          style={{
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div className="form-group" style={{ flex: "1", minWidth: 160 }}>
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={filter.type}
              onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="">All Types</option>
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: "1", minWidth: 160 }}>
            <label className="form-label">City</label>
            <input
              className="form-input"
              placeholder="e.g. Mumbai"
              value={filter.city}
              onChange={(e) => setFilter((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <div className="form-group" style={{ flex: "1", minWidth: 160 }}>
            <label className="form-label">Availability</label>
            <select
              className="form-select"
              value={filter.available}
              onChange={(e) => setFilter((f) => ({ ...f, available: e.target.value }))}
            >
              <option value="">All</option>
              <option value="true">Available Only</option>
            </select>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFilter({ type: "", city: "", available: "" })}
          >
            Clear Filters
          </button>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: "1.5rem", color: "var(--text-3)", fontSize: "0.875rem" }}>
          {loading ? "Loading…" : `${displayed.length} container${displayed.length !== 1 ? "s" : ""} found`}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 280, borderRadius: 12 }} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
            <p>No containers match your filters.</p>
          </div>
        ) : (
          <div className="grid-3">
            {displayed.map((c) => (
              <div key={c.id} className="card animate-fade-up" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.8rem" }}>{TYPE_ICONS[c.type] ?? "📦"}</span>
                  <span className={`badge ${c.isAvailable ? "badge-approved" : "badge-rejected"}`}>
                    {c.isAvailable ? "Available" : "Booked"}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.2rem" }}>{c.name}</h3>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>
                    {c.lsp.companyName}
                  </div>
                </div>

                {c.description && (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-3)", lineHeight: 1.5 }}>
                    {c.description}
                  </p>
                )}

                {/* Specs */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    padding: "0.75rem",
                    fontSize: "0.8rem",
                  }}
                >
                  <div>
                    <div style={{ color: "var(--text-3)" }}>Capacity</div>
                    <div style={{ fontWeight: 600, color: "var(--text-1)" }}>{c.capacity} m³</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-3)" }}>Max Weight</div>
                    <div style={{ fontWeight: 600, color: "var(--text-1)" }}>{(c.weightLimit / 1000).toFixed(1)}T</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-3)" }}>Location</div>
                    <div style={{ fontWeight: 600, color: "var(--text-1)" }}>{c.city}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-3)" }}>Type</div>
                    <div style={{ fontWeight: 600, color: "var(--text-1)" }}>{TYPE_LABELS[c.type]}</div>
                  </div>
                </div>

                {/* Price + CTA */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--gold-light)" }}>
                      ₹{c.pricePerDay.toLocaleString("en-IN")}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-3)" }}> / day</span>
                  </div>
                  {c.isAvailable ? (
                    <Link href={`/book/${c.id}`} className="btn btn-primary btn-sm">
                      Book Now →
                    </Link>
                  ) : (
                    <span className="btn btn-ghost btn-sm" style={{ cursor: "default", opacity: 0.5 }}>Unavailable</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
