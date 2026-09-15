# Serie Claude Certified Architect — overview

Estado: **borrador**. Reemplaza el outline de MDG-39. Ese outline suponía un
formato de referencia por dominio. Este documento fija ideas de contenido, no
tono ni redacción.

Id de la serie: `claude-certified-architect` (`rootLevel: true`, vive en
`/claude-certified-architect`). Los posts se escriben con la skill
`blog-post` (`.claude/skills/blog-post/`).

---

## Premisa

Mariano va a rendir el examen CCA-F. La serie es su forma de estudiar en
público. No se publica ningún puntaje.

Cada post toma **una regla del examen** y la lee a través de **una lección
vieja de personas u organizaciones**. Diseñar agentes es diseñar
organizaciones: casi todas las reglas ya existían en aviación, medicina,
periodismo o contabilidad.

## Formato de cada post

Tres capas. La definición completa está en
`.claude/skills/blog-post/FORMAT.md`.

| Capa | Fuente | Obligatoria |
|---|---|---|
| Apertura: un incidente real y verificado | Dirección B | No |
| Centro: analogía → mecanismo → regla del examen | Dirección A | Sí |
| Título y cierre: una tesis | Dirección C | Sí |

Cada post tiene además un **componente héroe**: el mecanismo del post, hecho
visual o interactivo. El estándar está en
`.claude/skills/blog-post/COMPONENTS.md`.

---

## Posts

### 0 — La apuesta
- **Tesis:** "Claude no es una app. Es un empleado brillante con amnesia."
- **Analogía:** el empleado capaz que olvida todo entre conversaciones (la analogía base del curso).
- **Incidente:** —
- **Regla del examen:** modelo mental (modelo, contexto, herramientas); mapa de los 5 dominios. Transversal.
- **Idea:** voy a rendir el CCA-F. Antes di un curso de preparación a 10 personas en 6 encuentros. Esta serie cuenta cada regla del examen con algo que ya sabíamos de las personas.
- **Componente héroe:** mapa de la serie: los 5 dominios con su peso, conectados a cada post.

### 1 — La receta y el chef
- **Tesis:** "El examen de Anthropic premia no usar agentes."
- **Analogía:** en una cocina, el cocinero de línea sigue la receta y el chef improvisa. No ponés un chef a pelar papas. Tampoco contratás un cirujano para poner curitas (selección de modelo).
- **Incidente:** —
- **Regla del examen:** workflow vs agente; la progresión de complejidad (prompt → contexto → herramientas → loop); el modelo según la tarea; Batch API para cargas no bloqueantes. Base + D4.
- **Idea:** el error más caro es subir un escalón de complejidad que no hacía falta.
- **Componente héroe:** escalera de complejidad interactiva. El lector elige una tarea y ve qué escalón alcanza, con costo y latencia relativos.

### 2 — Cambio y fuera
- **Tesis:** "Si parseás el texto del modelo, estás adivinando."
- **Analogía:** en la radio aeronáutica nadie deduce por el tono si el piloto terminó. El protocolo tiene señales explícitas de fin y de colación.
- **Incidente:** —
- **Regla del examen:** el loop agéntico termina con `stop_reason` (`tool_use` sigue, `end_turn` corta); nunca parsear texto ni cortar por un límite arbitrario de iteraciones. D1, anti-patrón 5.
- **Idea:** un sistema confiable usa señales estructuradas, no interpretación.
- **Componente héroe:** loop reproducible: enviar → `tool_use` → ejecutar → devolver resultado → `end_turn`, paso a paso.

### 3 — El prompt es un pedido, el hook es una ley
- **Tesis:** "El prompt es un pedido. El hook es una ley."
- **Analogía:** los aviones no confían en que el piloto se acuerde: usan interlocks y checklists. Toyota usa poka-yoke: la pieza no entra si está mal puesta.
- **Incidente:** Replit, julio 2025: el agente borró la base de producción durante un code freeze, con instrucciones explícitas de no tocar nada. Alternativa: el chatbot de Chevrolet de Watsonville (diciembre 2023), que "aceptó" vender una Tahoe por $1 después de una instrucción inyectada.
- **Regla del examen:** si es una garantía, va en un hook o una precondición programática, no en el prompt. Ejemplo canónico: bloquear `process_refund` hasta que `get_customer` devuelva un ID verificado. D1, anti-patrón 1.
- **Idea:** la pregunta del arquitecto es "¿sugerencia o garantía?".
- **Componente héroe:** simulador con toggle "regla en el prompt / regla en un hook". Muestra corridas y violaciones (patrón `RetrySimulator`).

