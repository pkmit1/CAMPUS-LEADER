import { Section } from "@/components/ResumeTemplates/Section";
import { ResumeData } from "@/types/resume";

interface ModernTemplateProps {
  data: ResumeData;
}

export const ModernTemplate = ({ data }: ModernTemplateProps) => (
  <div className="bg-white p-8 max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personal.fullName}</h1>
      {data.personal.title && (
        <div className="text-xl text-blue-600 mb-3">{data.personal.title}</div>
      )}
      <div className="text-lg text-gray-600 flex justify-center gap-4 flex-wrap">
        {data.personal.email && <span>{data.personal.email}</span>}
        {data.personal.phone && <span>•</span>}
        {data.personal.phone && <span>{data.personal.phone}</span>}
        {data.personal.location && <span>•</span>}
        {data.personal.location && <span>{data.personal.location}</span>}
        {data.personal.linkedin && <span>•</span>}
        {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
      </div>
    </div>

    {data.personal.summary && (
      <Section title="Professional Summary">
        <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
      </Section>
    )}

    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        {data.experience.length > 0 && (
          <Section title="Experience">
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-blue-500 pl-4">
                  <div className="font-semibold text-gray-900">{exp.position}</div>
                  <div className="text-gray-600">{exp.company}</div>
                  <div className="text-xs text-gray-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                  <div className="text-gray-700 mt-1 text-sm">{exp.description}</div>
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

      <div className="space-y-6">
        {data.education.length > 0 && (
          <Section title="Education">
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="border-l-2 border-green-500 pl-4">
                  <div className="font-semibold text-gray-900">{edu.degree}</div>
                  <div className="text-gray-600">{edu.school}</div>
                  <div className="text-xs text-gray-500">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </div>
                  {edu.field && <div className="text-sm text-gray-600">{edu.field}</div>}
                  <div className="text-gray-700 mt-1 text-sm">{edu.description}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {data.certifications.length > 0 && (
          <Section title="Certifications">
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={i} className="text-sm">
                  <div className="font-medium text-gray-900">{cert.name}</div>
                  <div className="text-gray-600">{cert.issuer} • {cert.date}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.languages.length > 0 && (
          <Section title="Languages">
            <div className="flex flex-wrap gap-3">
              {data.languages.map((lang, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium text-gray-900">{lang.name}</span>
                  <span className="text-gray-600 ml-1">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  </div>
);