import { useEffect, useState } from "react";
import { backdropEffect as Effect } from "../../lib/effects/backdrop";
import { readBackdropColors as readColors } from "../../lib/effects/backdrop/color";
import type { BackdropProps } from "../../lib/effects/backdrop/types";

/** Si no puede correr en condiciones, no se muestra nada. No hay fallback CSS. */
function canRender(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!gl) return false;
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return true;
}

export default function Backdrop({ seed }: { seed?: string }) {
  const [colors, setColors] = useState<Omit<BackdropProps, "seed"> | null>(null);
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

  /**
   * El island persiste entre navegaciones, pero el `<div class="backdrop">` que lo envuelve no: en
   * cada swap el canvas se transplanta al div nuevo, o sea que el elemento que observa el
   * `ResizeObserver` del shader se desconecta y se vuelve a conectar. Cuando eso pasa la medida en
   * píxeles físicos se puede perder y el shader vuelve a pintar a la mitad de resolución — la trama
   * del dither se ve el doble de gruesa.
   *
   * `@paper-design/shaders` re-mide cuando cambia el visual viewport: desconecta el observer y lo
   * vuelve a enganchar para forzar un callback fresco. Le disparamos ese mismo evento después de
   * cada navegación. Si la medida ya era correcta, `handleResize` no hace nada.
   */
  useEffect(() => {
    const remeasure = () => window.visualViewport?.dispatchEvent(new Event("resize"));
    document.addEventListener("astro:page-load", remeasure);
    return () => document.removeEventListener("astro:page-load", remeasure);
  }, []);

  if (!colors) return null;
  return (
    <div className="backdrop-fade" data-painted={painted || undefined}>
      <Effect {...colors} seed={seed} />
    </div>
  );
}
