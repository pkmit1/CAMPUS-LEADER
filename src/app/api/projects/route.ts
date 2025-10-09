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

    // Fetch all projects
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Fetch all ProjectResponses for this student
    const responses = await prisma.projectResponse.findMany({
      where: { studentId: Number(decoded.userId) },
      select: { projectId: true },
    });
    const appliedProjectIds = responses.map((r) => r.projectId);

    // Map projects with permission & applied
    const projectsWithFlags = projects.map((project) => ({
      ...project,
      permission:
        decoded.role === "ADMIN" && project.createdBy.id === decoded.userId
          ? "full"
          : "readonly",
      applied: appliedProjectIds.includes(project.id), 
    }));

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

    if (!title || !description || !requirements || !deadline) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        requirements,
        deadline: new Date(deadline),
        createdById: Number(decoded.userId),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
