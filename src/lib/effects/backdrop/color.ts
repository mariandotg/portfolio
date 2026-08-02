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

/** El canvas es un overlay: sólo deben pintar las celdas encendidas. */
export const TRANSPARENT_BACK = "rgba(0, 0, 0, 0)";

/** En dark el patrón es blanco sobre casi negro: contrasta solo, sin pedirle nada a la marca. */
export const DARK_FRONT = "hsl(0, 0%, 100%)";

/** Espejo de `--primary` en `:root`, por si el token no resuelve. */
export const LIGHT_FRONT_FALLBACK = "hsl(247, 76%, 61%)";

/**
 * El mismo blanco que funciona en dark desaparece sobre el fondo claro, así que en light el
 * patrón toma el morado de marca. Fuente única para el island y para el banco de calibración.
 */
export function readFrontColor(): string {
  const isDark = document.documentElement.classList.contains("dark");
  return isDark ? DARK_FRONT : readShaderToken("--primary", LIGHT_FRONT_FALLBACK);
}
