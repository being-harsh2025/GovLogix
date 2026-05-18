"use client";

import { useEffect, useState } from "react";

type LSP = {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  gstNumber: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  city: string;
  state: string;
  createdAt: string;
};

export default function AdminPage() {
  const [lsps, setLsps] = useState<LSP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLSPs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lsp/register");
      if (!res.ok) throw new Error("Failed to fetch LSPs");
      const data = await res.json();
      setLsps(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLSPs();
  }, []);

  const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/admin/lsp/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`Failed to mark as ${status}`);
      // Refresh list
      fetchLSPs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="section container-page" style={{ textAlign: "center" }}>Loading Admin Dashboard...</div>;
  }

  return (
    <div className="section">
      <div className="container-page">
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }} className="flex-col-mobile">
          <div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Admin Dashboard</h1>
            <p>Review and approve Logistics Service Provider applications.</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline w-full-mobile" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
            Logout
          </button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>⚠ {error}</div>}

        <div className="card" style={{ padding: "1.5rem", overflowX: "hidden" }}>
          {lsps.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-3)" }}>
              No LSPs registered yet.
            </div>
          ) : (
            <table className="responsive-table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-3)", fontSize: "0.85rem" }}>
                  <th style={{ padding: "1rem 0.5rem" }}>Company / Owner</th>
                  <th style={{ padding: "1rem 0.5rem" }}>Location</th>
                  <th style={{ padding: "1rem 0.5rem" }}>Contact</th>
                  <th style={{ padding: "1rem 0.5rem" }}>GST</th>
                  <th style={{ padding: "1rem 0.5rem" }}>Status</th>
                  <th style={{ padding: "1rem 0.5rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lsps.map((lsp) => (
                  <tr key={lsp.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td data-label="Company / Owner" style={{ padding: "1rem 0.5rem" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{lsp.companyName}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>{lsp.ownerName}</div>
                      </div>
                    </td>
                    <td data-label="Location" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem" }}>
                      <div>{lsp.city}, {lsp.state}</div>
                    </td>
                    <td data-label="Contact" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem" }}>
                      <div>
                        <div>{lsp.phone}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>{lsp.email}</div>
                      </div>
                    </td>
                    <td data-label="GST" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", fontFamily: "var(--font-mono)" }}>
                      <div>{lsp.gstNumber}</div>
                    </td>
                    <td data-label="Status" style={{ padding: "1rem 0.5rem" }}>
                      <div>
                        <span className={`badge badge-${lsp.status.toLowerCase()}`}>
                          {lsp.status}
                        </span>
                      </div>
                    </td>
                    <td data-label="Actions" style={{ padding: "1rem 0.5rem", textAlign: "right" }}>
                      {lsp.status === "PENDING" && (
                        <div className="action-buttons" style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleStatusUpdate(lsp.id, "APPROVED")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleStatusUpdate(lsp.id, "REJECTED")}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {lsp.status !== "PENDING" && (
                        <span style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
