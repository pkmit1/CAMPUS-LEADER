import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { Experience } from "@/types/resume";
import { generateId } from "@/utils/resumeUtils";

interface ExperienceFormProps {
  experiences: Experience[];
  onAdd: (experience: Experience) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Experience, value: any) => void;
}

export const ExperienceForm = ({ experiences, onAdd, onRemove, onUpdate }: ExperienceFormProps) => {
  const addExperience = () => {
    onAdd({
      id: generateId(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>Add your professional work experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiences.map((exp, index) => (
          <Card key={exp.id} className="relative">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Experience #{index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(exp.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`company-${exp.id}`}>Company *</Label>
                  <Input
                    id={`company-${exp.id}`}
                    value={exp.company}
                    onChange={(e) => onUpdate(exp.id, "company", e.target.value)}
                    placeholder="Google"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`position-${exp.id}`}>Position *</Label>
                  <Input
                    id={`position-${exp.id}`}
                    value={exp.position}
                    onChange={(e) => onUpdate(exp.id, "position", e.target.value)}
                    placeholder="Senior Software Engineer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${exp.id}`}>Start Date *</Label>
                  <Input
                    id={`startDate-${exp.id}`}
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => onUpdate(exp.id, "startDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                  <Input
                    id={`endDate-${exp.id}`}
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => onUpdate(exp.id, "endDate", e.target.value)}
                    disabled={exp.current}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={exp.current}
                  onCheckedChange={(checked) => onUpdate(exp.id, "current", checked)}
                />
                <Label>I currently work here</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`description-${exp.id}`}>Description</Label>
                <Textarea
                  id={`description-${exp.id}`}
                  value={exp.description}
                  onChange={(e) => onUpdate(exp.id, "description", e.target.value)}
                  placeholder="Describe your responsibilities, achievements, and key contributions..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button onClick={addExperience} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </CardContent>
    </Card>
  );
};