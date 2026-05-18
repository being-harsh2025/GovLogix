import Link from "next/link";

const stats = [
  { value: "2,400+", label: "Registered LSPs" },
  { value: "18,000+", label: "Containers Available" },
  { value: "₹840Cr+", label: "Transactions Processed" },
  { value: "28", label: "States Covered" },
];

const features = [
  {
    icon: "🏢",
    title: "LSP Registration",
    desc: "Streamlined onboarding for Logistics Service Providers with government approval workflows.",
    href: "/lsp/register",
    cta: "Register Now",
  },
  {
    icon: "📦",
    title: "Container Listings",
    desc: "Browse available containers by type, capacity, location and book instantly.",
    href: "/containers",
    cta: "Browse Containers",
  },
  {
    icon: "💳",
    title: "Secure Payments",
    desc: "Integrated Stripe payment gateway with full audit trail and invoice generation.",
    href: "/containers",
    cta: "Book & Pay",
  },
  {
    icon: "💬",
    title: "Instant Messaging",
    desc: "Real-time communication between LSPs and logistics coordinators.",
    href: "/chat",
    cta: "Open Chat",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="hero-gradient"
        style={{ padding: "6rem 0 5rem" }}
      >
        <div className="container-page" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(26,86,219,0.12)",
              border: "1px solid rgba(26,86,219,0.3)",
              borderRadius: 9999,
              padding: "0.35rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--blue-light)",
              marginBottom: "1.5rem",
              letterSpacing: "0.04em",
              textAlign: "center",
              flexWrap: "wrap",
              lineHeight: 1.4,
            }}
          >
            🇮🇳 &nbsp;MINISTRY OF LOGISTICS &amp; SUPPLY CHAIN
          </div>

          <h1
            style={{
              background: "linear-gradient(135deg, #f9fafb 30%, #93c5fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "1.25rem",
            }}
          >
            India&apos;s Premier Government
            <br />
            Logistics Management Platform
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--text-2)",
              maxWidth: 560,
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            Register as an LSP, list container spaces, manage bookings, and
            connect with partners — all on one secure, government-grade platform.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/lsp/register" className="btn btn-primary btn-lg">
              Register as LSP →
            </Link>
            <Link href="/containers" className="btn btn-ghost btn-lg">
              Browse Containers
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: "var(--navy-mid)", padding: "2.5rem 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container-page">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "1rem",
              textAlign: "center",
            }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: "clamp(1.5rem,3vw,2rem)",
                    fontWeight: 800,
                    color: "var(--gold-light)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-3)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section">
        <div className="container-page">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2>Everything You Need in One Place</h2>
            <p style={{ marginTop: "0.75rem", maxWidth: 500, margin: "0.75rem auto 0" }}>
              From registration to payment, GovLogix covers the complete logistics lifecycle.
            </p>
          </div>

          <div className="grid-2">
            {features.map((f) => (
              <div key={f.title} className="card animate-fade-up" style={{ padding: "2rem" }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.9rem", marginBottom: "1.25rem" }}>{f.desc}</p>
                <Link href={f.href} className="btn btn-ghost btn-sm">
                  {f.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--blue) 0%, #1d4ed8 100%)",
          padding: "3.5rem 0",
          textAlign: "center",
        }}
      >
        <div className="container-page">
          <h2 style={{ color: "#fff", marginBottom: "0.75rem" }}>Ready to Join GovLogix?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
            Get your LSP registration approved in 48 hours and start listing containers immediately.
          </p>
          <Link href="/lsp/register" className="btn btn-gold btn-lg">
            Start Registration →
          </Link>
        </div>
      </section>
    </>
  );
}
