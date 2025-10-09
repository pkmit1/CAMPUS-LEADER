"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ProjectEditForm {
  id: number;
  title: string;
  description?: string;
  requirements?: string;
  deadline?: string;
}

interface Props {
  project: ProjectEditForm | null;
  onClose: () => void;
  onUpdate: (updatedProject: ProjectEditForm) => void;
}

export default function ProjectEditDialog({
  project,
  onClose,
  onUpdate,
}: Props) {
  const [form, setForm] = useState<ProjectEditForm | null>(project);

  useEffect(() => {
    setForm(project);
  }, [project]);

  if (!form) return null;

  return (
    <Dialog.Root open={!!form} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-100 bg-opacity-50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Content className="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-bold">
                Edit Project
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4 ">
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />
              <textarea
                value={form.requirements}
                onChange={(e) =>
                  setForm({ ...form, requirements: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />
              <input
                type="date"
                value={form.deadline?.split("T")[0] || ""}
                onChange={(e) =>
                  setForm({ ...form, deadline: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <Dialog.Close asChild>
                <button className="px-6 py-2 border rounded-lg">Cancel</button>
              </Dialog.Close>
              <button
                onClick={() => form && onUpdate(form)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Update
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
