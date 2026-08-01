# T3 — Backdrop dither WebGL en `/cv` y `/blog`

**Repo:** `portfolio` · **Rama base:** `feature/blog-ui` · **Depende de:** nada · **Bloquea a:** T4

## Contexto

Referencia visual: **https://enesgules.com** — fondo dither full-viewport, fijo, atenuado en el
centro para no competir con el texto. Ese sitio usa `@paper-design/shaders` (WebGL2) como base.

Queremos ese fondo en el CV y el blog. **No** replicamos su máquina de estados (5 variantes con
hover + ~11 transiciones espaciales): eso requiere reescribir el fragment shader y no viene en la
librería. Acá se adopta el componente tal cual: **un campo idle animado, sin variantes**.

### La dependencia

- `@paper-design/shaders-react` — wrapper React del core `@paper-design/shaders`.
- Licencia **Apache 2.0** (uso comercial OK, requiere conservar atribución).
- Peer dep `react: ^18 || ^19` → compatible con el React 19.2.4 del repo.
- **Pinear versión exacta, sin caret.** Está en `0.0.x` con 105 releases desde oct-2024 (≈1 por
  semana); un caret te trae breaking changes sin aviso.

## Alcance

### 1. Dependencia

```bash
pnpm add @paper-design/shaders-react@0.0.78   # sin ^, versión exacta
```

### 2. Estructura

```
src/lib/effects/backdrop/
  types.ts       # contrato del backdrop
  index.ts       # registry + ACTIVE_BACKDROP_EFFECT
src/components/effects/
  PaperDithering.tsx    # el island React
  BackdropIsland.astro  # wrapper Astro (patrón *Island.astro del repo)
```

El registry es simétrico al de T2 pero **independiente**: son dos abstracciones distintas porque
los runtimes son incompatibles (T2 = build-time puro → string SVG; T3 = runtime WebGL → canvas).
No intentar unificarlos.

`types.ts`:
```ts
export interface BackdropProps {
  /** Color de fondo, string CSS. */
  colorBack: string;
  /** Color del patrón, string CSS. */
  colorFront: string;
}
export type BackdropEffect = React.ComponentType<BackdropProps>;
```

### 3. El island

`PaperDithering.tsx` monta `<Dithering />` de la lib con:

```tsx
<Dithering
  shape="simplex"     // 1 de: simplex | warp | dots | wave | ripple | swirl | sphere
  type="4x4"          // matriz de Bayer; 1 de: random | 2x2 | 4x4 | 8x8
  colorBack={colorBack}
  colorFront={colorFront}
  size={3}            // tamaño del "pixel gordo" — NO uses pxSize, está deprecado
  speed={0.4}
  scale={1}
  maxPixelCount={1920 * 1080}
  style={{ width: "100%", height: "100%" }}
/>
```

**API verificada contra `@paper-design/shaders-react@0.0.78` / core `0.0.56`** (leyendo los `.d.ts`
publicados, no de memoria):
- `DitheringProps extends ShaderComponentProps, DitheringParams`.
- `ShaderComponentProps extends React.ComponentProps<'div'>` → acepta `className`, `style`, etc.,
  más `width`/`height` (estilos CSS inline) y `maxPixelCount` para topear el costo en pantallas grandes.
- `size` es la prop vigente. **`pxSize` existe pero está marcada `@deprecated`** — no la uses.
- `shape` y `type` son strings; el shader los mapea a enteros internamente.
- `speed` viene de `ShaderMotionParams`, `scale` de `ShaderSizingParams`.

Si al instalar la versión pineada alguna de estas props no existe, **pará y reportá** en vez de
improvisar una equivalente.

Responsabilidades del island:

1. **Leer los tokens del tema.** `--background` y `--primary` en `src/styles/global.css` son
   tripletas HSL sin función (`--primary: 247 76% 61%`), así que hay que envolverlas:
   ```ts
   const read = (v: string) =>
     `hsl(${getComputedStyle(document.documentElement).getPropertyValue(v).trim()})`;
   // read("--background"), read("--primary")
   ```
