"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/",            label: "Home"        },
  { href: "/lsp/register",label: "Register LSP" },
  { href: "/containers",  label: "Containers"   },
  { href: "/chat",        label: "Chat"         },
  { href: "/admin",       label: "Admin Panel"  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        background: "rgba(10,22,40,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <nav
        className="container-page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #1a56db 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#fff",
              boxShadow: "0 4px 12px rgba(26,86,219,0.4)",
            }}
          >
            G
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            Gov<span style={{ color: "var(--blue-light)" }}>Logix</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul
          style={{
            listStyle: "none",
          }}
          className="hidden md:flex items-center gap-1"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    padding: "0.4rem 0.85rem",
                    borderRadius: 8,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: active ? "var(--text-1)" : "var(--text-3)",
                    background: active ? "rgba(59,130,246,0.12)" : "transparent",
                    border: active ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent",
                    transition: "all 0.15s",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex gap-3">
          <Link href="/lsp/register" className="btn btn-primary btn-sm">
            Register as LSP
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden btn btn-ghost btn-sm"
          aria-label="Toggle menu"
          style={{ padding: "0.4rem 0.6rem" }}
        >
          <span style={{ fontSize: "1.2rem" }}>{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div
          style={{
            background: "rgba(10,22,40,0.97)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 8,
                color: pathname === link.href ? "var(--blue-light)" : "var(--text-2)",
                fontWeight: 500,
                fontSize: "0.95rem",
                background: pathname === link.href ? "rgba(59,130,246,0.08)" : "transparent",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
