# Status — Orquestación en GCP con costo cero (parte 1)

Actualizado: 2026-10-02.

## Resumen

Lista para mergear. La parte 1 se publica en ES y EN con `draft: false`. La parte 2 (human-in-the-loop) entra en `main` en `draft: true` y no se publica.

## Dónde está

| Qué | Ruta |
|---|---|
| Nota ES | `src/content/notes/orquestacion-gcp-costo-cero.es.mdx` |
| Nota EN | `src/content/notes/orquestacion-gcp-costo-cero.mdx` |
| Figuras (bilingües) | `src/components/notes/orquestacion/` (`Lanes`, `TwoFlows`, `OfficialArchitecture`, `RunStateMachine`, `LastWorker`) |
| Parte 2 (borrador) | `src/content/notes/human-in-the-loop-gcp.es.mdx`, figuras en `src/components/notes/hitl/` |
| Rama | `post-orquestacion-gcp-costo-cero` |

## Verificación

| Chequeo | Resultado |
|---|---|
| `pnpm build` (con `generate:pdf`) | Verde. Genera `/notes/orquestacion-gcp-costo-cero` y `/es/notes/orquestacion-gcp-costo-cero` |
| `pnpm test` | 15/15 |
| Dev, 1280 y 390 px, claro y oscuro | Revisado. Sin overflow |
| Marcadores `TODO` en el texto | Ninguno |
| Referencias a la entrevista | Ninguna |
| Links a la parte 2 | Ninguno: se la menciona sin link hasta publicarla |

## Decisiones aplicadas

- Dos posts. Esta es la parte 1; la parte 2 queda en borrador.
- Workflows no queda descartado por costo (unos 5 USD/mes con 1.000 usuarios). Para la v1 lo descartan dos cosas: no tiene emulador local oficial, y prefiero el estado en mi base. Para la espera humana sí lo adoptaría.
- Máquina de estados del brief. El último worker cuenta filas con `UNIQUE`.
- Tabla de costos en lugar de gráfico. El árbol de decisión va en un `Callout`.
- El costo del LLM (Haiku 4.5, unos 0,0045 USD por match) es el costo dominante.
- La versión local, argospipe, tiene link. La versión en GCP figura como diseñada, no construida.
- Con usuarios reales, Cloud SQL. Neon queda para dev y test.

## Lo que todavía no se midió

Está en la sección "Lo que todavía no medí" de la nota:

- latencia de punta a punta;
- costo real de un mes;
- volumen a partir del cual deja de costar 0.

## Conocido, fuera de alcance

- **Fechas de todo el sitio un día antes.** `pubDate: 2026-10-01` se muestra como "30 de septiembre": formatear en hora local corre las fechas UTC. Afecta a todas las notas.
- **Neon.** Su página muestra "1 GB/project" de almacenamiento; el brief decía 0,5 GB. La nota no cita esa cifra.

## Parte 2, pendiente antes de publicarla

- El lease puede vencer mientras el worker sigue trabajando. Falta renovarlo y chequear quién es el dueño al cerrar.
- `PublishGap` promete "≤ 1 h" sin respaldo en el texto.
- Hay negritas en medio de frases.
- "Estoy construyendo un SaaS" choca con el encuadre de proyecto personal.
- Falta la versión EN.
