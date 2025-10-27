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
        skills:true,
        isOnline:true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, isOnline } = await req.json();

    if (typeof userId === "undefined" || typeof isOnline === "undefined") {
      return NextResponse.json({ error: "Missing userId or isOnline" }, { status: 400 });
    }

    // Update the user's online status in the database
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { isOnline: Boolean(isOnline) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating online status:", error);
    return NextResponse.json({ error: "Failed to update online status" }, { status: 500 });
  }
}
