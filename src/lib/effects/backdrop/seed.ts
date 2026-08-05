/**
 * Seed del backdrop.
 *
 * **Un solo campo para todo el sitio.** Antes se derivaba de la ruta (cada página tenía el suyo),
 * pero el canvas ahora se monta una vez y sobrevive las navegaciones vía `transition:persist` —
 * ver `BackdropIsland.astro`. Un seed por ruta obligaría a re-inicializar el shader en cada swap,
 * que es exactamente el re-render que se quiso eliminar.
 *
 * El seed sigue entrando por prop en `BackdropIsland`, así que una página puede pisar este default
 * (`/dev`, o el día que una serie quiera su propio campo) a costa de que ese campo no persista.
 */
export const SITE_BACKDROP_SEED = "/";
