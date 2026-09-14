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

Six hues, additive only — no existing token changed. Used as **text-only**
accents on the site's standard neutral badge (same background/border as every
other badge, e.g. the certificate-date pill) — no tinted background — so they
read as sober and consistent with the portfolio's mostly-grayscale palette
next to the single purple `--primary` accent.

| Token | Hue family | Light (HSL) | Light hex | Dark (HSL) | Dark hex |
|---|---|---|---|---|---|
| `--accent-blue` | slate blue | `213 38% 49%` | `#4d78ac` | `213 45% 51%` | `#4a7cba` |
| `--accent-orange` | clay/terracotta | `17 38% 47%` | `#a5644a` | `17 45% 49%` | `#b56545` |
| `--accent-teal` | sage teal | `159 38% 37%` | `#3a8269` | `159 45% 40%` | `#389474` |
| `--accent-amber` | olive/khaki | `41 38% 39%` | `#89713e` | `41 45% 40%` | `#947738` |
| `--accent-pink` | dusty rose | `337 38% 50%` | `#b04f74` | `337 45% 54%` | `#be557d` |
| `--accent-green` | moss green | `120 38% 37%` | `#3a823a` | `120 45% 40%` | `#389438` |

Exposed via `@theme inline` as `--color-accent-<hue>`, so `bg-accent-blue`,
`text-accent-blue`, `border-accent-blue` (and the other 5 hues) exist as
Tailwind utilities. Only `text-accent-<hue>` is actually used today (see
"Usage rules").

Hues were chosen to avoid `--primary`'s hue (247°, purple) and
`--destructive`'s hue (0°, red) by a wide margin.

### Design direction: sober over vivid

The first pass at this palette used the `dataviz` skill's categorical-color
method at full saturation (chart-grade hues, ~68–100% HSL saturation) with a
tinted badge background. On review that read as too colorful/playful for this
portfolio's mostly-grayscale, single-accent (purple) visual language, so the
palette was revised:

- **Saturation cut roughly in half** (~38% light / ~45% dark, same hues and
  lightness bands as the first pass) — dusty, muted tones instead of vivid
  chart colors.
- **No tinted background.** Badges keep the site's standard neutral chrome
  (`variant="secondary"`, same as every other badge); only the label text
  color shifts per category.

**Tradeoff, stated plainly**: at this saturation the palette no longer clears
the dataviz skill's chroma-floor and CVD-separation gates (`validate_palette.js`
reports FAIL on both for this hex set — chroma ~0.075–0.094, below the ~0.10
floor, and several adjacent pairs under the color-vision-deficiency
separation target). That method is built for chart marks, which often carry
*no other* identity signal than color. That's not the case here: every skill
badge always shows the skill's name as text — color is a quiet grouping cue
layered on top of a label that's legible on its own, never the only way to
tell two badges apart. Given that, and the explicit ask for a sober look
aligned with the rest of the site, the tradeoff was accepted deliberately
rather than automatically.

**Non-negotiable kept**: WCAG AA text contrast (>= 4.5:1) against
`--background`, in both modes — this is what actually matters for a label
that must stay readable regardless of how muted its hue is.

### Text contrast per hue (kept from the original validation)

| Hue | Light contrast | Dark contrast |
|---|---|---|
| blue | 4.57:1 | 4.60:1 |
| orange | 4.64:1 | 4.63:1 |
| teal | 4.59:1 | 5.33:1 |
| amber | 4.67:1 | 4.67:1 |
| pink | 4.98:1 | 4.51:1 |
| green | 4.74:1 | 5.15:1 |

All 6 clear WCAG AA (>= 4.5:1) for normal text, in both modes.

## Usage rules

- **Additive only.** Never replace an existing shadcn or legacy token with an
  accent, and never repurpose `--accent` (singular, the shadcn hover surface)
  for categorical color.
- **Badge pattern**: `text-accent-<hue>` on the site's standard neutral badge
  (`variant="secondary"` — unchanged background/border). See
  `src/data/skill-categories.ts` and `src/components/cv/sections/Skills.astro`.
  Don't add a tinted background back without re-discussing the sober
  direction above.
- **Fixed order.** When a new categorical grouping needs color (skills,
  tags, categories), assign hues in the fixed order above, never cycled or
  reordered per-instance.
- **Don't reuse for status.** Good/warning/error states stay on
  `--destructive` / future status tokens, not on these hues, even where a hue
  might look similar (e.g. don't read `--accent-green` as "success").
- **Scope**: introduced for CV skill badges (`src/data/skill-categories.ts`,
  `src/components/cv/sections/Skills.astro`). Available site-wide as regular
  Tailwind utilities for any future categorical UI (tags, filters, etc.) —
  but re-check contrast (and reconsider the sober-vs-vivid tradeoff above) if
  a future use case doesn't always carry its own text label.
