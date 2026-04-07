"use server";

import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "demo_auth";

function cookieBase(request: NextRequest) {
  const isHttps = request.nextUrl.protocol === "https:";
  return {
    name: COOKIE_NAME,
    path: "/",
    sameSite: "lax" as const,
    secure: isHttps,
    httpOnly: true,
  };
}

export async function POST(request: NextRequest) {
  // Demo auth only: any credentials are accepted client-side; server sets a durable cookie.
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    ...cookieBase(request),
    value: "1",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

export async function DELETE(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    ...cookieBase(request),
    value: "",
    maxAge: 0,
  });
  return res;
}

