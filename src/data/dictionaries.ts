import type { Dictionaries, Dictionary } from '../models/dictionary.model'

const EN_DICTIONARY: Dictionary = {
  DOWNLOAD: 'Download Resume',
  ABOUT: 'About',
  CURRENT_JOB: 'Present',
  PROJECTS: 'Projects',
  SKILLS: 'Skills',
  WORK_EXP: 'Work Experience',
  CERTIFICATES: 'Certificates',
  EDUCATION: 'Education',
  EDUCATION_AND_CERTIFICATIONS: 'Education & Certifications',
  IN_PROGRESS: 'In Progress',
  SKILL_CATEGORIES: {
    languages: 'Languages',
    backend: 'Backend',
    'data-messaging': 'Data & Messaging',
    'cloud-devops': 'Cloud & DevOps',
    frontend: 'Frontend',
    'ai-tooling': 'AI Tooling',
  },
}

const ES_DICTIONARY: Dictionary = {
  DOWNLOAD: 'Descargar CV',
  ABOUT: 'Sobre mi',
  CURRENT_JOB: 'Actualmente',
  PROJECTS: 'Proyectos',
  SKILLS: 'Habilidades',
  WORK_EXP: 'Experiencia Laboral',
  CERTIFICATES: 'Certificaciones',
  EDUCATION: 'Educación',
  EDUCATION_AND_CERTIFICATIONS: 'Formación y certificaciones',
  IN_PROGRESS: 'En curso',
  SKILL_CATEGORIES: {
    languages: 'Lenguajes',
    backend: 'Backend',
    'data-messaging': 'Datos y mensajería',
    'cloud-devops': 'Cloud y DevOps',
    frontend: 'Frontend',
    'ai-tooling': 'Herramientas de IA',
  },
}

const DICTIONARIES = {
  en: EN_DICTIONARY,
  es: ES_DICTIONARY,
} as Dictionaries

export { DICTIONARIES }
