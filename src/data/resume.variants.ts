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

type WorkJobId = 'upward' | 'stefanini-fullstack' | 'stefanini-techlead'
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

// --- Restructuring mechanism -------------------------------------------------
//
// Content overrides (above) never change the *shape* of `work`: which jobs
// exist, which clients belong to which job, or their order. A variant that
// needs that — e.g. merging two jobs into one, or reordering/re-parenting
// clients — provides `restructureWork`. It runs *after* every content
// override is applied, and receives typed helpers to fetch already-overridden
// jobs/clients by id, so restructured strings are reused by reference, not
// retyped. Fetching an unknown job/client id is a compile error for the known
// unions below, and throws a clear error at build time otherwise (e.g. a
// dynamically `addClients`-ed id like `'ai-products'`).

export interface RestructureHelpers {
  job(id: WorkJobId): Work
  client(jobId: 'stefanini-fullstack', clientId: FullstackClientId): WorkClient
  client(jobId: 'stefanini-techlead', clientId: TechLeadClientId | 'ai-products'): WorkClient
  client(jobId: WorkJobId, clientId: string): WorkClient
}

function makeRestructureHelpers(jobs: readonly Work[]): RestructureHelpers {
  function job(id: WorkJobId): Work {
    const found = jobs.find((j) => j.id === id)
    if (!found) throw new Error(`restructureWork: unknown job id "${id}"`)
    return found
  }
  function client(jobId: WorkJobId, clientId: string): WorkClient {
    const found = job(jobId).clients?.find((c) => c.id === clientId)
    if (!found) throw new Error(`restructureWork: unknown client id "${clientId}" under job "${jobId}"`)
    return found
  }
  return { job, client }
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
  /** Runs after all content overrides above; reshapes the final `work` array. */
  restructureWork?: (base: readonly Work[], helpers: RestructureHelpers) => Work[]
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
    restructureWork: b.restructureWork ?? a.restructureWork,
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
      'stefanini-techlead': {
        appendBullets: [
          'Act as AI ambassador for Stefanini Argentina, driving internal AI initiatives; taught a Claude Certified Architect preparation course (one session per exam domain) to 10–15 colleagues across roles.',
          'Apply AI-assisted development in daily client delivery, using GitHub Copilot at Ford and Cursor at Stefanini.',
        ],
        clients: {
          'banco-macro': {
            bullets: [
              'Served as development module lead for Sainapse at Banco Macro, acting as primary technical contact for client engineers adopting an AI-powered platform that used LLMs for automated code analysis.',
              'Designed and implemented a cloud abstraction layer across 5 microservices, enabling deployment on either AWS (DynamoDB, S3, Bedrock, Secrets Manager) or GCP (Cloud Storage, Firestore, Vertex AI, Secret Manager) without code changes.',
            ],
          },
        },
        addClients: [
          {
            id: 'ai-products',
            name: 'Internal AI Products',
            role: 'Architect & Sole Developer',
            start: '2026',
            end: null,
            bullets: [
              'Designed and built an AI coding agent for the terminal on Stefanini\'s proprietary LLM platform: a Python CLI plus a FastAPI backend on Cloud Run, distributed as an npm package through GitLab CI.',
              'Enforced deterministic guards around the LLM: file changes stay blocked until a plan is approved, rules decide step completion instead of model output, verification commands are allowlisted across Python, Node, Java, Go, Rust, and .NET, and every write is checkpointed for rollback.',
              'Backed the agent and its shared engine with ~1,300 automated tests, and drove its adoption in a client team that delivered an estimated 20–30% more tasks per month.',
              'Prototyped a QA-facing web app (Next.js, React 19, Tailwind v4) that maps microservice dependencies and explains how a change in one service impacts others.',
            ],
            techStack: ['Python', 'FastAPI', 'Cloud Run', 'GitLab CI', 'pytest', 'Next.js', 'React 19', 'TypeScript', 'Tailwind v4'],
          },
        ],
      },
    },
  },
  es: {
    work: {
      'stefanini-techlead': {
        appendBullets: [
          'Soy embajador de IA de Stefanini Argentina e impulso iniciativas internas de IA; dicté un curso de preparación para la certificación Claude Certified Architect (una clase por dominio) a 10–15 colegas de distintos perfiles.',
          'Aplico desarrollo asistido por IA en la entrega diaria para clientes, con GitHub Copilot en Ford y Cursor en Stefanini.',
        ],
        clients: {
          'banco-macro': {
            bullets: [
              'Lideré el módulo de desarrollo de Sainapse en Banco Macro, como referente técnico principal para los ingenieros del cliente que adoptaron una plataforma potenciada por IA para análisis automático de código.',
              'Diseñé e implementé una capa de abstracción de cloud en 5 microservicios, habilitando el despliegue tanto en AWS (DynamoDB, S3, Bedrock, Secrets Manager) como en GCP (Cloud Storage, Firestore, Vertex AI, Secret Manager) sin cambios en el código.',
            ],
          },
        },
        addClients: [
          {
            id: 'ai-products',
            name: 'Productos internos de IA',
            role: 'Arquitecto y único desarrollador',
            start: '2026',
            end: null,
            bullets: [
              'Diseñé y construí un agente de IA para programar desde la terminal sobre la plataforma LLM propietaria de Stefanini: un CLI en Python y un backend FastAPI en Cloud Run, distribuido como paquete npm mediante GitLab CI.',
              'Implementé guardas determinísticas alrededor del LLM: los cambios de archivos quedan bloqueados hasta aprobar un plan, las reglas deciden cuándo termina cada paso en lugar del modelo, los comandos de verificación usan una allowlist para Python, Node, Java, Go, Rust y .NET, y cada escritura genera un checkpoint para rollback.',
              'Respaldé el agente y su motor compartido con ~1.300 tests automatizados e impulsé su adopción en un equipo de cliente que entregó un estimado de 20–30% más tareas por mes.',
              'Prototipé una web app para QA (Next.js, React 19, Tailwind v4) que mapea dependencias entre microservicios y explica cómo un cambio en un servicio impacta en otros.',
            ],
            techStack: ['Python', 'FastAPI', 'Cloud Run', 'GitLab CI', 'pytest', 'Next.js', 'React 19', 'TypeScript', 'Tailwind v4'],
          },
        ],
      },
    },
  },
}

