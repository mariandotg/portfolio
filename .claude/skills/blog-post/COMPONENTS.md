# Estándar de componentes

Inspirado en dos ideas:

- **Nityesh (@nityeshaga):** los modelos se entrenan con landing pages y no usan su capacidad de SVG y JS en el navegador. Los visuales son de primera clase. Los flujos se animan para que se puedan reproducir. Antes de compartir, sacá un screenshot y miralo.
- **Thariq, "The Unreasonable Effectiveness of HTML":** los diagramas y los diffs son información espacial, y la prosa los aplana. El movimiento y la interacción no se describen, se sienten. Un componente cuesta de 2 a 4 veces más que la prosa.

De ahí sale la regla: **los visuales son de primera clase, pero cada
componente se gana su lugar.**

## La prueba

Antes de agregar un componente, respondé las tres preguntas. Si alguna es
"no", usá prosa, una tabla o un bloque de código.

1. **¿Muestra algo que la prosa no puede?** Orden en el tiempo, relación espacial, efecto de una variable, comparación lado a lado.
2. **¿El lector entiende más rápido con él?** "En cinco segundos" es la vara.
3. **¿Tiene una sola pregunta?** Escribí la pregunta que responde ("¿qué pasa con los números si resumo 5 veces?"). Si no la podés escribir, no hace falta.

## Cuándo sí: tipo de contenido → componente

| El contenido es… | Usá | Ejemplo |
|---|---|---|
| Un flujo con orden en el tiempo (loop, handoff, ciclo de vida) | Flujo reproducible: `Stepper` o isla animada con play/pausa/paso | Loop `tool_use` → `end_turn` |
| Una relación espacial (arquitectura, jerarquía, quién habla con quién) | Diagrama SVG inline | Hub-and-spoke; capas de `CLAUDE.md` |
| Una variable **continua** que cambia un resultado | Simulador con un slider | Segundos entre requests; largo del loop |
| De 2 a 4 estados **discretos** de un mismo cálculo (con/sin, antes/después, modo A/B) | Diagrama estático en HTML con todos los estados visibles a la misma escala. **Nunca un toggle:** esconde la comparación que es el punto | `InvalidationCascade`, `FanOutTimeline`, `TrimCost` |
| Dos opciones comparadas (rota/correcta, antes/después) | `SideBySide variant="diff"` | Descripción de tool antes y después |
| El mismo contenido en variantes paralelas (lenguajes, configs) | `Tabs` + `Tab` | Implementación en TS y Java |
| Una decisión del lector (escenario tipo examen) | Quiz con revelado: elegir → trampa → respuesta | "¿Qué hace el arquitecto?" |
| Una matriz de comparación (varias opciones × criterios) | Tabla markdown; isla solo si se filtra u ordena | Workflow vs agente por costo/latencia |
| La idea que el lector se lleva | `Callout type="rule"` | La regla en una línea |

## Cuándo no

- Para decorar prosa o repetir lo que dice el párrafo anterior.
- Para un solo dato. Un número va en una frase.
- Código que entra en un bloque de código.
- Una crónica o reflexión personal: prosa con `---`, sin islas.
- Un `Callout` por sección. Pierde peso.
- Animación que no representa un flujo real.

## Presupuesto por nota

| Tipo de nota | Componentes |
|---|---|
| Crónica o reflexión | 0–1 (solo `Callout`) |
| Nota de serie (formato de capas) | **1 héroe** + hasta 3 de soporte. Máximo 2 `Callout` |
| Referencia técnica | Sin tope; cada uno pasa la prueba |

**Componente héroe:** el mecanismo central de la nota, hecho visual o
interactivo. Vive en la capa 2 (ver FORMAT.md), justo después de la analogía.
Una sola isla interactiva pesada por nota.

## Catálogo existente (reusar antes de crear)

Todos en `src/components/notes/`. Precedente de uso:
`src/content/notes/idempotency-distributed-payments.mdx`.

