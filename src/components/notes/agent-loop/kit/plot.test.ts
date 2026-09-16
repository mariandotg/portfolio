import assert from "node:assert/strict";
import { test } from "node:test";
import { plotFrame } from "./plot";

// The four coordinate conventions the agent-loop figures grew independently. Each case below
// reproduces one figure's own constants from a frame, so the migration in MDG-131 cannot need an
// escape hatch to draw what the figure already draws.

test("numeric x and y — CacheBreakEven's PLOT_LEFT/PLOT_RIGHT/PLOT_TOP/PLOT_BOTTOM", () => {
  const yMax = 1.28;
  const f = plotFrame({ w: 480, h: 240, inset: { l: 6, r: 108, t: 30, b: 44 }, x: [0, 900], y: [0, yMax] });

  assert.deepEqual([f.left, f.right, f.top, f.bottom], [6, 372, 30, 196]);
  assert.equal(f.x(0), 6);
  assert.equal(f.x(900), 372);
  assert.equal(f.y(0), 196);
  assert.equal(f.y(yMax), 30);
  // The 5-minute TTL marker sits where the old `xAt(TTL)` put it.
  assert.equal(f.x(300), 6 + (300 / 900) * 366);
});

test("bands over an index — TrimCost's slot/x(i)/barWidth", () => {
  const N = 30;
  const f = plotFrame({ w: 480, h: 214, inset: { l: 6, r: 6, t: 24, b: 26 }, bands: N, bandGap: 1, y: [0, 104_100] });

  const slot = (474 - 6) / N;
  assert.equal(f.bandWidth, slot - 1);
  assert.equal(f.band(0), 6);
  assert.equal(f.band(N - 1), 6 + (N - 1) * slot);
  assert.equal(f.y(0), 188);
  // ClearingCost centred its ghost line on the same bands.
  assert.equal(f.bandCenter(7), 6 + 7 * slot + (slot - 1) / 2);
});

test("rows behind a label gutter — TeamTimeline's labelW/trackX0/laneY", () => {
  const lanes = 6;
  const laneH = 22;
  const laneGap = 8;
  const f = plotFrame({ w: 480, h: 16 + lanes * (laneH + laneGap) - laneGap + 16, inset: { l: 82, r: 6, t: 16, b: 16 }, x: [0, 1200], rows: lanes, rowGap: laneGap });

  assert.equal(f.left, 82);
  assert.equal(f.right, 474);
  assert.equal(f.rowHeight, laneH);
  assert.equal(f.row(0), 16);
  assert.equal(f.row(lanes - 1), 16 + (lanes - 1) * (laneH + laneGap));
  assert.equal(f.x(0), 82);
  assert.equal(f.x(1200), 474);
});

test("one proportional bar — a request split into blocks by token share", () => {
  const total = 70_000;
  const f = plotFrame({ w: 480, h: 110, inset: { l: 6, r: 74, t: 54, b: 26 }, x: [0, total] });

  assert.deepEqual([f.left, f.width, f.top, f.height], [6, 400, 54, 30]);
  // A block's width is its share of the request, which is what `segW` computed.
  assert.equal(f.spanX(3_000), (3_000 / total) * 400);
  // Blocks butt against each other: the second starts where the first ends.
  assert.equal(f.x(3_000), 6 + f.spanX(3_000));
});
