import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VARIANT_COOKIE = "nostrum_variant";

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(VARIANT_COOKIE)?.value;

  // If valid variant cookie already exists, continue
  if (existing === "a" || existing === "b") {
    return NextResponse.next();
  }

  // Assign a new variant: 10% get "a", 90% get "b"
  const variant = Math.random() < 0.9 ? "a" : "b";

  const response = NextResponse.next();
  response.cookies.set(VARIANT_COOKIE, variant, {
    path: "/",
    // Session cookie (no maxAge) — matches the old sessionStorage behaviour.
    // If you want it to persist across browser restarts, add maxAge.
    httpOnly: false, // Client JS can still read it if needed
    sameSite: "lax",
  });

  return response;
}

export const config = {
  // Run middleware on all page navigations but skip static assets & API routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
