import { RESUME_DATA } from './resume.datav2'
import type { Welcome, Work, WorkClient } from '../models/resume.data.models'

// --- Variant mechanism -----------------------------------------------------
//
// A variant is the default résumé (`RESUME_DATA`) plus a typed override.
// Overrides never copy the default content — they only state what changes.
// Jobs and clients are targeted by their stable `id` (set in resume.datav2.ts),
// so an override can't silently target a job/client that no longer exists:
// TypeScript's excess-property check on the object literals below rejects
// unknown ids, and `applyResumeOverride` re-asserts it at build time.

export type ResumeVariantId = 'java' | 'ts'
export type Lang = 'en' | 'es'

type FullstackClientId = 'rci' | 'interbanking'
type TechLeadClientId = 'rci' | 'banco-macro' | 'ford'

interface ClientOverride {
  role?: string
  /** Replaces the client's bullets entirely. */
  bullets?: readonly string[]
  /** Appends bullets after the default ones (use instead of `bullets` to avoid retyping them). */
  appendBullets?: readonly string[]
  techStack?: readonly string[]
}

interface JobOverride<ClientId extends string> {
  title?: string
  /** Replaces the job's own bullets entirely (jobs that use `clients` usually have none by default). */
  bullets?: readonly string[]
  /** Appends bullets after the default ones. */
  appendBullets?: readonly string[]
  clients?: Partial<Record<ClientId, ClientOverride>>
  /** New client entries to add under this job. */
  addClients?: readonly WorkClient[]
}

export interface ResumeOverride {
  about?: string
  summary?: string
  skills?: readonly string[]
  work?: {
    upward?: JobOverride<never>
    'stefanini-fullstack'?: JobOverride<FullstackClientId>
    'stefanini-techlead'?: JobOverride<TechLeadClientId>
  }
}

function applyClientOverride(client: WorkClient, override: ClientOverride | undefined): WorkClient {
  if (!override) return client
  return {
    ...client,
    role: override.role ?? client.role,
    bullets: override.bullets ?? (override.appendBullets ? [...client.bullets, ...override.appendBullets] : client.bullets),
    techStack: override.techStack ?? client.techStack,
  }
}

function applyJobOverride(job: Work, override: JobOverride<string> | undefined): Work {
  if (!override) return job

  const baseBullets = job.bullets ?? []
  const bullets = override.bullets ?? (override.appendBullets ? [...baseBullets, ...override.appendBullets] : job.bullets)

  const clients = job.clients?.map((client) => applyClientOverride(client, override.clients?.[client.id]))
  const withAdded = override.addClients ? [...(clients ?? []), ...override.addClients] : clients

  return {
    ...job,
    title: override.title ?? job.title,
    bullets,
    clients: withAdded,
  }
}

/** Applies a typed override on top of a default résumé, returning a new object. */
export function applyResumeOverride(base: Welcome, override: ResumeOverride): Welcome {
  const workOverrides = override.work ?? {}

  for (const jobId of Object.keys(workOverrides)) {
    if (!base.work.some((job) => job.id === jobId)) {
      throw new Error(`Resume override targets unknown job id "${jobId}"`)
    }
  }
  for (const [jobId, jobOverride] of Object.entries(workOverrides)) {
    const job = base.work.find((w) => w.id === jobId)
    for (const clientId of Object.keys(jobOverride?.clients ?? {})) {
      if (!job?.clients?.some((c) => c.id === clientId)) {
        throw new Error(`Resume override targets unknown client id "${clientId}" under job "${jobId}"`)
      }
    }
  }

  return {
    ...base,
    about: override.about ?? base.about,
    summary: override.summary ?? base.summary,
    skills: override.skills ? [...override.skills] : base.skills,
    work: base.work.map((job) => applyJobOverride(job, workOverrides[job.id as keyof typeof workOverrides])),
  }
}

/** Merges two overrides, `b` taking precedence field-by-field (used to layer common + variant-specific overrides). */
export function mergeResumeOverrides(a: ResumeOverride, b: ResumeOverride): ResumeOverride {
  const jobIds = new Set([...Object.keys(a.work ?? {}), ...Object.keys(b.work ?? {})])
  const work: Record<string, JobOverride<string>> = {}

  for (const jobId of jobIds) {
    const jobA = a.work?.[jobId as keyof typeof a.work]
    const jobB = b.work?.[jobId as keyof typeof b.work]
    if (!jobA) {
      work[jobId] = jobB!
      continue
    }
    if (!jobB) {
      work[jobId] = jobA
      continue
    }
    work[jobId] = {
      title: jobB.title ?? jobA.title,
      bullets: jobB.bullets ?? jobA.bullets,
      appendBullets: jobB.appendBullets ?? jobA.appendBullets,
      clients: { ...jobA.clients, ...jobB.clients },
      addClients: jobB.addClients ?? jobA.addClients ?? (jobA.addClients && jobB.addClients ? [...jobA.addClients, ...jobB.addClients] : undefined),
    }
  }

  return {
    about: b.about ?? a.about,
    summary: b.summary ?? a.summary,
    skills: b.skills ?? a.skills,
    work: work as ResumeOverride['work'],
  }
}

