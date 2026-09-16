// Formatting and scale helpers shared by the agent-loop visuals. Pure and isomorphic.

export const fmtTokens = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k` : `${Math.round(n)}`;

export const fmtUsd = (n: number) => (n >= 1 ? `$${n.toFixed(2)}` : n >= 0.01 ? `$${n.toFixed(3)}` : `$${n.toFixed(4)}`);

export const fmtSeconds = (s: number) =>
  s < 60 ? `${Math.round(s)}s` : s < 3_600 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${Math.floor(s / 3_600)}h ${Math.round((s % 3_600) / 60)}m`;

/** Signed, rounded percentage change, e.g. "+24%" or "−80%". */
export const fmtChange = (now: number, before: number) => {
  if (!before) return "—";
  const p = Math.round(((now - before) / before) * 100);
  return `${p > 0 ? "+" : p < 0 ? "−" : ""}${Math.abs(p)}%`;
};

/** Linear map from [d0, d1] to [r0, r1]. */
export const scale = (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
  d1 === d0 ? r0 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

export const cumulative = (values: number[]) => {
  let running = 0;
  return values.map((v) => (running += v));
};

/** SVG polyline points from values, with x spread over the index. */
export const points = (values: number[], x: (i: number) => number, y: (v: number) => number) =>
  values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

/** Sort labels top-down and push apart any that sit closer than `minGap` units. */
export const nudgeLabels = <T extends { y: number }>(entries: T[], minGap: number): T[] => {
  const sorted = entries.map((e) => ({ ...e })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].y - sorted[i - 1].y < minGap) sorted[i].y = sorted[i - 1].y + minGap;
  }
  return sorted;
};
