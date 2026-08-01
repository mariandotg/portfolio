# T1 — Aislar `dither-scene` en `src/legacy/`

**Repo:** `portfolio` · **Rama base:** `feature/blog-ui` · **Depende de:** nada · **Bloquea a:** nada

## Contexto

`src/components/dither-scene/` es un renderizador halftone escrito a mano: rasterizador 3D por
software (cubo/esfera/cono) que se dibuja en escala de grises a un canvas offscreen y luego se
post-procesa dibujando un `ctx.arc()` por celda de grilla, con radio proporcional a la oscuridad.

Va a ser reemplazado por un backdrop WebGL (ver T3), pero **no se borra**: sigue en uso y funciona.
Este ticket solo lo mueve fuera del árbol activo para marcar físicamente que es código congelado.

Se decidió explícitamente **no** registrarlo como estrategia intercambiable del backdrop nuevo:
no cumple el mismo contrato. Es una caja de hero posicionada con insets negativos y `transform`
por breakpoint (`DitherScene.astro:12,31-44`), no un fondo full-viewport.

## Alcance

Mover, sin modificar comportamiento:

| Desde | Hacia |
|---|---|
| `src/components/dither-scene/dither.ts` | `src/legacy/dither-scene/dither.ts` |
| `src/components/dither-scene/math.ts` | `src/legacy/dither-scene/math.ts` |
| `src/components/dither-scene/renderer.ts` | `src/legacy/dither-scene/renderer.ts` |
| `src/components/dither-scene/shapes.ts` | `src/legacy/dither-scene/shapes.ts` |
| `src/components/DitherScene.astro` | `src/legacy/DitherScene.astro` |

Único consumidor a actualizar: **`src/pages/landing.astro`** (import en línea 9, uso en línea 99).

Además:
1. En `src/legacy/dither-scene/renderer.ts`, agregar arriba del `export function init`:
   ```ts
   /**
    * @deprecated Congelado. Reemplazado por el backdrop WebGL en `src/lib/effects/backdrop/`.
    * Se mantiene solo para `/landing`, que sigue en tokens legacy crimson.
    * No agregar consumidores nuevos ni features acá.
    */
   ```
2. El import relativo dentro de `DitherScene.astro` (`./dither-scene/renderer`) sigue siendo
   válido después de la mudanza porque ambos se mueven juntos — verificar igual.
3. Agregar a `CLAUDE.md`, en "Conventions & gotchas":
   > `src/legacy/` contiene el `DitherScene` halftone (canvas 2D, CPU) usado solo por `/landing`.
   > Está congelado — el efecto vigente es el backdrop WebGL de `src/lib/effects/backdrop/`.

## Fuera de alcance

- Borrar el efecto o desconectarlo de `/landing`.
- Refactorizarlo, optimizarlo o adaptarlo al contrato del backdrop nuevo.
- Tocar cualquier otra página.

## Criterios de aceptación

- [ ] `pnpm build` pasa.
- [ ] `/landing` renderiza el efecto **exactamente igual** que antes — mismas formas, mismo
      posicionamiento en desktop, tablet y mobile. Verificar con `pnpm dev`, no solo type-check.
- [ ] `rg "components/dither-scene|components/DitherScene"` sobre `src/` no devuelve nada.
- [ ] No hay cambios de comportamiento en el diff: solo mudanza de archivos, ajuste de un import
      y el bloque JSDoc.