### 4 — El cambio de guardia
- **Tesis:** "Tu subagente empieza el turno sin saber nada."
- **Analogía:** el pase de guardia en un hospital: la enfermera que entra solo sabe lo que le entregan. El control aéreo: los aviones no coordinan entre sí, todo pasa por la torre.
- **Incidente:** Deloitte Australia, 2025: un informe para el gobierno con citas inventadas y una cita judicial fabricada. Deloitte devolvió parte del pago. Sin un mapeo afirmación → fuente, nadie detectó el problema a tiempo.
- **Regla del examen:** hub-and-spoke; el coordinador es dueño de la comunicación; los subagentes no heredan contexto; el contexto se inyecta explícito; varias llamadas `Task` en un turno corren en paralelo; la síntesis conserva la procedencia. D1, anti-patrón 6.
- **Idea:** la calidad de un sistema multiagente depende de la calidad del pase.
- **Componente héroe:** diagrama de secuencia animado hub-and-spoke, con toggle "contexto inyectado / sin contexto".

### 5 — Tres luces verdes
- **Tesis:** "Un error silencioso es peor que un error."
- **Analogía:** antes de aterrizar, el piloto confirma "tres verdes": el tren está abajo y trabado. No supone que bajó porque movió la palanca. El corresponsal de guerra publica lo que confirmó y marca lo que no.
- **Incidente:** Gemini CLI, julio 2025: un `mkdir` falló, el agente no lo verificó y movió archivos a una carpeta que no existía. Los archivos se perdieron. En el caso Replit, el agente también leyó un resultado vacío como un problema a arreglar.
- **Regla del examen:** distinguir un fallo de acceso (reintentable) de un resultado vacío válido; contexto de error estructurado; resolver en el nivel más bajo capaz; ni abortar todo ni suprimir en silencio. D1/D5, anti-patrón 3.
- **Idea:** degradación elegante: completar lo posible y marcar la incertidumbre.
- **Componente héroe:** flujo de decisión reproducible: timeout / vacío válido / error de permisos → qué hace el agente en cada caso.

### 6 — Mayúsculas de farmacia
- **Tesis:** "Tu descripción de tool es la API."
- **Analogía:** los hospitales escriben nombres de medicamentos parecidos con mayúsculas parciales (Tall Man lettering, por ejemplo "hydrOXYzine" y "hydrALAZINE") para evitar confusiones. El nombre es la interfaz.
- **Incidente:** —
- **Regla del examen:** la descripción es el mecanismo principal de selección; renombrar para eliminar superposiciones; 4–5 herramientas por agente; errores MCP con `isError`, `errorCategory` e `isRetryable`, nunca "Operation failed"; `.mcp.json` versionado vs `~/.claude.json` personal. D2, anti-patrón 7.
- **Idea:** el cambio más chico (mejorar nombres y descripciones) suele arreglar más que un cambio de arquitectura.
- **Componente héroe:** quiz "¿qué tool elige el modelo?", con descripciones antes y después en `SideBySide`.

### 7 — Partida doble
- **Tesis:** "Un JSON válido también puede mentir."
- **Analogía:** la contabilidad de partida doble: cada movimiento se registra dos veces para que los totales se controlen entre sí. Un formulario bien completado puede tener datos falsos.
- **Incidente:** —
- **Regla del examen:** `tool_use` + JSON Schema garantizan sintaxis, no semántica; `calculated_total` vs `stated_total`; campos nullable y enums con `"unclear"` para no fabricar valores; reintento con errores concretos, inútil si el dato no está en la fuente; criterios explícitos y few-shot. D4.
- **Idea:** la validación estructural es el piso, no el techo.
- **Componente héroe:** validador en vivo: el schema pasa en verde y el control de totales falla en rojo.

### 8 — El conocimiento tribal
- **Tesis:** "Si la regla vive en tu máquina, no es una regla del equipo."
- **Analogía:** el conocimiento tribal: lo que sabe el senior y no está escrito en ningún lado. El dev nuevo no lo ve.
- **Incidente:** —
- **Regla del examen:** jerarquía de `CLAUDE.md` (usuario, proyecto, directorio); `@path`; `.claude/rules/` con globs; skills bajo demanda vs `CLAUDE.md` siempre cargado; plan mode vs ejecución directa. D3.
- **Idea:** configurar Claude Code es onboarding: decidir qué sabe cada persona y cuándo.
- **Componente héroe:** árbol de archivos interactivo: el lector elige un archivo del repo y ve qué reglas se cargan.

### 9 — Nadie corrige su propio texto
- **Tesis:** "La sesión que escribió el código no debería revisarlo."
- **Analogía:** un escritor no corrige su propio texto: lee lo que quiso escribir. En la cabina, un piloto vuela y el otro monitorea.
- **Incidente:** Mata v. Avianca, 2023: un abogado presentó casos inventados por ChatGPT. Antes le preguntó a ChatGPT si los casos eran reales, y ChatGPT dijo que sí. El tribunal lo sancionó.
- **Regla del examen:** la auto-revisión es limitada porque retiene su razonamiento; una instancia independiente revisa mejor; revisión multipasada (por archivo + pasada de integración); `-p` y `--output-format json` en CI. D3/D4.
- **Idea:** verificar con el mismo contexto que generó el error no es verificar.
- **Componente héroe:** `Stepper` de la revisión multipasada, más `SideBySide` auto-revisión vs instancia independiente.

