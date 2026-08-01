export interface BannerOptions {
  cols?: number;
  rows?: number;
}

/** Genera un banner determinista. Debe ser puro e isomórfico (build + browser). */
export type BannerEffect = (seed: string, opts?: BannerOptions) => string;
