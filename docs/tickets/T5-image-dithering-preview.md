# T5 — Previsualizar imágenes con dither en `/dev/effects`

**Repo:** `portfolio` · **Rama base:** `feature/blog-ui` · **Depende de:** T4 (mergeado) · **Bloquea a:** la decisión sobre banners de serie con imagen

## Contexto

La idea para los banners de serie cambió: en vez de un patrón generado desde un seed, queremos
**cargar una imagen y aplicarle el dither**. Antes de comprometer arquitectura hay que ver cómo
queda, y `/dev/effects` es el lugar.

La librería que ya está instalada trae el componente exacto: **`ImageDithering`** de
`@paper-design/shaders-react`. No hace falta escribir shader ni sumar dependencias.

Este ticket es **sólo la herramienta de previsualización**. No cambia ningún banner ni toca
`src/lib/effects/banner/`. La decisión de arquitectura viene después, informada por lo que se vea acá.

## API de `ImageDithering` — verificada contra los `.d.ts` instalados

```ts
interface ImageDitheringParams extends ShaderSizingParams, ShaderMotionParams {
  image: HTMLImageElement | string;   // string = URL, la carga sola
  colorFront?: string;
  colorBack?: string;
  colorHighlight?: string;            // igualarlo a colorFront = dither clásico de 2 colores
  type?: "random" | "2x2" | "4x4" | "8x8";
  size?: number;                      // grilla del dither, 0.5 a 20. NO uses pxSize (deprecada)
  colorSteps?: number;                // 1 a 7
  originalColors?: boolean;           // usa los colores de la imagen en vez de la paleta
  inverted?: boolean;
}
```

Hereda además de `ShaderSizingParams`: `fit` (`none | contain | cover`), `scale`, `rotation`,
`offsetX`, `offsetY`, `worldWidth`, `worldHeight`.

Presets exportados: `defaultPreset`, `retroPreset`, `noisePreset`, `naturalPreset`, y el array
`imageDitheringPresets`.

**Trampa conocida, no la repitas:** el parser de color de la librería acepta `hsl()` **sólo con
comas**. Los tokens shadcn son tripletas separadas por espacios y al fallar el parseo devuelve gris
medio en silencio. Usá `readShaderToken` / `toShaderHsl` de `src/lib/effects/backdrop/color.ts`.

## Alcance

Agregar una tercera sección a `src/pages/dev/effects.astro` (+ su island), **"Image dithering"**:

1. **Fuente de la imagen.** Input de archivo + drag & drop sobre el área de preview, usando
   `URL.createObjectURL`. Todo en cliente, no se sube nada a ningún lado. Acordate de
   `URL.revokeObjectURL` al reemplazar la imagen.
   Sembrar con `/me.webp` (la única foto del repo) para que la página sirva sin interacción.
2. **Controles en vivo**, mismo patrón que el `BackdropLab` de T4: `type`, `size`, `colorSteps`,
   `originalColors`, `inverted`, `fit`, `scale`, y los tres colores. Los colores arrancan desde
   los tokens del tema (`--primary` / `--background`) con opción de override manual.
3. **Botones de preset** que apliquen `imageDitheringPresets` iterando el array, sin hardcodear.
4. **Comparación lado a lado**: imagen original y resultado ditherizado, mismo tamaño.
5. **Selector de aspect-ratio** con al menos las dos proporciones que ya usa el sitio:
   `80/15` (`VIEW_COLS`/`VIEW_ROWS`, el nativo del banner) y `16/9` (el de `SeriesCard`).
   Importalos de `@/lib/effects/banner`, no los escribas a mano.
6. **Bloque de configuración copiable**, igual que hace T4 con el backdrop.

## Fuera de alcance

- Cambiar los banners de serie. `ACTIVE_BANNER_EFFECT` sigue en `halftone`.
- Tocar `src/lib/effects/banner/` o cualquiera de sus 8 consumidores.
- Registrar `ImageDithering` como estrategia de banner — el contrato `BannerEffect` es
  `(seed, opts) => string` (SVG, build-time) y esto es un canvas WebGL en runtime. No entran en el
  mismo registry; forzarlo es el error que este proyecto viene evitando desde el principio.
- Resolver dónde se guardarían las imágenes de cada serie, ni tocar el schema de la colección.
- Rasterizado en build, headless GL, o exportar el resultado a archivo.

## Criterios de aceptación

- [ ] `pnpm build` pasa.
- [ ] `/dev/effects` carga con `/me.webp` ya ditherizada, sin necesidad de interactuar.
- [ ] Soltar un archivo de imagen sobre el área lo reemplaza y re-renderiza.
- [ ] Cada control modifica el resultado en vivo, sin recargar.
- [ ] Los presets se leen de `imageDitheringPresets`, no hardcodeados.
- [ ] El dither sale **con color**, no gris — si sale gris, el parseo de color falló (ver la trampa
      de arriba). Verificalo muestreando píxeles del canvas, no a ojo.
- [ ] Las tres secciones previas de `/dev/effects` siguen funcionando igual, y `/dev/banners` y
      `/dev/series-banner` también.
- [ ] `/dev/effects` sigue fuera del sitemap.