2. **Re-leer al cambiar de tema.** El dark mode es class-based (`.dark` en `<html>`, lo togglea
   `ThemeToggle.tsx`). Usar un `MutationObserver` sobre `documentElement` filtrando
   `attributeName === "class"` y actualizar el estado de colores. Sin esto el fondo queda con la
   paleta del tema anterior.
3. **Guardas de degradación** — decisión tomada: *si no puede correr en condiciones, no se muestra
   nada*. No hay fallback CSS.
   ```ts
   // no renderizar (return null) si:
   //  a) window.matchMedia("(prefers-reduced-motion: reduce)").matches
   //  b) no hay contexto WebGL:
   //     const c = document.createElement("canvas");
   //     const gl = c.getContext("webgl2") ?? c.getContext("webgl");
   //     gl?.getExtension("WEBGL_lose_context")?.loseContext();
   //     if (!gl) return null;
   ```

### 4. El wrapper y el montaje

`BackdropIsland.astro` renderiza el contenedor posicionado + el island con `client:idle`
(no `client:load`: es decorativo, no debe competir con el contenido crítico).

CSS del contenedor:
```css
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  /* atenuar el centro para no competir con el texto (idea tomada de enesgules.com) */
  --mask: linear-gradient(to right,
    black 0%, rgba(0,0,0,.82) 14%, rgba(0,0,0,.4) 50%, rgba(0,0,0,.82) 86%, black 100%);
  -webkit-mask-image: var(--mask);
  mask-image: var(--mask);
  opacity: .42;
}
@media print { .backdrop { display: none; } }
```

`PageLayout.astro` gana una prop opcional:
```ts
interface Props { /* ...las actuales... */ backdrop?: boolean }
```
Cuando es `true`, renderiza `<BackdropIsland />` antes del `<Nav />`. El `<main>` necesita
`position: relative` (o `z-10`) para quedar por encima.

### 5. Páginas donde se activa — exactamente estas 4

| Archivo | Ruta |
|---|---|
| `src/pages/cv.astro` | `/cv` |
| `src/pages/es/cv.astro` | `/es/cv` |
| `src/pages/blog/index.astro` | `/blog` |
| `src/pages/es/blog/index.astro` | `/es/blog` |

## Fuera de alcance

- **`/` y `/es`** — aunque hoy renderizan el mismo `CvPage`, quedan sin backdrop. Cuando llegue el
  swap a la landing (ver `docs/vercel-consolidation.md`) esa decisión se corrige sola.
- `/blog/archive`, posts individuales, landings de serie, `/about`, `/work`, `/contact`, `/landing`.
  Los posts y series ya tienen banner dither propio: doble dither es ruido.
- Variantes por sección, `data-variant`, hover, transiciones entre campos, fragment shader propio.
- Fallback CSS para sin-WebGL o reduced-motion. Decidido: no se muestra nada.
- Tocar `src/pdf/` — el generador de PDF es un renderer aparte y no ve el DOM.

## Criterios de aceptación

Verificar **corriendo la app** (`pnpm dev`), no solo con type-check:

- [ ] `pnpm build` pasa y `@paper-design/shaders-react` está pineado sin `^` en `package.json`.
- [ ] El fondo se ve en `/cv`, `/es/cv`, `/blog`, `/es/blog` y **en ninguna otra ruta**.
- [ ] Togglear el tema con `ThemeToggle` cambia los colores del fondo sin recargar.
- [ ] El texto es perfectamente legible sobre el fondo en ambos temas — el mask central cumple.
- [ ] Con `prefers-reduced-motion: reduce` (DevTools → Rendering → Emulate CSS media) **no se
      renderiza ningún canvas**.
- [ ] `Ctrl+P` en `/cv`: la preview de impresión no muestra el fondo.
- [ ] Nada del contenido queda tapado ni deja de ser clickeable (el contenedor es
      `pointer-events: none`).
- [ ] Lighthouse en `/blog` no baja más de 3 puntos de performance respecto de `feature/blog-ui`.
