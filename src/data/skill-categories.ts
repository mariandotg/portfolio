/**
 * Skill → category map for the CV skills badges (site only, not the PDF).
 *
 * Covers every literal skill string across the base résumé skill list
 * (`resume.datav2.ts`) and both variant skill lists (`JAVA_SKILLS`,
 * `TS_SKILLS` in `resume.variants.ts`). A skill not listed here falls back
 * to the neutral badge — see `getSkillCategoryClassName`.
 */

export type SkillCategory =
  | 'languages'
  | 'backend'
  | 'frontend'
  | 'cloud-devops'
  | 'data-messaging'
  | 'ai-tooling'

/** Tailwind classes per category, built on the accent tokens in `global.css`. */
const CATEGORY_CLASS_NAMES: Record<SkillCategory, string> = {
  languages: 'bg-accent-blue/12 text-accent-blue dark:bg-accent-blue/18',
  backend: 'bg-accent-teal/12 text-accent-teal dark:bg-accent-teal/18',
  frontend: 'bg-accent-orange/12 text-accent-orange dark:bg-accent-orange/18',
  'cloud-devops': 'bg-accent-amber/12 text-accent-amber dark:bg-accent-amber/18',
  'data-messaging': 'bg-accent-pink/12 text-accent-pink dark:bg-accent-pink/18',
  'ai-tooling': 'bg-accent-green/12 text-accent-green dark:bg-accent-green/18',
}

const SKILL_CATEGORY_MAP: Record<string, SkillCategory> = {
  // Languages
  Java: 'languages',
  'Java 17/21': 'languages',
  TypeScript: 'languages',
  Python: 'languages',
  SQL: 'languages',

  // Backend frameworks
  'Spring Boot': 'backend',
  Quarkus: 'backend',
  NestJS: 'backend',
  'Node.js': 'backend',
  Microservices: 'backend',
  'REST APIs': 'backend',

  // Frontend
  Angular: 'frontend',
  React: 'frontend',
  'Next.js': 'frontend',

  // Cloud & DevOps
  GCP: 'cloud-devops',
  'GCP (BigQuery, Cloud Run, GCS)': 'cloud-devops',
  AWS: 'cloud-devops',
  Docker: 'cloud-devops',
  Tekton: 'cloud-devops',

  // Data & Messaging
  Kafka: 'data-messaging',
  'Event-Driven Architecture': 'data-messaging',
  PostgreSQL: 'data-messaging',
  BigQuery: 'data-messaging',
  MongoDB: 'data-messaging',

  // AI tooling
  'Claude Code': 'ai-tooling',
  Codex: 'ai-tooling',
  Cursor: 'ai-tooling',
  Copilot: 'ai-tooling',
}

export function getSkillCategory(skill: string): SkillCategory | undefined {
  return SKILL_CATEGORY_MAP[skill]
}

/** Returns the category's Tailwind classes, or `undefined` for an unknown skill (neutral badge). */
export function getSkillCategoryClassName(skill: string): string | undefined {
  const category = getSkillCategory(skill)
  return category ? CATEGORY_CLASS_NAMES[category] : undefined
}
