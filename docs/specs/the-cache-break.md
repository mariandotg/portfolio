# Spec — "The Cache Break" (nota de ingeniería)

**Repo:** `portfolio` · **Rama:** `content/cca-series` · **Estado:** borrador para revisión ·
**Depende de:** motor `src/lib/sim/agent-loop/` (no se edita) · **Idioma de la nota:** inglés ·
**Serie:** ninguna. Nota suelta de ingeniería, fuera del temario del examen CCA
(ver `docs/specs/the-quadratic-loop.md` §11).

## 1. Objetivo

Responder una sola pregunta con números propios:

> El cache de prompts de Claude no es un booleano. Tiene una vida útil que se mide
> desde el inicio del request, un piso de tokens por debajo del cual no activa, una
> jerarquía que decide qué invalida qué, una ventana de 20 posiciones que puede
> perder el hit, y un comportamiento distinto con requests paralelos. ¿Dónde se
> rompe cada supuesto ingenuo, y cuánto cuesta cuando se rompe?

La nota 1 de la serie (`the-quadratic-loop.mdx`) ya explica por qué el historial de
un loop agéntico crece al cuadrado y qué hace el cache con ese costo en el caso
simple. Esta nota no repite esa derivación — la linkea — y se queda en las
trampas del cache mismo: TTL, piso mínimo, invalidación, lookback y paralelismo.
Además cubre las dos palancas que rompen el cache a propósito (context editing,
compaction), que la nota 1 ya toca pero sin el detalle de trampa por trampa.

**Lector:** par técnico (`docs/content-manifesto.md` §1).

## 2. Fuera de alcance

- Calidad o acierto de las respuestas.
- Thinking tokens, tokenización real, rate limits.
- Modelos fuera de Haiku 4.5, Sonnet 5 y Opus 5.
- Preguntas del examen CCA real o del simulacro (NDA).
- Cache isolation por plataforma (Bedrock, Vertex): se menciona como dato suelto, no
  se simula.

## 3. Hechos verificados

Fuente completa: `/Users/marianoguillaume/.claude/jobs/0cdd1a91/tmp/cache-break-facts.md`
(fetch 2026-09-15). Filas relevantes para esta nota:

| # | Hecho | Valor | Fuente |
|---|---|---|---|
| 1 | Orden del prefijo de cache | `tools` → `system` → `messages`, jerárquico | [Prompt caching][caching] |
| 2 | Breakpoints explícitos por request | Máximo 4. Con 4 ya puestos, un breakpoint automático adicional devuelve 400 | [Prompt caching][caching] |
| 3 | Cache automático | Un solo `cache_control` a nivel request; el sistema lo aplica al último bloque cacheable compartido | [Prompt caching][caching] |
| 4 | Ventana de lookback | 20 posiciones, contando el breakpoint como la primera. Una corrida de `tool_use` (o de `tool_result`) consecutivos cuenta como **una** posición | [Prompt caching][caching] |
| 5 | Qué invalida cada nivel | Tabla completa en el hecho #5 del archivo de fuentes: tool definitions, web search/citations, speed, `tool_choice`, imágenes, thinking, effort | [Prompt caching][caching] |
| 6 | TTL | 5 min por defecto, 1 h opcional. Se mide **desde el inicio** del request que escribe o lee, no desde el final de la respuesta | [Prompt caching][caching] |
| 7 | Mínimo cacheable | Opus 5: 512 · Sonnet 5: 1.024 · Haiku 4.5: 4.096 tokens. Por debajo, no se cachea y no hay error; `cache_creation_input_tokens` y `cache_read_input_tokens` quedan en 0 | [Prompt caching][caching] |
| 8 | Requests concurrentes | Una entrada de cache está disponible solo **después de que empieza la primera respuesta** | [Prompt caching][caching] |
| 9 | Campos de `usage` | `cache_creation_input_tokens`, `cache_read_input_tokens`, `input_tokens`; desglose por TTL en `cache_creation.ephemeral_5m_input_tokens` / `ephemeral_1h_input_tokens` | [Prompt caching][caching] |
| 11 | Precio base Sonnet 5 | $2 / $10 por MTok (entrada/salida) | [Pricing][pricing] |
| 12 | Multiplicadores de cache | Escritura 5 min 1,25× · escritura 1 h 2× · lectura 0,1× del precio base de entrada | [Pricing][pricing] |
| 13 | Batch API | 50% off entrada y salida; se combina con el cache | [Pricing][pricing] |
| 14–16 | `clear_tool_uses_20250919` | `trigger` 100.000 tokens · `keep` 3 · `clear_at_least` sin default · limpiar invalida el prefijo desde ahí | [Context editing][editing] |
| 17 | `clear_thinking_20251015` | `keep` con default por modelo (una frase, sin simular) | [Context editing][editing] |
| 18 | `context_management.applied_edits[]` | Reporta qué se limpió por request | [Context editing][editing] |
| 19 | `compact_20260112` | Beta `compact-2026-01-12`. **No en Haiku 4.5** | [Compaction][compaction] |
| 20 | Trigger de compaction | Default 150.000 · mínimo 50.000 | [Compaction][compaction] |
| 21 | Facturación de compaction | Se factura como iteración separada (`usage.iterations[]`); `usage.input_tokens`/`output_tokens` de nivel superior **no la incluyen** | [Compaction][compaction] |
| 22 | Breakpoint recomendado | `cache_control` al final del system prompt, para que sobreviva a la compaction | [Compaction][compaction] |

