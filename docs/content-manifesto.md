# Manifiesto de contenido — v1

Este documento describe cómo Mariano ya escribe notas para este blog. No
inventa una metodología nueva: la extrae de las 5 notas y 2 series que ya
existen en `src/content/notes/` y `src/content/series/`. Toda regla de este
documento tiene que poder señalarse en texto publicado. Si no puede, no entra.

## 1. Audiencia y propósito

El lector primario es un **par técnico**: otro ingeniero. El objetivo de
Mariano con este blog es conseguir entrevistas y construirse un nombre como
dev indie. Las dos cosas dependen de reputación entre pares, no de convencer a
un decisor de negocio — un par que confía en el criterio técnico de Mariano es
quien lo refiere para una entrevista; un decisor de negocio no lee blogs
técnicos para decidir a quién contratar.

El lector que contrata (un hiring manager, un CTO) es un **lector
secundario**. No se lo sirve bajando el nivel técnico ni agregando una capa de
explicación introductoria — se lo sirve dejando ver el criterio y los
tradeoffs tal como se los mostraría a un par. Un hiring manager competente
evalúa exactamente eso: cómo piensa Mariano cuando nadie le exige explicarlo
para principiantes.

Por eso el registro **no cambia** entre los dos lectores. No hay una versión
"para pares" y otra "para reclutadores" de la misma nota. Bajar el nivel para
el lector secundario tiene un costo con el primario, que es quien realmente
mueve la aguja (ver sección 6): un par que percibe que el contenido está
suavizado deja de compartirlo.

## 2. Nota suelta vs serie

**Criterio:** escribí una serie cuando el mismo hallazgo sostiene más de un
ángulo editorial independiente, cada uno completo por sí mismo. Escribí una
nota suelta cuando el material tiene un solo argumento, aunque ese argumento
sea largo.

### Caso: `agent-vs-cursor` es una serie de 3 notas

Las tres notas (`my-agent-vs-cursor-broad.mdx`, `my-agent-vs-cursor-senior.mdx`,
`how-i-beat-cursor.mdx`) tienen el mismo `pubDate: 2026-05-02` y parten del
mismo experimento — correr el agente propio de Mariano contra el de Cursor
sobre el mismo codebase. No son la misma nota repartida en tres partes: cada
una es un género distinto sobre el mismo hallazgo, y cada una funciona sola.

- **`seriesOrder: 1`** es la crónica: "For the past several months I've been
  building my own AI coding agent. Not because I thought I could
  out-engineer Cursor — that's a silly thing to think — but because I kept
  running into limitations that bothered me."
- **`seriesOrder: 2`** es el benchmark punto por punto, con el mismo caso pero
  en formato de evidencia: "I'm being specific because vague takes about AI
  coding tools are useless."
- **`seriesOrder: 3`** no repite el diff — argumenta la tesis de diseño detrás
  de los dos anteriores: "The first real decision I had to make wasn't
  technical. It was definitional."

Fusionar las tres en una nota única perdería la razón de ser de cada una:
la crónica, la evidencia y la tesis piden un lector distinto en un momento
distinto, y cada una ya es una unidad completa (título, descripción y cierre
propios). Esa independencia editorial es la condición para que algo sea serie
y no una nota larga con subtítulos.

### Caso: `idempotency-distributed-payments` es una nota sola

Con 224 líneas y 7 encabezados `##` es, por lejos, la nota más larga del
sitio — y aun así es una sola nota, no una serie, porque tiene **un solo hilo
de razonamiento** que no se puede cortar sin romperlo: problema → race
condition del enfoque naive → patrón correcto (claim atómico vía insert) →
ciclo de vida del patrón → propiedades de la key → implementaciones de
referencia → casos borde. Cada sección depende de que la anterior ya haya
sentado el patrón "claim, then process, then settle" — no hay un ángulo
editorial alternativo sobre el mismo hallazgo, hay un solo hallazgo
desarrollado hasta el final. Partirla en dos dejaría una "Parte 1" que
termina en la mitad de un argumento, no en una conclusión.

### Antes de plantear una serie: escribí el outline primero

El precedente es `docs/series/claude-certified-architect-outline.md`: antes
de escribir ninguna nota de esa serie, existe un documento que fija las
fuentes, lo que no se pudo verificar, el orden de las notas y por qué ese
orden. Cualquier serie de más de 2 notas se planifica así — un
`docs/series/<id>-outline.md` — antes de escribir la primera nota.

## 3. Anatomía de una nota

