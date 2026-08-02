import { useEffect, useState } from "react";
import { backdropEffect as Effect } from "../../lib/effects/backdrop";
import { readFrontColor, TRANSPARENT_BACK } from "../../lib/effects/backdrop/color";
import type { BackdropProps } from "../../lib/effects/backdrop/types";

function readColors(): BackdropProps {
  return {
    colorBack: TRANSPARENT_BACK,
    colorFront: readFrontColor(),
  };
}

/** Si no puede correr en condiciones, no se muestra nada. No hay fallback CSS. */
function canRender(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!gl) return false;
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return true;
}

export default function Backdrop() {
  const [colors, setColors] = useState<BackdropProps | null>(null);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    if (!canRender()) return;
    setColors(readColors());

    const observer = new MutationObserver((records) => {
      if (records.some((r) => r.attributeName === "class")) setColors(readColors());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  /**
   * El island hidrata tarde (`client:idle`) y el canvas WebGL recién pinta en el frame siguiente
   * al montaje. Sin esperar ese frame el fade arrancaría sobre un canvas todavía vacío y se vería
   * el mismo salto que se quiere evitar.
   */
  useEffect(() => {
    if (!colors || painted) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPainted(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [colors, painted]);

  if (!colors) return null;
  return (
    <div className="backdrop-fade" data-painted={painted || undefined}>
      <Effect {...colors} />
    </div>
  );
}