## 4. Supuestos de la simulación

Todos declarados también en la nota, junto al visual que los usa.

| Id | Supuesto | Dónde se usa |
|---|---|---|
| S1 | Un resultado limpiado deja un placeholder de 10 tokens | `ClearingCost`, prosa §7 |
| S2 | La limpieza invalida solo desde el primer bloque limpiado; el prefijo anterior sigue cacheado | `ClearingCost`, `InvalidationLadder` |
| S3 | La iteración de compaction lee el cache como un request normal | `CompactionSawtooth`, prosa §8 |
| S4 | El tamaño del resumen de compaction es 3.500 tokens (ejemplo de la doc, no un default documentado) | `CompactionSawtooth` |
| S5 | El primer token de una respuesta a un prefijo compartido de 40.000 tokens tarda ~8 s en empezar a llegar (no documentado, ilustrativo) | `FanOutCache` |
| S6 | El workload base es el mismo `BASE_WORKLOAD` de la nota 1: prefijo 5.500 tokens (3.000 tools + 2.000 system + 500 tarea), salida 400 tokens, resultado de tool 3.000 tokens, 30 requests, Sonnet 5 | Todos los visuales, salvo donde se indique otro tamaño |

## 5. Arco de secciones

Cada sección abre con lo que la anterior no resolvió.

| § | Sección | Falla que abre la sección | Visual |
|---|---|---|---|
| 1 | Apertura: precio, no tamaño | El cache no reduce el historial (nota 1); reduce lo que se paga por él | ninguno (link a nota 1) |
| 2 | Trampa: el TTL cuenta desde el inicio | Una tool lenta hace que el cache nunca pegue un hit | `CacheCost` (existente), `CacheBreakEven` (nuevo) |
| 3 | Trampa: piso mínimo | Un prefijo corto no cachea y no avisa | tabla markdown, sin visual nuevo |
| 4 | Trampa: qué invalida el prefijo | Cambiar una tool, el system o `tool_choice` no cuestan lo mismo | `InvalidationLadder` (nuevo) + tabla markdown |
| 5 | Trampa: ventana de 20 bloques | Una conversación larga puede perder el hit aunque el cache esté vivo | `LookbackWindow` (nuevo) |
| 6 | Trampa: requests paralelos | Lanzar N requests a la vez no cachea N veces | `FanOutCache` (nuevo) |
| 7 | Palanca: context editing | Reduce el tamaño rompiendo el cache a propósito; sin `clear_at_least` sale más caro que no editar | `ClearingCost` (existente) |
| 8 | Palanca: compaction | Reduce más, pero su costo se esconde si no se suma `usage.iterations[]` | `CompactionSawtooth` (existente, sin props) |
| 9 | Medirlo en producción | Ninguna palanca sirve si no se mide el hit rate real | fórmula derivada + snippet de código |
| 10 | Qué me llevo | — | `Callout type="takeaway"` + límites |