### Largo

El rango real observado es **52 a 224 líneas**, y no es aleatorio: se agrupa
en dos clusters con una función distinta.

| Nota | Líneas | `##` | Función |
|---|---|---|---|
| `shipping-without-a-safety-net.mdx` | 52 | 4 | reflexión personal |
| `my-agent-vs-cursor-senior.mdx` | 57 | 0 | crónica/benchmark narrativo |
| `my-agent-vs-cursor-broad.mdx` | 58 | 0 | crónica/benchmark narrativo |
| `how-i-beat-cursor.mdx` | 83 | 5 | tesis conceptual |
| `idempotency-distributed-payments.mdx` | 224 | 7 | referencia técnica completa |

Las notas narrativas y reflexivas caen en **52–83 líneas**. La única nota de
referencia técnica completa (con componentes interactivos y código de
referencia en dos lenguajes) llega a **224**. No hay un número objetivo de
líneas: el largo es una consecuencia de cuánto terreno necesita el único
argumento de la sección 2, no una meta a rellenar. Si una nota narrativa llega
a 200 líneas, probablemente dejó de ser una nota y es una serie sin dividir.

### Encabezados: no son obligatorios

Dos notas (`my-agent-vs-cursor-broad.mdx`, `my-agent-vs-cursor-senior.mdx`)
tienen **cero** encabezados `##`. Usan `---` como separador de movimiento
dentro de un ensayo continuo. Esto no es una omisión: es la forma correcta
para una crónica narrativa, donde forzar encabezados rompería el flujo. Las
notas de referencia técnica (`idempotency-distributed-payments.mdx`) y de
reflexión con lecciones nombrables (`shipping-without-a-safety-net.mdx`,
`how-i-beat-cursor.mdx`) sí usan `##` porque el lector necesita poder saltar a
una sección — son navegables por diseño.

**Regla:** si la nota es un ensayo de una sola pieza (crónica, tesis breve),
usá `---` para separar movimientos y no fuerces `##`. Si la nota es una
referencia a la que alguien va a volver a buscar algo puntual (un patrón, una
lección con nombre propio), usá `##` por sección.

### Qué tiene que estar sí o sí

- **Un solo argumento central, planteado temprano** — nunca enterrado. Ver
  sección 4, "nombrá el tipo de decisión antes de tomarla".
- **`description` que declara el hallazgo concreto**, no un teaser genérico
  (ver sección 5).
- **`collection` siempre seteado.** `series`/`seriesOrder` sólo si la nota es
  parte de una serie real (sección 2).
- **Un cierre que aterriza la implicación** o, si es parte de una serie,
  anuncia la siguiente entrega — nunca un llamado a la acción tipo "contame
  qué opinás".
- Si la nota es técnica y paso a paso, preferí componentes
  (`Callout`, `Stepper`, `Tabs`/`Tab`, `SideBySide`, islands interactivas —
  ver `docs/MDX-COMPONENTS.md` y `src/components/README.md`) antes que más
  prosa, como hace `idempotency-distributed-payments.mdx`. Si es narrativa,
  prosa simple con `---` es lo esperado y no hace falta forzar componentes.

## 4. Voz y registro

Cada regla está anclada en una cita textual de una nota existente.

**Primera persona, afirmaciones directas, sin cobertura.** Mariano no diluye
sus propias conclusiones con "podría ser" cuando ya las sostiene:

> "I don't think this means Cursor is a bad product." — `my-agent-vs-cursor-broad.mdx`

**Especificidad cuantificada en vez de vaguedad.** Los hallazgos se nombran
con números y artefactos concretos, no con adjetivos:

> "Six `// eslint-disable-next-line` comments across three server files." — `my-agent-vs-cursor-senior.mdx`

**Concesión explícita cuando el "otro lado" hizo algo bien.** Mariano marca
en voz alta que no está seleccionando evidencia:

> "I want to be honest about where Cursor did better, because I have no interest in a benchmark that only counts my wins." — `my-agent-vs-cursor-senior.mdx`

**Humildad epistémica sobre el alcance de la propia conclusión.** No
generaliza de un solo dato point a una regla universal:

> "One benchmark is a data point, not a conclusion." — `how-i-beat-cursor.mdx`

**Frases cortas y declarativas, a veces un párrafo de una sola oración.**
El ritmo no se rellena:

> "Those are different targets." — `my-agent-vs-cursor-broad.mdx`

> "I'm not naming the domain. It doesn't matter." — `my-agent-vs-cursor-senior.mdx`

