# Color palette

Source of truth: `src/styles/global.css`. This doc inventories the existing
tokens (unchanged) and documents the new categorical accents added for skill
badges and future categorical UI.

## Existing tokens (unchanged)

shadcn tokens, defined as HSL triplets in `:root` / `.dark`, exposed through
`@theme inline` as `--color-*` (Tailwind utilities `bg-*`, `text-*`,
`border-*`).

| Token | Light | Dark |
|---|---|---|
| `--background` | `#ffffff` | `#0a0a0a` |
| `--foreground` | `#121212` | `#f2f2f2` |
| `--card` | `#f7f7f7` | `#121212` |
| `--primary` (brand) | `#6250e7` | `#7666ea` |
| `--secondary` | `#f7f7f7` | `#1f1f1f` |
| `--muted` | `#f7f7f7` | `#1f1f1f` |
| `--muted-foreground` | `#6b6b6b` | `#8f8f8f` |
| `--accent` (shadcn hover surface — unrelated to the new categorical accents below) | `#f7f7f7` | `#1f1f1f` |
| `--destructive` | `#ef4444` | `#7f1d1d` |
| `--border` | `#d1d1d1` | `#333333` |

Legacy crimson tokens (`--color-legacy-*`, hardcoded hex in `@theme`) stay
scoped to the WIP landing + `about`/`contact`/`work`. Not touched.

**Naming collision to note**: shadcn already has a token literally named
`--accent` (a neutral hover surface, e.g. `bg-accent` on menu items). The new
palette below is a *different* concept — categorical identity colors — added
as `--accent-<hue>` (`--accent-blue`, not `--accent`). Don't confuse the two.

## New tokens: categorical accents

Six hues, additive only — no existing token changed. Built with the `dataviz`
skill's categorical-color method: fixed hue order, OKLCH lightness band,
chroma floor, CVD (color-vision-deficiency) separation, and contrast, all
machine-checked with `validate_palette.js` (not eyeballed).

| Token | Hue family | Light (HSL) | Light hex | Dark (HSL) | Dark hex |
|---|---|---|---|---|---|
| `--accent-blue` | blue | `213 68% 49%` | `#2874d2` | `213 77% 56%` | `#3987e5` |
| `--accent-orange` | orange | `17 82% 44%` | `#cc4814` | `17 70% 50%` | `#d95926` |
| `--accent-teal` | teal | `159 73% 30%` | `#15845d` | `159 73% 36%` | `#199e70` |
| `--accent-amber` | amber | `41 100% 31%` | `#9e6c00` | `40 100% 39%` | `#c98500` |
| `--accent-pink` | pink/magenta | `337 70% 52%` | `#da2f71` | `338 61% 58%` | `#d55181` |
| `--accent-green` | green | `120 100% 27%` | `#008a00` | `120 90% 30%` | `#089108` |

Exposed via `@theme inline` as `--color-accent-<hue>`, so `bg-accent-blue`,
`text-accent-blue`, `border-accent-blue` (and the other 5 hues) exist as
Tailwind utilities, including opacity modifiers (`bg-accent-blue/12`).

Hues were chosen to avoid `--primary`'s hue (247°, purple) and
`--destructive`'s hue (0°, red) by a wide margin, so the new accents read as
a distinct categorical set that still sits comfortably next to the purple
brand color (same saturation/lightness philosophy as the rest of the shadcn
palette).

### Why these values (not the raw dataviz reference hexes)

The dataviz skill's default reference palette (`references/palette.md`) is
tuned for **chart marks** — filled areas/lines/dots that don't carry their
own text label. Its light-mode hexes for teal/amber/pink/orange land under
3:1 contrast against a white surface (e.g. `#eda100` amber is 2.17:1) —
correct for a chart mark next to a legend, wrong for a color used as small
badge **text**.

Since these accents are used as text (see "Usage rules" below), each hue was
independently re-stepped (same hue/saturation, different lightness) so the
badge text itself clears **WCAG AA text contrast (>= 4.5:1)** against the
page background in its own mode, not just the >= 3:1 mark-contrast bar. The
`--primary`/`--foreground` design language (HSL, `.dark` override) was kept
so the tokens drop into the existing system unchanged.

### Validation results

Run against this site's actual surfaces (`#ffffff` light / `#0a0a0a` dark),
in the fixed order above (this order is the CVD-safety mechanism — don't
reorder without re-validating):

**Light** (`node validate_palette.js "#2874d2,#cc4814,#15845d,#9e6c00,#da2f71,#008a00" --mode light --surface "#ffffff"`)
- Lightness band: PASS (all 6 inside OKLCH L 0.43–0.77)
- Chroma floor: PASS (all 6 >= 0.10)
- CVD separation (adjacent pairs): **WARN** — worst pair `#9e6c00` (amber) ↔ `#15845d` (teal), ΔE 7.7 (in the 6–8 "floor" band, legal only with secondary encoding)
- Normal-vision floor: PASS — worst pair ΔE 16.0 (>= 15 hard gate)
- Contrast vs surface: PASS (all 6 >= 3:1; all 6 are also individually >= 4.5:1 as text, see below)

**Dark** (`--mode dark --surface "#0a0a0a"`)
- Lightness band: PASS (all 6 inside OKLCH L 0.48–0.67)
- Chroma floor: PASS
- CVD separation: PASS — worst adjacent pair ΔE 8.4
- Normal-vision floor: PASS — worst pair ΔE 19.3
- Contrast vs surface: PASS (all 6 >= 3:1)

**Text contrast per hue** (badge text color vs its mode's `--background`):

| Hue | Light contrast | Dark contrast |
|---|---|---|
| blue | 4.65:1 | 4.60:1 |
| orange | 4.66:1 | 4.59:1 |
| teal | 4.68:1 | 5.81:1 |
| amber | 4.57:1 | 6.45:1 |
| pink | 4.54:1 | 4.60:1 |
| green | 4.53:1 | 4.77:1 |

All 6 clear WCAG AA (>= 4.5:1) for normal text, in both modes.

**Accepted deviation**: the light-mode adjacent pair amber/teal sits in the
6–8 CVD "floor" band (WARN, not FAIL — the normal-vision floor still clears
at 16.0). This is legal under the skill's own rule *only* with secondary
encoding, which this use case always ships: every skill badge shows the
skill's name as text — color is a supplementary grouping cue, never the only
way to tell two badges apart. If a 7th category is ever needed, re-run the
validator before adding a hue; don't eyeball it.

## Usage rules

- **Additive only.** Never replace an existing shadcn or legacy token with an
  accent, and never repurpose `--accent` (singular, the shadcn hover surface)
  for categorical color.
- **Badge pattern**: tinted background + solid text, both from the same
  token — `bg-accent-<hue>/12 text-accent-<hue>` (see
  `src/components/cv/ui/Badge.tsx`'s `category` variants). The background
  tint is decorative (low opacity); the contrast guarantee above applies to
  the text.
- **Fixed order.** When a new categorical grouping needs color (skills,
  tags, categories), assign hues in the fixed order above, never cycled or
  reordered per-instance.
- **Don't reuse for status.** Good/warning/error states stay on
  `--destructive` / future status tokens, not on these hues, even where a hue
  might look similar (e.g. don't read `--accent-green` as "success").
- **Scope**: introduced for CV skill badges (`src/data/skill-categories.ts`,
  `src/components/cv/sections/Skills.astro`). Available site-wide as regular
  Tailwind utilities for any future categorical UI (tags, filters, etc.).
