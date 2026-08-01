import { Dithering } from "@paper-design/shaders-react";
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
  scale: 0.7,
};

/** Los overrides existen sólo para la página de calibración; en producción no se pasan. */
type Props = BackdropProps & Partial<PaperDitheringCalibration>;

export default function PaperDithering({ colorBack, colorFront, ...overrides }: Props) {
  const { shape, type, size, speed, scale } = { ...PAPER_DITHERING_DEFAULTS, ...overrides };

  return (
    <Dithering
      shape={shape}
      type={type}
      colorBack={colorBack}
      colorFront={colorFront}
      size={size}
      speed={speed}
      scale={scale}
      maxPixelCount={1920 * 1080}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
