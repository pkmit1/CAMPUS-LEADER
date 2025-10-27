import { Section } from "@/components/ResumeTemplates/Section";
import { ResumeData } from "@/types/resume";

interface TimelineTemplateProps {
  data: ResumeData;
}

export const TimelineTemplate = ({ data }: TimelineTemplateProps) => (
  <div className="bg-white p-8 max-w-4xl mx-auto">
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personal.fullName}</h1>
      {data.personal.title && (
        <div className="text-xl text-blue-600 mb-3">{data.personal.title}</div>
      )}
      <div className="text-lg text-gray-600">
        {data.personal.email} • {data.personal.phone} • {data.personal.location}
      </div>
      {data.personal.linkedin && <div className="text-gray-600">{data.personal.linkedin}</div>}
    </header>

    {data.personal.summary && (
      <Section title="Summary">
        <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
      </Section>
    )}

    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
      
      {data.experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-6">
            {data.experience.map((exp, i) => (
              <div key={i} className="flex">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 border-4 border-white z-10"></div>
                <div className="ml-4 flex-1">
                  <div className="font-semibold text-gray-900">{exp.position}</div>
                  <div className="text-gray-600">{exp.company}</div>
                  <div className="text-xs text-gray-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                  <div className="text-gray-700 mt-1">{exp.description}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          <div className="space-y-6">
            {data.education.map((edu, i) => (
              <div key={i} className="flex">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 border-4 border-white z-10"></div>
                <div className="ml-4 flex-1">
                  <div className="font-semibold text-gray-900">{edu.degree}</div>
                  <div className="text-gray-600">{edu.school}</div>
                  <div className="text-xs text-gray-500">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </div>
                  <div className="text-gray-700 mt-1">{edu.description}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>

    {data.skills.length > 0 && (
      <Section title="Skills">
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill, i) => (
            <span key={i} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {skill.name}
            </span>
          ))}
        </div>
      </Section>
    )}
  </div>
);