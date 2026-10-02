# Status — Orquestación en GCP con costo cero (parte 1)

Actualizado: 2026-10-02.

## Resumen

El borrador de la parte 1 está escrito y se renderiza en dev. **No está listo para publicar.** Faltan tres cosas:

1. Tu revisión de las decisiones abiertas.
2. La versión en inglés. El build la exige para publicar.
3. Arreglar el build de la parte 2.

## Dónde está

| Qué | Ruta |
|---|---|
| Nota (ES) | `src/content/notes/orquestacion-gcp-costo-cero.es.mdx` |
| Componente genérico de carriles | `src/components/notes/orquestacion/Lanes.astro` |
| Figura 1, dos flujos | `src/components/notes/orquestacion/TwoFlows.astro` |
| Figura 2, arquitectura oficial | `src/components/notes/orquestacion/OfficialArchitecture.astro` |
| Figura 3, máquina de estados | `src/components/notes/orquestacion/RunStateMachine.astro` |
| Figura 4, último worker | `src/components/notes/orquestacion/LastWorker.astro` |
| Rama | `post-orquestacion-gcp-costo-cero` (sale de `worktree-post-human-in-the-loop-gcp`), pusheada, sin PR |
| Worktree | `.claude/worktrees/post-orquestacion-gcp` |
| Parte 2 (sin cambios) | `src/content/notes/human-in-the-loop-gcp.es.mdx`, rama `worktree-post-human-in-the-loop-gcp` |

## Estado

| Item | Estado |
|---|---|
| `draft` | `true` en el commit. `false` solo en la copia local, para leerla en dev. |
| Idioma | Solo ES. Falta la versión EN. |
| Largo | 2.698 palabras con tablas. El objetivo del brief es 1.800–2.500. |
| Verificado en dev | Sí: 1280 y 390 px, claro y oscuro. El script de capturas no avisó overflow. |
| Build (`pnpm astro build`) | Falla, pero no por esta nota (ver bloqueos). Por eso los componentes solo están probados en dev. |
| Serie | No hay JSON de serie. Las dos partes se enlazan solo en el texto. |

## Origen

La nota sale de la auditoría del borrador de la parte 2 contra el brief "orquestación en GCP con costo cero". Hubo dos reportes: uno de Claude (Opus 5.5) y otro de Codex (`gpt-6-astra`, reasoning medium). Los dos coincidieron en que el borrador cubría bien la espera humana, pero le faltaban el origen, los dos flujos, la DLQ, el último worker y WIF.

## Decisiones tomadas sin tu OK (todas reversibles)

| Decisión | Alternativa |
|---|---|
| Dos posts: parte 1 nueva (este) y parte 2 (tu borrador de human-in-the-loop) | La de Codex: un solo post y recortar la parte de human-in-the-loop |
| Tesis ajustada: el costo en reposo descarta a Composer; testing local, control del estado y el límite de 10.000 ejecuciones activas descartan a Workflows | La tesis original del brief: "ninguno de los dos, por costo en reposo" |
| Máquina de estados del brief (`created → prefiltered → matching → matched → notified`); la espera humana sigue en la parte 2 | Unificar con `waiting_approval → tailoring → done` en un solo diagrama |
| El último worker cuenta filas con `UNIQUE` en vez de sumar un contador | El contador del brief, que cuenta dos veces un mensaje duplicado |
| El costo por cantidad de usuarios va en una tabla calculada, no en un gráfico | Diagrama 5 del brief |
| El árbol de decisión va en un `Callout` de regla | Diagrama 6 del brief |
| No hice la ficha previa que pide la skill `blog-post` | — |

## Cobertura del brief

| # | Punto | Estado |
|---|---|---|
| 1 | Origen en la entrevista | cubierto |
| 2 | Dos flujos | cubierto (figura 1 + tabla) |
| 3 | Restricciones | cubierto |
| 4 | Opciones, incluidos Cloud Run solo y RabbitMQ frente a Pub/Sub | cubierto |
| 5 | Tabla con las 10 filas | cubierto |
| 6 | Números con fuente | cubierto; la estimación de Composer está marcada como de la comunidad |
| 7 | Decisión y track experimental | cubierto |
| 8 | Qué se pierde y cómo lo mitigo | cubierto |
| 9 | Confiabilidad: `UNIQUE`, DLQ, último worker, rescate | cubierto |
| 10 | Cuándo cambiaría | cubierto |
| 11 | Costos ocultos | cubierto, con TODO |
| 12 | Seguridad: WIF y una service account por servicio | cubierto |
| 13 | Human-in-the-loop | resumen y link a la parte 2 |
| 14 | Mediciones | como TODO(medir) |

Están las 7 frases obligatorias.

**Diagramas:** 1, 2, 3 y 4 están como figuras. El 5 es una tabla y el 6 es un `Callout`. El 7 está en la parte 2 (`WaitStateMap`).

## Bloqueos para publicar

1. **El build de la parte 2 está roto.** El `.es.mdx` de human-in-the-loop está commiteado con `draft: false`, y no hay versión EN commiteada. `assertTranslationIntegrity` (`src/lib/notes.ts`) tira error. El `.mdx` sin commitear en el worktree `post-human-in-the-loop-gcp` no sirve como EN: está en español y declara `lang: "en"`.
2. **A esta nota le falta la versión EN.** Sin ella, el build falla igual apenas pase a `draft: false`.
3. **Decisiones abiertas.** Las de la tabla de arriba.

## TODO en el texto

| Línea | Tipo | Qué |
|---|---|---|
| 105 | medir | Latencia de punta a punta de cada opción, sobre 50 corridas sintéticas |
| 107 | verificar | Si existe un emulador de Cloud Workflows |
| 119 | verificar | Desde qué volumen la tabla + Pub/Sub deja de costar 0 |
| 142 | verificar | Costo fijo de una forwarding rule del Load Balancer |
| 184 | verificar | Cómo se comporta el subquery de conteo al reevaluar después del lock (test de concurrencia) |
| 192 | verificar | Cupo gratis de jobs de Cloud Scheduler |
| 216 | verificar | CU-horas del barrido horario en Neon free |
| 218 | verificar | Free tier en regiones de EE.UU. frente a la UE |
| 220 | medir | Costo real del track oficial durante un mes |

## Hallazgos de la auditoría que siguen abiertos en la parte 2

- El lease puede vencer mientras el worker sigue generando, y entonces otro worker reclama la misma corrida. Falta renovar el lease y chequear quién es el dueño al cerrar.
- La figura `PublishGap` promete "≤ 1 h", y eso no se puede deducir del texto.
- Hay negritas en medio de frases (L23, L104, L148, L198).
- "Estoy construyendo un SaaS" y "Hoy el flujo corre de punta a punta" chocan con el encuadre del brief.

## Próximos pasos

1. Leer la nota en dev y decidir las decisiones abiertas.
2. Arreglar el build de la parte 2: traducir al inglés o volver a `draft: true`.
3. Escribir la versión EN de la parte 1.
4. Opcional: crear el JSON de la serie y poner `series`/`seriesOrder` en las dos notas.
5. Cerrar los TODO o dejarlos explícitos en el texto publicado.
6. Abrir el PR.