### 10 — Tatuajes
- **Tesis:** "Tu agente no tiene memoria. Tiene tatuajes."
- **Analogía:** en *Memento*, Leonard no forma recuerdos nuevos. Vive de tatuajes y polaroids: hechos fijos fuera de su memoria. El teléfono descompuesto: cada resumen pierde detalle.
- **Incidente:** —
- **Regla del examen:** la sumarización progresiva degrada números, porcentajes y fechas; bloque persistente de *case facts*; lost in the middle (lo clave al inicio, con encabezados); recortar resultados de herramientas; `/compact`. D5, anti-patrón 4.
- **Idea:** más contexto no arregla un mal contexto.
- **Componente héroe:** slider "resumir N veces": los números del texto se degradan; al lado, el bloque de hechos queda fijo.

### 11 — El triage no pregunta cómo te sentís
- **Tesis:** "Un agente seguro de sí mismo es un agente peligroso."
- **Analogía:** en la guardia, la enfermera de triage sigue un protocolo con criterios explícitos. No decide por su nivel de confianza ni por el tono del paciente.
- **Incidente:** Air Canada, 2024: el chatbot inventó una política de reembolso y un tribunal obligó a la aerolínea a pagar. Cursor, abril 2025: el bot de soporte "Sam" inventó una política de un dispositivo por suscripción, con total seguridad.
- **Regla del examen:** escalar por disparadores explícitos (pedido humano, vacío de política, imposibilidad de avanzar); la autoconfianza y el sentimiento son proxies poco fiables; ante varias coincidencias, pedir identificadores; un 97% agregado esconde fallos por tipo de documento; muestreo estratificado. D5/D4, anti-patrón 2.
- **Idea:** la confianza del modelo no es una métrica.
- **Componente héroe:** gráfico de calibración (confianza declarada vs acierto), con toggle "agregado / por tipo de documento".

### 12 — Simulador y vuelo real
- **Tesis:** "Qué analogías me sirvieron en el examen, y cuáles no."
- **Analogía:** horas de simulador vs el primer vuelo real.
- **Incidente:** —
- **Regla del examen:** transversal; formato por escenarios.
- **Idea:** qué funcionó al estudiar así, qué dominio preparé mal, qué cambiaría. Sin puntaje y sin contenido real del examen (NDA).
- **Componente héroe:** el mapa del post 0, con cada regla marcada según cuánto sirvió.

---

## Cobertura

| Dominio | Peso | Posts |
|---|---|---|
| D1 Arquitectura agéntica y orquestación | 27% | 2, 3, 4, 5 |
| D3 Configuración y flujos de Claude Code | 20% | 8, 9 |
| D4 Prompts y salida estructurada | 20% | 1, 7, 9, 11 |
| D2 Herramientas e integración MCP | 18% | 6 |
| D5 Gestión de contexto y fiabilidad | 15% | 5, 10, 11 |

| Anti-patrón oficial | Post |
|---|---|
| 1. Confiar en el prompt cuando hace falta una garantía | 3 |
| 2. Escalar demasiado pronto / por autoconfianza | 11 |
| 3. Abortar o suprimir ante datos parciales | 5 |
| 4. Agrandar la ventana en vez de gestionar el contexto | 10 |
| 5. Parsear texto del modelo | 2 |
| 6. Perder procedencia al sintetizar | 4 |
| 7. Complejidad innecesaria | 1, 6 |

## Fuentes

**Examen.** Guía oficial CCA-F v1.0 (julio 2026):
`https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F6nizmqk8tpzpfjvt6qmmav7rh%2Fpublic%2F1783542750%2FClaude+Certified+Architect+%E2%80%93+Foundations+Exam+Guide.pdf`.
Material propio del curso en `~/Documents/Cursos/CCA/` (temario v2, plan de
la clase base, slides de las clases 1–4).

**Incidentes** (verificados el 2026-09-14):
- Replit: https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/
- Chevrolet de Watsonville: https://incidentdatabase.ai/cite/622/
- Deloitte Australia: https://fortune.com/2025/10/07/deloitte-ai-australia-government-report-hallucinations-technology-290000-refund
- Gemini CLI: https://incidentdatabase.ai/cite/1178/
- Mata v. Avianca: https://www.documentcloud.org/documents/23826751-mata-v-avianca-airlines-affidavit-in-opposition-to-motion/ y https://en.wikipedia.org/wiki/Mata_v._Avianca,_Inc.
- Air Canada: https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/
- Cursor "Sam": https://incidentdatabase.ai/cite/1039/

## Pendientes

- **Analogías:** los hechos del mundo real (Tall Man lettering, pase de guardia, "tres verdes", poka-yoke, partida doble) se verifican con fuente al escribir cada post.
- **Guía del examen:** confirmar que la versión vigente sigue siendo la v1.0 antes de cada post.
- **Corte de aprobación:** el plan de la clase base dice que 720/1000 no es oficial; el outline anterior lo atribuía a la guía. No se usa hasta verificarlo.
- **`claude-certified-architect.json`:** la `description` actual ("Field notes from Anthropic's AI training…") no refleja la premisa nueva. Decisión de Mariano.
- **Idioma de publicación:** sin definir.
