import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { Project } from "@/types/resume";
import { generateId } from "@/utils/resumeUtils";

interface ProjectsFormProps {
  projects: Project[];
  onAdd: (project: Project) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Project, value: any) => void;
}

export const ProjectsForm = ({ projects, onAdd, onRemove, onUpdate }: ProjectsFormProps) => {
  const addProject = () => {
    onAdd({
      id: generateId(),
      name: "",
      description: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Showcase your personal or professional projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project, index) => (
          <Card key={project.id} className="relative">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Project #{index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(project.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`project-name-${project.id}`}>Project Name *</Label>
                <Input
                  id={`project-name-${project.id}`}
                  value={project.name}
                  onChange={(e) => onUpdate(project.id, "name", e.target.value)}
                  placeholder="E-commerce Platform"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`project-start-${project.id}`}>Start Date</Label>
                  <Input
                    id={`project-start-${project.id}`}
                    type="month"
                    value={project.startDate}
                    onChange={(e) => onUpdate(project.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`project-end-${project.id}`}>End Date</Label>
                  <Input
                    id={`project-end-${project.id}`}
                    type="month"
                    value={project.endDate}
                    onChange={(e) => onUpdate(project.id, "endDate", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`project-technologies-${project.id}`}>Technologies Used</Label>
                <Input
                  id={`project-technologies-${project.id}`}
                  value={project.technologies}
                  onChange={(e) => onUpdate(project.id, "technologies", e.target.value)}
                  placeholder="React, Node.js, MongoDB, AWS"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`project-link-${project.id}`}>Project Link</Label>
                <Input
                  id={`project-link-${project.id}`}
                  value={project.link}
                  onChange={(e) => onUpdate(project.id, "link", e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`project-description-${project.id}`}>Description</Label>
                <Textarea
                  id={`project-description-${project.id}`}
                  value={project.description}
                  onChange={(e) => onUpdate(project.id, "description", e.target.value)}
                  placeholder="Describe the project, your role, key features, and achievements..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button onClick={addProject} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </CardContent>
    </Card>
  );
};