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
}

const DICTIONARIES = {
  en: EN_DICTIONARY,
  es: ES_DICTIONARY,
} as Dictionaries

export { DICTIONARIES }
