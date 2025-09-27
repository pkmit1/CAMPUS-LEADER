import { verifyToken } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token || "");

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Correct Prisma query with orderBy
    const feed = await prisma.feed.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true, // optional: if you want user info
      },
    });

    return NextResponse.json(feed, { status: 200 });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // ✅ Get token from cookies
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token || "");
    console.log("🚀 ~ POST ~ decoded:", decoded)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    const feed = await prisma.feed.create({
      data: {
        title,  
        message,
        userId: Number(decoded.userId),
      },
    });

    return NextResponse.json(feed, { status: 201 });
  } catch (error) {
    console.error("Error creating feed:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
