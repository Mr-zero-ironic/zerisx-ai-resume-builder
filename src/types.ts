export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin?: string;
    summary: string;
    photo?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'creative' | 'professional' | 'elegant' | 'bold' | 'compact' | 'sidebar' | 'tech' | 'canva' | 'visual' | 'modern_dark' | 'infographic' | 'executive' | 'academic';

export interface ResumeSettings {
  templateId: TemplateId;
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  photoBorderStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  photoBorderColor: string;
  photoBorderWidth: number;
}
