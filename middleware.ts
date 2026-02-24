import { NextRequest, NextResponse } from "next/server";

// Protected routes — login ছাড়া ঢুকতে পারবে না
const protectedRoutes = ["/dashboard"];

// Auth routes — login থাকলে ঢুকতে পারবে না
const authRoutes = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || 
                req.headers.get("authorization")?.replace("Bearer ", "");
  
  const { pathname } = req.nextUrl;

  // Dashboard এ login ছাড়া গেলে → login page
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Login/Register এ already logged in থাকলে → dashboard
  if (authRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard/student", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