| Componente | Props | Uso |
|---|---|---|
| `Callout.astro` | `type`: `note` \| `rule` \| `warning`; `title?` | Aside con acento: `note` neutro, `rule` para la regla que el lector se lleva, `warning` para una trampa. Un tipo desconocido cae a `note` |
| `SideBySide.astro` | `leftLabel?`, `rightLabel?`, `variant?`: `neutral` \| `diff`. Slots `left`/`right` vía `<Fragment slot="left">` | Comparación. Apila en < 640px |
| `Stepper.astro` + `Step.astro` | `Step`: `title?` | Recorrido paso a paso con prev/next y progreso |
| `Tabs.astro` + `Tab.astro` | `Tab`: `label` | Variantes paralelas |
| `RetrySimulatorIsland.astro` | — | Precedente de simulador: control + contador + veredicto (anterior a la regla de diagramas estáticos) |
| `RequestAnatomy.astro` | — | SVG estático: qué reenvía cada request. Precedente de diagrama estático |
| `agent-loop/kit/Figure.astro` | `question`, `basis` (obligatorio), `n?`; slots `caption` y `a11y` | Marco de visual calculado: pregunta, la figura con **todos sus estados visibles** (sin toggle, ver design-system.md §5), y una línea final con el marcador de base epistémica más las fuentes. Estilos en `agent-loop/agent-loop.css` |
| `agent-loop/LoopTriangleIsland.astro` | — | Héroe con un slider: el loop dibuja un triángulo y el área es lo que se factura. Ejes fijos |
| `agent-loop/TrimCost.astro` | — | 40 y 5 campos a la misma escala: el tamaño del tool result multiplica el total. Nota 1 de la serie |
| `agent-loop/SubagentTriangles.astro`, `ContextIsolation.astro`, `TeamTimeline.astro` | — | Subagentes: triángulos a la misma escala, qué sabe un subagente al empezar, paralelo vs secuencial. Nota 2 de la serie |
| `agent-loop/CompactionSawtooth.astro` | `variant?`: `cost` \| `context` | Serrucho de compaction. `context` (solo tokens) para la serie, `cost` para la nota de ingeniería |
| `agent-loop/FactsSurvival.astro` | — | Qué hechos siguen literales después de cada compaction, con y sin bloque de case facts. Nota 3 de la serie (la posición de los hallazgos va con `SideBySide`) |
| `agent-loop/CacheBreakEven.astro`, `InvalidationCascade.astro`, `LookbackWindow.astro`, `FanOutTimeline.astro`, `ClearingCost.astro` | — | Caching, invalidación, lookback, fan-out y context editing. Nota de ingeniería `the-cache-break` (fuera de la serie). `InvalidationCascade` y `FanOutTimeline` son los precedentes de diagrama estático en HTML |

**Base epistémica (`basis`, obligatoria en `Figure`):** cada figura declara cómo
sabe su número, en mono junto al caption. Si mezcla orígenes, gana el más débil.

| `basis` | Cuándo |
|---|---|
| `measured` | el número se lee de una fuente citada o de una corrida observada; no se deriva nada |
| `calculated` | se deriva aplicando reglas y precios documentados a un escenario declarado |
| `assumed` | depende de una cantidad o un comportamiento que ninguna fuente documenta |

Un workload elegido **no** baja la figura a `assumed`: el escenario es un
parámetro declarado, no una adivinanza. Lo que la baja es un comportamiento sin
documentar del que depende el número — la espera de 8 s antes de que empiece la
respuesta, el tamaño del brief de un subagente, si el pase de compaction lee la
caché. Criterio completo en `docs/design/design-system.md` §5.

**Regla de alcance de la serie CCA:** la guía del examen excluye caching, cálculo de precios y conteo de tokens. Los visuales de la serie muestran tokens, nunca dólares.

Precedente de visuales calculados: `the-quadratic-loop.mdx` (motor en `src/lib/sim/agent-loop/`, galería en `/dev/agent-loop`). Lección del rediseño (2026-09-15): la primera versión, una isla con 6 presets y un playground, quedó sobrecargada. **Interactivo solo cuando la variable es el concepto.** Un visual, una pregunta, un número, escala fija entre estados, y la unidad de la pregunta (dólares para costo).

Los `.astro` no necesitan directiva `client:*` (usan `<script>` propio).

**Problema conocido (visto en captura, 2026-09-14):** `Tabs` y `Stepper` crean
los botones de tab y los dots de progreso con JS. Esos elementos no reciben
los estilos scoped de Astro: los tabs se ven como texto plano y los dots no
aparecen. Hasta corregirlo, verificá esos dos componentes en la captura antes
de usarlos.

## Estándar técnico para componentes nuevos

- **Ubicación:** `src/components/notes/<Nombre>.tsx` + wrapper `<Nombre>Island.astro` con `client:visible`. La nota importa el wrapper, no el `.tsx`.
- **Diagramas estáticos:** componente `.astro` con SVG inline. Sin librerías nuevas (no hay Mermaid ni D3 instalados).
- **Tokens:** `hsl(var(--primary))`, `--foreground`, `--muted-foreground`, `--border`. Sin pares `dark:`. Rojo/verde de estado como en `RetrySimulator` (`hsl(8 75% 57%)` / `hsl(150 55% 42%)`).
- **Contenedor:** clase `not-prose`, margen `1.6rem 0`, borde `--border`, radio 10–12px, como los componentes existentes.
- **Datos:** embebidos y deterministas. Sin fetch ni llamadas a APIs. Cada número se marca "medido" (con la fuente) o "ilustrativo".
- **SVG:** `viewBox` sin ancho fijo, texto con margen para no desbordar, sin líneas cruzadas.
- **Animación:** reproducible (play, pausa, paso) y sin autoplay infinito. Respetá `prefers-reduced-motion`.
- **Accesibilidad:** `<button>` reales, `aria-pressed` en toggles, foco visible, operable con teclado.
- **Mobile:** legible a 390px sin scroll horizontal del cuerpo.

## Verificación visual (obligatoria)

1. Capturas con `node scripts/screenshot.mjs <url>`: 1280px y 390px, light y dark. Atendé cada `WARN` (overflow horizontal, tema incorrecto).
2. Mirá cada captura. Fallas típicas: labels desbordados, líneas cruzadas, contraste bajo en dark, overflow en mobile, pasos ocultos que no aparecen.
3. Recorré todos los estados interactivos en el navegador.
