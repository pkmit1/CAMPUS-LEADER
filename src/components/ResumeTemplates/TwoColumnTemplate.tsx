import { Section } from "@/components/ResumeTemplates/Section";
import { ResumeData } from "@/types/resume";

interface TwoColumnTemplateProps {
  data: ResumeData;
}

export const TwoColumnTemplate = ({ data }: TwoColumnTemplateProps) => (
  <div className="bg-white p-8 max-w-6xl mx-auto">
    <div className="grid md:grid-cols-3 gap-8">
      {/* Sidebar */}
      <div className="md:col-span-1 bg-gray-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.personal.fullName}</h1>
          {data.personal.title && (
            <div className="text-sm text-blue-600 mb-3">{data.personal.title}</div>
          )}
          <div className="text-sm text-gray-600 space-y-1">
            {data.personal.email && <div>{data.personal.email}</div>}
            {data.personal.phone && <div>{data.personal.phone}</div>}
            {data.personal.location && <div>{data.personal.location}</div>}
            {data.personal.linkedin && <div>{data.personal.linkedin}</div>}
            {data.personal.github && <div>{data.personal.github}</div>}
          </div>
        </div>

        {data.skills.length > 0 && (
          <Section title="Skills" compact>
            <div className="space-y-2">
              {data.skills.map((skill, i) => (
                <div key={i} className="text-sm">
                  <div className="font-medium text-gray-700">{skill.name}</div>
                  {skill.level && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.languages.length > 0 && (
          <Section title="Languages" compact>
            <div className="space-y-1">
              {data.languages.map((lang, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium text-gray-700">{lang.name}</span>
                  <span className="text-gray-500 ml-1">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.certifications.length > 0 && (
          <Section title="Certifications" compact>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={i} className="text-sm">
                  <div className="font-medium text-gray-700">{cert.name}</div>
                  <div className="text-gray-500 text-xs">{cert.issuer}</div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Main Content */}
      <div className="md:col-span-2 space-y-6">
        {data.personal.summary && (
          <Section title="Professional Summary">
            <p className="text-gray-700 text-sm leading-relaxed">{data.personal.summary}</p>
          </Section>
        )}

        {data.experience.length > 0 && (
          <Section title="Work Experience">
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <div className="font-semibold text-gray-900">{exp.position}</div>
                      <div className="text-gray-600 text-sm">{exp.company}</div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </div>
                  </div>
                  <div className="text-gray-700 mt-1 text-sm">{exp.description}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.education.length > 0 && (
          <Section title="Education">
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">{edu.degree}</div>
                      <div className="text-gray-600 text-sm">{edu.school}</div>
                      {edu.field && <div className="text-gray-500 text-xs">{edu.field}</div>}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    </div>
                  </div>
                  {edu.description && (
                    <div className="text-gray-700 mt-1 text-sm">{edu.description}</div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.projects.length > 0 && (
          <Section title="Projects">
            <div className="space-y-3">
              {data.projects.map((project, i) => (
                <div key={i}>
                  <div className="font-semibold text-gray-900">{project.name}</div>
                  {project.technologies && (
                    <div className="text-sm text-gray-600 mb-1">{project.technologies}</div>
                  )}
                  <div className="text-gray-700 text-sm">{project.description}</div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  </div>
);