/**
 * Los tokens shadcn son tripletas HSL separadas por espacios (`247 76% 66%`), pero el parser de
 * `@paper-design/shaders` sólo acepta `hsl()` con comas — su regex es
 * `/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%.../`. Cuando no matchea devuelve su
 * `fallbackColor` (gris medio, `[.5,.5,.5,1]`) sin lanzar, así que el shader pinta gris y el color
 * de marca desaparece en silencio. De ahí que haya que normalizar antes de pasar el color.
 */
export function toShaderHsl(triplet: string): string {
  const parts = triplet.trim().split(/\s+/);
  return parts.length === 3 ? `hsl(${parts.join(", ")})` : `hsl(${triplet.trim()})`;
}

/** Lee un token HSL del `:root` y lo devuelve en la forma que el shader sí parsea. */
export function readShaderToken(name: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw ? toShaderHsl(raw) : fallback;
}

import type { BackdropProps } from "./types";

/** Back sin tinta. Queda para poder comparar contra el duotono en el banco de calibración. */
export const TRANSPARENT_BACK = "rgba(0, 0, 0, 0)";

/**
 * El campo es **duotono**: dos tintas, no una tinta sobre nada. La celda encendida lleva
 * `front`, la apagada lleva `back` — y `back` es un velo, nunca una capa opaca: el canvas
 * sigue siendo un overlay sobre la página. De ahí que todos los `back` lleven alpha.
 *
 * El alpha efectivo es `alpha × máscara × opacidad del contenedor` (ver `BackdropIsland.astro`:
 * máscara 0.13 en el centro, 0.7 en los bordes; opacidad 0.3 light / 0.15 dark). O sea que el
 * velo tiñe los márgenes y prácticamente desaparece en la columna de lectura, que es justo lo
 * que se quiere.
 *
 * El parser de `@paper-design/shaders` acepta alpha como cuarto argumento de `hsl()/hsla()`,
 * pero exige H/S/L **enteros** y separados por comas (ver `toShaderHsl`).
 */

/** Light: tinta morada de marca sobre papel cálido. El calor es lo que lo despega del blanco puro. */
export const LIGHT_PAPER_BACK = "hsla(32, 72%, 80%, 0.9)";

/** Dark: la tinta se tiñe hacia la marca en vez de ser blanco puro (blanco/negro es el look ajeno). */
export const DARK_FRONT = "hsl(250, 58%, 92%)";

/** Dark: base violácea profunda; sobre `--background` (0 0% 4%) da un fondo frío, no neutro. */
export const DARK_INK_BACK = "hsla(250, 58%, 26%, 0.9)";

/** Espejo de `--primary` en `:root`, por si el token no resuelve. */
export const LIGHT_FRONT_FALLBACK = "hsl(247, 76%, 61%)";

function isDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

/**
 * El mismo blanco que funciona en dark desaparece sobre el fondo claro, así que en light el
 * patrón toma el morado de marca.
 */
export function readFrontColor(): string {
  return isDark() ? DARK_FRONT : readShaderToken("--primary", LIGHT_FRONT_FALLBACK);
}

/** La segunda tinta del duotono. */
export function readBackColor(): string {
  return isDark() ? DARK_INK_BACK : LIGHT_PAPER_BACK;
}

/** Fuente única de los colores del backdrop: la usan el island y el banco de calibración. */
export function readBackdropColors(): BackdropProps {
  return { colorBack: readBackColor(), colorFront: readFrontColor() };
}