// --- Overrides shared by every variant --------------------------------------
//
// The only real content change (not a TODO placeholder): Banco Macro's
// engagement ended (~June 2026), so its bullets move to past tense. Facts
// unchanged, only tense.

const COMMON_OVERRIDE: Record<Lang, ResumeOverride> = {
  en: {
    work: {
      'stefanini-fullstack': {
        title: 'Full Stack Developer',
      },
      'stefanini-techlead': {
        appendBullets: [
          '[[TODO: bullet about AI-assisted development workflow — Claude Code, Codex, Cursor, Copilot]]',
        ],
        clients: {
          'banco-macro': {
            bullets: [
              'Served as development module lead for Sainapse at Banco Macro, acting as primary technical contact for client engineers adopting an AI-powered platform that used LLMs for automated code analysis.',
              'Coordinated a PM, QA lead, and 2 DevOps engineers to scope and ship product upgrades (including bug fixes and new features) aligned with Banco Macro\'s enterprise requirements.',
              'Designed and implemented a cloud abstraction layer across 5 microservices, enabling deployment on either AWS (DynamoDB, S3, Bedrock, Secrets Manager) or GCP (Cloud Storage, Firestore, Vertex AI, Secret Manager) without code changes.',
              'Built a provider-agnostic git integration layer across 2 microservices, enabling Sainapse\'s repository analysis to run on both GitHub and GitLab without code changes.',
            ],
          },
          ford: {
            role: '[[TODO: current Ford role title — now full time on Ford]]',
            appendBullets: [
              '[[TODO: bullet about Java 17/21 + Spring Boot services delivered for Ford]]',
              '[[TODO: bullet about supply-chain/security scanning with Fossa and Cycode]]',
              '[[TODO: bullet about CI/CD pipelines with Tekton]]',
              '[[TODO: bullet about GCP usage — BigQuery, Cloud Run, GCS]]',
            ],
          },
        },
        addClients: [
          {
            id: 'ai-products',
            name: '[[TODO: name this client entry — keep generic, e.g. "Internal AI Products", no product names]]',
            role: 'Tech Lead',
            bullets: [
              '[[TODO: bullet about an AI coding agent — Python backend on Cloud Run + CLI]]',
              '[[TODO: bullet about an AI developer platform web app — Next.js 15, React 19, Tailwind v4]]',
            ],
            techStack: ['Python', 'Cloud Run', 'CLI', 'Next.js 15', 'React 19', 'Tailwind v4'],
          },
        ],
      },
    },
  },
  es: {
    work: {
      'stefanini-fullstack': {
        title: 'Desarrollador Full Stack',
      },
      'stefanini-techlead': {
        appendBullets: [
          '[[TODO: bullet sobre el workflow de desarrollo asistido por IA — Claude Code, Codex, Cursor, Copilot]]',
        ],
        clients: {
          'banco-macro': {
            bullets: [
              'Lideré el módulo de desarrollo de Sainapse en Banco Macro, como referente técnico principal para los ingenieros del cliente que adoptaron una plataforma potenciada por IA para análisis automático de código.',
              'Coordiné un equipo compuesto por un PM, un líder de QA y 2 DevOps para definir y entregar mejoras al producto (incluyendo correcciones de bugs y nuevas funcionalidades) alineadas con los requerimientos enterprise de Banco Macro.',
              'Diseñé e implementé una capa de abstracción de cloud en 5 microservicios, habilitando el despliegue tanto en AWS (DynamoDB, S3, Bedrock, Secrets Manager) como en GCP (Cloud Storage, Firestore, Vertex AI, Secret Manager) sin cambios en el código.',
              'Construí una capa de integración git agnóstica al proveedor en 2 microservicios, habilitando el análisis de repositorios de Sainapse tanto en GitHub como en GitLab sin cambios en el código.',
            ],
          },
          ford: {
            role: '[[TODO: título del rol actual en Ford — ahora full time en Ford]]',
            appendBullets: [
              '[[TODO: bullet sobre servicios en Java 17/21 + Spring Boot para Ford]]',
              '[[TODO: bullet sobre escaneo de seguridad de la cadena de suministro con Fossa y Cycode]]',
              '[[TODO: bullet sobre pipelines de CI/CD con Tekton]]',
              '[[TODO: bullet sobre uso de GCP — BigQuery, Cloud Run, GCS]]',
            ],
          },
        },
        addClients: [
          {
            id: 'ai-products',
            name: '[[TODO: nombre para este cliente — genérico, ej. "Productos de IA internos", sin nombrar productos]]',
            role: 'Tech Lead',
            bullets: [
              '[[TODO: bullet sobre un agente de IA para código — backend en Python en Cloud Run + CLI]]',
              '[[TODO: bullet sobre una web app de plataforma de desarrollo con IA — Next.js 15, React 19, Tailwind v4]]',
            ],
            techStack: ['Python', 'Cloud Run', 'CLI', 'Next.js 15', 'React 19', 'Tailwind v4'],
          },
        ],
      },
    },
  },
}

