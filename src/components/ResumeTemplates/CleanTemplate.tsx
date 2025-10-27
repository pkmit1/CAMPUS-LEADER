import { Section } from "@/components/ResumeTemplates/Section";
import { ResumeData } from "@/types/resume";

interface CleanTemplateProps {
  data: ResumeData;
}

export const CleanTemplate = ({ data }: CleanTemplateProps) => (
  <div className="bg-white rounded-lg p-8 max-w-3xl mx-auto border border-gray-200">
    <header className="border-b border-gray-200 pb-6 mb-6">
      <h1 className="text-3xl font-light text-gray-900 mb-2">{data.personal.fullName}</h1>
      {data.personal.title && (
        <div className="text-lg text-gray-600 mb-3">{data.personal.title}</div>
      )}
      <div className="text-gray-600 space-y-1">
        <div>{data.personal.email} • {data.personal.phone}</div>
        <div>{data.personal.location}</div>
        {data.personal.linkedin && <div>{data.personal.linkedin}</div>}
      </div>
    </header>

    <div className="space-y-6">
      {data.personal.summary && (
        <Section title="Summary" noBorder>
          <p className="text-gray-700 text-sm leading-relaxed">{data.personal.summary}</p>
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section title="Experience" noBorder>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-gray-900">{exp.position}</div>
                  <div className="text-xs text-gray-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>
                <div className="text-gray-600 text-sm mb-2">{exp.company}</div>
                <div className="text-gray-700 text-sm">{exp.description}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education" noBorder>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-gray-900">{edu.degree}</div>
                  <div className="text-xs text-gray-500">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </div>
                </div>
                <div className="text-gray-600 text-sm">{edu.school}</div>
                {edu.description && <div className="text-gray-700 text-sm mt-1">{edu.description}</div>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills" noBorder>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  </div>
);