import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { Certification } from "@/types/resume";
import { generateId } from "@/utils/resumeUtils";

interface CertificationsFormProps {
  certifications: Certification[];
  onAdd: (certification: Certification) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Certification, value: any) => void;
}

export const CertificationsForm = ({ certifications, onAdd, onRemove, onUpdate }: CertificationsFormProps) => {
  const addCertification = () => {
    onAdd({
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
      link: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications</CardTitle>
        <CardDescription>Add your professional certifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={cert.id} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="flex-1 grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`cert-name-${cert.id}`} className="text-xs">Certification Name</Label>
                <Input
                  id={`cert-name-${cert.id}`}
                  value={cert.name}
                  onChange={(e) => onUpdate(cert.id, "name", e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`cert-issuer-${cert.id}`} className="text-xs">Issuing Organization</Label>
                <Input
                  id={`cert-issuer-${cert.id}`}
                  value={cert.issuer}
                  onChange={(e) => onUpdate(cert.id, "issuer", e.target.value)}
                  placeholder="Amazon Web Services"
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`cert-date-${cert.id}`} className="text-xs">Date Issued</Label>
                <Input
                  id={`cert-date-${cert.id}`}
                  type="month"
                  value={cert.date}
                  onChange={(e) => onUpdate(cert.id, "date", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`cert-link-${cert.id}`} className="text-xs">Credential URL</Label>
                <Input
                  id={`cert-link-${cert.id}`}
                  value={cert.link}
                  onChange={(e) => onUpdate(cert.id, "link", e.target.value)}
                  placeholder="https://www.credly.com/users/username"
                  className="h-9"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(cert.id)}
              className="text-red-500 hover:text-red-700 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        <Button onClick={addCertification} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add Certification
        </Button>
      </CardContent>
    </Card>
  );
};