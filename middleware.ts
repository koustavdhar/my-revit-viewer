import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("demo_auth")?.value === "1";
  const { pathname } = request.nextUrl;

  // Keep viewer protected in prototype auth.
  // Project detail pages are left open so navigation stays smooth in demos.
  const isProtectedRoute = pathname.startsWith("/viewer");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/viewer/:path*"],
};