## 6. Componentes nuevos

Estándar técnico: `.claude/skills/blog-post/COMPONENTS.md`. Ubicación:
`src/components/notes/agent-loop/`. `viewBox` 480 de ancho, texto ≥ 12 unidades,
`role="img"` + `aria-label`, escala fija entre estados de un toggle, cálculo en el
frontmatter con el motor (`simulate`, `CACHE`, `MODELS`), sin props para que la
galería (`/dev/agent-loop`) los renderice solos.

- **`CacheBreakEven.astro`** — estático. Eje x: segundos entre requests (0 a 15
  min). Eje y: costo total del loop base de 30 requests. Tres líneas: sin cache,
  cache de 5 min, cache de 1 h. Marca en 5:00 (`.alc-marker`). Titular: el punto
  donde la línea de 5 min cruza por encima de "sin cache", y el costo fijo de 1 h.
- **`InvalidationLadder.astro`** — toggle de 4 estados (`message`, `tool_choice`,
  `system`, `tools`) sobre el request 20 del loop base con cache de 5 min. Barra
  apilada horizontal (tools | system | messages), leído vs escrito. Costo del
  request y su múltiplo contra el caso normal (`message`).
- **`LookbackWindow.astro`** — estático, dos filas. Fila 1: el ejemplo de la doc
  (35 bloques, entrada en el bloque 15, ventana 35→16, la entrada queda una
  posición afuera). Fila 2: el mismo crecimiento con tool calls en paralelo, donde
  una corrida de `tool_use`/`tool_result` cuenta como una posición y la entrada
  sigue dentro de la ventana.
- **`FanOutCache.astro`** — toggle `together` / `staggered`. 8 requests paralelos
  que comparten un prefijo de 40.000 tokens. `together`: los 8 escriben (1,25×).
  `staggered`: el primero escribe, los otros 7 leen (0,1×). Costo en tokens
  equivalentes y en USD sobre Sonnet 5, más la espera extra asumida (S5).

## 7. Criterios de aceptación

- [ ] Todo número documentado de la nota tiene fila en §3 y link a la fuente.
- [ ] Todo número calculado sale de un script que importa el motor (
  `/Users/marianoguillaume/.claude/jobs/0cdd1a91/tmp/cache-break-numbers.ts`) —
  ninguno a mano.
- [ ] Todo supuesto de §4 aparece declarado en la nota, junto al visual que lo usa.
- [ ] `draft: true`, `collection: "engineering-notes"`, sin `series` ni
  `seriesOrder`.
- [ ] `CompactionSawtooth` se usa sin props (otra sesión le agrega `variant`, no se
  edita el componente).
- [ ] `CacheCost.astro` y `ClearingCost.astro` se reusan tal cual, o con extras
  menores que no rompen `the-quadratic-loop.mdx`.
- [ ] Capturas 1280/390 × light de cada visual nuevo, sin overlap ni overflow.
- [ ] `curl` a `/notes/the-cache-break` devuelve 200 con `draft: false` temporal;
  sin errores en el log del dev server; se vuelve a `draft: true` después.
- [ ] 2.500–3.500 palabras.
- [ ] Máximo 3 `Callout`.

[pricing]: https://platform.claude.com/docs/en/about-claude/pricing
[caching]: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
[editing]: https://platform.claude.com/docs/en/build-with-claude/context-editing
[compaction]: https://platform.claude.com/docs/en/build-with-claude/compaction
