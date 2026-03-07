export interface ContactInfo {
  email: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ExperienceItem {
  company: string;
  client?: string;
  title: string;
  period: string;
  location: string;
  bullets: string[];
  technologies: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  status?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface LanguageItem {
  language: string;
  proficiency: string;
}

export interface ResumeData {
  name: string;
  title: string;
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  skills: SkillGroup[];
  languages: LanguageItem[];
}

export const resumeEn: ResumeData = {
  name: "Mariano Guillaume",
  title: "Fullstack Software Engineer",
  contact: {
    email: "contacto@marianoguillaume.com",
    location: "Buenos Aires, Argentina",
    website: "marianoguillaume.com",
    linkedin: "linkedin.com/in/marianoguillaume",
    github: "github.com/mariandotg",
  },
  summary:
    "Fullstack Software Engineer with 5+ years of experience delivering production-grade web and mobile applications for clients in fintech and enterprise sectors. Proven track record building products from scratch — from architecture to deployment — across React, Node.js, Angular, and Google Cloud. Led development teams on high-impact projects for Renault Argentina and contributed to a zero-downtime microservices migration at Interbanking. Product-minded, bilingual (Spanish native / English C2), available for project-based remote contracts.",
  experience: [
    {
      company: "Stefanini Group",
      client: "Renault Argentina",
      title: "Tech Lead",
      period: "[Month YYYY] – Present",
      location: "Remote",
      bullets: [
        "[PLACEHOLDER: Describe your main achievement — e.g. 'Led end-to-end delivery of Hub Digital, an internal platform consolidating N fragmented workflows across departments']",
        "[PLACEHOLDER: Describe team leadership — e.g. 'Managed and mentored a team of X developers, driving architecture decisions, code standards, and sprint planning']",
        "[PLACEHOLDER: Describe the mobile app — e.g. 'Architected and shipped a companion Ionic + Angular mobile app, published to iOS App Store and Google Play']",
        "[PLACEHOLDER: Add a quantified outcome — e.g. 'Reduced manual process overhead by X% for Y field teams by extending platform access to mobile devices']",
      ],
      technologies: [
        "Angular",
        "Ionic",
        "Node.js",
        "TypeScript",
        "Google Cloud Run",
        "Firestore",
      ],
    },
    {
      company: "Stefanini Group",
      client: "Interbanking",
      title: "Fullstack Developer",
      period: "[Month YYYY] – [Month YYYY]",
      location: "Remote",
      bullets: [
        "[PLACEHOLDER: Describe the monolith decomposition — e.g. 'Contributed to decoupling a legacy monolith into X independently deployable microservices using Domain-Driven Design principles']",
        "[PLACEHOLDER: Describe your specific service — e.g. 'Designed and implemented the VEP service handling tax obligation payments (ARCA), processing N transactions per day']",
        "[PLACEHOLDER: Describe the zero-downtime strategy — e.g. 'Applied strangler-fig migration pattern ensuring uninterrupted service for financial institutions throughout the transition']",
        "[PLACEHOLDER: Add a quantified outcome — e.g. 'New architecture reduced average deployment cycle from X hours to Y minutes, enabling the team to ship features faster']",
      ],
      technologies: [
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "Kafka",
        "RabbitMQ",
        "Docker",
      ],
    },
    {
      company: "Freelance",
      title: "Software Developer & Consultant",
      period: "[Month YYYY] – [Month YYYY]",
      location: "Remote",
      bullets: [
        "[PLACEHOLDER: Describe work for Banco Macro — e.g. 'Built X feature for Banco Macro's digital banking platform, improving Y for N users']",
        "[PLACEHOLDER: Describe an early Renault or Interbanking engagement from this period]",
        "[PLACEHOLDER: Describe a product you built end-to-end independently]",
        "[PLACEHOLDER: Describe a key technical challenge you solved as a consultant]",
      ],
      technologies: [
        "React",
        "Next.js",
        "Node.js",
        "TypeScript",
        "MongoDB",
        "MySQL",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Systems Engineering",
      institution: "Universidad Abierta Interamericana (UAI)",
      location: "Buenos Aires, Argentina",
      period: "In Progress",
      status: "In Progress",
    },
  ],
  certifications: [
    {
      name: "[PLACEHOLDER: e.g. AWS Certified Solutions Architect – Associate]",
      issuer: "[PLACEHOLDER: e.g. Amazon Web Services]",
      year: "[YYYY]",
    },
    {
      name: "[PLACEHOLDER: e.g. Google Cloud Professional Cloud Developer]",
      issuer: "[PLACEHOLDER: e.g. Google]",
      year: "[YYYY]",
    },
  ],
  skills: [
    {
      category: "Frontend",
      items: [
        "React",
        "Next.js",
        "Astro",
        "Angular",
        "TypeScript",
        "Tailwind CSS",
        "HTML/CSS",
      ],
    },
    {
      category: "Mobile",
      items: [
        "Ionic",
        "Angular",
        "iOS App Store Deployment",
        "Google Play Deployment",
      ],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Express",
        "REST APIs",
        "GraphQL",
        "PostgreSQL",
        "MySQL",
        "Oracle SQL",
        "MongoDB",
        "Firestore",
      ],
    },
    {
      category: "Cloud & Infrastructure",
      items: [
        "Google Cloud Run",
        "Cloud Storage",
        "Document AI",
        "Vertex AI",
        "Vercel",
        "Docker",
        "GitHub Actions",
      ],
    },
    {
      category: "Messaging & Streaming",
      items: ["Kafka", "RabbitMQ"],
    },
    {
      category: "Architecture",
      items: [
        "Microservices",
        "Monolith Decomposition",
        "System Design",
        "API Design",
      ],
    },
  ],
  languages: [
    { language: "Spanish", proficiency: "Native" },
    { language: "English", proficiency: "C2 — Proficient" },
  ],
};

export const resumeEs: ResumeData = {
  name: "Mariano Guillaume",
  title: "Ingeniero de Software Fullstack",
  contact: {
    email: "contacto@marianoguillaume.com",
    location: "Buenos Aires, Argentina",
    website: "marianoguillaume.com",
    linkedin: "linkedin.com/in/marianoguillaume",
    github: "github.com/mariandotg",
  },
  summary:
    "Ingeniero de Software Fullstack con más de 5 años de experiencia entregando aplicaciones web y móviles de producción para clientes en los sectores fintech y enterprise. Historial comprobado construyendo productos desde cero — desde la arquitectura hasta el despliegue — en React, Node.js, Angular y Google Cloud. Lideré equipos de desarrollo en proyectos de alto impacto para Renault Argentina y contribuí a una migración de microservicios sin downtime en Interbanking. Orientado al producto, bilingüe (español nativo / inglés C2), disponible para contratos remotos por proyecto.",
  experience: [
    {
      company: "Stefanini Group",
      client: "Renault Argentina",
      title: "Tech Lead",
      period: "[Mes AAAA] – Presente",
      location: "Remoto",
      bullets: [
        "[PLACEHOLDER: Describe tu logro principal — ej. 'Lideré el desarrollo de Hub Digital, una plataforma interna que consolidó N flujos de trabajo fragmentados en distintos departamentos']",
        "[PLACEHOLDER: Describe el liderazgo — ej. 'Gestioné y mentoricé un equipo de X desarrolladores, definiendo la arquitectura, estándares de código y planificación de sprints']",
        "[PLACEHOLDER: Describe la app mobile — ej. 'Diseñé y publiqué una app móvil con Ionic + Angular en el App Store de iOS y Google Play']",
        "[PLACEHOLDER: Agrega un resultado cuantificado — ej. 'Reduje la carga operativa manual en X% para Y equipos de campo al extender el acceso de la plataforma a dispositivos móviles']",
      ],
      technologies: [
        "Angular",
        "Ionic",
        "Node.js",
        "TypeScript",
        "Google Cloud Run",
        "Firestore",
      ],
    },
    {
      company: "Stefanini Group",
      client: "Interbanking",
      title: "Desarrollador Fullstack",
      period: "[Mes AAAA] – [Mes AAAA]",
      location: "Remoto",
      bullets: [
        "[PLACEHOLDER: Describe la descomposición — ej. 'Contribuí a desacoplar un monolito legacy en X microservicios desplegables de forma independiente usando principios de Domain-Driven Design']",
        "[PLACEHOLDER: Describe tu servicio específico — ej. 'Diseñé e implementé el servicio VEP para pagos de obligaciones impositivas (ARCA), procesando N transacciones diarias']",
        "[PLACEHOLDER: Describe la estrategia sin downtime — ej. 'Apliqué el patrón strangler-fig garantizando continuidad del servicio durante toda la migración']",
        "[PLACEHOLDER: Agrega un resultado cuantificado — ej. 'La nueva arquitectura redujo el ciclo de despliegue de X horas a Y minutos, acelerando la entrega de features']",
      ],
      technologies: [
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "Kafka",
        "RabbitMQ",
        "Docker",
      ],
    },
    {
      company: "Freelance",
      title: "Desarrollador de Software & Consultor",
      period: "[Mes AAAA] – [Mes AAAA]",
      location: "Remoto",
      bullets: [
        "[PLACEHOLDER: Describe trabajo para Banco Macro — ej. 'Desarrollé la funcionalidad X para la plataforma digital de Banco Macro, mejorando Y para N usuarios']",
        "[PLACEHOLDER: Describe un proyecto temprano de Renault o Interbanking de este período]",
        "[PLACEHOLDER: Describe un producto que entregaste de principio a fin de forma independiente]",
        "[PLACEHOLDER: Describe un desafío técnico clave que resolviste como consultor]",
      ],
      technologies: [
        "React",
        "Next.js",
        "Node.js",
        "TypeScript",
        "MongoDB",
        "MySQL",
      ],
    },
  ],
  education: [
    {
      degree: "Ingeniería en Sistemas",
      institution: "Universidad Abierta Interamericana (UAI)",
      location: "Buenos Aires, Argentina",
      period: "En curso",
      status: "En curso",
    },
  ],
  certifications: [
    {
      name: "[PLACEHOLDER: ej. AWS Certified Solutions Architect – Associate]",
      issuer: "[PLACEHOLDER: ej. Amazon Web Services]",
      year: "[AAAA]",
    },
    {
      name: "[PLACEHOLDER: ej. Google Cloud Professional Cloud Developer]",
      issuer: "[PLACEHOLDER: ej. Google]",
      year: "[AAAA]",
    },
  ],
  skills: [
    {
      category: "Frontend",
      items: [
        "React",
        "Next.js",
        "Astro",
        "Angular",
        "TypeScript",
        "Tailwind CSS",
        "HTML/CSS",
      ],
    },
    {
      category: "Mobile",
      items: [
        "Ionic",
        "Angular",
        "Publicación en App Store (iOS)",
        "Publicación en Google Play",
      ],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Express",
        "REST APIs",
        "GraphQL",
        "PostgreSQL",
        "MySQL",
        "Oracle SQL",
        "MongoDB",
        "Firestore",
      ],
    },
    {
      category: "Cloud e Infraestructura",
      items: [
        "Google Cloud Run",
        "Cloud Storage",
        "Document AI",
        "Vertex AI",
        "Vercel",
        "Docker",
        "GitHub Actions",
      ],
    },
    {
      category: "Mensajería y Streaming",
      items: ["Kafka", "RabbitMQ"],
    },
    {
      category: "Arquitectura",
      items: [
        "Microservicios",
        "Descomposición de Monolitos",
        "Diseño de Sistemas",
        "Diseño de APIs",
      ],
    },
  ],
  languages: [
    { language: "Español", proficiency: "Nativo" },
    { language: "Inglés", proficiency: "C2 — Competente" },
  ],
};
