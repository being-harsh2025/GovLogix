import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-govlogix-key";

// Paths that require admin authentication
const ADMIN_PATHS = ["/admin", "/api/admin"];

// Paths that are excluded from admin authentication
const EXCLUDED_PATHS = ["/admin/login", "/api/admin/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path is under admin scope
  const isProtectedPath = ADMIN_PATHS.some((path) => pathname.startsWith(path));
  const isExcluded = EXCLUDED_PATHS.some((path) => pathname === path);

  if (isProtectedPath && !isExcluded) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      // Valid token, proceed
      return NextResponse.next();
    } catch (err) {
      // Invalid token
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Handle users trying to access login page while already logged in
  if (pathname === "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        // Already logged in, redirect to admin dashboard
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch (err) {
        // Token invalid, stay on login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
