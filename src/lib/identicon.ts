// Deterministic halftone-gradient banner generator.
// Pure, dependency-free, runs at build time and returns a self-contained SVG string.
// Same seed -> same SVG. The WHOLE banner is a halftone dot grid: every cell has a
// dot. A smooth seed-derived intensity field (soft radial glow + linear gradient +
// a little grain) drives each dot's size and brightness, so faint background dots
// sit under a brighter gradient bloom.
// Aspect ratio is fixed (VIEW_COLS x VIEW_ROWS) so dots stay circular; callers must
// give the banner the same aspect-ratio so card and header render identically.

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const VIEW_COLS = 80;
export const VIEW_ROWS = 15;

export interface IdenticonOptions {
  cols?: number;
  rows?: number;
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

interface Glow {
  cx: number;
  cy: number;
  s2: number; // 2 * sigma^2
  amp: number;
}

export function identiconSvg(seed: string, opts: IdenticonOptions = {}): string {
  const cols = opts.cols ?? VIEW_COLS;
  const rows = opts.rows ?? VIEW_ROWS;
  const rng = mulberry32(fnv1a(seed));

  // Palette: highlight hue + a slightly shifted shadow hue (kept unwrapped so the
  // interpolation never crosses the color wheel the long way).
  const hueHi = Math.floor(rng() * 360);
  const hueLo = hueHi - (16 + rng() * 44);

  // Linear gradient direction.
  const ang = rng() * Math.PI * 2;
  const dirx = Math.cos(ang);
  const diry = Math.sin(ang);

  // One or two soft radial glows placed by the seed.
  const nGlows = 1 + Math.floor(rng() * 0.33);
  const glows: Glow[] = [];
  for (let k = 0; k < nGlows; k++) {
    const sigma = rows * (0.85 + rng() * 0.85);
    glows.push({
      cx: cols * (0.15 + rng() * 0.7),
      cy: rows * (0.2 + rng() * 0.6),
      s2: 2 * sigma * sigma,
      amp: 0.55 + rng() * 0.5,
    });
  }

  // Grain lattice for subtle value noise on top of the smooth field.
  const lgx = 7;
  const lgy = 4;
  const lat: number[][] = [];
  for (let y = 0; y < lgy; y++) {
    const row: number[] = [];
    for (let x = 0; x < lgx; x++) row.push(rng());
    lat.push(row);
  }
  const noise = (fx: number, fy: number): number => {
    const gxp = fx * (lgx - 1);
    const gyp = fy * (lgy - 1);
    const x0 = Math.floor(gxp);
    const y0 = Math.floor(gyp);
    const x1 = Math.min(x0 + 1, lgx - 1);
    const y1 = Math.min(y0 + 1, lgy - 1);
    const tx = smooth(gxp - x0);
    const ty = smooth(gyp - y0);
    const a = lat[y0][x0];
    const b = lat[y0][x1];
    const c = lat[y1][x0];
    const d = lat[y1][x1];
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
  };

  const baseline = 0.02; // background dot intensity (never fully empty)
  const linWeight = 0.07;
  const minR = 0.01; // background dot radius (cell units)
  const maxR = 0.31; // brightest dot radius (tangent to neighbors)

  let dots = "";
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const px = i + 0.5;
      const py = j + 0.5;

      // Linear gradient component, projected onto the seed direction -> [0,1].
      const proj = (px / cols - 0.5) * dirx + (py / rows - 0.5) * diry;
      const lin = clamp01(proj + 0.5);

      // Soft radial glow(s).
      let g = 0;
      for (let k = 0; k < nGlows; k++) {
        const gl = glows[k];
        const ddx = px - gl.cx;
        const ddy = py - gl.cy;
        g += gl.amp * Math.exp(-(ddx * ddx + ddy * ddy) / gl.s2);
      }

      const grain = (noise(px / cols, py / rows) - 0.5) * 0.76;
      const t = clamp01(baseline + linWeight * lin + g + grain);

      const rad = minR + (maxR - minR) * t;
      const hue = ((hueLo * (1 - t) + hueHi * t) % 360 + 360) % 360;
      const sat = 68 + t * 16;
      const light = 20 + t * 46;
      dots +=
        `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${rad.toFixed(3)}" ` +
        `fill="hsl(${hue.toFixed(0)} ${sat.toFixed(0)}% ${light.toFixed(0)}%)"/>`;
    }
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols} ${rows}" ` +
    `width="100%" height="100%" preserveAspectRatio="xMidYMid meet">` +
    `<g>${dots}</g>` +
    `</svg>`
  );
}
