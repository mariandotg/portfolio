/**
 * Halftone dithering post-processor.
 *
 * Reads luminance from a grayscale-rendered ImageData (offscreen canvas),
 * then draws circles on the output canvas. Each circle's radius is proportional
 * to the darkness at that grid point — darker areas → bigger dots, lighter → smaller.
 *
 * This produces the classic newspaper/halftone print aesthetic seen in the reference.
 */
interface HalftoneOptions {
  /** Clear the output canvas before drawing (default: true). */
  clear?: boolean;
  /** X offset where sourceData's (0,0) maps on the destination canvas. */
  offsetX?: number;
  /** Y offset where sourceData's (0,0) maps on the destination canvas. */
  offsetY?: number;
}

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
  options?: HalftoneOptions,
): void {
  const { data, width: srcW, height: srcH } = sourceData;
  const clear = options?.clear ?? true;
  const offsetX = options?.offsetX ?? 0;
  const offsetY = options?.offsetY ?? 0;

  /**
   * Maximum dot radius as a fraction of dotSpacing.
   * 0.55 means the biggest dots almost touch neighbors (0.5 would be tangent).
   * Increase for overlapping dots, decrease for more whitespace between dots.
   */
  const maxRadius = dotSpacing * 0.40;

  const fillStyle = `rgba(${fgR},${fgG},${fgB},${fgAlpha})`;

  if (clear) ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = fillStyle;

  const startX = Math.max(0, Math.floor(offsetX / dotSpacing) * dotSpacing);
  const startY = Math.max(0, Math.floor(offsetY / dotSpacing) * dotSpacing);
  const endX = Math.min(canvasW, Math.ceil((offsetX + srcW) / dotSpacing) * dotSpacing);
  const endY = Math.min(canvasH, Math.ceil((offsetY + srcH) / dotSpacing) * dotSpacing);

  // Walk a uniform grid over the canvas. At each cell, sample the grayscale
  // source and decide dot size.
  for (let gy = startY; gy < endY; gy += dotSpacing) {
    for (let gx = startX; gx < endX; gx += dotSpacing) {
      if (gx < offsetX || gx >= offsetX + srcW || gy < offsetY || gy >= offsetY + srcH) continue;

      // Sample the source pixel at this grid position
      const sx = Math.min(Math.max(Math.round(gx - offsetX), 0), srcW - 1);
      const sy = Math.min(Math.max(Math.round(gy - offsetY), 0), srcH - 1);
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
