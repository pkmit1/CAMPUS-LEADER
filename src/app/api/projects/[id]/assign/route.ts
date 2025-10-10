import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = await verifyToken(token || "");
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { studentId } = await req.json();
    const projectId = Number(params.id);


    // Prevent duplicate assignment
    const existing = await prisma.assignment.findUnique({
      where: { projectId_studentId: { projectId, studentId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Project Already assigned to this student" }, { status: 400 });
    }

    
    // Create an assignment in DB
    const assignment = await prisma.assignment.create({
      data: {
        studentId,
        projectId,
        assignedById: Number(decoded.userId),
      },
    });

      await prisma.projectResponse.updateMany({
      where: { projectId, studentId },
      data: { status: "ACCEPTED" },
    });

   

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error("Error assigning student:", error);
    return NextResponse.json({ error: "Failed to assign student" }, { status: 500 });
  }
}