**Nombrá el tipo de decisión antes de tomarla.** Antes de argumentar algo,
Mariano declara qué clase de pregunta está respondiendo:

> "The first real decision I had to make wasn't technical. It was definitional." — `how-i-beat-cursor.mdx`

**Sin introducción de content marketing — la nota entra directo al tema en
la primera oración:**

> "Payment systems fail in interesting ways." — `idempotency-distributed-payments.mdx`, primera línea

> "I left my last full-time role in January." — `shipping-without-a-safety-net.mdx`, primera línea

**En notas personales, reflexión honesta sin lenguaje de autoayuda.** La
vulnerabilidad se nombra con precisión, no con frases genéricas de bienestar:

> "What I've noticed is that rate anxiety is usually about something else — a fear that you're not actually worth it, that someone will look at your work and find it lacking." — `shipping-without-a-safety-net.mdx`

**El cierre aterriza una idea, no pide una acción.** Ninguna nota termina con
"suscribite" o "contame qué pensás":

> "The real one is skills and reputation, and those you already have." — `shipping-without-a-safety-net.mdx`, última línea

## 5. El contrato de frontmatter

Campos de la colección `notes` en `src/content.config.ts`, en el orden del
schema:

| Campo | Tipo | Obligatorio | Cuándo se usa |
|---|---|---|---|
| `title` | `string` | sí | Título de la nota. |
| `description` | `string` | sí | El hallazgo concreto, no un teaser — es lo que aparece en listados y en el `<meta description>`. |
| `pubDate` | fecha (`z.coerce.date()`) | sí | Fecha de publicación. Ordena las notas en `/notes` y en la serie si aplica. |
| `updatedDate` | fecha | no | Sólo si la nota se corrigió o actualizó después de publicada. |
| `tags` | `string[]` | no (default `[]`) | Etiquetas libres; no hay un vocabulario cerrado en el schema. |
| `image` | `string` | no | Imagen de la nota si no se usa el banner generado por seed. |
| `imageAlt` | `string` | no | Alt text de `image`, si `image` está seteado. |
| `bannerSeed` | `string` | no | Seed determinístico para el banner SVG (`src/lib/effects/banner`). Si no está, se usa un fallback — ver `idempotency-distributed-payments.mdx` (`bannerSeed: "ptt1ru"`) vs `how-i-beat-cursor.mdx`, que no lo tiene. |
| `draft` | `boolean` | no (default `false`) | `true` mientras la nota no está lista para publicar. Los listados la filtran con `!data.draft`. |
| `collection` | `enum('engineering-notes' \| 'building-in-public')` | sí | El eje de categoría — ver `CLAUDE.md`, "Notes content model". No confundir con `series`. |
| `series` | `string` | no | Id de la serie (= nombre de archivo del JSON en `src/content/series/`, sin extensión). Sólo si la nota es parte de una serie real (sección 2). |
| `seriesOrder` | `number` | no | Posición dentro de la serie. Sólo tiene sentido si `series` está seteado. |

Este manifesto no redefine el eje `collection` vs `series` — usa la
distinción ya fijada en `CLAUDE.md`.

## 6. Estrategia de LinkedIn v1

**Regla de conteo:** una nota suelta genera **1 post de LinkedIn**. Una serie
genera **1 post por nota que la compone** (no un post-resumen de toda la
serie) — es decir, `agent-vs-cursor` genera 3 posts, uno por nota, no uno.

**Escalonado, no simultáneo.** Las notas de una serie pueden publicarse todas
el mismo día (`agent-vs-cursor` tiene las tres con `pubDate: 2026-05-02`),
pero sus posts de LinkedIn no. Separación mínima entre dos posts que vienen de
la misma serie: **5 días**.

**Cadencia global:** máximo **2 posts de LinkedIn por semana** originados en
notas. Más que eso lee como content mill, no como alguien pensando en
público.

**Formato del post:**
1. **Hook (primeras 1–2 líneas):** el hallazgo concreto más fuerte de la
   nota, no el título ni un teaser genérico. Ejemplo del tipo de frase que
   funciona como hook, tomado directamente de una nota existente: *"The
   `Task` type Cursor defined used `id: number`. The database was generating
   string IDs."*
2. **Cuerpo (3–6 oraciones):** el detalle cuantificado que sostiene el hook —
   números, nombres de archivo, un fragmento de código si entra. El mismo
   nivel de especificidad de la sección 4, no una versión resumida y vaga.
