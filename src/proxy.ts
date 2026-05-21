import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define public paths that do not require authentication
const publicPaths = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  // Add other public paths like marketing pages, etc.
  "/", // Assuming the homepage is public
];

// Define paths for assets, which should also be public
const assetPrefixes = ["/fonts", "/_next/static", "/favicon.ico"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is for a public asset
  if (assetPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Check if the path is a public page
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If not a public path, check for authentication token
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value;

  if (!token) {
    // If no token, redirect to the login page
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
