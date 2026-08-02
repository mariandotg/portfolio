/**
 * Seed del backdrop derivado de la ruta.
 *
 * Dos decisiones que importan:
 *
 * 1. **El prefijo de locale se descarta.** `/notes` y `/es/notes` son la misma página en dos
 *    idiomas, así que comparten campo. Si no se descartara, cambiar de idioma cambiaría el fondo
 *    y parecería un bug.
 * 2. **Es la ruta, no el contenido.** El backdrop hoy vive en 4 rutas fijas (`/cv` y `/notes` por
 *    locale), así que la ruta alcanza como identidad. El día que un post o una serie quiera su
 *    propio campo, la página le pasa su `bannerSeed` a `<BackdropIsland seed=... />` y este
 *    default deja de aplicar — por eso el seed entra por prop y no se lee acá adentro.
 */
export function backdropSeed(pathname: string): string {
  const normalized = pathname.replace(/^\/es(?=\/|$)/, "").replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
}