3. **Cierre:** link a la nota. Sin "¿qué opinan?", sin "seguime para más".

**Qué se recorta:** el planteo de apertura de la nota, las secciones de
concesión (el "to be fair" / "I want to be honest about where Cursor did
better") y cualquier tramo reflexivo sobre el propio proceso. Esas partes
sostienen el argumento completo en la nota; en un post compiten por espacio
con el hallazgo, así que se cortan.

**Qué nunca se recorta:** el dato concreto y verificable — el número, el
nombre de archivo, el fragmento de código citado textual. Es lo que distingue
el post de un take genérico de LinkedIn, y es lo que un par técnico puede
chequear y por lo que decide compartirlo.

**Regla explícita sobre el pitch de búsqueda laboral:** el mensaje "estoy
buscando trabajo" / "disponible para nuevos proyectos" no aparece nunca en un
post de contenido. Vive únicamente en el perfil de LinkedIn (headline,
sección "Acerca de"). Un post de contenido que además pide trabajo se lee
como autopromoción, y un par técnico deja de compartirlo — y son los pares
quienes refieren, no los reclutadores que ven el post de pasada.

## 7. Checklist de publicación

- [ ] `title`, `description`, `pubDate` y `collection` están seteados.
- [ ] `description` declara el hallazgo concreto, no un teaser genérico.
- [ ] `draft: false`.
- [ ] Si la nota es parte de una serie: `series` coincide con el filename del
      JSON en `src/content/series/`, y `seriesOrder` está seteado.
- [ ] La primera oración entra directo al tema — sin preámbulo de blog
      genérico.
- [ ] Hay un argumento central y está planteado temprano, no enterrado.
- [ ] Hay especificidad cuantificada (números, nombres de archivo, código) y
      no sólo afirmaciones generales.
- [ ] Si la nota compara o discute algo con contraparte, incluye una
      concesión explícita a favor de esa contraparte.
- [ ] El cierre aterriza una implicación; no pide "suscribite" ni "contame
      qué opinás".
- [ ] Componentes MDX usados según `docs/MDX-COMPONENTS.md` /
      `src/components/README.md`; toda isla interactiva tiene su directiva
      `client:*`.
- [ ] Ningún tramo de la nota suena a "estoy disponible para trabajar" — ese
      mensaje no va en contenido (sección 6).
- [ ] Post de LinkedIn redactado según la sección 6, con su hook, su cuerpo
      cuantificado y sin lenguaje de búsqueda laboral.

## 8. Preguntas abiertas

Esto no se puede resolver leyendo el repo — necesita el criterio de Mariano.

- **Cadencia de publicación de las notas mismas** (no de LinkedIn). Las 5
  notas actuales tienen `pubDate` 2026-04-08, 2026-04-15 y tres el
  2026-05-02. ¿Es esa agrupación (tres el mismo día) intencional para
  series, o el repo simplemente no tiene todavía cadencia real? Este
  manifesto no fija una cadencia de notas, sólo de LinkedIn.
- **`collection` como eje visible vs sólo filtro de archivo.** `CLAUDE.md`
  dice que hoy `collection` sólo existe como tabs en `/notes/archive`. ¿Este
  manifesto asume que eso queda así, o hay intención de volver a darle
  landing propia a cada colección?
- **El campo `collection` muerto en el schema de `series`.** `CLAUDE.md` ya
  lo marca como gotcha (`agent-vs-cursor.json` dice `building-in-public`
  pero sus notas son `engineering-notes`). Este manifesto no lo resuelve.
  ¿Se borra el campo, o una serie debería heredar/validar la `collection` de
  sus notas?
- **¿La sección 6 (LinkedIn) aplica igual a `building-in-public`?**
  `shipping-without-a-safety-net.mdx` tiene un registro más vulnerable que
  las notas de `engineering-notes`. ¿El mismo formato de post (hook +
  cuerpo cuantificado) sirve para una nota reflexiva sin datos duros que
  citar, o esa colección necesita su propio formato de post?
- **Umbral mínimo antes de plantear una serie.** El outline de
  `claude-certified-architect` ya existe sin notas escritas. ¿Hay un
  mínimo de notas sueltas publicadas antes de justificar planificar una
  serie nueva, o el criterio de la sección 2 alcanza por sí solo?
- **Política de interacción en LinkedIn.** La sección 6 cubre publicar. No
  cubre si responder comentarios, citar a otros, o resharear es parte de la
  estrategia v1 o queda para una v2.
