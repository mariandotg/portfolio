# Analytics Implementation Plan

## Contexto

- **Portfolio**: Astro + Vercel → `marianoguillaume.com`
- **CV**: Astro + Vercel → `cv.marianoguillaume.com`
- `@vercel/analytics` ya está en `node_modules` — solo falta activarlo.

---

## Fase 1: Vercel Analytics (pageviews, tráfico general)

### Activar en Vercel Dashboard

En ambos proyectos: Settings → Web Analytics → Enable.

### Portfolio — `src/layouts/BaseLayout.astro`

```astro
---
import { Analytics } from '@vercel/analytics/astro';
---

<!-- al final del <body> -->
<Analytics />
```

### CV — mismo cambio en su BaseLayout

```astro
---
import { Analytics } from '@vercel/analytics/astro';
---

<Analytics />
```

**Qué te da:** pageviews por ruta (blog posts, work items), visitantes únicos, países, dispositivos, referrers.  
**Costo:** gratis hasta 2,500 eventos/mes.  
**Limitación:** no trackea clicks específicos.

---

## Fase 2: Eventos custom (clicks en redes, descargas de CV)

Agregar `track()` en los componentes React del repo CV donde están los botones.

```ts
import { track } from '@vercel/analytics';

// Botón de descarga del CV
track('cv_download', { format: 'pdf' });

// Links a redes sociales
track('social_click', { network: 'linkedin' });
track('social_click', { network: 'github' });
track('social_click', { network: 'twitter' });
```

**Dónde:** en los componentes React del repo `cv` que renderizan botones/links de descarga y redes.

---

## Fase 3: PostHog (retención, session replay, funnels)

Para cuando haya tráfico real y se quiera entender comportamiento profundo.

**Qué agrega sobre Vercel Analytics:**
- Session replay (ver exactamente qué hace el usuario)
- Funnels (de los que llegan al blog, cuántos leen hasta el final)
- Heatmaps
- Retención por cohorte

**Costo:** gratis hasta 1M eventos/mes.

### Instalación

```bash
npm install posthog-js
```

### `BaseLayout.astro` (ambos repos)

```astro
<script>
  import posthog from 'posthog-js'
  posthog.init('TU_POSTHOG_KEY', {
    api_host: 'https://app.posthog.com',
    capture_pageview: true,
  })
</script>
```

La key va en `.env` como `PUBLIC_POSTHOG_KEY`.

---

## Resumen de prioridades

| Prioridad | Qué implementar | Esfuerzo | Qué resuelve |
|-----------|----------------|----------|--------------|
| 1 | Vercel Analytics en ambos repos | ~10 min | Pageviews, tráfico general |
| 2 | `track()` events en CV | ~30 min | Clicks a redes, descargas |
| 3 | PostHog | ~1h | Retención, session replay, funnels |
