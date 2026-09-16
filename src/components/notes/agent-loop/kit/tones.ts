// One meaning per fill. The custom properties live in agent-loop.css and derive from the semantic
// data palette in global.css (docs/design/design-system.md §3.1).

export type Tone = "new" | "resent" | "read" | "write" | "uncached" | "gain" | "loss";

/** A legend may also stand for a quantity that is not there yet. */
export type SwatchTone = Tone | "ghost";

/** The class that fills an SVG shape with a tone. */
export const TONE_FILL: Record<Tone, string> = {
  new: "alc-fill-new",
  resent: "alc-fill-resent",
  read: "alc-fill-read",
  write: "alc-fill-write",
  uncached: "alc-fill-uncached",
  gain: "alc-fill-good",
  loss: "alc-fill-bad",
};
