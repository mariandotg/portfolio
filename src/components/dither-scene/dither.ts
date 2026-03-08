/**
 * Halftone dithering post-processor.
 *
 * Reads luminance from a grayscale-rendered ImageData (offscreen canvas),
 * then draws circles on the output canvas. Each circle's radius is proportional
 * to the darkness at that grid point — darker areas → bigger dots, lighter → smaller.
 *
 * This produces the classic newspaper/halftone print aesthetic seen in the reference.
 */
export function applyHalftone(
  ctx: CanvasRenderingContext2D,
  sourceData: ImageData,
  canvasW: number,
  canvasH: number,
  /** Grid spacing in physical pixels between dot centers (smaller = denser dots) */
  dotSpacing: number,
  /** Foreground dot color — red channel (0-255) */
  fgR: number,
  /** Foreground dot color — green channel (0-255) */
  fgG: number,
  /** Foreground dot color — blue channel (0-255) */
  fgB: number,
  /** Foreground dot opacity (0-1). Controls how visible the dots are over the page. */
  fgAlpha: number,
): void {
  const { data, width: srcW } = sourceData;

  /**
   * Maximum dot radius as a fraction of dotSpacing.
   * 0.55 means the biggest dots almost touch neighbors (0.5 would be tangent).
   * Increase for overlapping dots, decrease for more whitespace between dots.
   */
  const maxRadius = dotSpacing * 0.40;

  const fillStyle = `rgba(${fgR},${fgG},${fgB},${fgAlpha})`;

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = fillStyle;

  // Walk a uniform grid over the canvas. At each cell, sample the grayscale
  // source and decide dot size.
  for (let gy = 0; gy < canvasH; gy += dotSpacing) {
    for (let gx = 0; gx < canvasW; gx += dotSpacing) {
      // Sample the source pixel at this grid position
      const sx = Math.min(Math.round(gx), srcW - 1);
      const sy = Math.min(Math.round(gy), (data.length / 4 / srcW) - 1);
      const i = (sy * srcW + sx) * 4;

      // Skip fully transparent pixels (no geometry was rendered here)
      const a = data[i + 3];
      if (a === 0) continue;

      const r = data[i], g = data[i + 1], b = data[i + 2];

      // Perceived luminance using standard weights (0 = black, 1 = white)
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Invert: darker areas get bigger dots
      const darkness = 1 - lum;

      /** Skip very faint areas — tweak this threshold to control dot cutoff */
      if (darkness < 0.04) continue;

      const radius = maxRadius * darkness;

      ctx.beginPath();
      ctx.arc(gx, gy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
