# Spec — "The Quadratic Loop" (post + simulador)

**Repo:** `portfolio` · **Rama:** `content/cca-series` · **Estado:** borrador para revisión ·
**Depende de:** nada · **Idioma del post:** inglés

## 1. Contexto

La nota 1 de la serie (`dont-hire-a-chef-to-follow-a-recipe.mdx`) quedó rechazada por sencilla.
Los referentes elegidos son Discord ("How Discord Stores Trillions of Messages"), samwho
("Load Balancing") y Anthropic ("How we built our multi-agent research system").

Restricción: **sin gasto en la API**. Por eso el post no mide calidad. Calcula costo y tamaño de
contexto de un loop agéntico con la mecánica documentada de la API. Cada número del post sale de
una fórmula o de un parámetro con fuente. Ningún número se inventa.

## 2. Objetivo

Un post interactivo, estilo samwho, que responde:

> ¿Por qué un agente gasta ~4× los tokens de un chat, y un sistema multi-agente ~15×? ¿Qué palanca
> documentada cambia esa curva, y cuánto cuesta cada una?

Las cifras 4× y 15× son de Anthropic. El post las cita como referencia externa. No las deriva.

**Lector:** par técnico (ver `docs/content-manifesto.md` §1).
**Valor para el CCA:** D1 (loop, subagentes, 27%) y D5 (gestión de contexto, 15%).

## 3. Fuera de alcance

- Calidad o acierto de las respuestas. Si el post menciona calidad, cita Chroma "Context Rot" o Liu et al. "Lost in the Middle".
- Thinking tokens, fast mode, data residency, Batch API (no admite un loop de tools multi-turno).
- Tokenización real. La unidad de entrada del simulador es el token.
- Modelos fuera de Haiku 4.5, Sonnet 5 y Opus 5.

## 4. Hechos verificados (2026-09-15)

| Hecho | Valor | Fuente |
|---|---|---|
| Precio base entrada / salida por MTok | Haiku 4.5 $1/$5 · Sonnet 5 $2/$10 · Opus 5 $5/$25 | [Pricing][pricing] |
| Multiplicadores de cache | Escritura 5 min 1,25× · escritura 1 h 2× · lectura 0,1× del precio base de entrada | [Pricing][pricing] |
| TTL del cache | 5 min por defecto (1 h opcional). Una lectura lo renueva sin costo. Se mide **desde el inicio del request** | [Prompt caching][caching] |
| Mínimo cacheable | Opus 5: 512 · Sonnet 5: 1.024 · Haiku 4.5: 4.096 tokens. Por debajo no se cachea y no hay error | [Prompt caching][caching] |
| Orden del prefijo | `tools` → `system` → `messages` | [Prompt caching][caching] |
| Caching automático en multi-turno | Cada request lee el prefijo anterior y escribe el delta nuevo (tabla de 3 requests de la doc) | [Prompt caching][caching] |
| Contabilidad | `total_input = cache_read_input_tokens + cache_creation_input_tokens + input_tokens` | [Prompt caching][caching] |
| Context window | Opus 5: 1M · Sonnet 5: 1M · Haiku 4.5: 200K | [Models][models] |
| Context editing `clear_tool_uses_20250919` | `trigger` por defecto 100.000 tokens de entrada · `keep` por defecto 3 tool uses · `clear_at_least` opcional · `clear_tool_inputs` por defecto `false` · reemplaza cada resultado por un placeholder · **invalida el prefijo cacheado** | [Context editing][editing] |
| Compaction `compact_20260112` | `trigger` por defecto 150.000 (mínimo 50.000) · descarta los bloques anteriores al bloque `compaction` · la iteración de compaction **se factura** · con breakpoint al final del system, el cache del system sobrevive | [Compaction][compaction] |
| Modelos con compaction | Incluye Opus 5 y Sonnet 5. **No incluye Haiku 4.5** | [Compaction][compaction] |
| Tokens de agentes | Agentes ~4× un chat · multi-agente ~15× un chat | [Anthropic][multiagent] |
| Retiro de Haiku 4.5 | No antes del 15-oct-2026 | [Models][models] |

## 5. Modelo de simulación

### 5.1 Estructura

```
src/lib/sim/agent-loop/
  types.ts         # Workload, Options, RequestRecord, Totals
  pricing.ts       # precios, multiplicadores, mínimos, ventanas (con fecha y URL de fuente)
  engine.ts        # simulate(workload, options) → { requests, totals }
  engine.test.ts   # tests (node:test)
  index.ts         # fachada: los consumidores importan solo desde acá
```

Módulo **puro e isomórfico** (sin APIs de Node), como `src/lib/effects/banner`. Las islas lo
importan en el navegador.

### 5.2 Parámetros

