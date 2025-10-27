import { Section } from "@/components/ResumeTemplates/Section";
import { ResumeData } from "@/types/resume";

interface CreativePortfolioTemplateProps {
  data: ResumeData;
}

export const CreativePortfolioTemplate = ({ data }: CreativePortfolioTemplateProps) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-10 max-w-5xl mx-auto border border-gray-100">
    <header className="text-center mb-12">
      <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
        {data.personal.fullName.split(' ').map((n: string) => n[0]).join('')}
      </div>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">{data.personal.fullName}</h1>
      <div className="text-xl text-gray-600 mb-4">{data.personal.title || "Professional"}</div>
      <div className="flex justify-center gap-6 text-gray-500 flex-wrap">
        <span>{data.personal.email}</span>
        <span>•</span>
        <span>{data.personal.phone}</span>
        <span>•</span>
        <span>{data.personal.location}</span>
      </div>
    </header>

    <div className="grid md:grid-cols-2 gap-10">
      <div className="space-y-8">
        {data.personal.summary && (
          <Section title="About Me" creative>
            <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
          </Section>
        )}

        {data.experience.length > 0 && (
          <Section title="Experience" creative>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-purple-400"></div>
                  <div className="font-semibold text-gray-900">{exp.position}</div>
                  <div className="text-gray-600 text-sm">{exp.company}</div>
                  <div className="text-xs text-gray-500 mb-1">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                  <div className="text-gray-700 text-sm">{exp.description}</div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      <div className="space-y-8">
        {data.skills.length > 0 && (
          <Section title="Skills & Expertise" creative>
            <div className="space-y-4">
              {data.skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{skill.name}</span>
                    {skill.level && <span className="text-gray-500">{skill.level}%</span>}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" 
                      style={{ width: skill.level ? `${skill.level}%` : '100%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.education.length > 0 && (
          <Section title="Education" creative>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-pink-400"></div>
                  <div className="font-semibold text-gray-900">{edu.degree}</div>
                  <div className="text-gray-600 text-sm">{edu.school}</div>
                  <div className="text-xs text-gray-500">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </div>
                  {edu.description && <div className="text-gray-700 text-sm mt-1">{edu.description}</div>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.projects.length > 0 && (
          <Section title="Projects" creative>
            <div className="space-y-3">
              {data.projects.map((project, i) => (
                <div key={i}>
                  <div className="font-semibold text-gray-900">{project.name}</div>
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