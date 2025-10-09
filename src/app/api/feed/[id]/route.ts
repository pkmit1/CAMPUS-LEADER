
import { verifyToken } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token || "");

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { title, message } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    // Optional: verify ownership or admin
    const feed = await prisma.feed.findUnique({ where: { id: Number(id) } });
    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    if (feed.userId !== Number(decoded.userId) && decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedFeed = await prisma.feed.update({
      where: { id: Number(id) },
      data: { title, message },
    });

    return NextResponse.json(updatedFeed, { status: 200 });
  } catch (error) {
    console.error("Error updating feed:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token || "");

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const feed = await prisma.feed.findUnique({ where: { id: Number(id) } });
    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    if (feed.userId !== Number(decoded.userId) && decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.feed.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Feed deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting feed:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