// --- Variant-specific overrides ---------------------------------------------

const JAVA_SKILLS = [
  'Java 17/21',
  'Spring Boot',
  'Kafka',
  'Microservices',
  'Event-Driven Architecture',
  'Quarkus',
  'GCP (BigQuery, Cloud Run, GCS)',
  'AWS',
  'Tekton',
  'PostgreSQL',
  'SQL',
  'MongoDB',
  'Docker',
  'REST APIs',
  'TypeScript',
  'Node.js',
  'Angular',
  'Python',
  'Claude Code',
  'Codex',
  'Cursor',
  'Copilot',
]

const TS_SKILLS = [
  'TypeScript',
  'Node.js',
  'NestJS',
  'React',
  'Next.js',
  'Angular',
  'Kafka',
  'Event-Driven Architecture',
  'Microservices',
  'AWS',
  'GCP',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'REST APIs',
  'Java',
  'Spring Boot',
  'Python',
  'Claude Code',
  'Codex',
  'Cursor',
  'Copilot',
]

const VARIANT_OVERRIDE: Record<ResumeVariantId, Record<Lang, ResumeOverride>> = {
  java: {
    en: {
      about: '[[TODO: about line — Java/Spring Boot backend + Tech Lead angle]]',
      summary: '[[TODO: summary — Java/Spring Boot backend + Tech Lead angle]]',
      skills: JAVA_SKILLS,
      work: {
        'stefanini-fullstack': {
          clients: {
            interbanking: {
              appendBullets: [
                '[[TODO: bullet about Kafka messaging between microservices — event-driven, async and non-blocking for users]]',
              ],
            },
          },
        },
        'stefanini-techlead': {
          clients: {
            rci: {
              appendBullets: [
                '[[TODO: bullet about Java 8/Spring 4 -> Java 17/Spring Boot 3 migration and Activiti -> Flowable migration — final stages]]',
              ],
            },
          },
        },
      },
    },
    es: {
      about: '[[TODO: resumen breve — backend Java/Spring Boot + enfoque Tech Lead]]',
      summary: '[[TODO: resumen extendido — backend Java/Spring Boot + enfoque Tech Lead]]',
      skills: JAVA_SKILLS,
      work: {
        'stefanini-fullstack': {
          clients: {
            interbanking: {
              appendBullets: [
                '[[TODO: bullet sobre mensajería con Kafka entre microservicios — event-driven, asíncrono y no bloqueante para los usuarios]]',
              ],
            },
          },
        },
        'stefanini-techlead': {
          clients: {
            rci: {
              appendBullets: [
                '[[TODO: bullet sobre la migración final de Java 8/Spring 4 a Java 17/Spring Boot 3 y de Activiti a Flowable]]',
              ],
            },
          },
        },
      },
    },
  },
  ts: {
    en: {
      about: '[[TODO: about line — Node.js/TypeScript backend + Tech Lead angle]]',
      summary: '[[TODO: summary — Node.js/TypeScript backend + Tech Lead angle]]',
      skills: TS_SKILLS,
      work: {
        'stefanini-fullstack': {
          clients: {
            interbanking: {
              appendBullets: [
                '[[TODO: bullet about NestJS BFFs built for Interbanking]]',
                '[[TODO: bullet about Kafka event-driven messaging between microservices]]',
              ],
            },
          },
        },
      },
    },
    es: {
      about: '[[TODO: resumen breve — backend Node.js/TypeScript + enfoque Tech Lead]]',
      summary: '[[TODO: resumen extendido — backend Node.js/TypeScript + enfoque Tech Lead]]',
      skills: TS_SKILLS,
      work: {
        'stefanini-fullstack': {
          clients: {
            interbanking: {
              appendBullets: [
                '[[TODO: bullet sobre BFFs construidos con NestJS para Interbanking]]',
                '[[TODO: bullet sobre mensajería event-driven con Kafka entre microservicios]]',
              ],
            },
          },
        },
      },
    },
  },
}

export const RESUME_VARIANT_IDS: readonly ResumeVariantId[] = ['java', 'ts']

/** Returns the default résumé (identical to `RESUME_DATA[lang]`) plus the given variant's overrides applied. */
export function getVariantResumeData(variantId: ResumeVariantId, lang: Lang): Welcome {
  const base = RESUME_DATA[lang]
  const merged = mergeResumeOverrides(COMMON_OVERRIDE[lang], VARIANT_OVERRIDE[variantId][lang])
  return applyResumeOverride(base, merged)
}
