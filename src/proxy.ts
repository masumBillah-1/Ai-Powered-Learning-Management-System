import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const roleRoutes: Record<string, string[]> = {
  student: [
    "/sampleDashboard/student",
    "/sampleDashboard/profile",
    "/sampleDashboard/messages",
    "/sampleDashboard/settings",
  ],
  instructor: [
    "/sampleDashboard/instructor",
    "/sampleDashboard/profile",
    "/sampleDashboard/messages",
    "/sampleDashboard/settings",
  ],
  admin: [
    "/sampleDashboard/admin",
    "/sampleDashboard/profile",
    "/sampleDashboard/messages",
    "/sampleDashboard/settings",
  ],
};

const roleDashboard: Record<string, string> = {
  student: "/sampleDashboard/student",
  instructor: "/sampleDashboard/instructor",
  admin: "/sampleDashboard/admin",
};

const authRoutes = ["/login", "/register"];

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("token")?.value ||
    req.headers.get("x-auth-token") ||
    undefined
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = getToken(req);

  const isAuthRoute = authRoutes.includes(pathname);
  const isDashboardRoute = pathname.startsWith("/sampleDashboard");

  if (isAuthRoute) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);
        const role = payload.role as string;
        return NextResponse.redirect(
          new URL(roleDashboard[role] || "/sampleDashboard/student", req.url)
        );
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (isDashboardRoute) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      const allowed = roleRoutes[role] || [];
      const isAllowed = allowed.some(route => pathname.startsWith(route));

      if (!isAllowed) {
        console.log(`🚫 ${role} tried to access ${pathname} → redirecting`);
        return NextResponse.redirect(
          new URL(roleDashboard[role] || "/sampleDashboard/student", req.url)
        );
      }

      return NextResponse.next();

    } catch {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sampleDashboard/:path*",
    "/login",
    "/register",
  ],
};