import { useEffect, useState } from "react";
import { backdropEffect as Effect } from "../../lib/effects/backdrop";
import type { BackdropProps } from "../../lib/effects/backdrop/types";

function readToken(name: string): string {
  return `hsl(${getComputedStyle(document.documentElement).getPropertyValue(name).trim()})`;
}

/**
 * El canvas es un overlay sobre la página, así que el fondo del shader debe ser
 * transparente: sólo pintan las celdas encendidas. Pasarle `--background` pinta
 * un rectángulo opaco y aplasta el contraste del dither hasta dejarlo plano.
 */
function readColors(): BackdropProps {
  return { colorBack: "rgba(0, 0, 0, 0)", colorFront: readToken("--primary") };
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

  useEffect(() => {
    if (!canRender()) return;
    setColors(readColors());

    const observer = new MutationObserver((records) => {
      if (records.some((r) => r.attributeName === "class")) setColors(readColors());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!colors) return null;
  return <Effect {...colors} />;
}
