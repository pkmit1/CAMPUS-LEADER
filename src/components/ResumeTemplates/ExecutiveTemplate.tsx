import { Section } from "@/components/ResumeTemplates/Section";
import { ResumeData } from "@/types/resume";

interface ExecutiveTemplateProps {
  data: ResumeData;
}

export const ExecutiveTemplate = ({ data }: ExecutiveTemplateProps) => (
  <div className="bg-white rounded-none shadow-sm p-12 max-w-4xl mx-auto border-t-4 border-blue-800">
    {/* HEADER */}
    <header className="mb-12 text-center">
      {/* Name & Title */}
      <div className="mb-6">
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2">
          {data.personal.fullName}
        </h1>
        {data.personal.title && (
          <p className="text-2xl text-blue-800 font-light tracking-wide">
            {data.personal.title}
          </p>
        )}
      </div>

      {/* Contact Info */}
      <div className="flex flex-wrap justify-center items-center gap-6 text-gray-700 text-lg">
        {data.personal.email && (
          <a href={`mailto:${data.personal.email}`} className="flex items-center gap-2 hover:text-blue-700">
            <span className="text-xl">📧</span>
            <span>{data.personal.email}</span>
          </a>
        )}
        {data.personal.phone && (
          <a href={`tel:${data.personal.phone}`} className="flex items-center gap-2 hover:text-blue-700">
            <span className="text-xl">📱</span>
            <span>{data.personal.phone}</span>
          </a>
        )}
        {data.personal.location && (
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <span>{data.personal.location}</span>
          </div>
        )}
        {data.personal.linkedin && (
          <a
            href={`https://${data.personal.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-700"
          >
            <span className="text-xl">💼</span>
            <span>LinkedIn</span>
          </a>
        )}
        
      </div>
    </header>

    {/* MAIN CONTENT */}
    <div className="space-y-10">
      {/* Summary */}
      {data.personal.summary && (
        <Section title="Executive Summary" elegant>
          <p className="text-gray-700 leading-relaxed text-lg">
            {data.personal.summary}
          </p>
        </Section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <Section title="Professional Experience" elegant>
          <div className="space-y-6">
            {data.experience.map((exp, i) => (
              <div
                key={i}
                className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {exp.position}
                    </div>
                    <div className="text-gray-600">{exp.company}</div>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education & Skills Side by Side */}
      {data.education.length > 0 && (
        <Section title="Professional Experience" elegant>
          <div className="space-y-6">
            {data.education.map((edu, i) => (
              <div
                key={i}
                className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {edu.degree}
                    </div>
                    <div className="text-gray-600">{edu.school}</div>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {edu.description}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
      
        {data.skills.length > 0 && (
          <Section title="Tech Stack" elegant>
            
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-md text-sm"
                >
                  <p>• {skill.name}</p>
                </span>
              ))}
            
          </Section>
        )}
    </div>
  </div>
);