// --- Restructured Stefanini job (java + ts variants) ------------------------
//
// Both variants collapse `stefanini-fullstack` + `stefanini-techlead` into one
// `Stefanini` job (title "Full Stack Developer", 2024–present), and rebuild
// the RCI/Ford client entries with new final text. Bullets that are unchanged
// from the base résumé (RCI's 2024–2025 Hub Digital/Angular-migration/DocAI
// bullets, Ford's NEW VAT migration bullet, Ford's interviews bullet) are
// fetched by id/index and reused by reference rather than retyped.

const RESTRUCTURE_TEXT: Record<
  Lang,
  {
    fullStackTitle: string
    rciRole: string
    fordRole: string
    macroRole: string
    r1: string
    r2: string
    r3: string
    r4: string
    f1: string
    f2: string
    f3: string
    f4: string
    f6: string
    f7: string
  }
> = {
  en: {
    fullStackTitle: 'Full Stack Developer',
    rciRole: 'Technical Lead (since 2025)',
    fordRole: 'Full Stack Developer',
    macroRole: 'Development Module Lead',
    r1: 'Lead technical direction for a 2-developer team, authoring functional specs and technical documents, reviewing code, and unblocking delivery.',
    r2: 'Leading an end-to-end modernization in its final stages: Java 8/Spring 4 to Java 17/Spring Boot 3, Tomcat 9 to 10, Activiti to Flowable BPMN, and consolidation of multiple Angular micro-frontends into a single frontend.',
    r3: 'Delivered the invoice approval flow as the mobile app\'s first production MVP on iOS and Android (~50 users), then shipped push notifications through RabbitMQ.',
    r4: 'Designed an LLM + template-based OCR architecture for invoice text extraction, estimated to cut OCR cloud costs by up to 80%.',
    f1: 'Built BigQuery-sourced stages (delivery notes, supplier legal names) for a scheduled Spring Boot pipeline service in Java 17/21 that processes 20–30k vehicles per month.',
    f2: 'Designed a weekly reconciliation job that re-queries a Ford internal microservice for all tracked vehicle parts and updates only changed records in PostgreSQL, keeping reference data current for the append-only daily pipelines.',
    f3: 'Redesigned the Microsoft Teams notification flow (Power Automate webhooks) into standardized, reusable cards for data errors, exceptions, and pipeline start/finish events across all stages.',
    f4: 'Refactored scattered role-based checks in the Angular frontend into declarative, granular permissions (e.g. canOpenMenu, canFilterByState), centralizing authorization logic.',
    f6: 'Contributed to distributed locking across scheduled pipelines, preventing concurrent runs from overlapping.',
    f7: 'Shipped chart-based reporting views in Angular and REST endpoints with dynamic filtering and pagination.',
  },
  es: {
    fullStackTitle: 'Desarrollador Full Stack',
    rciRole: 'Technical Lead (desde 2025)',
    fordRole: 'Desarrollador Full Stack',
    macroRole: 'Líder de Módulo de Desarrollo',
    r1: 'Lidero la dirección técnica de un equipo de 2 desarrolladores: redacto especificaciones funcionales y documentos técnicos, reviso código y destrabo la entrega.',
    r2: 'Lidero una modernización integral en etapas finales: Java 8/Spring 4 a Java 17/Spring Boot 3, Tomcat 9 a 10, Activiti a Flowable BPMN y unificación de varios micro-frontends Angular en un solo frontend.',
    r3: 'Entregué el flujo de aprobación de facturas como primer MVP productivo de la app móvil en iOS y Android (~50 usuarios) y luego implementé notificaciones push con RabbitMQ.',
    r4: 'Diseñé una arquitectura de OCR basada en LLMs y templates para extracción de texto de facturas, con un ahorro estimado de hasta el 80% en costos de OCR en la nube.',
    f1: 'Construí stages que obtienen datos de BigQuery (remitos, razones sociales de proveedores) para un servicio de pipelines programados en Spring Boot y Java 17/21 que procesa 20–30k vehículos por mes.',
    f2: 'Diseñé un job semanal de reconciliación que consulta un microservicio interno de Ford por todas las piezas y actualiza en PostgreSQL solo los registros que cambiaron, manteniendo vigentes los datos de referencia de los pipelines diarios.',
    f3: 'Rediseñé las notificaciones en Microsoft Teams (webhooks de Power Automate) con cards estandarizadas y reutilizables para errores de datos, excepciones y avisos de inicio y fin en todos los stages.',
    f4: 'Refactoricé los chequeos de roles dispersos del frontend Angular a permisos declarativos y granulares (ej. canOpenMenu, canFilterByState), centralizando la lógica de autorización.',
    f6: 'Colaboré en la implementación de locks distribuidos entre pipelines programados para evitar ejecuciones superpuestas.',
    f7: 'Entregué vistas de reporting con gráficos en Angular y endpoints REST con filtros dinámicos y paginación.',
  },
}

