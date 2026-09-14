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

/**
 * Tailwind classes per category, built on the accent tokens in `global.css`.
 * Text-only accent — the badge keeps the site's standard neutral chrome
 * (`variant="secondary"`, same background/border as every other badge); only
 * the label color shifts per category, low-saturation, so it reads as sober
 * and consistent with the rest of the (mostly grayscale) portfolio.
 */
const CATEGORY_CLASS_NAMES: Record<SkillCategory, string> = {
  languages: 'text-accent-blue',
  backend: 'text-accent-teal',
  frontend: 'text-accent-orange',
  'cloud-devops': 'text-accent-amber',
  'data-messaging': 'text-accent-pink',
  'ai-tooling': 'text-accent-green',
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
