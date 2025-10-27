import { v4 as uuidv4 } from 'uuid';
import { ResumeData } from '@/types/resume';

export const generateId = () => uuidv4();

export const initialResumeData: ResumeData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    title: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

export const exportToPDF = () => {
  alert("PDF export functionality");
};

export const exportToWord = () => {
  alert("Word export functionality");
};