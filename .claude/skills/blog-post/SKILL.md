---
name: blog-post
description: Genera notas MDX del blog de Mariano (src/content/notes/) con el formato de capas (incidente verificado, analogía, regla, tesis) y decide qué componentes, diagramas o simuladores usar según un estándar. Use when writing or drafting a blog note or series post (e.g. the claude-certified-architect series), when the user says "escribí la nota", "armá el post", "draft blog post", "nuevo post de la serie", or when deciding whether a note needs an interactive component or diagram.
---

# blog-post

Produce una nota MDX lista para revisar, con fuentes verificadas y
componentes que se ganan su lugar.

## Fuentes de verdad (leer antes de escribir)

- `docs/content-manifesto.md` — voz, frontmatter, checklist de publicación. Esta skill no redefine la voz.
- `docs/series/<id>-outline.md` — si la nota es parte de una serie (idea, analogía, incidente, componente héroe).
- [FORMAT.md](FORMAT.md) — las capas de la nota y sus reglas.
- [COMPONENTS.md](COMPONENTS.md) — cuándo usar componentes, catálogo y estándar técnico.

## Workflow

Copiá este checklist y marcá cada paso.

```
- [ ] 1. Contexto: leer manifesto, outline de la serie (si aplica), FORMAT.md
- [ ] 2. Fuentes: verificar incidente y hechos de la analogía; regla desde la guía oficial
- [ ] 3. Ficha: completar y presentar a Mariano. Esperar OK
- [ ] 4. Plan de componentes: aplicar COMPONENTS.md. Presentar junto con la ficha
- [ ] 5. Escribir el MDX con draft: true
- [ ] 6. Construir componentes nuevos (si el plan los aprueba)
- [ ] 7. Verificar en el navegador: screenshots + interacción
- [ ] 8. Entregar: ruta, screenshots, fuentes, pendientes
```

### 2. Fuentes

- Cada incidente necesita fecha, hecho central y al menos una fuente (medio, tribunal o base de incidentes). Si no se verifica, **no entra**.
- Cada hecho del mundo real de la analogía (aviación, medicina, historia) se verifica igual.
- La regla del examen sale de la guía oficial o del material del curso (`~/Documents/Cursos/CCA/`). **Nunca** uses preguntas reales del examen ni del simulacro (NDA).
- No inventes métricas. Si un componente muestra números, marcá si son **medidos** o **ilustrativos**.

### 3. Ficha (checkpoint)

Presentá esto antes de escribir prosa:

```
Tesis (título tentativo):
Incidente (o "—") + fuente:
Analogía:
Mapeo analogía → mecanismo (tabla):
Dónde se rompe la analogía:
Regla del examen + dominio/anti-patrón:
Plan de componentes (héroe + soporte, con la pregunta que responde cada uno):
```

### 5. Escribir

- Ruta: `src/content/notes/<slug>.mdx`. Frontmatter según el manifesto (§5). `draft: true` hasta el OK final.
- Serie: `series` = nombre del JSON en `src/content/series/`, y `seriesOrder`.
- Imports relativos: `../../components/notes/<Componente>.astro`.

### 7. Verificar

1. `pnpm dev` (en background). Leé el puerto en el log: si está ocupado, Astro usa otro. Una nota con `draft: true` da 404: poné `draft: false` para verificar y volvé a `true` antes de commitear (confirmalo con grep).
2. `node .claude/skills/blog-post/scripts/screenshot.mjs http://localhost:4321/notes/<slug> [outDir]` → capturas 1280/390px × light/dark. El script avisa (`WARN`) si hay overflow horizontal o si el tema no coincide.
3. **Mirá cada captura** con Read. Buscá labels desbordados, líneas cruzadas, texto ilegible en dark. Todo `WARN` de overflow se corrige.
4. Recorré cada estado interactivo (toggles, pasos, tabs). Un screenshot estático no prueba la interacción.
5. `pnpm build` si agregaste componentes nuevos.

No declares la nota lista solo por el type-check.

### 8. Entregar

Ruta del MDX, rutas de las capturas, lista de fuentes con URL, y lo que
quedó pendiente (hechos sin verificar, decisiones de Mariano).

Derivados para LinkedIn/X: solo si Mariano los pide. Usá el manifesto §6.
