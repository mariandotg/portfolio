import type { SkillCategory } from '../data/skill-categories'

export interface Dictionary {
  DOWNLOAD: string
  ABOUT: string
  WORK_EXP: string
  CURRENT_JOB: string
  SKILLS: string
  PROJECTS: string
  CERTIFICATES: string
  EDUCATION: string
  /** Site-only merged "Education" + "Certificates" section heading (src/components/cv/sections/EducationAndCertifications.astro). Not used by the PDF, which keeps separate sections. */
  EDUCATION_AND_CERTIFICATIONS: string
  IN_PROGRESS: string
  /** Site-only group labels for the web Skills section. Not used by the PDF. */
  SKILL_CATEGORIES: Record<SkillCategory, string>
}

export type Dictionaries = Record<string, Dictionary>
