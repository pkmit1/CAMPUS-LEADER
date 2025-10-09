"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import LoadingUI from "@/components/loadingUI";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


import ProjectCard from "@/components/project-component/ProjectCard";
import ProjectEditDialog from "@/components/project-component/ProjectEditDialog";

interface Project {
  id: number;
  title: string;
  description?: string;
  requirements?: string;
  createdById: number;
  deadline?: string;
  status: "PENDING" | "ASSIGNED" | "ACCEPTED" | "REJECTED" | "IGNORE";
  createdAt: string;
  permission: "full" | "readonly";
  applied: "true" | "false";
}

interface NewProject {
  title: string;
  description?: string;
  requirements?: string;
  deadline?: string;
}

interface ProjectEditForm {
  id: number;
  title: string;
  description?: string;
  requirements?: string;
  deadline?: string;
}

export default function ProjectAssigned() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [newProject, setNewProject] = useState<NewProject>({
    title: "",
    description: "",
    requirements: "",
    deadline: "",
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [role, setRole] = useState<"ADMIN" | "STUDENT" | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchUserRole();
    fetchProjects();
  }, []);

  const fetchUserRole = async () => {
    try {
      const res = await axios.get("/api/me"); // returns { role: "ADMIN" | "STUDENT" }
      setRole(res.data.role);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/projects");
      setProjects(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newProject.title) return toast.error("Please enter a title");
    try {
      await axios.post("/api/projects", newProject);
      setNewProject({ title: "", description: "", requirements: "", deadline: "" });
      toast.success("Project created");
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    }
  };

  const handleUpdate = async (updatedProject: Project) => {
    try {
      await axios.put(`/api/projects/${updatedProject.id}`, updatedProject);
      toast.success("Project updated");
      fetchProjects();
      setEditingProject(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update project");
    }
  };

  const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this project?")) return;
  try {
    await axios.delete(`/api/projects/${id}`);
    toast.success("Project deleted");
    fetchProjects(); // Reload the projects list
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete project");
  }
};


  const handleAccept = async (id: number) => {
    try {
      await axios.put(`/api/projects/${id}`, { status: "ACCEPTED" });
      toast.success("Project accepted");
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header & Create Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Assigned</h1>
            <p className="text-gray-600 mt-2">Manage and track your projects</p>
          </div>

          {/* Admin Only Create Button */}
          {role === "ADMIN" && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="flex items-center px-6 py-3 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl hover:scale-105 transition-transform">
                  <PlusCircle className="mr-2 w-5 h-5" /> Create New Project
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-gray-100 bg-opacity-50 backdrop-blur-sm" />
                <div className="fixed inset-0 flex items-center justify-center">
                  <Dialog.Content className="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title className="text-xl font-bold">Create New Project</Dialog.Title>
                      <Dialog.Close asChild>
                        <button className="p-1 hover:bg-gray-100 rounded-full">X</button>
                      </Dialog.Close>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Title"
                        className="w-full border p-3 rounded-lg"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      />
                      <textarea
                        placeholder="Description"
                        className="w-full border p-3 rounded-lg"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      />
                      <textarea
                        placeholder="Requirements"
                        className="w-full border p-3 rounded-lg"
                        value={newProject.requirements}
                        onChange={(e) => setNewProject({ ...newProject, requirements: e.target.value })}
                      />
                      <input
                        type="date"
                        className="w-full border p-3 rounded-lg"
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end mt-6 space-x-3">
                      <Dialog.Close asChild>
                        <button className="px-6 py-2 border rounded-lg">Cancel</button>
                      </Dialog.Close>
                      <button onClick={handleCreate} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                        Create
                      </button>
                    </div>
                  </Dialog.Content>
                </div>
              </Dialog.Portal>
            </Dialog.Root>
          )}
        </div>

        {/* Projects List */}
        {loading ? (
          <LoadingUI />
        ) : projects.length > 0 ? (
          <div className="grid gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => setEditingProject(project)}
                onDelete={handleDelete}
                onAccept={handleAccept}
                onViewApplicants={() => router.push(`/dashboard/leader/project-assigned/${project.id}`)}

              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No projects found</p>
        )}

        {/* Edit Dialog */}
        <ProjectEditDialog
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdate={async (updatedProjectForm) => {
            const fullProject = { ...editingProject!, ...updatedProjectForm };
            await handleUpdate(fullProject);
          }}
        />
      </div>
    </div>
  );
}
