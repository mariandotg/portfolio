// The one coordinate system the note figures draw in. Before this, the same idea had four names:
// PLOT_LEFT/PLOT_RIGHT, plotX0/plotY0, L/R/T/B and trackX0/BAR_X. A frame is computed in the
// figure's frontmatter and handed to <Plot> and <Axis>, which is the only way an Astro component
// can share derived scope with its children.
import { scale } from "../format";

export interface Inset {
  l?: number;
  r?: number;
  t?: number;
  b?: number;
}

export interface FrameOptions {
  /** viewBox width and height, in SVG user units. */
  w: number;
  h: number;
  /** Space between the viewBox and the drawing box: label gutters, axis room. */
  inset?: Inset;
  /** Domain mapped left to right across the drawing box. */
  x?: [number, number];
  /** Domain mapped bottom to top, so `y(d0)` sits on the baseline. */
  y?: [number, number];
  /** Split the horizontal span into this many equal bands, one per datum. */
  bands?: number;
  /** Taken off each band's width, so bands read as separate bars. */
  bandGap?: number;
  /** Stack this many rows down the vertical span. */
  rows?: number;
  rowGap?: number;
}

export interface PlotFrame {
  readonly w: number;
  readonly h: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
  /** Where a value of the x domain sits. */
  x(v: number): number;
  y(v: number): number;
  /** How wide `v` x-domain units are — the width of a bar measured from zero. */
  spanX(v: number): number;
  spanY(v: number): number;
  /** Left edge of band `i`. */
  band(i: number): number;
  bandCenter(i: number): number;
  readonly bandWidth: number;
  /** Top edge of row `i`. */
  row(i: number): number;
  readonly rowHeight: number;
}

export function plotFrame(o: FrameOptions): PlotFrame {
  const left = o.inset?.l ?? 0;
  const top = o.inset?.t ?? 0;
  const right = o.w - (o.inset?.r ?? 0);
  const bottom = o.h - (o.inset?.b ?? 0);
  const width = right - left;
  const height = bottom - top;

  const [x0, x1] = o.x ?? [0, 1];
  const [y0, y1] = o.y ?? [0, 1];

  const bandPitch = width / (o.bands ?? 1);
  const bandGap = o.bandGap ?? 0;
  const rowPitch = (height + (o.rowGap ?? 0)) / (o.rows ?? 1);

  return Object.freeze({
    w: o.w,
    h: o.h,
    left,
    right,
    top,
    bottom,
    width,
    height,
    x: scale(x0, x1, left, right),
    y: scale(y0, y1, bottom, top),
    spanX: (v: number) => (x1 === x0 ? 0 : (width * v) / (x1 - x0)),
    spanY: (v: number) => (y1 === y0 ? 0 : (height * v) / (y1 - y0)),
    band: (i: number) => left + i * bandPitch,
    bandCenter: (i: number) => left + i * bandPitch + (bandPitch - bandGap) / 2,
    bandWidth: bandPitch - bandGap,
    row: (i: number) => top + i * rowPitch,
    rowHeight: rowPitch - (o.rowGap ?? 0),
  });
}
