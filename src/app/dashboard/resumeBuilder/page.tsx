"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Download, FileText } from "lucide-react";

// Components
import { ResumePreview } from "@/components/ResumeTemplates/ResumePreview";
import { TemplateSelector } from "@/components/ResumeTemplates/TemplateSelector";
import { PersonalForm } from "@/components/ResumeForm/PersonalForm";
import { ExperienceForm } from "@/components/ResumeForm/ExperienceForm";
import { EducationForm } from "@/components/ResumeForm/EducationForm";
import { SkillsForm } from "@/components/ResumeForm/SkillsForm";
import { ProjectsForm } from "@/components/ResumeForm/ProjectsForm";
import { CertificationsForm } from "@/components/ResumeForm/CertificationsForm";
import { LanguagesForm } from "@/components/ResumeForm/LanguagesForm";

// Types & Utils
import { ResumeData, TemplateType, TEMPLATES, PersonalData, Experience, Education, Skill, Project, Certification, Language } from "@/types/resume";
import { initialResumeData, exportToPDF, exportToWord, generateId } from "@/utils/resumeUtils";

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(TEMPLATES[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  // Personal data handlers
  const updatePersonal = (field: keyof PersonalData, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  // Experience handlers
  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Skills handlers
  const addSkill = () => {
    const newSkill: Skill = {
      id: generateId(),
      name: "",
      level: 50,
      category: "Programming Languages",
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  // Projects handlers
  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: "",
      description: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: "",
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  // Certifications handlers
  const addCertification = () => {
    const newCertification: Certification = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
      link: "",
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  // Languages handlers
  const addLanguage = () => {
    const newLanguage: Language = {
      id: generateId(),
      name: "",
      proficiency: "Professional",
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, newLanguage]
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  // Reset form
  const resetForm = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      setResumeData(initialResumeData);
    }
  };

  // Load sample data
  const loadSampleData = () => {
    const sampleData: ResumeData = {
      personal: {
        fullName: "Pawan Maurya",
        email: "pawan@email.com",
        phone: "+1 (555) 123-4567",
        location: "Noida, IN",
        linkedin: "linkedin.com/in/pawanmaurya",
        github: "github.com/pawanmaurya",
        summary: "Senior Software Engineer with 1 years of experience in full-stack development. Passionate about building scalable web applications and leading engineering teams. Strong expertise in React, Node.js, and cloud technologies.",
        title: "Junior Software Engineer"
      },
      experience: [
        {
          id: generateId(),
          company: "TechCorp Inc.",
          position: "Junior Software Engineer",
          startDate: "2024-25",
          endDate: "",
          description: "Lead a team of 6 developers in building scalable microservices architecture. Improved application performance by 40% through code optimization and caching strategies. Mentored junior developers and established coding standards.",
          current: true
        },
        {
          id: generateId(),
          company: "StartupXYZ",
          position: "Full Stack Developer",
          startDate: "2018-01",
          endDate: "2020-02",
          description: "Developed and maintained customer-facing web applications using React and Node.js. Implemented CI/CD pipelines reducing deployment time by 60%. Collaborated with product team to deliver features on tight deadlines.",
          current: false
        }
      ],
      education: [
        {
          id: generateId(),
          school: "Stanford University",
          degree: "Master of Science",
          field: "Computer Science",
          startDate: "2016-09",
          endDate: "2018-05",
          description: "Graduated with honors. Focus on distributed systems and machine learning.",
          current: false
        },
        {
          id: generateId(),
          school: "University of California, Berkeley",
          degree: "Bachelor of Science",
          field: "Computer Engineering",
          startDate: "2012-09",
          endDate: "2016-05",
          description: "Minor in Mathematics. Dean's List for 4 semesters.",
          current: false
        }
      ],
      skills: [
        {
          id: generateId(),
          name: "JavaScript/TypeScript",
          level: 95,
          category: "Programming Languages"
        },
        {
          id: generateId(),
          name: "React",
          level: 90,
          category: "Frameworks & Libraries"
        },
        {
          id: generateId(),
          name: "Node.js",
          level: 85,
          category: "Frameworks & Libraries"
        },
        {
          id: generateId(),
          name: "AWS",
          level: 80,
          category: "Cloud Platforms"
        },
        {
          id: generateId(),
          name: "PostgreSQL",
          level: 75,
          category: "Databases"
        }
      ],
      projects: [
        {
          id: generateId(),
          name: "E-commerce Platform",
          description: "Built a full-stack e-commerce solution serving 10,000+ monthly users. Implemented payment processing, inventory management, and recommendation engine.",
          technologies: "React, Node.js, MongoDB, Stripe API",
          link: "https://github.com/sarahjohnson/ecommerce-platform",
          startDate: "2021-01",
          endDate: "2021-06"
        },
        {
          id: generateId(),
          name: "Real-time Chat Application",
          description: "Developed a real-time messaging app with WebSocket support, file sharing, and group chats.",
          technologies: "React, Socket.io, Express, Redis",
          link: "https://github.com/sarahjohnson/chat-app",
          startDate: "2020-08",
          endDate: "2020-12"
        }
      ],
      certifications: [
        {
          id: generateId(),
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2022-03",
          link: "https://www.credly.com/users/sarahjohnson"
        },
        {
          id: generateId(),
          name: "Google Cloud Professional Developer",
          issuer: "Google Cloud",
          date: "2021-11",
          link: "https://www.credly.com/users/sarahjohnson"
        }
      ],
      languages: [
        {
          id: generateId(),
          name: "English",
          proficiency: "Native"
        },
        {
          id: generateId(),
          name: "Spanish",
          proficiency: "Professional"
        },
        {
          id: generateId(),
          name: "French",
          proficiency: "Conversational"
        }
      ]
    };

    setResumeData(sampleData);
  };

  // Export handlers with enhanced functionality
  const handleExportPDF = () => {

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${resumeData.personal.fullName || 'Resume'} - PDF Export</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .resume { max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .section-title { border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="resume">
              <div class="header">
                <h1>${resumeData.personal.fullName || 'Your Name'}</h1>
                <p>${resumeData.personal.title || 'Professional'}</p>
                <p>${[resumeData.personal.email, resumeData.personal.phone, resumeData.personal.location].filter(Boolean).join(' | ')}</p>
              </div>
              
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportWord = () => {
    // Simple implementation - in production, use libraries like docx
    const blob = new Blob([`
      ${resumeData.personal.fullName || 'Resume'}
      ${resumeData.personal.title || ''}
      
      Contact Information:
      Email: ${resumeData.personal.email || ''}
      Phone: ${resumeData.personal.phone || ''}
      Location: ${resumeData.personal.location || ''}
      LinkedIn: ${resumeData.personal.linkedin || ''}
      GitHub: ${resumeData.personal.github || ''}
      
      Summary:
      ${resumeData.personal.summary || ''}
      
      This is a basic text export. For full Word document export, implement using docx library.
    `], { type: 'application/msword' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personal.fullName || 'resume'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-600 mt-1">Create professional resumes in minutes</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadSampleData}
                >
                  Load Sample
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetForm}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Reset All
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)} 
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Edit Resume" : "Preview Resume"}
              </Button>
              <Button onClick={handleExportPDF} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button onClick={handleExportWord} variant="secondary" className="gap-2">
                <FileText className="w-4 h-4" />
                Export Word
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!showPreview ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Build Your Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-6">
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="projects">Projects</TabsTrigger>
                      <TabsTrigger value="certifications">Certifications</TabsTrigger>
                      <TabsTrigger value="languages">Languages</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4">
                      <PersonalForm 
                        data={resumeData.personal} 
                        onChange={updatePersonal} 
                      />
                    </TabsContent>

                    <TabsContent value="experience" className="space-y-4">
                      <ExperienceForm
                        experiences={resumeData.experience}
                        onAdd={addExperience}
                        onRemove={removeExperience}
                        onUpdate={updateExperience}
                      />
                    </TabsContent>

                    <TabsContent value="education" className="space-y-4">
                      <EducationForm
                        education={resumeData.education}
                        onAdd={addEducation}
                        onRemove={removeEducation}
                        onUpdate={updateEducation}
                      />
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-4">
                      <SkillsForm
                        skills={resumeData.skills}
                        onAdd={addSkill}
                        onRemove={removeSkill}
                        onUpdate={updateSkill}
                      />
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-4">
                      <ProjectsForm
                        projects={resumeData.projects}
                        onAdd={addProject}
                        onRemove={removeProject}
                        onUpdate={updateProject}
                      />
                    </TabsContent>

                    <TabsContent value="certifications" className="space-y-4">
                      <CertificationsForm
                        certifications={resumeData.certifications}
                        onAdd={addCertification}
                        onRemove={removeCertification}
                        onUpdate={updateCertification}
                      />
                    </TabsContent>

                    <TabsContent value="languages" className="space-y-4">
                      <LanguagesForm
                        languages={resumeData.languages}
                        onAdd={addLanguage}
                        onRemove={removeLanguage}
                        onUpdate={updateLanguage}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

             
            </div>

            {/* Template Selector */}
            <div className="lg:col-span-1 space-y-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => setShowPreview(true)}
                  >
                    <Eye className="w-4 h-4" />
                    Preview Current Template
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={handleExportPDF}
                  >
                    <Download className="w-4 h-4" />
                    Quick PDF Export
                  </Button>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 text-center">
                      Changes auto-save as you type
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview Header */}
            {/* <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Resume Preview</h2>
                    <p className="text-gray-600">Template: {selectedTemplate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPreview(false)}
                    >
                      Back to Editor
                    </Button>
                    <Button onClick={handleExportPDF}>
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Resume Preview */}
            <ResumePreview data={resumeData} template={selectedTemplate} />
          </div>
        )}
      </div>
    </div>
  );
};
export default ResumeBuilder;