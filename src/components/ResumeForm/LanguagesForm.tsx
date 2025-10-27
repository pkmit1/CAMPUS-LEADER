import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { Language, PROFICIENCY_LEVELS } from "@/types/resume";
import { generateId } from "@/utils/resumeUtils";

interface LanguagesFormProps {
  languages: Language[];
  onAdd: (language: Language) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Language, value: any) => void;
}

export const LanguagesForm = ({ languages, onAdd, onRemove, onUpdate }: LanguagesFormProps) => {
  const addLanguage = () => {
    onAdd({
      id: generateId(),
      name: "",
      proficiency: "Professional",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Languages</CardTitle>
        <CardDescription>Add languages you speak and your proficiency level</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {languages.map((language, index) => (
          <div key={language.id} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="flex-1 grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`lang-name-${language.id}`} className="text-xs">Language</Label>
                <Input
                  id={`lang-name-${language.id}`}
                  value={language.name}
                  onChange={(e) => onUpdate(language.id, "name", e.target.value)}
                  placeholder="English, Spanish, French..."
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`lang-proficiency-${language.id}`} className="text-xs">Proficiency</Label>
                <Select
                  value={language.proficiency}
                  onValueChange={(value) => onUpdate(language.id, "proficiency", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(language.id)}
              className="text-red-500 hover:text-red-700 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        <Button onClick={addLanguage} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add Language
        </Button>
      </CardContent>
    </Card>
  );
};