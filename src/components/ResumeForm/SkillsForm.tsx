import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { Skill, SKILL_CATEGORIES } from "@/types/resume";
import { generateId } from "@/utils/resumeUtils";

interface SkillsFormProps {
  skills: Skill[];
  onAdd: (skill: Skill) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Skill, value: any) => void;
}

export const SkillsForm = ({ skills, onAdd, onRemove, onUpdate }: SkillsFormProps) => {
  const addSkill = () => {
    onAdd({
      id: generateId(),
      name: "",
      level: 50,
      category: SKILL_CATEGORIES[0],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Add your technical and professional skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill, index) => (
          <Card key={skill.id} className="relative">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Skill #{index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(skill.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`skill-name-${skill.id}`}>Skill Name *</Label>
                  <Input
                    id={`skill-name-${skill.id}`}
                    value={skill.name}
                    onChange={(e) => onUpdate(skill.id, "name", e.target.value)}
                    placeholder="JavaScript, React, Project Management"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`skill-category-${skill.id}`}>Category</Label>
                  <Select
                    value={skill.category}
                    onValueChange={(value) => onUpdate(skill.id, "category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`skill-level-${skill.id}`}>
                  Proficiency Level: {skill.level}%
                </Label>
                <Input
                  id={`skill-level-${skill.id}`}
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={skill.level}
                  onChange={(e) => onUpdate(skill.id, "level", parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Expert</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button onClick={addSkill} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      </CardContent>
    </Card>
  );
};