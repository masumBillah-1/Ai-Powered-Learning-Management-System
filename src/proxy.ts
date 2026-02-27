import { NextRequest, NextResponse } from "next/server";

// Protected routes — login ছাড়া ঢুকতে পারবে না
const protectedRoutes = [
  "/dashboard",
  "/(public)/dashboard", // Public folder এর dashboard ও protect করো
  "/profile",
  "/my-classes",
  "/enrollment",
];

// Auth routes — login থাকলে ঢুকতে পারবে না
const authRoutes = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  console.log("🔒 Middleware:", { pathname, hasToken: !!token });

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  console.log("🔍 Route check:", { isProtectedRoute, isAuthRoute });

  // Protected route without token → redirect to login
  if (isProtectedRoute && !token) {
    console.log("❌ No token, redirecting to login");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth route with token → redirect to dashboard
  if (isAuthRoute && token) {
    console.log("✅ Has token, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard/student", req.url));
  }

  console.log("✅ Allowing access");
  return NextResponse.next();
}

// Export as default and named export for compatibility
export default middleware;

// Also export as proxy for Next.js compatibility
export const proxy = middleware;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/profile/:path*",
    "/my-classes/:path*",
    "/enrollment/:path*",
    "/login",
    "/register",
  ],
};