| Parámetro | Símbolo | Tipo |
|---|---|---|
| Modelo | — | `haiku-4-5` \| `sonnet-5` \| `opus-5` |
| Tokens de tools, system y tarea inicial | `P = T + S + U` | supuesto del lector |
| Turnos del loop | `N` | supuesto del lector |
| Salida del asistente por turno (bloque `tool_use`) | `A` | supuesto del lector |
| Resultado de tool por turno | `R` | supuesto del lector |
| Segundos entre inicios de request (generación + latencia de tool) | `g` | supuesto del lector |
| Caching | — | `off` \| `auto-5m` \| `auto-1h` |
| Context editing | — | `off` \| `{ trigger, keep, clearAtLeast }` |
| Compaction | — | `off` \| `{ trigger, summaryTokens }` |
| Subagentes | — | `off` \| `{ count, workloadEach, resultTokens, parallel }` |

Cada valor que viene de la doc se marca **documentado**. Cada valor del lector se marca
**supuesto**. La UI muestra las dos marcas.

### 5.3 Semántica de un request

El request `t` (con `t = 1..N`) envía `P + Σ_{i<t} (A + R)` tokens de entrada y produce `A`
tokens de salida. Después, la tool agrega `R` al historial.

**Sin cache**, la entrada acumulada es exacta:

```
Σ_t input_t = N·P + (A + R) · N(N−1)/2
```

Crece de forma cuadrática en `N`. Esta igualdad es un test del motor.

### 5.4 Caching

- Request 1: escribe todo el prefijo (si supera el mínimo cacheable del modelo).
- Request `t > 1`: lee el prefijo escrito por `t−1` y escribe el delta `A + R`.
- Si el prefijo no llega al mínimo: todo es entrada sin cache.
- Si `g` > TTL: el cache venció. El request escribe el prefijo completo de nuevo.
- Costo del request: `lectura·0,1·p_in + escritura·m·p_in + sin_cache·p_in + salida·p_out`, con `m = 1,25` (5 min) o `2` (1 h).

### 5.5 Context editing

- Antes del request `t`: si la entrada supera `trigger`, se reemplazan los resultados de tool más viejos por un placeholder y se conservan los últimos `keep`.
- Si lo que se libera es menor que `clearAtLeast`, no se aplica.
- **Supuesto (§8, P1):** el prefijo cacheado sigue válido hasta el primer bloque limpiado. Desde ahí, todo se escribe de nuevo.
- **Supuesto (§8, P2):** tamaño del placeholder, parámetro con valor chico por defecto.
- El historial del cliente queda completo. La edición se aplica del lado del servidor en cada request, así que el prefijo queda estable hasta la próxima limpieza.

### 5.6 Compaction

- Antes del request `t`: si la entrada llega a `trigger`, corre una iteración de compaction. Entrada: el contexto completo. Salida: `summaryTokens`. Las dos se facturan.
- Después: contexto = `T + S + resumen + contenido nuevo`. El cache del system sobrevive; el resumen se escribe.
- `summaryTokens` por defecto: 3.500 (valor del ejemplo de la doc, marcado como supuesto).
- **Supuesto (§8, P3):** la iteración de compaction lee el cache igual que un request normal.
- Con Haiku 4.5, la opción queda deshabilitada y la UI dice por qué.

### 5.7 Subagentes

- El coordinador corre su loop. Cada subagente es una llamada `Task` cuyo resultado tiene `resultTokens`.
- Cada subagente corre su propio loop con el mismo motor (`workloadEach`), en un contexto aislado.
- Totales: suma de tokens de todos los agentes. **Pico de contexto:** el del coordinador.
- Tiempo total: `max` de los subagentes si son paralelos, suma si son secuenciales.
- Comparación: un agente único que acumula todos los resultados de tool en su propio contexto.

### 5.8 Límites

Si la entrada de un request supera la ventana del modelo, el request se marca **overflow** y la
simulación se detiene ahí. La UI lo muestra como error, no lo esconde.

## 6. Tests

Runner: `node --import tsx --test` (sin dependencias nuevas; `tsx` ya está en el repo). Script:
`"test": "node --import tsx --test \"src/lib/sim/**/*.test.ts\""`.

- [ ] Tabla de 3 requests de la doc de caching: el request 2 lee hasta `User(2)` y escribe `Asst(2) + User(3)`.
- [ ] Igualdad cuadrática de §5.3 para 200 combinaciones aleatorias con semilla fija de `N`, `P`, `A`, `R`.
- [ ] `total_input = lectura + escritura + sin_cache` en cada request, en todos los modos.
- [ ] Prefijo menor al mínimo cacheable (por modelo): lectura y escritura en 0.
- [ ] `g` mayor que el TTL: el request escribe el prefijo completo.
- [ ] Context editing: no se aplica bajo `trigger`; conserva `keep`; se salta si no alcanza `clearAtLeast`.
- [ ] Compaction: después del `trigger`, el contexto es `T + S + resumen`; la iteración se factura; con Haiku 4.5 devuelve "no soportado".
- [ ] Haiku 4.5 por encima de 200K: overflow.
- [ ] Con todo en `off`, el costo coincide con el cálculo a mano de un caso chico (3 turnos).

## 7. Post

