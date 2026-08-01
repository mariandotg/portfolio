import PaperDithering from "../../../components/effects/PaperDithering";
import type { BackdropEffect, BackdropProps } from "./types";

export const BACKDROP_EFFECTS = {
  paperDithering: PaperDithering,
} satisfies Record<string, BackdropEffect>;

export type BackdropEffectName = keyof typeof BACKDROP_EFFECTS;

/** ÚNICO punto de swap del efecto de backdrop. */
export const ACTIVE_BACKDROP_EFFECT: BackdropEffectName = "paperDithering";

export const backdropEffect: BackdropEffect = BACKDROP_EFFECTS[ACTIVE_BACKDROP_EFFECT];

export type { BackdropEffect, BackdropProps };