const RCI_TECH_STACK = [
  'Java 17',
  'Spring Boot 3',
  'Flowable BPMN',
  'Tomcat 10',
  'Angular 17',
  'TypeScript',
  'Ionic',
  'Capacitor',
  'RabbitMQ',
  'SQL Server',
  'Google Cloud Storage',
]

const FORD_TECH_STACK = [
  'Java 17/21',
  'Spring Boot',
  'BigQuery',
  'PostgreSQL',
  'Angular 17',
  'TypeScript',
  'GCP (Cloud Run, GCS)',
  'Tekton',
  'Fossa',
  'Cycode',
  'Power Automate',
  'Docker',
]

interface ReusedBullets {
  /** RCI's 2024–2025 Hub Digital ownership bullet. */
  hub: string
  /** RCI's 2024–2025 AngularJS-to-Angular 17 migration bullet. */
  ngx: string
  /** RCI's 2024–2025 Google Cloud Storage + Document AI bullet. */
  docai: string
  /** Ford's NEW VAT BigQuery-to-refined-dataset migration bullet ("F5"). */
  vatBullet: string
  /** Internal AI Products' "AI coding agent" bullet ("A1"). */
  a1: string
  /** Internal AI Products' "deterministic guards" bullet ("A2"). */
  a2: string
  /** Internal AI Products' "~1,300 tests + adoption" bullet ("A3"). */
  a3: string
  /** Internal AI Products' "QA-facing web app prototype" bullet ("A4"). */
  a4: string
  /** Upward's Node.js/Express microservices bullet. */
  upNode: string
  /** Upward's Kotlin/Javalin endpoints bullet. */
  upKotlin: string
  /** Upward's 80% unit test coverage bullet. */
  upTests: string
  /** Upward's Python/Selenium scraping bot bullet. */
  upSelenium: string
}

