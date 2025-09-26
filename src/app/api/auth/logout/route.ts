import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Clear cookies or tokens (if you store JWT in cookies)
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set("token", "", {
    path: "/signin",
    httpOnly: true,
    expires: new Date(0), 
  });

  return response;
}