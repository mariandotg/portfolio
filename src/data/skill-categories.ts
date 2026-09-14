/**
 * Web CV skills (site only, not the PDF): one unified list, grouped by
 * category, with a small core set as the only accented badges. The variant
 * lists (`JAVA_SKILLS`, `TS_SKILLS` in `resume.variants.ts`) stay PDF-only.
 * Color criterion: docs/design/palette.md.
 */

export type SkillCategory =
  | 'languages'
  | 'backend'
  | 'data-messaging'
  | 'cloud-devops'
  | 'frontend'
  | 'ai-tooling'

/** Union of the java and ts variant lists, in render order. */
export const WEB_SKILL_GROUPS: readonly { category: SkillCategory; skills: readonly string[] }[] = [
  { category: 'languages', skills: ['Java 17/21', 'TypeScript', 'SQL', 'Python'] },
  {
    category: 'backend',
    skills: ['Spring Boot', 'Quarkus', 'NestJS', 'Node.js', 'Microservices', 'REST APIs'],
  },
  {
    category: 'data-messaging',
    skills: ['Kafka', 'Event-Driven Architecture', 'PostgreSQL', 'MongoDB'],
  },
  {
    category: 'cloud-devops',
    skills: ['GCP (BigQuery, Cloud Run, GCS)', 'AWS', 'Docker', 'Tekton'],
  },
  { category: 'frontend', skills: ['Angular', 'React', 'Next.js'] },
  { category: 'ai-tooling', skills: ['Claude Code', 'Codex', 'Cursor', 'Copilot'] },
]

/**
 * Positioning core — the only accented skills. Independent of CV variants.
 * Keep it to ~20% of `WEB_SKILL_GROUPS`, or the accent stops meaning emphasis.
 */
export const CORE_SKILLS: ReadonlySet<string> = new Set([
  'Java 17/21',
  'Spring Boot',
  'TypeScript',
  'Kafka',
  'Event-Driven Architecture',
])

const ALL_WEB_SKILLS = new Set(WEB_SKILL_GROUPS.flatMap((group) => group.skills))
for (const skill of CORE_SKILLS) {
  if (!ALL_WEB_SKILLS.has(skill)) {
    throw new Error(`CORE_SKILLS has "${skill}", which is not in WEB_SKILL_GROUPS`)
  }
}

/**
 * Aliases for résumé techStack strings (JobCard) that name a core skill with
 * different wording/version than its canonical `CORE_SKILLS` entry. Covers
 * only obvious version/naming variants of the 5 core skills — ambiguous or
 * generic strings (e.g. 'Java EE', 'Kotlin', 'Spring', 'RabbitMQ', 'Kafka
 * Connect') are deliberately left unmapped.
 */
const CORE_SKILL_ALIASES: Readonly<Record<string, string>> = {
  'Java 17': 'Java 17/21',
  'Spring Boot 3': 'Spring Boot',
}

for (const target of Object.values(CORE_SKILL_ALIASES)) {
  if (!CORE_SKILLS.has(target)) {
    throw new Error(`CORE_SKILL_ALIASES points to "${target}", which is not in CORE_SKILLS`)
  }
}

/** Shared accent classes for the core skill set. AA-checked in both themes, see docs/design/palette.md. */
export const CORE_SKILL_BADGE_CLASS = 'bg-skill-core/8 text-skill-core hover:bg-skill-core/8'

/** True for a skill/techStack string that is a core skill, or an explicit alias of one. */
export function isCoreSkill(skill: string): boolean {
  const alias = CORE_SKILL_ALIASES[skill]
  return CORE_SKILLS.has(skill) || (alias !== undefined && CORE_SKILLS.has(alias))
}
