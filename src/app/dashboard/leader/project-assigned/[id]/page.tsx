"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingUI from "@/components/loadingUI";
import StudentProfilePage from "@/components/project-component/studentProfile";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import { X, CheckCircle, MoveLeft } from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "IGNORE";
}

export default function ProjectStudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState<number | null>(null);

  const router = useRouter();
  const { id } = useParams();
  const projectId = Number(id);

  useEffect(() => {
    if (projectId) fetchStudents(projectId);
  }, [projectId]);

  // Fetch all applicants
  const fetchStudents = async (id: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/projects/${id}`);
      setProjectTitle(res.data.projectTitle);
      setStudents(res.data.students);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Assign project to student
  const handleAssign = async (studentId: number) => {
    setAssigning(studentId);
    try {
      const res = await axios.put(`/api/projects/${projectId}/assign`, { studentId });
      toast.success("Project assigned successfully!");

      // Update the student list locally
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, status: "ACCEPTED" } : s))
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to assign project. Please try again.");
    } finally {
      setAssigning(null);
      setSelectedStudentId(null);
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name", cell: (info: any) => info.getValue() },
    { header: "Email", accessorKey: "email", cell: (info: any) => info.getValue() },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        const status = info.getValue();
        const color =
          status === "ACCEPTED"
            ? "text-green-600"
            : status === "REJECTED"
            ? "text-red-600"
            : "text-yellow-600";
        return <span className={`font-semibold ${color}`}>{status}</span>;
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <MoveLeft
  className="mb-6 border-2 border-gray-200"
  onClick={() => router.back()}
/>


      <h1 className="text-3xl font-bold mb-4">
        Students Applied: {projectTitle}
      </h1>

      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <LoadingUI /> Loading students...
                </TableCell>
              </TableRow>
            ) : students.length ? (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedStudentId(student.id)}
                >
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {columns[2].cell({
                      getValue: () => student.status,
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No students applied yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Student Profile Modal */}
      {selectedStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-5/6 max-w-5xl p-6 rounded-2xl overflow-auto max-h-[90vh] relative shadow-lg">
            <X
              className="absolute top-4 right-4 w-6 h-6 text-gray-700 hover:text-black cursor-pointer"
              onClick={() => setSelectedStudentId(null)}
            />
            <StudentProfilePage
              id={selectedStudentId}
              onClose={() => setSelectedStudentId(null)}
            />
            <div className="flex justify-end mt-6">
              <button
                disabled={assigning === selectedStudentId}
                onClick={() => handleAssign(selectedStudentId)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md disabled:opacity-60"
              >
                <CheckCircle className="w-5 h-5" />
                {assigning === selectedStudentId ? "Assigning..." : "Assign Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
