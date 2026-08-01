import { halftoneSvg, VIEW_COLS, VIEW_ROWS, BANNER_BACKDROP } from "./halftone";
import type { BannerEffect, BannerOptions } from "./types";

export const BANNER_EFFECTS = {
  /** @deprecated Efecto original. Se mantiene como fallback hasta que haya reemplazo. */
  halftone: halftoneSvg,
} satisfies Record<string, BannerEffect>;

export type BannerEffectName = keyof typeof BANNER_EFFECTS;

/** ÚNICO punto de swap del efecto de banners. */
export const ACTIVE_BANNER_EFFECT: BannerEffectName = "halftone";

export const bannerSvg: BannerEffect = (seed, opts) =>
  BANNER_EFFECTS[ACTIVE_BANNER_EFFECT](seed, opts);

export { VIEW_COLS, VIEW_ROWS, BANNER_BACKDROP };
export type { BannerEffect, BannerOptions };
