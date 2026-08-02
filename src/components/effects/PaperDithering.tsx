import { Dithering } from "@paper-design/shaders-react";
import { seededRng } from "../../lib/effects/rng";
import type { BackdropProps } from "../../lib/effects/backdrop/types";

export interface PaperDitheringCalibration {
  shape: "simplex" | "warp" | "dots" | "wave" | "ripple" | "swirl" | "sphere";
  type: "random" | "2x2" | "4x4" | "8x8";
  /** Tamaño de celda del dither. `pxSize` está deprecada en la librería. */
  size: number;
  speed: number;
  scale: number;
}

/** Calibración vigente. Pegar acá lo que escupe `/dev/effects`. */
export const PAPER_DITHERING_DEFAULTS: PaperDitheringCalibration = {
  shape: "simplex",
  type: "4x4",
  size: 2,
  speed: 0.4,
  scale: 0.9,
};

/**
 * El shader no expone un uniform de seed, así que el seed se traduce a los uniforms de encuadre
 * que sí existen (verificados en `dithering.d.ts` de `@paper-design/shaders@0.0.78`):
 *
 * - `frame` — offset del `u_time` inicial. Es el que más cambia el dibujo: mueve el corte del
 *   campo de ruido, no sólo su posición. La librería lo documenta como "deterministic results".
 * - `offsetX` / `offsetY` — paneo del campo (-1 a 1).
 * - `rotation` — giro en grados (0 a 360).
 * - `scale` — zoom, con un jitter chico alrededor de la calibración para no romper la densidad.
 *
 * Todo se deriva del mismo RNG que los banners, así que el contrato es el mismo: **mismo seed,
 * mismo campo**. No es aleatorio por visita — es estable por página.
 */
export interface SeedVariation {
  frame: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  scale: number;
}

/** Cuánto puede apartarse el zoom de la calibración, en ±%. Más que esto y cambia la densidad. */
const SCALE_JITTER = 0.12;

export function seedVariation(seed: string, baseScale: number): SeedVariation {
  const rng = seededRng(seed);
  return {
    // Rango amplio a propósito: adentro del mismo campo de ruido, cortes cercanos se parecen.
    frame: Math.round(rng() * 100000),
    offsetX: (rng() * 2 - 1) * 0.5,
    offsetY: (rng() * 2 - 1) * 0.5,
    rotation: Math.round(rng() * 360),
    scale: baseScale * (1 + (rng() * 2 - 1) * SCALE_JITTER),
  };
}

/** Sin seed el backdrop cae al campo por defecto — el mismo que había antes de que fuera sembrado. */
export const DEFAULT_BACKDROP_SEED = "";

/** Los overrides existen sólo para la página de calibración; en producción no se pasan. */
type Props = BackdropProps & Partial<PaperDitheringCalibration> & { seed?: string };

export default function PaperDithering({ colorBack, colorFront, seed, ...overrides }: Props) {
  const { shape, type, size, speed, scale } = { ...PAPER_DITHERING_DEFAULTS, ...overrides };
  const varied = seed ? seedVariation(seed, scale) : null;

  return (
    <Dithering
      shape={shape}
      type={type}
      colorBack={colorBack}
      colorFront={colorFront}
      size={size}
      speed={speed}
      scale={varied?.scale ?? scale}
      frame={varied?.frame}
      offsetX={varied?.offsetX}
      offsetY={varied?.offsetY}
      rotation={varied?.rotation}
      maxPixelCount={1920 * 1080}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