### 7.1 Arco

Cada sección abre con la falla de la anterior.

| § | Sección | Pregunta | Componente |
|---|---|---|---|
| 1 | One call | ¿Qué se paga en un request? | `RequestAnatomy` (SVG estático) |
| 2 | The loop | ¿Por qué 2× requests cuesta ~4×? | `LoopTriangleIsland` (héroe, un slider `N`) |
| 3 | Caching | ¿Qué pasa si una tool tarda más que el cache? | `CacheCost` (toggle 20 s / 5 min 5 s) |
| 4 | Context editing | ¿Por qué limpiar puede costar más? | `ClearingCost` (toggle `clear_at_least` 0 / 20k) |
| 5 | Compaction | ¿Qué hace la compaction con el contexto? | `CompactionSawtooth` (estático) |
| 6 | Subagents | ¿Por qué cuatro loops cortos cuestan menos que uno largo? | `SubagentTriangles` (estático) |

### 7.2 Componentes (rediseño, 2026-09-15)

La primera versión (una isla `AgentLoopSim` con 6 presets y un playground) quedó sobrecargada: muchos controles, ejes que se reescalan solos y gráficos en tokens para preguntas de costo. El lector no entendía qué mirar.

Reglas del rediseño:

- **Un concepto por visual.** Una pregunta como título, un número principal, un gráfico.
- **Interactivo solo cuando la variable es el concepto.** Un slider en el héroe, un toggle de dos estados en caching y editing. Compaction y subagents son diagramas estáticos.
- **Sin playground.** La nota explica conceptos, no es un laboratorio.
- **Escala fija.** Entre estados del mismo visual, el eje no cambia, así el cambio se ve.
- **La unidad es la de la pregunta.** Dólares para costo, tokens para tamaño.
- **Render en el servidor.** Los estáticos y los toggles son `.astro` que calculan con el motor al renderizar. Solo el héroe es una isla React.
- Archivos en `src/components/notes/agent-loop/`: `AlcFigure.astro` (marco + toggle), `agent-loop.css`, `format.ts`, `workloads.ts` (los workloads que citan la prosa y los visuales). Galería de desarrollo en `/dev/agent-loop`.
- Fuentes y supuestos en una línea al pie de cada visual. Precios con fecha visible.

### 7.3 Largo y tono

2.500–3.500 palabras más simulaciones (rango de los referentes). Voz según el manifesto. Cierre
con implicación, sin CTA.

## 8. Preguntas abiertas y supuestos

| Id | Pregunta | Supuesto del simulador | Cómo cerrarla |
|---|---|---|---|
| P1 | ¿Context editing invalida todo el prefijo o solo desde el primer bloque limpiado? | Desde el primer bloque limpiado | Doc de context editing o de caching; si no aparece, el post lo declara como supuesto |
| P2 | ¿Cuántos tokens ocupa el placeholder de un resultado limpiado? | Valor chico, parámetro | Igual que P1 |
| P3 | ¿La iteración de compaction lee el cache? | Sí, como un request normal | Doc de compaction |
| P4 | ¿Qué pasa con la nota 1? | — | Decisión de Mariano: borrar o dejar como borrador |
| P5 | `FORMAT.md`, `COMPONENTS.md` y el overview de la serie piden analogía obligatoria | — | Actualizarlos después de aprobar este spec |

**Riesgos:**
- Haiku 4.5 se puede retirar después del 15-oct-2026. Los precios viven en `pricing.ts` con fecha y el post muestra la fecha.
- Las features en beta (context editing, compaction) pueden cambiar de nombre o de parámetros. El post muestra el identificador con fecha (`compact_20260112`).

## 9. Criterios de aceptación

- [ ] `pnpm test` pasa y cubre la lista de §6.
- [ ] Ningún número del post está sin marca (calculado o supuesto).
- [ ] Cada hecho de §4 aparece en el post con link a su fuente.
- [ ] Capturas 1280/390 × light/dark sin `WARN`, revisadas (skill `blog-post`, paso 7).
- [ ] Recorrido de interacción de los 7 presets en el navegador.
- [ ] `pnpm build` pasa con la nota en `draft: false` localmente y queda en `draft: true` en el commit hasta el OK.

## 10. Plan de entrega

1. Motor + tests (`src/lib/sim/agent-loop/`, script `test`, línea en `CLAUDE.md`).
2. `AgentLoopSim` con los 7 presets.
3. MDX del post.
4. Verificación con la skill `blog-post`.
5. Actualización de `FORMAT.md`, `COMPONENTS.md` y el overview (P5).

Un commit por paso.

[pricing]: https://platform.claude.com/docs/en/about-claude/pricing
[caching]: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
[models]: https://platform.claude.com/docs/en/about-claude/models/overview
[editing]: https://platform.claude.com/docs/en/build-with-claude/context-editing
[compaction]: https://platform.claude.com/docs/en/build-with-claude/compaction
[multiagent]: https://www.anthropic.com/engineering/multi-agent-research-system
