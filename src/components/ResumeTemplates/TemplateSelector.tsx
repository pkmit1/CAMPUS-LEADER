import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TEMPLATES, TemplateType } from "@/types/resume";

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const TemplateCard = ({ 
  template, 
  isSelected, 
  onClick 
}: { 
  template: TemplateType; 
  isSelected: boolean; 
  onClick: () => void; 
}) => {
  const getTemplatePreview = (templateName: string) => {
    const previews: Record<string, { gradient: string; elements: React.ReactNode }> = {
      Modern: {
        gradient: "from-blue-100 to-blue-200",
        elements: (
          <>
            <div className="w-10 h-2 bg-blue-400 rounded mx-auto mb-1"></div>
            <div className="w-8 h-1 bg-blue-300 rounded mx-auto mb-1"></div>
            <div className="w-12 h-1 bg-blue-300 rounded mx-auto"></div>
          </>
        )
      },
      TwoColumn: {
        gradient: "from-green-100 to-green-200",
        elements: (
          <div className="flex gap-1 w-full h-full p-1">
            <div className="w-1/3 bg-green-300 rounded"></div>
            <div className="w-2/3 bg-green-400 rounded"></div>
          </div>
        )
      },
      Timeline: {
        gradient: "from-purple-100 to-purple-200",
        elements: (
          <div className="flex flex-col items-start w-full h-full p-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full mb-1"></div>
            <div className="w-8 h-1 bg-purple-300 rounded mb-1"></div>
            <div className="w-6 h-1 bg-purple-300 rounded"></div>
          </div>
        )
      },
      Clean: {
        gradient: "from-gray-100 to-gray-200",
        elements: (
          <>
            <div className="w-12 h-1 bg-gray-400 rounded mx-auto mb-1"></div>
            <div className="w-10 h-1 bg-gray-300 rounded mx-auto mb-1"></div>
            <div className="w-8 h-1 bg-gray-300 rounded mx-auto"></div>
          </>
        )
      },
      Technical: {
        gradient: "from-gray-800 to-gray-900",
        elements: (
          <>
            <div className="w-8 h-1 bg-blue-400 rounded mx-auto mb-1"></div>
            <div className="w-6 h-1 bg-purple-400 rounded mx-auto mb-1"></div>
            <div className="w-10 h-1 bg-blue-400 rounded mx-auto"></div>
          </>
        )
      },
      Executive: {
        gradient: "from-blue-50 to-blue-100",
        elements: (
          <>
            <div className="w-10 h-1 bg-blue-600 rounded mx-auto mb-1"></div>
            <div className="w-12 h-1 bg-blue-400 rounded mx-auto mb-1"></div>
            <div className="w-8 h-1 bg-blue-400 rounded mx-auto"></div>
          </>
        )
      },
      CreativePortfolio: {
        gradient: "from-pink-100 to-purple-100",
        elements: (
          <div className="flex flex-col items-center w-full h-full">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mb-1"></div>
            <div className="w-10 h-1 bg-pink-400 rounded mb-1"></div>
            <div className="w-6 h-1 bg-purple-400 rounded"></div>
          </div>
        )
      },
      Classic: {
        gradient: "from-amber-100 to-amber-200",
        elements: (
          <>
            <div className="w-12 h-1 bg-amber-600 rounded mx-auto mb-1"></div>
            <div className="w-8 h-1 bg-amber-400 rounded mx-auto mb-1"></div>
            <div className="w-10 h-1 bg-amber-400 rounded mx-auto"></div>
          </>
        )
      },
      Professional: {
        gradient: "from-slate-100 to-slate-200",
        elements: (
          <>
            <div className="w-10 h-1 bg-slate-600 rounded mx-auto mb-1"></div>
            <div className="w-12 h-1 bg-slate-400 rounded mx-auto mb-1"></div>
            <div className="w-8 h-1 bg-slate-400 rounded mx-auto"></div>
          </>
        )
      },
      Elegant: {
        gradient: "from-emerald-100 to-emerald-200",
        elements: (
          <>
            <div className="w-8 h-1 bg-emerald-600 rounded mx-auto mb-1"></div>
            <div className="w-10 h-1 bg-emerald-400 rounded mx-auto mb-1"></div>
            <div className="w-6 h-1 bg-emerald-400 rounded mx-auto"></div>
          </>
        )
      },
      Bold: {
        gradient: "from-red-100 to-red-200",
        elements: (
          <>
            <div className="w-12 h-2 bg-red-500 rounded mx-auto mb-1"></div>
            <div className="w-10 h-1 bg-red-400 rounded mx-auto"></div>
          </>
        )
      },
      Compact: {
        gradient: "from-cyan-100 to-cyan-200",
        elements: (
          <div className="flex flex-col gap-0.5 w-full h-full p-1">
            <div className="w-full h-1 bg-cyan-400 rounded"></div>
            <div className="w-full h-1 bg-cyan-300 rounded"></div>
            <div className="w-full h-1 bg-cyan-300 rounded"></div>
          </div>
        )
      },
      Designer: {
        gradient: "from-orange-100 to-orange-200",
        elements: (
          <div className="flex gap-1 w-full h-full p-1">
            <div className="w-2/3 bg-orange-400 rounded"></div>
            <div className="w-1/3 bg-orange-300 rounded"></div>
          </div>
        )
      },
      Academic: {
        gradient: "from-indigo-100 to-indigo-200",
        elements: (
          <>
            <div className="w-10 h-1 bg-indigo-600 rounded mx-auto mb-1"></div>
            <div className="w-8 h-1 bg-indigo-400 rounded mx-auto mb-1"></div>
            <div className="w-12 h-1 bg-indigo-400 rounded mx-auto"></div>
          </>
        )
      },
      Simple: {
        gradient: "from-gray-50 to-gray-100",
        elements: (
          <>
            <div className="w-8 h-1 bg-gray-400 rounded mx-auto mb-1"></div>
            <div className="w-6 h-1 bg-gray-300 rounded mx-auto"></div>
          </>
        )
      },
      Corporate: {
        gradient: "from-blue-100 to-blue-200",
        elements: (
          <>
            <div className="w-12 h-1 bg-blue-600 rounded mx-auto mb-1"></div>
            <div className="w-10 h-1 bg-blue-400 rounded mx-auto mb-1"></div>
            <div className="w-8 h-1 bg-blue-400 rounded mx-auto"></div>
          </>
        )
      },
      Colorful: {
        gradient: "from-rainbow-100 to-rainbow-200",
        elements: (
          <div className="flex gap-0.5 w-full h-full">
            <div className="w-1/4 bg-red-400 rounded-l"></div>
            <div className="w-1/4 bg-yellow-400"></div>
            <div className="w-1/4 bg-green-400"></div>
            <div className="w-1/4 bg-blue-400 rounded-r"></div>
          </div>
        )
      },
      Minimal: {
        gradient: "from-white to-gray-50",
        elements: (
          <>
            <div className="w-10 h-0.5 bg-gray-400 rounded mx-auto mb-1"></div>
            <div className="w-8 h-0.5 bg-gray-300 rounded mx-auto"></div>
          </>
        )
      }
    };

    return previews[templateName] || {
      gradient: "from-gray-100 to-gray-200",
      elements: (
        <>
          <div className="w-8 h-1 bg-gray-400 rounded mx-auto mb-1"></div>
          <div className="w-6 h-1 bg-gray-300 rounded mx-auto"></div>
        </>
      )
    };
  };

  const preview = getTemplatePreview(template);

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 border-2 ${
        isSelected 
          ? 'ring-2 ring-primary border-primary shadow-md scale-105' 
          : 'border-gray-200 hover:shadow-md hover:border-gray-300 hover:scale-102'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm text-gray-900">{template}</span>
          {isSelected && (
            <Badge variant="default" className="bg-primary text-primary-foreground">
              Selected
            </Badge>
          )}
        </div>
        <div 
          className={`h-20 bg-gradient-to-br ${preview.gradient} rounded border flex items-center justify-center transition-all duration-200 ${
            isSelected ? 'shadow-inner' : ''
          }`}
        >
          <div className="text-xs text-gray-500 text-center">
            {preview.elements}
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {isSelected ? 'Active template' : 'Click to select'}
          </span>
          {isSelected && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  const templateCategories = {
    Professional: ["Modern", "Professional", "Corporate", "Executive", "Classic"],
    Creative: ["Creative", "Designer", "Colorful", "CreativePortfolio", "Bold"],
    Minimal: ["Minimal", "Simple", "Clean", "Compact", "Elegant"],
    Technical: ["Technical", "TwoColumn", "Timeline", "Academic"]
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Choose Template</CardTitle>
        <CardDescription>
          Select a design that matches your style and industry
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Count */}
        <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
          <span className="text-sm font-medium">Templates Available</span>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {TEMPLATES.length}
          </Badge>
        </div>

        {/* Currently Selected */}
        <div className="p-3 bg-primary/5 rounded-lg border">
          <div className="text-sm font-medium text-primary mb-1">Current Selection</div>
          <div className="text-lg font-semibold text-gray-900">{selectedTemplate}</div>
        </div>

        {/* Template Grid */}
        <div className="space-y-4">
          {Object.entries(templateCategories).map(([category, templatesInCategory]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 capitalize">
                {category} ({templatesInCategory.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {templatesInCategory.map((template) => (
                  <TemplateCard
                    key={template}
                    template={template as TemplateType}
                    isSelected={selectedTemplate === template}
                    onClick={() => onTemplateChange(template as TemplateType)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
};