/** Builds the merged Stefanini job (java/ts variants only), given which final bullets each client uses. */
function buildRestructuredWork(
  helpers: RestructureHelpers,
  lang: Lang,
  pick: (
    reused: ReusedBullets,
    text: (typeof RESTRUCTURE_TEXT)[Lang],
  ) => {
    rciBullets: readonly string[]
    fordBullets: readonly string[]
    aiProductsBullets: readonly string[]
    upwardBullets: readonly string[]
  },
): Work[] {
  const upward = helpers.job('upward')
  const techlead = helpers.job('stefanini-techlead')
  const rci2024 = helpers.client('stefanini-fullstack', 'rci')
  const ford = helpers.client('stefanini-techlead', 'ford')
  const macro = helpers.client('stefanini-techlead', 'banco-macro')
  const interbanking = helpers.client('stefanini-fullstack', 'interbanking')
  const aiProducts = helpers.client('stefanini-techlead', 'ai-products')

  const fordInterviewsBullet = ford.bullets[ford.bullets.length - 1]
  const sAmbassadorBullet = techlead.bullets?.[0]
  const sAiWorkflowBullet = techlead.bullets?.[1]
  if (!sAmbassadorBullet || !sAiWorkflowBullet) {
    throw new Error('restructureWork: expected the AI-ambassador and AI-assisted-development bullets on "stefanini-techlead"')
  }

  const reused: ReusedBullets = {
    hub: rci2024.bullets[0],
    ngx: rci2024.bullets[2],
    docai: rci2024.bullets[3],
    vatBullet: ford.bullets[0],
    a1: aiProducts.bullets[0],
    a2: aiProducts.bullets[1],
    a3: aiProducts.bullets[2],
    a4: aiProducts.bullets[3],
    upNode: upward.bullets[0],
    upKotlin: upward.bullets[1],
    upTests: upward.bullets[2],
    upSelenium: upward.bullets[3],
  }
  const text = RESTRUCTURE_TEXT[lang]
  const { rciBullets, fordBullets, aiProductsBullets, upwardBullets } = pick(reused, text)

  const stefanini: Work = {
    id: 'stefanini',
    company: 'Stefanini',
    logo: techlead.logo,
    title: text.fullStackTitle,
    start: '2024',
    end: null,
    description: '',
    bullets: [sAmbassadorBullet, sAiWorkflowBullet, fordInterviewsBullet],
    clients: [
      {
        id: 'rci',
        name: rci2024.name,
        logo: rci2024.logo,
        role: text.rciRole,
        start: '2024',
        end: null,
        bullets: rciBullets,
        techStack: RCI_TECH_STACK,
      },
      {
        id: 'ford',
        name: ford.name,
        logo: ford.logo,
        role: text.fordRole,
        start: '2026',
        end: null,
        bullets: fordBullets,
        techStack: FORD_TECH_STACK,
      },
      {
        ...aiProducts,
        bullets: aiProductsBullets,
      },
      {
        ...macro,
        role: text.macroRole,
        start: '2025',
        end: '2026',
      },
      {
        ...interbanking,
        start: '2024',
        end: '2025',
      },
    ],
  }

  return [{ ...upward, bullets: upwardBullets }, stefanini]
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

const INTERBANKING_TECH_STACK = [
  'Java 17',
  'Quarkus',
  'Microservices',
  'NestJS',
  'Node.js',
  'Kafka',
  'Kafka Connect',
  'Oracle Database',
  'MongoDB',
]

const INTERBANKING_TEXT: Record<Lang, { i2: string; i3: string; i4: string }> = {
  en: {
    i2: 'Built a payment service with idempotency keys persisted in MongoDB and distributed locking, preventing duplicate payments and race conditions under high concurrent load.',
    i3: 'Implemented Java consumers for change-data-capture events streamed from the legacy monolith\'s Oracle database into Kafka via Kafka Connect, so new microservices could act on VEP records without coupling to the monolith.',
    i4: 'Built the NestJS backend-for-frontend (BFF) that aggregated data from multiple microservices and shaped it for the web frontend, contributing to its design.',
  },
  es: {
    i2: 'Construí un servicio de pagos con claves de idempotencia persistidas en MongoDB y locks distribuidos, evitando pagos duplicados y race conditions bajo alta carga concurrente.',
    i3: 'Implementé consumers en Java para eventos de change data capture que Kafka Connect enviaba a Kafka desde la base Oracle del monolito legacy, para que los nuevos microservicios actuaran sobre los VEPs sin acoplarse al monolito.',
    i4: 'Construí el BFF (backend-for-frontend) en NestJS que agregaba datos de varios microservicios y los adaptaba para el frontend web, participando en su diseño.',
  },
}

/** Fetches Interbanking's base "2 of 5 Quarkus microservices" bullet ("I1") from the default résumé, by reference. */
function interbankingBaseBullet(lang: Lang): string {
  const job = RESUME_DATA[lang].work.find((w) => w.id === 'stefanini-fullstack')
  const client = job?.clients?.find((c) => c.id === 'interbanking')
  if (!client) throw new Error('interbankingBaseBullet: could not find stefanini-fullstack/interbanking in RESUME_DATA')
  return client.bullets[0]
}

const VARIANT_OVERRIDE: Record<ResumeVariantId, Record<Lang, ResumeOverride>> = {
  java: {
    en: {
      about:
        'Backend Engineer & Technical Lead specializing in Java 17/21 and Spring Boot, with 4+ years building fintech and enterprise systems.',
      summary:
        'Backend engineer with 4+ years of remote experience in Java and Spring Boot across fintech, automotive, and enterprise clients. I lead the technical direction of a Java 8/Spring 4 to Java 17/Spring Boot 3 and Flowable modernization, build scheduled data pipelines on GCP for Ford, and helped decompose a Java monolith into Quarkus microservices with Kafka-based change data capture for a platform serving 40,000+ companies. I also designed and built an internal AI coding agent, and I work spec-first with AI agents. Based in Buenos Aires (GMT-3), upper-intermediate English (B2).',
      skills: JAVA_SKILLS,
      work: {
        'stefanini-fullstack': {
          clients: {
            interbanking: {
              bullets: [interbankingBaseBullet('en'), INTERBANKING_TEXT.en.i3, INTERBANKING_TEXT.en.i2, INTERBANKING_TEXT.en.i4],
              techStack: INTERBANKING_TECH_STACK,
            },
          },
        },
      },
      restructureWork: (_base, helpers) =>
        buildRestructuredWork(helpers, 'en', (reused, text) => ({
          rciBullets: [text.r1, text.r2, text.r3, text.r4, reused.hub, reused.docai],
          fordBullets: [text.f1, text.f2, text.f6, reused.vatBullet, text.f3],
          aiProductsBullets: [reused.a1, reused.a2, reused.a3, reused.a4],
          upwardBullets: [reused.upNode, reused.upKotlin, reused.upTests],
        })),
    },
    es: {
      about:
        'Ingeniero Backend y Technical Lead especializado en Java 17/21 y Spring Boot, con más de 4 años construyendo sistemas fintech y enterprise.',
      summary:
        'Ingeniero backend con más de 4 años de experiencia remota en Java y Spring Boot para clientes fintech, automotrices y enterprise. Lidero la dirección técnica de una modernización de Java 8/Spring 4 a Java 17/Spring Boot 3 y Flowable, construyo pipelines de datos programados en GCP para Ford y participé en la descomposición de un monolito Java en microservicios Quarkus con change data capture sobre Kafka para una plataforma con más de 40.000 empresas. También diseñé y construí un agente interno de IA para programar y trabajo spec-first con agentes de IA. Vivo en Buenos Aires (GMT-3) y tengo inglés intermedio-alto (B2).',
      skills: JAVA_SKILLS,
      work: {
        'stefanini-fullstack': {
          clients: {
            interbanking: {
              bullets: [interbankingBaseBullet('es'), INTERBANKING_TEXT.es.i3, INTERBANKING_TEXT.es.i2, INTERBANKING_TEXT.es.i4],
              techStack: INTERBANKING_TECH_STACK,
            },
          },
        },
      },
      restructureWork: (_base, helpers) =>
        buildRestructuredWork(helpers, 'es', (reused, text) => ({
          rciBullets: [text.r1, text.r2, text.r3, text.r4, reused.hub, reused.docai],
          fordBullets: [text.f1, text.f2, text.f6, reused.vatBullet, text.f3],
          aiProductsBullets: [reused.a1, reused.a2, reused.a3, reused.a4],
          upwardBullets: [reused.upNode, reused.upKotlin, reused.upTests],
        })),
    },
  },
  ts: {
    en: {
      about:
        'Full Stack Engineer & Technical Lead working with TypeScript, Node.js, NestJS, and Angular, with 4+ years building fintech and enterprise systems.',
      summary:
        'Full stack engineer with 4+ years of remote experience across fintech, automotive, and enterprise clients. I built a NestJS backend-for-frontend aggregating microservices for a payment platform serving 40,000+ companies, led an AngularJS to Angular 17 migration and a declarative permissions refactor, and designed and built internal AI products: a Python coding agent with deterministic guards and a Next.js/React prototype for microservice impact analysis. I work spec-first with AI agents (Claude Code, Codex, Cursor, Copilot). Based in Buenos Aires (GMT-3), upper-intermediate English (B2).',
      skills: TS_SKILLS,
      work: {
        'stefanini-fullstack': {
          clients: {
            interbanking: {
              bullets: [INTERBANKING_TEXT.en.i4, INTERBANKING_TEXT.en.i3, INTERBANKING_TEXT.en.i2, interbankingBaseBullet('en')],
              techStack: INTERBANKING_TECH_STACK,
            },
          },
        },
      },
      restructureWork: (_base, helpers) =>
        buildRestructuredWork(helpers, 'en', (reused, text) => ({
          rciBullets: [text.r1, text.r2, reused.ngx, text.r3, text.r4, reused.hub],
          fordBullets: [text.f4, text.f3, text.f7, text.f1, text.f2],
          aiProductsBullets: [reused.a4, reused.a1, reused.a2, reused.a3],
          upwardBullets: [reused.upNode, reused.upTests, reused.upSelenium],
        })),
    },
    es: {
      about:
        'Ingeniero Full Stack y Technical Lead con TypeScript, Node.js, NestJS y Angular, con más de 4 años construyendo sistemas fintech y enterprise.',
      summary:
        'Ingeniero full stack con más de 4 años de experiencia remota para clientes fintech, automotrices y enterprise. Construí un BFF en NestJS que agrega microservicios para una plataforma de pagos con más de 40.000 empresas, lideré una migración de AngularJS a Angular 17 y un refactor de permisos declarativos, y diseñé y construí productos internos de IA: un agente de programación en Python con guardas determinísticas y un prototipo en Next.js/React para análisis de impacto entre microservicios. Trabajo spec-first con agentes de IA (Claude Code, Codex, Cursor, Copilot). Vivo en Buenos Aires (GMT-3) y tengo inglés intermedio-alto (B2).',
      skills: TS_SKILLS,
      work: {
        'stefanini-fullstack': {
          clients: {
            interbanking: {
              bullets: [INTERBANKING_TEXT.es.i4, INTERBANKING_TEXT.es.i3, INTERBANKING_TEXT.es.i2, interbankingBaseBullet('es')],
              techStack: INTERBANKING_TECH_STACK,
            },
          },
        },
      },
      restructureWork: (_base, helpers) =>
        buildRestructuredWork(helpers, 'es', (reused, text) => ({
          rciBullets: [text.r1, text.r2, reused.ngx, text.r3, text.r4, reused.hub],
          fordBullets: [text.f4, text.f3, text.f7, text.f1, text.f2],
          aiProductsBullets: [reused.a4, reused.a1, reused.a2, reused.a3],
          upwardBullets: [reused.upNode, reused.upTests, reused.upSelenium],
        })),
    },
  },
}

export const RESUME_VARIANT_IDS: readonly ResumeVariantId[] = ['java', 'ts']

/** Returns the default résumé (identical to `RESUME_DATA[lang]`) plus the given variant's overrides applied. */
export function getVariantResumeData(variantId: ResumeVariantId, lang: Lang): Welcome {
  const base = RESUME_DATA[lang]
  const merged = mergeResumeOverrides(COMMON_OVERRIDE[lang], VARIANT_OVERRIDE[variantId][lang])
  const overridden = applyResumeOverride(base, merged)

  if (!merged.restructureWork) return overridden

  const helpers = makeRestructureHelpers(overridden.work)
  return { ...overridden, work: merged.restructureWork(overridden.work, helpers) }
}
