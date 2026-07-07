# Plan: identicons por seed como banner en la lista del blog

## Objetivo
Cada entry del blog muestra un **banner generado deterministicamente** desde un seed
(el slug del post), estilo identicon de GitHub (grilla de pixeles simetrica, un color
derivado del hash sobre fondo neutro). Sin dependencias nuevas, sin archivos de imagen:
SVG inline generado en build-time por Astro.

## Decisiones tomadas
- **Estilo:** identicon GitHub (grilla simetrica de pixeles, 1 color + fondo).
- **Layout:** banner ancho arriba del texto de cada card (aspect fino, ~5:1).
- **Seed:** `post.id` (slug) → estable entre builds.
- **Override:** si el frontmatter ya define `image`, se usa esa imagen real y NO el identicon.

## Arquitectura

### 1. `src/lib/identicon.ts` (nuevo) — generador puro, sin deps
Funcion `identiconSvg(seed: string, opts?)` que devuelve un `string` de SVG.

- **Hash deterministico:** FNV-1a (o djb2) sobre `seed` → entero. De ahi derivamos
  tanto el color como que celdas se prenden (distintos bytes del hash / rehash con salt).
- **Color:** HSL con `H` = `hash % 360`, `S`/`L` fijos y tuneados para leer bien en
  light y dark (ej. `S 55% / L 58%`). Fondo = tinte neutro sutil (token del sitio,
  ver seccion tema).
- **Grilla banner:** parametrica.
  - `rows` (ej. 4) y `cols` derivados del aspect (ej. 20 columnas).
  - **Simetria horizontal:** solo se calculan `ceil(cols/2)` columnas y se espejan,
    manteniendo el look identicon en formato ancho.
  - Cada celda se prende si un bit del hash (posicion → indice de bit, con rehash si
    faltan bits) es 1. Densidad objetivo ~45-55%.
  - Render como `<rect>` por celda prendida; `viewBox` segun `cols*cell x rows*cell`,
    `preserveAspectRatio` para que estire al ancho del banner.
- Salida: SVG autocontenido (fill con el color HSL, sin `<style>` externo).

### 2. `src/lib/identicon.test`-mental (verificacion)
Determinismo: mismo seed → mismo SVG. Se valida corriendo el dev server y comparando
dos renders del mismo post (no requiere framework de test; el repo hoy no tiene tests).

### 3. `src/components/BlogPostCard.astro` — integrar banner
- Nueva prop opcional `image?: string` y `imageAlt?: string`.
- Al inicio del frontmatter del componente:
  ```ts
  import { identiconSvg } from "../lib/identicon";
  const banner = image ? null : identiconSvg(slug);
  ```
- En el markup, arriba del `<time>`:
  - Si `image` → `<img src={image} alt={imageAlt} class="banner-img" />`.
  - Si no → `<div class="banner" set:html={banner} aria-hidden="true" />`.
- Estilos: banner full-width, alto fijo (~88-104px), `border-radius` arriba,
  `overflow-hidden`, borde sutil con `var(--color-border)`.

### 4. Tema (light/dark)
El fondo del identicon debe leer en ambos temas. Opcion elegida: fondo = tinte muy
sutil derivado del mismo `H` con `L` alto en light / `L` bajo en dark, controlado con
CSS vars en el wrapper (`--ident-bg`). Alternativa mas simple: fondo transparente y el
wrapper usa `background: var(--color-border)` opacado. Se decide al implementar viendo
el contraste real en el navegador (skill `verify`/`run`).

### 5. Ajuste de layout en los index (en + es)
Archivos: `src/pages/blog/index.astro` y `src/pages/es/blog/index.astro`.
- Con banners, las cards pasan de "filas con `<hr>`" a **tarjetas apiladas**:
  - Quitar los `<hr>` divisores entre posts.
  - Cambiar `flex flex-col` → `flex flex-col gap-6` (o `gap-8`).
  - Ajustar el CSS de `.post-card.hidden + hr` (ya no aplica) al nuevo modelo.
- El filtro por tabs (`data-collection`) y su JS **no cambian**.
- Pasar las nuevas props al card:
  ```astro
  <BlogPostCard ... image={post.data.image} imageAlt={post.data.imageAlt} />
  ```

## Archivos tocados
| Archivo | Accion |
|---|---|
| `src/lib/identicon.ts` | **nuevo** — hash + generador SVG |
| `src/components/BlogPostCard.astro` | banner arriba + props `image`/`imageAlt` |
| `src/pages/blog/index.astro` | quitar `hr`, gap entre cards, pasar props |
| `src/pages/es/blog/index.astro` | idem |

## Fuera de alcance (posible follow-up)
- Usar el mismo identicon como header en la pagina de detalle del post
  (`src/layouts/BlogPost.astro` / `src/pages/blog/[...slug].astro`).
- Cachear/pre-generar SVGs a archivo (no hace falta: build-time inline es barato).

## Verificacion
1. `pnpm dev`, abrir `/blog` y `/es/blog`.
2. Confirmar: banner distinto por post, identico entre recargas (determinismo).
3. Toggle light/dark → contraste correcto en ambos.
4. Un post con `image` en frontmatter usa la imagen real, no el identicon.
5. Tabs de filtro siguen ocultando/mostrando bien sin `hr` huerfanos.
