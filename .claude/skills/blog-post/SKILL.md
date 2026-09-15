---
name: blog-post
description: Genera notas MDX de ingeniería del blog de Mariano (src/content/notes/) con el formato "mecanismo calculado" (un mecanismo real, números medidos o calculados con origen, simulaciones interactivas) y decide qué componentes, diagramas o simuladores usar según un estándar. Use when writing or drafting a blog note or series post (e.g. the claude-certified-architect series), when the user says "escribí la nota", "armá el post", "draft blog post", "nuevo post de la serie", or when deciding whether a note needs an interactive component or diagram.
---

# blog-post

Produce una nota MDX lista para revisar, con números que tienen origen y
componentes que se ganan su lugar.

## Fuentes de verdad (leer antes de escribir)

- `docs/content-manifesto.md` — voz, frontmatter, checklist de publicación. Esta skill no redefine la voz.
- `docs/specs/<slug>.md` — spec de la nota, si existe. Para notas con simulador o experimento, escribilo antes.
- [FORMAT.md](FORMAT.md) — el formato "mecanismo calculado" y sus reglas.
- [COMPONENTS.md](COMPONENTS.md) — cuándo usar componentes, catálogo y estándar técnico.

## Workflow

Copiá este checklist y marcá cada paso.

```
- [ ] 1. Contexto: manifesto, spec (si hay), FORMAT.md
- [ ] 2. Fuentes: verificar cada hecho documentado; declarar cada supuesto
- [ ] 3. Ficha: presentar a Mariano (salvo que ya haya un spec aprobado). Esperar OK
- [ ] 4. Plan de componentes: aplicar COMPONENTS.md
- [ ] 5. Motor o script + tests, si la nota calcula o simula
- [ ] 6. Números de la prosa: generarlos con el motor o script
- [ ] 7. Escribir el MDX
- [ ] 8. Verificar en el navegador: screenshots + interacción
- [ ] 9. Entregar: ruta, screenshots, fuentes, supuestos, pendientes
```

### 2. Fuentes

- Cada hecho documentado (precio, límite, parámetro) necesita una URL oficial y fecha. Si no se verifica, **no entra**.
- Cada incidente o caso real necesita fecha y al menos una fuente.
- Cada comportamiento que la doc no especifica es un **supuesto**: declaralo en la nota, donde se usa.
- No inventes métricas. Todo número es **medido**, **calculado** o **supuesto** (ver FORMAT.md).
- Material del examen CCA: **nunca** preguntas reales del examen ni del simulacro (NDA).

### 3. Ficha (checkpoint)

```
Mecanismo:
Pregunta que responde la nota:
Hechos documentados (con URL):
Supuestos:
Arco (sección → falla que la abre → número clave):
Plan de componentes (con la pregunta que responde cada uno):
```

### 5–6. Motor y números

- Motor puro e isomórfico en `src/lib/sim/<nombre>/`, con tests en `*.test.ts` (`pnpm test`).
- Confirmá que los tests prueban algo: introducí un bug a propósito y verificá que un test falla.
- Generá los números de la prosa con un script que importe el motor y los presets del componente. No calcules a mano.

### 7. Escribir

- Ruta: `src/content/notes/<slug>.mdx`. Frontmatter según el manifesto (§5).
- Serie: `series` = nombre del JSON en `src/content/series/`, y `seriesOrder`.
- Imports relativos: `../../components/notes/<Componente>.astro`.

### 8. Verificar

1. `pnpm dev` (en background). Leé el puerto en el log: si está ocupado, Astro usa otro. Una nota con `draft: true` da 404: poné `draft: false` para verificar.
2. `node .claude/skills/blog-post/scripts/screenshot.mjs http://localhost:<puerto>/notes/<slug> [outDir]` → capturas 1280/390px × light/dark. El script avisa (`WARN`) si hay overflow horizontal o si el tema no coincide.
3. **Mirá cada captura** con Read. Buscá labels desbordados, líneas cruzadas, texto ilegible en dark. Todo `WARN` de overflow se corrige.
4. Recorré cada estado interactivo (toggles, sliders, presets). Un screenshot estático no prueba la interacción.
5. `pnpm build` si agregaste componentes nuevos (con la nota publicada, para que el build la incluya).

No declares la nota lista solo por el type-check.

### 9. Entregar

Ruta del MDX, rutas de las capturas, fuentes con URL, supuestos declarados y
lo que quedó pendiente (decisiones de Mariano).

Derivados para LinkedIn/X: solo si Mariano los pide. Usá el manifesto §6.
