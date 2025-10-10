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

    // Fetch all projects with creator info
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Fetch responses for this student
    const responses = await prisma.projectResponse.findMany({
      where: { studentId: Number(decoded.userId) },
      select: { projectId: true },
    });
    const appliedProjectIds = responses.map((r) => r.projectId);

    // Map with permissions + applied
    const projectsWithFlags = projects.map((project) => {
      const isOwner = project.createdBy.id === decoded.userId;
      const isAdminOrLeader = ["ADMIN", "LEADER", "SUPER_ADMIN"].includes(String(decoded.role));

      return {
        ...project,
        permission: isOwner || isAdminOrLeader ? "full" : "readonly",
        applied: appliedProjectIds.includes(project.id),
      };
    });

    return NextResponse.json(projectsWithFlags, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token || "");

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, requirements, deadline } = body;

    if (!title || !deadline) {
      return NextResponse.json(
        { error: "Title and deadline are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        requirements,
        status: "ACTIVE",
        deadline: new Date(deadline),
        createdById: Number(decoded.userId),
      },
      include: {
        createdBy: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
