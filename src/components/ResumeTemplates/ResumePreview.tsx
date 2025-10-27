import { ResumeData, TemplateType } from "@/types/resume";
import { ModernTemplate } from "@/components/ResumeTemplates/ModernTemplate";
import { TwoColumnTemplate } from "@/components/ResumeTemplates/TwoColumnTemplate";
import { TimelineTemplate } from "@/components/ResumeTemplates/TimelineTemplate";
import { CleanTemplate } from "@/components/ResumeTemplates/CleanTemplate";
import { TechnicalTemplate } from "@/components/ResumeTemplates/TechnicalTemplate";
import { ExecutiveTemplate } from "@/components/ResumeTemplates/ExecutiveTemplate";
import { CreativePortfolioTemplate } from "@/components/ResumeTemplates/CreativePortfolioTemplate";

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
}

export const ResumePreview = ({ data, template }: ResumePreviewProps) => {
  const renderTemplate = () => {
    switch (template) {
      case "Modern":
        return <ModernTemplate data={data} />;
      case "TwoColumn":
        return <TwoColumnTemplate data={data} />;
      case "Timeline":
        return <TimelineTemplate data={data} />;
      case "Clean":
        return <CleanTemplate data={data} />;
      case "Technical":
        return <TechnicalTemplate data={data} />;
      case "Executive":
        return <ExecutiveTemplate data={data} />;
      case "CreativePortfolio":
        return <CreativePortfolioTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border">
      {renderTemplate()}
    </div>
  );
};