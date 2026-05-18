import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GovLogix — Government Logistics Management Platform",
  description:
    "Streamline LSP registration, container space allocation, bookings, and payments on India's premier government-grade logistics platform.",
  keywords: ["logistics", "government", "LSP", "container", "booking", "freight"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/8 py-6 text-center text-sm text-white/40">
          © 2026 GovLogix — Ministry of Logistics & Supply Chain, Government of India
        </footer>
      </body>
    </html>
  );
}
