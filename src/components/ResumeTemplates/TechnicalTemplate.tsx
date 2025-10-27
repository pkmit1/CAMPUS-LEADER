import { Section } from "@/components/ResumeTemplates/Section";
import { ResumeData } from "@/types/resume";

interface TechnicalTemplateProps {
  data: ResumeData;
}

export const TechnicalTemplate = ({ data }: TechnicalTemplateProps) => (
  <div className="bg-gray-900 text-gray-100 rounded-xl shadow-2xl p-8 max-w-5xl mx-auto">
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold  mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {data.personal.fullName}
      </h1>
      {data.personal.title && (
        <div className="text-xl text-blue-400 mb-3">{data.personal.title}</div>
      )}
      <div className="text-gray-400 flex justify-center gap-4 flex-wrap">
        <span>{data.personal.email}</span>
        <span>•</span>
        <span>{data.personal.phone}</span>
        <span>•</span>
        <span>{data.personal.location}</span>
        {data.personal.linkedin && <span>•</span>}
        {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
      </div>
    </header>

    <div className="grid md:grid-cols-4 gap-6">
      <div className="md:col-span-3 space-y-6">
        {data.personal.summary && (
          <Section title="Profile" dark>
            <p className="text-gray-300 leading-relaxed">{data.personal.summary}</p>
          </Section>
        )}

        {data.experience.length > 0 && (
          <Section title="Professional Experience" dark>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-white">{exp.position}</div>
                      <div className="text-blue-400 text-sm">{exp.company}</div>
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </div>
                  </div>
                  <div className="text-gray-300 text-sm">{exp.description}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.projects.length > 0 && (
          <Section title="Projects" dark>
            <div className="space-y-3">
              {data.projects.map((project, i) => (
                <div key={i} className="bg-gray-800 rounded p-3">
                  <div className="font-medium text-white text-sm">{project.name}</div>
                  {project.technologies && (
                    <div className="text-blue-400 text-xs mb-1">{project.technologies}</div>
                  )}
                  <div className="text-gray-300 text-xs">{project.description}</div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      <div className="md:col-span-1 space-y-6">
        {data.skills.length > 0 && (
          <Section title="Technical Skills" dark>
            <div className="space-y-3">
              {data.skills.map((skill, i) => (
                <div key={i}>
                  <div className="text-white text-sm font-medium mb-1">{skill.name}</div>
                  <div className="w-full rounded-full h-2">
                    <div 
                      className=" h-2 rounded-full" 
                      style={{ width: skill.level ? `${skill.level}%` : '80%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.education.length > 0 && (
          <Section title="Education" dark>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i} className="bg-gray-800 rounded p-3">
                  <div className="font-medium text-white text-sm">{edu.degree}</div>
                  <div className="text-gray-400 text-xs">{edu.school}</div>
                  <div className="text-gray-500 text-xs">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.certifications.length > 0 && (
          <Section title="Certifications" dark>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={i} className="text-sm">
                  <div className="text-white">{cert.name}</div>
                  <div className="text-gray-400 text-xs">{cert.issuer}</div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  </div>
);