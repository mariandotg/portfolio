/**
 * Resolución de los banners horneados de serie.
 *
 * Un banner ya no se genera: se dibuja en `/dev/effects`, se exporta con el dither adentro y se
 * guarda en `public/series/`. Acá sólo se decide **qué archivo** le toca a cada contenedor.
 *
 * La detección es de build: `import.meta.glob` sin `eager` devuelve un mapa de rutas a funciones
 * de import que nunca se llaman — se usan sólo las **claves**. Vite resuelve ese glob al compilar,
 * así que la lista de archivos disponibles es estática, no cuesta nada en runtime y no depende de
 * que el filesystem de `public/` exista en la función serverless (no existe).
 */

const AVAILABLE: ReadonlySet<string> = new Set(
  Object.keys(
    import.meta.glob("/public/series/*.{webp,png,avif}", { query: "?raw" }),
  ).map((path) => path.replace(/^\/public/, "")),
);

export type BannerVariant = "card" | "hero";

/**
 * El hero es 3/1, no la franja 80/15 que venía del halftone.
 *
 * Con `fit: contain`, el alto de la franja es lo que limita el tamaño de la marca: en 80/15 una
 * marca cuadrada usaba 228px de un canvas de 1233 y en pantalla quedaban ~132px de dibujo en una
 * banda de 704. Bajar el `size` del dither la deja nítida pero igual de chica — el que manda es
 * el ratio.
 *
 * Consecuencia buena: a 3/1 la imagen de card recortada con `object-fit: cover` alcanza para los
 * dos lugares, así que **lo normal es un archivo por serie**, no dos.
 */
export const BANNER_RATIOS: Record<BannerVariant, string> = {
  card: "16 / 9",
  hero: "3 / 1",
};

/** El sufijo del archivo es el contrato con quien exporta desde el lab. */
const SUFFIX: Record<BannerVariant, string> = {
  card: "-card",
  hero: "-hero",
};

/** webp primero: es el formato objetivo. png queda como escape para lo que todavía no se migró. */
const EXTENSIONS = ["webp", "png", "avif"] as const;

function firstExisting(stems: string[]): string | undefined {
  for (const stem of stems) {
    for (const ext of EXTENSIONS) {
      const candidate = `${stem}.${ext}`;
      if (AVAILABLE.has(candidate)) return candidate;
    }
  }
  return undefined;
}

/**
 * Devuelve la imagen para `variant`, degradando en vez de romper:
 *
 * 1. la variante pedida (`-card` / `-hero`),
 * 2. la otra variante — un hero en una card se recorta con `object-fit`, que es feo pero es mucho
 *    mejor que un hueco,
 * 3. el archivo sin sufijo, para series con una sola imagen.
 *
 * `undefined` significa que no hay nada que mostrar y el contenedor se queda en su color de fondo.
 */
export function seriesBannerSrc(base: string, variant: BannerVariant): string | undefined {
  const other: BannerVariant = variant === "card" ? "hero" : "card";
  return firstExisting([`${base}${SUFFIX[variant]}`, `${base}${SUFFIX[other]}`, base]);
}

/** Base por convención: `/series/<id>`. La serie sólo la pisa si quiere otro nombre de archivo. */
export function seriesBannerBase(id: string, override?: string): string {
  return override ?? `/series/${id}`;
}
