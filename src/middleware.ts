import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/utils/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public routes
  if (path.startsWith("/api/auth") || path === "/signin" || path === "/signup") {
    return NextResponse.next();
  }

  // Get token
  const token = request.cookies.get("token")?.value;
  const decoded = await verifyToken(token || "");

  // Block if not logged in
  if (!decoded) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Restrict /dashboard/*
  if (path.startsWith("/dashboard/") && !decoded) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }



   if (path.startsWith("/dashboard/leader") && !(decoded.role == "LEADER" || decoded.role == "ADMIN"  ) ){
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Restrict /api/users → only LEADER can call
  if (path.startsWith("/api/user")&& !(decoded.role == "LEADER" || decoded.role == "ADMIN"  ) ) {
    
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/"],
};
