// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 👇 change this to your real cookie name
const AUTH_COOKIE_NAME = "auth_token";

// routes that do NOT require login
const PUBLIC_PATHS = ["/login", "/register", "/api/auth", "/_next", "/favicon.ico"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((publicPath) =>
    pathname === publicPath || pathname.startsWith(publicPath)
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Allow public routes & static files
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 2) Check auth cookie
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    // Not logged in → redirect to /login
    const loginUrl = new URL("/login", req.url);

    // Optional: send user back after login
    loginUrl.searchParams.set("from", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // 3) Token exists → allow request
  return NextResponse.next();
}

// Apply middleware to ALL routes except static assets automatically
export const config = {
  matcher: [
    // run on everything except:
    // - /_next/*
    // - /favicon.ico
    // you can adjust if needed
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
