import { Dithering } from "@paper-design/shaders-react";
import type { BackdropProps } from "../../lib/effects/backdrop/types";

export default function PaperDithering({ colorBack, colorFront }: BackdropProps) {
  return (
    <Dithering
      shape="simplex"
      type="4x4"
      colorBack={colorBack}
      colorFront={colorFront}
      size={3}
      speed={0.4}
      scale={1}
      maxPixelCount={1920 * 1080}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
