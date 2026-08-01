# T4 — `/dev/effects`: preview y comparación de estrategias

**Repo:** `portfolio` · **Rama base:** `feature/blog-ui` · **Depende de:** T2 y T3 · **Bloquea a:** nada

> Ticket opcional. Es tooling interno: si se cae del scope no rompe nada de lo entregado.

## Contexto

T2 y T3 introducen dos registries de efectos (`src/lib/effects/banner/` y
`src/lib/effects/backdrop/`), cada uno con una constante `ACTIVE_*` que es el único punto de swap.
Hoy no hay forma de ver qué produce cada estrategia sin editar esa constante y rebuildear.

Ya existen dos páginas de dev relacionadas, que **no hay que romper ni fusionar**:
- `src/pages/dev/banners.astro` — grilla de banners de todos los posts/series + input de seed que
  regenera en vivo desde el cliente.
- `src/pages/dev/series-banner.astro` — playground de aspect-ratio del banner de serie.

Este ticket agrega una tercera, enfocada en **comparar estrategias entre sí**.

## Alcance

Nueva página `src/pages/dev/effects.astro` con dos secciones:

### Sección "Banner effects"

- Un input de seed (default: `agent-vs-cursor`).
- Una fila por estrategia registrada en `BANNER_EFFECTS`, renderizadas lado a lado con el mismo
  seed, cada una con su nombre y un badge `ACTIVE` en la que coincide con `ACTIVE_BANNER_EFFECT`.
- Debajo de cada una: el peso del SVG en KB. El halftone actual pesa **76,5 KB** (1200 `<circle>`)
  — es un número que conviene tener a la vista al evaluar estrategias nuevas.
- Regeneración en cliente al cambiar el seed. Iterar sobre el registry, no hardcodear nombres.

> Con T2 recién mergeado va a haber **una sola** estrategia (`halftone`). Está bien: la página
> tiene que funcionar con una y escalar a N sin cambios.

### Sección "Backdrop effects"

- Un contenedor de tamaño fijo (ej. `16/9`, ancho completo) por cada estrategia de
  `BACKDROP_EFFECTS`, con su badge `ACTIVE`.
- Controles: toggle de tema (para ver cómo responde a los tokens) y toggle del mask central
  on/off, para poder juzgar la legibilidad del texto encima.
- Un párrafo de texto de muestra superpuesto en cada preview.

### General

- Reusar `PageLayout` con `noindex` (`/dev/*` no debe indexarse — verificar cómo lo resuelven las
  otras dos páginas de dev y seguir el mismo criterio).
- Sin i18n: es tooling interno, solo inglés, sin versión bajo `/es`.
- **No** activar el backdrop de T3 en esta página vía la prop de `PageLayout`; acá los backdrops se
  montan embebidos y controlados.

## Fuera de alcance

- Cambiar la constante activa desde la UI y que persista (sería mentirle al build; el swap real es
  editar `ACTIVE_*`). El selector de la página es solo para previsualizar.
- Reescribir, fusionar o deprecar `dev/banners.astro` y `dev/series-banner.astro`.
- Escribir estrategias nuevas.

## Criterios de aceptación

- [ ] `/dev/effects` carga y lista todas las estrategias registradas, iterando el registry.
- [ ] Cambiar el seed regenera todos los previews de banner en vivo, sin recargar.
- [ ] El badge `ACTIVE` cae sobre la estrategia correcta en ambas secciones.
- [ ] El peso en KB mostrado coincide con el largo real del string SVG.
- [ ] Los previews de backdrop responden al toggle de tema.
- [ ] `pnpm build` pasa y la página no aparece en el sitemap.
- [ ] `/dev/banners` y `/dev/series-banner` siguen funcionando exactamente igual.
