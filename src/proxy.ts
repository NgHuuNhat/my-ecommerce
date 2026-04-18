import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  console.log(`>>> Path: ${pathname} | Login: ${!!token}`);

  // ❌ chưa login → vào admin thì đá login
  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // ❌ user thường vào /admin → đá về home
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // (optional) nếu muốn user không vào login nữa khi đã login
  if (token && pathname.startsWith("/login")) {
    if (token?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/login",
  ],
};