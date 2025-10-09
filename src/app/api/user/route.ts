import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token || "");
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    

    // exclude logged-in leader
    const users = await prisma.user.findMany({
      where: { 
       NOT:{id: decoded.userId || 0}
      },
      select: {
        id: true,
        name: true,
        email: true,
        collegeName: true,
        role: true,
        mobile:true,
        skill:true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
