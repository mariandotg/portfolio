/** Peso real del string SVG. Isomórfico: lo usan el render de `/dev/effects` y su script. */
export function svgWeight(svg: string): { bytes: number; label: string } {
  const bytes = new TextEncoder().encode(svg).length;
  return { bytes, label: `${(bytes / 1024).toFixed(1)} KB · ${bytes.toLocaleString("en-US")} B` };
}
