import type { Lang } from "@/i18n/utils";

export const agentLoopUi = {
  en: {
    basis: {
      measured: "measured",
      calculated: "calculated",
      assumed: "assumed",
    },
    basisLabel: "Basis: ",
    figurePrefix: "Fig",
    sourceLabel: "Source",
    sourceAsOf: (date: string) => `, as of ${date}.`,
    sourceLinks: {
      caching: "prompt caching",
      pricing: "pricing",
      contextEditing: "context editing",
    },
    callout: {
      defaults: {
        note: "Note",
        rule: "Rule",
        warning: "Warning",
      },
      titles: {
        "On the exam": "On the exam",
        "The rule": "The rule",
        "How to read the numbers": "How to read the numbers",
      },
    },
    sideBySide: {
      before: "Before",
      after: "After",
      labels: {
        Before: "Before",
        After: "After",
        "Prose summary": "Prose summary",
        "Structured data": "Structured data",
        "Key finding buried in the middle": "Key finding buried in the middle",
        "Key finding on top, with headers": "Key finding on top, with headers",
      },
    },
    loopTriangle: {
      inputTokens: "input tokens",
      finalContext: "the final context",
      lastRequestSends: "The last request sends",
      halfLoopPrefix: (requests: number, tokens: string) =>
        `Half the loop (${requests} requests) bills ${tokens}: twice the requests, `,
      halfLoopSuffix: " the tokens.",
      requests: "requests",
      requestOne: "request 1",
      requestArrow: "request →",
      newThisRequest: "new this request",
      sentAgain: "sent again",
      areaBilled: "area = input tokens billed",
      rangeLabel: "requests",
      animation: "Animation",
      pause: "❚❚ pause",
      run: "▶ run the loop",
      aria: (turns: number, last: string, total: string) =>
        `${turns} requests. Each bar is the context one request sends; the last one sends ${last} tokens. The total area, ${total} input tokens, is what the loop sends in total.`,
    },
    cacheBreakEven: {
      question: "How slow can a tool be before the cache stops paying?",
      delta: "5-min cache turns worse past this gap",
      statBeforeMiss: (ttl: string) =>
        `Past ${ttl} between request starts, the 5-minute cache never gets a hit: every request writes the whole prefix again at 1.25×, and the loop costs `,
      statBetweenCosts: " instead of ",
      statAfterHit: (hour: string) =>
        `. The 1-hour cache costs ${hour} at any gap in this range.`,
      scale: (max: string) => `0 – ${max} total cost`,
      xTitle: "seconds between request starts →",
      endTick: "15 min",
      labels: {
        noCache: "no cache",
        fiveMinMiss: "5-min (miss)",
        oneHour: "1-hour",
        fiveMinHit: "5-min (hit)",
      },
      aria: (noCache: string, oneHour: string, hit: string, miss: string) =>
        `Total cost of the 30-request loop as a function of seconds between requests, 0 to 15 minutes. No cache stays flat at ${noCache}. The 1-hour cache stays flat at ${oneHour}. The 5-minute cache stays at ${hit} up to 5 minutes, then jumps to ${miss} past 5 minutes, becoming more expensive than no cache.`,
      caption: (ttl: string) => `Cache break-even: 5-minute TTL at ${ttl}.`,
      columns: ["mode", "cost at short gaps", "cost past TTL"],
      rows: {
        noCache: "no cache",
        oneHour: "1-hour cache",
        fiveMinute: "5-minute cache",
      },
      source:
        "Every request in this loop waits the same number of seconds, so a cache mode either hits on every request or misses on every request — the line steps once, at the TTL, instead of sloping. Claude Sonnet 5, 30-request loop.",
    },
    invalidationCascade: {
      question: "Which change at request 20 costs the least, and which the most?",
      caption:
        "Request 20 of a 30-request loop with a warm 5-minute cache: which blocks each change forces the cache to rewrite, and what the request costs.",
      changes: {
        appendResult: "append a tool result",
        toolChoice: "tool_choice",
        systemPrompt: "system prompt",
        toolDefinition: "a tool definition",
      },
      columns: {
        change: "change at request 20",
        scale: "what the request sends, by block",
        cost: "cost",
      },
      statuses: {
        rewritten: "rewritten",
        mostlyRead: "mostly read, newest tail written",
        read: "read from cache",
      },
      legend: {
        read: "read from cache (0.1×)",
        write: "written to cache (1.25×)",
        rule: "a change rewrites its block and every block to its right",
      },
      source: (total: string) =>
        `Cache hierarchy: tools → system → messages. Bar width is each block's share of the ${total}-token request. Claude Sonnet 5 prices from the engine's request-20 context.`,
    },
    lookbackWindow: {
      question: "Why does a 20-block lookback miss a cache entry that's still alive?",
      introBeforeCode:
        "The lookback checks at most 20 positions per breakpoint, counting the breakpoint itself as the first. A run of consecutive ",
      introBetweenCode: " blocks counts as one position — so does a run of consecutive ",
      introAfterCode: " blocks.",
      aria:
        "Two rows of 35 blocks with a cache entry written at block 15. Sequential: the 20-position window checks blocks 35 down to 16, and the entry at block 15 falls one position outside — a miss. Parallel: the same growth made of parallel tool calls collapses blocks 16 to 35 into 4 positions, so the entry at block 15 is only 5 positions back — a hit.",
      sequentialTitle: "sequential tool calls — miss",
      parallelTitle: "same growth, parallel tool calls — hit",
      windowLabel: (start: number, end: number) => `${end - start + 1}-position window (${end} → ${start})`,
      positionLabel: (position: number) => `pos ${position}`,
      missCallout: { block: "block 15", detail: "1 position short" },
      hitCallout: { block: "block 15", detail: "position 5 of 20" },
      legend: {
        outside: "entry outside the window — miss",
        inside: "entry inside the window — hit",
        window: "inside the 20-position window",
        parallel: "parallel run, alternate position",
      },
      caption: "35-block growth: cache entry at block 15, 20-position lookback.",
      columns: ["layout", "entry reachable?"],
      rows: {
        sequential: "sequential (1 block = 1 position)",
        sequentialResult: "miss — 1 position outside window",
        parallel: "parallel runs (5 blocks = 1 position)",
        parallelResult: "hit — entry is position 5 of 20",
      },
      source:
        "Row 1 is the docs' own turn-3 example: 35 blocks, an entry written at block 15, the window checks positions 35→16 and misses by one. Row 2 is an illustrative reconstruction of the same 35-block growth as 2 turns of 5 parallel tool calls each, to show how the run-counts-as-one-position rule changes the count — the docs don't publish this second example. The fix for a real miss is an explicit breakpoint placed often enough that no gap exceeds 20 positions — up to 4 explicit breakpoints per request.",
    },
    fanOutTimeline: {
      question: "Does firing 8 parallel requests cache 8 times?",
      laneLabels: {
        together: "all at once",
        staggered: "first, then the rest",
      },
      firstResponseBegins: "first response begins",
      requestLabel: (count: number) => (count === 1 ? "1 request" : `${count} requests`),
      writeAt: (count: number, seconds: number) =>
        `${count === 1 ? "1 request" : `${count} requests`} at ${seconds} s write the prefix at 1.25×.`,
      readAt: (count: number, seconds: number) =>
        `${count === 1 ? "1 request" : `${count} requests`} at ${seconds} s read the prefix at 0.1×.`,
      legend: {
        writes: (tokens: string) => `writes the ${tokens} prefix (1.25×)`,
        reads: "reads it from cache (0.1×)",
        staggering: (saving: string) => `staggering: ${saving}`,
      },
      source:
        "Assumption: 8 requests sharing a 40,000-token prefix (tools, system, and a shared document); the 8-second wait for the first response to begin is illustrative, not documented. Rule: a cache entry becomes available only after the first response begins.",
    },
    clearingCost: {
      question: "Why can clearing old tool results cost more than keeping them?",
      caption: (turns: number, threshold: string, max: string) =>
        `Tokens sent per request over ${turns} requests, comparing clear_at_least: 0 against clear_at_least: ${threshold}, on the same 0–${max} token scale.`,
      setting: "setting",
      scale: (max: string) => `0–${max} tokens sent per request`,
      srScale: "tokens sent per request, stacked by cache read, cache write, and uncached input",
      cost: "cost",
      requestAxis: "request →",
      settingEach: "clear_at_least: 0",
      settingBatched: (threshold: string) => `clear_at_least: ${threshold}`,
      noteEach: (clears: number, turns: number) =>
        `${clears} of ${turns} requests clear something. No cache entry ends where the edit happened, so each of those requests writes everything after the task again.`,
      noteBatched: (clears: number) =>
        `Clearing happens in ${clears} batches. Most requests read the cache again.`,
      sr: (turns: number, setting: string, note: string, cost: string, change: string, max: string, trigger: string) =>
        `Tokens sent per request over ${turns} requests, ${setting}. ${note} Total cost ${cost}, ${change} vs no clearing. The full client history reaches ${max}; clearing keeps the prompt near the ${trigger} trigger.`,
      legend: {
        read: "read from cache (0.1×)",
        write: "written to cache (1.25×)",
        history: "history without clearing",
        trigger: (tokens: string) => `trigger ${tokens}`,
      },
      sourceDefaults: "defaults: 100k-token trigger, keep the last 3 results.",
      sourceAfterCode:
        " Clearing invalidates the cached prefix. Assumption: a cleared result leaves a 10-token placeholder, and only the cleared blocks change, so a request still reads the last cache entry written before the first of them.",
    },
  },
  es: {
    basis: {
      measured: "medida",
      calculated: "calculada",
      assumed: "supuesto",
    },
    basisLabel: "Base: ",
    figurePrefix: "Fig.",
    sourceLabel: "Fuente",
    sourceAsOf: (date: string) => `, consultado el ${date}.`,
    sourceLinks: {
      caching: "caching de prompts",
      pricing: "precios",
      contextEditing: "edición de contexto",
    },
    callout: {
      defaults: {
        note: "Nota",
        rule: "Regla",
        warning: "Advertencia",
      },
      titles: {
        "On the exam": "En el examen",
        "The rule": "La regla",
        "How to read the numbers": "Cómo leer los números",
      },
    },
    sideBySide: {
      before: "Antes",
      after: "Después",
      labels: {
        Before: "Antes",
        After: "Después",
        "Prose summary": "Resumen en prosa",
        "Structured data": "Datos estructurados",
        "Key finding buried in the middle": "Hallazgo clave perdido en el medio",
        "Key finding on top, with headers": "Hallazgo clave arriba, con encabezados",
      },
    },
    loopTriangle: {
      inputTokens: "tokens de entrada",
      finalContext: "el contexto final",
      lastRequestSends: "La última solicitud envía",
      halfLoopPrefix: (requests: number, tokens: string) =>
        `La mitad del bucle (${requests} solicitudes) factura ${tokens}: el doble de solicitudes, `,
      halfLoopSuffix: " de los tokens.",
      requests: "solicitudes",
      requestOne: "solicitud 1",
      requestArrow: "solicitud →",
      newThisRequest: "nuevo en esta solicitud",
      sentAgain: "enviado de nuevo",
      areaBilled: "área = tokens de entrada facturados",
      rangeLabel: "solicitudes",
      animation: "Animación",
      pause: "❚❚ pausar",
      run: "▶ ejecutar el bucle",
      aria: (turns: number, last: string, total: string) =>
        `${turns} solicitudes. Cada barra es el contexto que envía una solicitud; la última envía ${last} tokens. El área total, ${total} tokens de entrada, es lo que envía el bucle en total.`,
    },
    cacheBreakEven: {
      question: "¿Qué tan lenta puede ser una tool antes de que el cache deje de convenir?",
      delta: "El cache de 5 min empeora después de este intervalo",
      statBeforeMiss: (ttl: string) =>
        `Después de ${ttl} entre inicios de solicitudes, el cache de 5 minutos nunca acierta: cada solicitud vuelve a escribir todo el prefijo a 1.25× y el bucle cuesta `,
      statBetweenCosts: " en vez de ",
      statAfterHit: (hour: string) =>
        `. El cache de 1 hora cuesta ${hour} con cualquier intervalo de este rango.`,
      scale: (max: string) => `0 – ${max} de costo total`,
      xTitle: "segundos entre inicios de solicitudes →",
      endTick: "15 min",
      labels: {
        noCache: "sin cache",
        fiveMinMiss: "5 min (miss)",
        oneHour: "1 hora",
        fiveMinHit: "5 min (hit)",
      },
      aria: (noCache: string, oneHour: string, hit: string, miss: string) =>
        `Costo total del bucle de 30 solicitudes según los segundos entre solicitudes, de 0 a 15 minutos. Sin cache queda plano en ${noCache}. El cache de 1 hora queda plano en ${oneHour}. El cache de 5 minutos queda en ${hit} hasta 5 minutos, luego salta a ${miss} después de 5 minutos y pasa a costar más que sin cache.`,
      caption: (ttl: string) => `Punto de equilibrio del cache: TTL de 5 minutos en ${ttl}.`,
      columns: ["modo", "costo en intervalos cortos", "costo después del TTL"],
      rows: {
        noCache: "sin cache",
        oneHour: "cache de 1 hora",
        fiveMinute: "cache de 5 minutos",
      },
      source:
        "Cada solicitud de este bucle espera la misma cantidad de segundos, así que un modo de cache acierta en todas las solicitudes o falla en todas: la línea da un salto en el TTL en vez de inclinarse. Claude Sonnet 5, bucle de 30 solicitudes.",
    },
    invalidationCascade: {
      question: "¿Qué cambio en la solicitud 20 cuesta menos y cuál cuesta más?",
      caption:
        "Solicitud 20 de un bucle de 30 solicitudes con un cache de 5 minutos activo: qué bloques obliga a reescribir cada cambio y cuánto cuesta la solicitud.",
      changes: {
        appendResult: "agregar un resultado de tool",
        toolChoice: "tool_choice",
        systemPrompt: "system prompt",
        toolDefinition: "una definición de tool",
      },
      columns: {
        change: "cambio en la solicitud 20",
        scale: "qué envía la solicitud, por bloque",
        cost: "costo",
      },
      statuses: {
        rewritten: "reescrito",
        mostlyRead: "mayormente leído, cola más reciente escrita",
        read: "leído del cache",
      },
      legend: {
        read: "leído del cache (0.1×)",
        write: "escrito en el cache (1.25×)",
        rule: "un cambio reescribe su bloque y todos los bloques a su derecha",
      },
      source: (total: string) =>
        `Jerarquía del cache: tools → system → messages. El ancho de cada barra representa la proporción de cada bloque en la solicitud de ${total} tokens. Precios de Claude Sonnet 5 según el contexto de la solicitud 20 del motor.`,
    },
    lookbackWindow: {
      question: "¿Por qué una ventana de lookback de 20 bloques pierde una entrada de cache que todavía está activa?",
      introBeforeCode:
        "El lookback revisa como máximo 20 posiciones por breakpoint, contando el breakpoint mismo como la primera. Una secuencia consecutiva de ",
      introBetweenCode: " bloques cuenta como una posición; lo mismo ocurre con una secuencia consecutiva de ",
      introAfterCode: " bloques.",
      aria:
        "Dos filas de 35 bloques con una entrada de cache escrita en el bloque 15. Secuencial: la ventana de 20 posiciones revisa los bloques 35 a 16 y la entrada del bloque 15 queda una posición afuera: miss. Paralelo: el mismo crecimiento hecho con tool calls paralelas agrupa los bloques 16 a 35 en 4 posiciones, así que la entrada del bloque 15 queda a solo 5 posiciones: hit.",
      sequentialTitle: "tool calls secuenciales — miss",
      parallelTitle: "mismo crecimiento, tool calls paralelas — hit",
      windowLabel: (start: number, end: number) => `ventana de ${end - start + 1} posiciones (${end} → ${start})`,
      positionLabel: (position: number) => `posición ${position}`,
      missCallout: { block: "bloque 15", detail: "falta 1 posición" },
      hitCallout: { block: "bloque 15", detail: "posición 5 de 20" },
      legend: {
        outside: "entrada fuera de la ventana — miss",
        inside: "entrada dentro de la ventana — hit",
        window: "dentro de la ventana de 20 posiciones",
        parallel: "secuencia paralela, posición alternada",
      },
      caption: "Crecimiento de 35 bloques: entrada de cache en el bloque 15, lookback de 20 posiciones.",
      columns: ["disposición", "¿se puede alcanzar la entrada?"],
      rows: {
        sequential: "secuencial (1 bloque = 1 posición)",
        sequentialResult: "miss — 1 posición fuera de la ventana",
        parallel: "secuencias paralelas (5 bloques = 1 posición)",
        parallelResult: "hit — la entrada está en la posición 5 de 20",
      },
      source:
        "La fila 1 es el ejemplo propio de la documentación en el turno 3: 35 bloques, una entrada escrita en el bloque 15; la ventana revisa las posiciones 35→16 y falla por una. La fila 2 reconstruye de forma ilustrativa el mismo crecimiento como 2 turnos de 5 tool calls paralelas cada uno, para mostrar cómo cambia el conteo cuando una secuencia cuenta como una posición; la documentación no publica este segundo ejemplo. Para corregir un miss real, colocá un breakpoint explícito con suficiente frecuencia para que ningún intervalo supere 20 posiciones: hasta 4 breakpoints explícitos por solicitud.",
    },
    fanOutTimeline: {
      question: "¿Lanzar 8 solicitudes paralelas escribe 8 veces en el cache?",
      laneLabels: {
        together: "todas juntas",
        staggered: "primera y después el resto",
      },
      firstResponseBegins: "comienza la primera respuesta",
      requestLabel: (count: number) => (count === 1 ? "1 solicitud" : `${count} solicitudes`),
      writeAt: (count: number, seconds: number) =>
        `${count === 1 ? "1 solicitud" : `${count} solicitudes`} en ${seconds} s escribe el prefijo a 1.25×.`,
      readAt: (count: number, seconds: number) =>
        `${count === 1 ? "1 solicitud" : `${count} solicitudes`} en ${seconds} s leen el prefijo a 0.1×.`,
      legend: {
        writes: (tokens: string) => `escribe el prefijo de ${tokens} (1.25×)`,
        reads: "lee el prefijo desde el cache (0.1×)",
        staggering: (saving: string) => `escalonar: ${saving}`,
      },
      source:
        "Supuesto: 8 solicitudes comparten un prefijo de 40.000 tokens (tools, system y un documento compartido); la espera de 8 segundos para que comience la primera respuesta es ilustrativa, no está documentada. Regla: una entrada de cache queda disponible solo después de que comienza la primera respuesta.",
    },
    clearingCost: {
      question: "¿Por qué limpiar resultados viejos de tools puede costar más que conservarlos?",
      caption: (turns: number, threshold: string, max: string) =>
        `Tokens enviados por solicitud durante ${turns} solicitudes, comparando clear_at_least: 0 con clear_at_least: ${threshold}, en la misma escala de 0–${max} tokens.`,
      setting: "configuración",
      scale: (max: string) => `0–${max} tokens enviados por solicitud`,
      srScale: "tokens enviados por solicitud, apilados por lectura del cache, escritura del cache y entrada sin cache",
      cost: "costo",
      requestAxis: "solicitud →",
      settingEach: "clear_at_least: 0",
      settingBatched: (threshold: string) => `clear_at_least: ${threshold}`,
      noteEach: (clears: number, turns: number) =>
        `${clears} de ${turns} solicitudes limpian algo. Ninguna entrada de cache termina donde ocurrió la edición, así que cada una de esas solicitudes vuelve a escribir todo lo que sigue a la tarea.`,
      noteBatched: (clears: number) =>
        `La limpieza ocurre en ${clears} tandas. La mayoría de las solicitudes vuelve a leer el cache.`,
      sr: (turns: number, setting: string, note: string, cost: string, change: string, max: string, trigger: string) =>
        `Tokens enviados por solicitud durante ${turns} solicitudes, ${setting}. ${note} Costo total ${cost}, ${change} frente a no limpiar. El historial completo del cliente llega a ${max}; la limpieza mantiene el prompt cerca del umbral de ${trigger}.`,
      legend: {
        read: "leído del cache (0.1×)",
        write: "escrito en el cache (1.25×)",
        history: "historial sin limpieza",
        trigger: (tokens: string) => `umbral ${tokens}`,
      },
      sourceDefaults: "valores por defecto: umbral de 100.000 tokens, conserva los últimos 3 resultados.",
      sourceAfterCode:
        " Limpiar invalida el prefijo en cache. Supuesto: un resultado limpiado deja un placeholder de 10 tokens y solo cambian los bloques limpiados, así que una solicitud todavía lee la última entrada de cache escrita antes del primero de ellos.",
    },
  },
} as const;

export function getAgentLoopUi(lang: Lang) {
  return agentLoopUi[lang];
}
