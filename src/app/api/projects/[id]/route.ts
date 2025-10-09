import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

// UPDATE PROJECT
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token || "");
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const projectId = Number(params.id);
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const body = await request.json();

    // Full permission 
    if (decoded.role === "ADMIN" || project.createdById === decoded.userId) {
      const updated = await prisma.project.update({
        where: { id: projectId },
        data: {
          title: body.title ?? project.title,
          description: body.description ?? project.description,
          requirements: body.requirements ?? project.requirements,
          deadline: body.deadline ? new Date(body.deadline) : project.deadline,
          status: body.status ?? project.status,
        },
      });
      return NextResponse.json(updated, { status: 200 });
    }

    if (body.status === "ACCEPTED") {
      // if student already responded on project
      const existingResponse = await prisma.projectResponse.findUnique({
        where: { projectId_studentId: { projectId, studentId: Number(decoded.userId) } },
      });

      if (existingResponse) {
        // update existing response to accepted
        const updatedResponse = await prisma.projectResponse.update({
          where: { id: existingResponse.id },
          data: { status: "ACCEPTED", respondedAt: new Date() },
        });
        return NextResponse.json(updatedResponse, { status: 200 });
      } else {
        // create new response
        const response = await prisma.projectResponse.create({
          data: {
            projectId,
            studentId: Number(decoded.userId),
            status: "ACCEPTED",
            respondedAt: new Date(),
          },
        });
        return NextResponse.json(response, { status: 200 });
      }
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}



// DELETE PROJECT
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;

    // Early return if token is missing
    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const projectId = Number(id);

    // Check if the projectId is a valid number
    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // ✅ Only creator or ADMIN can delete
    if (
      project.createdById !== Number(decoded.userId) &&
      decoded.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    
    
    await prisma.project.delete({
      where: { id: projectId },
    });
    console.log("🚀 ~ DELETE ~ projectId:", projectId)


    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}


//GET APPLIED STUDENT


export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  try {
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token || "");

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = Number(params.id);

    // Only allow admins to view applicants
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch project info
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { title: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch all students who applied for this project
    const applicants = await prisma.projectResponse.findMany({
      where: { projectId },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const students = applicants.map((a) => ({
      id: a.student.id,
      name: a.student.name,
      email: a.student.email,
      status: a.status,
    }));

    return NextResponse.json({ projectTitle: project.title, students }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
