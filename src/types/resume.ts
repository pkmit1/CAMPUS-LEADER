export interface PersonalData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  title?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Professional' | 'Native';
}

export interface ResumeData {
  personal: PersonalData;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

export const TEMPLATES = [
  "Modern", "Classic", "Creative", "Minimal", "Professional", "Elegant",
  "Bold", "Compact", "Designer", "Academic", "Simple", "Corporate", "Colorful",
  "TwoColumn", "Timeline", "Clean", "Technical", "Executive", "CreativePortfolio"
] as const;

export const SKILL_CATEGORIES = [
  "Programming Languages",
  "Frameworks & Libraries",
  "Tools & Technologies",
  "Databases",
  "Cloud Platforms",
  "Soft Skills",
  "Languages"
] as const;

export const PROFICIENCY_LEVELS = [
  "Basic",
  "Conversational", 
  "Professional",
  "Native"
] as const;

export type TemplateType = typeof TEMPLATES[number];
export type SkillCategory = typeof SKILL_CATEGORIES[number];
export type ProficiencyLevel = typeof PROFICIENCY_LEVELS[number];