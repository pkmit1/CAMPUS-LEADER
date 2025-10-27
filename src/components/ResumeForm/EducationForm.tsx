import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { Education } from "@/types/resume";
import { generateId } from "@/utils/resumeUtils";

interface EducationFormProps {
  education: Education[];
  onAdd: (education: Education) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Education, value: any) => void;
}

export const EducationForm = ({ education, onAdd, onRemove, onUpdate }: EducationFormProps) => {
  const addEducation = () => {
    onAdd({
      id: generateId(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your educational background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.map((edu, index) => (
          <Card key={edu.id} className="relative">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(edu.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`school-${edu.id}`}>School/University *</Label>
                  <Input
                    id={`school-${edu.id}`}
                    value={edu.school}
                    onChange={(e) => onUpdate(edu.id, "school", e.target.value)}
                    placeholder="Stanford University"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`degree-${edu.id}`}>Degree *</Label>
                  <Input
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => onUpdate(edu.id, "degree", e.target.value)}
                    placeholder="Bachelor of Science"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                  <Input
                    id={`field-${edu.id}`}
                    value={edu.field}
                    onChange={(e) => onUpdate(edu.id, "field", e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                  <Input
                    id={`startDate-${edu.id}`}
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => onUpdate(edu.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                  <Input
                    id={`endDate-${edu.id}`}
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => onUpdate(edu.id, "endDate", e.target.value)}
                    disabled={edu.current}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={edu.current}
                  onCheckedChange={(checked) => onUpdate(edu.id, "current", checked)}
                />
                <Label>I currently study here</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`description-${edu.id}`}>Description</Label>
                <Textarea
                  id={`description-${edu.id}`}
                  value={edu.description}
                  onChange={(e) => onUpdate(edu.id, "description", e.target.value)}
                  placeholder="Relevant coursework, achievements, or additional information..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button onClick={addEducation} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add Education
        </Button>
      </CardContent>
    </Card>
  );
};