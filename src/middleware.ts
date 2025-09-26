import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/utils/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1️⃣ Allow public routes: signin/signup and auth APIs
  if (
    path.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Get token
  const token = request.cookies.get("token")?.value;
  // 4️⃣ Verify token
  const decoded = await verifyToken(token || "");

  if (path.startsWith("/dashboard") && !decoded) {
    // console.log(`⛔ Invalid token for ${path}, redirecting to /signin`);
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 6️⃣ All logged-in users can access dashboard and other protected pages
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/"],
};
