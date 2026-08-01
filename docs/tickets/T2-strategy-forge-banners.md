# T2 — Strategy para el forge de banners (sin cambio visual)

**Repo:** `portfolio` · **Rama base:** `feature/blog-ui` · **Depende de:** nada · **Bloquea a:** T4

## Contexto

`src/lib/identicon.ts` genera los banners de series y posts: función pura, corre en **build time**,
devuelve un string SVG determinista a partir de un `bannerSeed`. Se inlinea con `set:html`.
Cero JS en cliente.

Hoy hay **un solo algoritmo** (halftone: círculos de radio variable sobre un campo de glows
gaussianos + gradiente lineal + grano) y los 8 consumidores lo importan por nombre directo. Para
poder swapear el efecto en el futuro sin tocar 8 archivos, hace falta una indirección.

**Este ticket NO cambia cómo se ven los banners.** Es puramente estructural: introduce el registry
y deja `halftone` como estrategia activa. El efecto nuevo es un ticket futuro.

## Alcance

### 1. Estructura nueva

```
src/lib/effects/banner/
  types.ts       # el contrato
  halftone.ts    # el contenido actual de src/lib/identicon.ts, sin cambios de lógica
  index.ts       # registry + punto único de swap
```

`types.ts`:
```ts
export interface BannerOptions {
  cols?: number;
  rows?: number;
}

/** Genera un banner determinista. Debe ser puro e isomórfico (build + browser). */
export type BannerEffect = (seed: string, opts?: BannerOptions) => string;
```

`index.ts`:
```ts
import { halftoneSvg, VIEW_COLS, VIEW_ROWS, BANNER_BACKDROP } from "./halftone";
import type { BannerEffect, BannerOptions } from "./types";

export const BANNER_EFFECTS = {
  /** @deprecated Efecto original. Se mantiene como fallback hasta que haya reemplazo. */
  halftone: halftoneSvg,
} satisfies Record<string, BannerEffect>;

export type BannerEffectName = keyof typeof BANNER_EFFECTS;

/** ÚNICO punto de swap del efecto de banners. */
export const ACTIVE_BANNER_EFFECT: BannerEffectName = "halftone";

export const bannerSvg: BannerEffect = (seed, opts) =>
  BANNER_EFFECTS[ACTIVE_BANNER_EFFECT](seed, opts);

export { VIEW_COLS, VIEW_ROWS, BANNER_BACKDROP };
export type { BannerEffect, BannerOptions };
```

`halftone.ts` = el archivo actual movido tal cual. Renombrar el export `identiconSvg` → `halftoneSvg`.
`VIEW_COLS` / `VIEW_ROWS` / `BANNER_BACKDROP` se re-exportan desde `index.ts` porque hoy son
específicos de este efecto pero varios consumidores los usan para fijar aspect-ratio.

### 2. Consumidores a migrar (8 archivos)

Todos pasan de `identiconSvg(...)` a `bannerSvg(...)`, importando desde `@/lib/effects/banner`:

| Archivo | Líneas |
|---|---|
| `src/components/SeriesCard.astro` | 3, 20 |
| `src/layouts/BlogPost.astro` | 7, 38 |
| `src/pages/blog/series/[slug].astro` | 7, 24 |
| `src/pages/[slug].astro` | 7, 24 |
| `src/pages/es/[slug].astro` | 7, 24 |
| `src/pages/es/blog/series/[slug].astro` | 7, 24 |
| `src/pages/dev/banners.astro` | 3, 18, **187 (script de cliente)**, 219, 231 |
| `src/pages/dev/series-banner.astro` | 2, 12, 189, 325 — solo usa `VIEW_COLS`/`VIEW_ROWS` |

**Atención con `dev/banners.astro:187`:** ese import está dentro de un `<script>` de cliente, o sea
el forge se bundlea al navegador. Por eso el contrato exige que las estrategias sean **isomórficas
y sin dependencias node-only** — nada de `fs`, `crypto` de node, ni libs de noise que asuman Node.

### 3. Borrar

`src/lib/identicon.ts` desaparece (su contenido vive ahora en `effects/banner/halftone.ts`).
No dejar re-export de compatibilidad.

### 4. Documentación

Actualizar la sección "Identicon banners" de `CLAUDE.md`: el path pasa a ser
`src/lib/effects/banner/`, y hay que mencionar que el efecto se cambia desde
`ACTIVE_BANNER_EFFECT` en `index.ts` y que los consumidores nunca importan una estrategia directa.

## Fuera de alcance

- Escribir una estrategia nueva. `halftone` es la única y sigue activa.
- Cambiar cualquier cosa que altere el SVG generado.
- Tocar el schema de las content collections (nada de campo `bannerEffect` en frontmatter — el
  swap es global, por constante).
- La página de comparación de estrategias (eso es T4).

## Criterios de aceptación

- [ ] `pnpm build` pasa.
- [ ] **Los banners son byte-idénticos a antes del cambio.** Verificar así:
      ```bash
      # antes del refactor
      git stash && npx tsx -e "import {identiconSvg} from './src/lib/identicon.ts'; \
        console.log(['agent-vs-cursor','cloud-certified-architect'].map(s=>identiconSvg(s).length))"
      # después
      git stash pop && npx tsx -e "import {bannerSvg} from './src/lib/effects/banner/index.ts'; \
        console.log(['agent-vs-cursor','cloud-certified-architect'].map(s=>bannerSvg(s).length))"
      ```
      Mismos largos, y un diff de los strings completos sin diferencias.
- [ ] `rg "identicon" src/` no devuelve nada.
- [ ] `/dev/banners` sigue regenerando en vivo desde el cliente (probar el input de seed en el
      navegador, no solo que compile).
- [ ] `/blog`, `/blog/archive`, `/es/blog` y una landing de serie renderizan sus banners igual.
