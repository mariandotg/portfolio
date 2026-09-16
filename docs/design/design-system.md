# Design system

Scope: the productive surfaces — `/notes`, `/notes/archive`, the note page,
the series landings, and the CV. The WIP landing and the marketing pages
(`about`, `contact`, `work`) stay on legacy crimson and are out of scope.

Companion doc: [`palette.md`](./palette.md) inventories the current tokens.
This doc says what the system must become and in which order.

---

## 1. Diagnosis

The site has two design systems that never met.

**The chrome and the listings are disciplined.** Nav, footer, `/notes`,
`PostListItem` and `SeriesCard` share one container, one accent, and one
metadata voice. They look like one product.

**The note bodies are not.** Two generations of note components live side by
side and use different visual languages:

| | Old family (`idempotency`) | New family (`agent-loop`) |
|---|---|---|
| Callouts | 4 tinted hues + emoji | 2 tinted hues, no emoji |
| Figure header | mono caps bar (`PAYMENT RETRY SIMULATOR`) | a question in sentence case |
| Headline number | none | big mono stat + delta chip |
| Caption | none | caption with source and assumption |
| Comparison block | red/green = wrong/right | red/green = brief/result (not a verdict) |

The new family is better. It already repeats a fixed seven-part anatomy
across 14 components: question → controls → stat → lede → plot → legend →
caption. That anatomy is the design system. It must be extracted, not
redesigned.

### Measured drift

| Fact | Evidence |
|---|---|
| 54 distinct hardcoded hex colors | `grep` over `src/**/*.{astro,tsx,css}` |
| 19 literal `font-size` values, including `8.5px`, `11.5px`, `12.5px`, `13.5px` | same sweep; plus 10 Tailwind `text-*` steps |
| The same semantic red is defined 5 times, independently | `Callout.astro:50`, `SideBySide.astro:52`, `RetrySimulatorIsland.astro` (×6), `agent-loop.css:10` |
| `#fff` stands in for `--primary-foreground` in 3 places | `RetrySimulatorIsland.astro:70,199`, `agent-loop.css:50` |
| `--radius-sm` / `--radius-md` are defined twice with different values | `global.css:123-124` (calc: 6px/4px) vs `global.css:164-165` (literal: 8px/10px) |
| ~50 literal `border-radius` values in scoped `<style>` blocks | none reference `var(--radius*)` |
| Two page widths, unreconciled | `max-w-[800px]` (13 uses) vs `max-w-5xl` (26 uses) |
| Note prose runs ~100 characters per line | `prose-sm` (14px) inside 704px, with `max-w-none` cancelling the plugin's `65ch` |

### Confirmed bugs

1. `.alc-fill-good` is used at `LookbackWindow.astro:76` but never defined in
   `agent-loop.css`. The rect renders with the browser default fill.
2. `smx:` is not a breakpoint. `Social.astro:36` (`hidden smx:flex`) is dead in
   every viewport; `Social.astro:49` (`flex smx:hidden`) always shows. The
   intended responsive split never runs.
3. `ProjectCard.tsx:35` puts `print:visible` on a `hidden` element. `hidden`
   sets `display:none`; `visible` only changes `visibility`. The print URL
   never prints.
4. `--font-family-inter` is declared and used (`.font-inter`) but Inter is
   never loaded. Those elements fall back to `system-ui`.
5. `AlertBox.tsx` carries 12 literal Material hexes and breaks in dark mode.
   No note imports it. `Counter.tsx` is also unused. `README.md` still lists
   both as the current catalogue.

### Token leaks into the notes surface

`CLAUDE.md` says notes must not use legacy crimson. Three rules break it:

- `global.css:225` — inline `code` background uses `--color-legacy-light-subtle`.
- `global.css:299` / `:324` — `.prose a:hover` uses `--color-legacy-primary`.
  Note links hover crimson while every other link hovers purple.
- `global.css:305` — `.shiki` light background is `#f6f8fa`, a blue-tinted grey
  in a palette that is otherwise 0% saturation.

---

## 2. Thesis

**The counted unit.**

Every note answers a question of quantity: how many tokens, how many requests,
how many facts survive, how many seconds. The site already encodes this by
accident — halftone dot banners, mono for every number, figures built from
discrete chips and bars, roadmap nodes numbered `01 / 02 / 03`. Make it the
explicit organising principle.

Five principles follow.

1. **Every figure asks a question in its title.** Not a label, a question. The
   figure is the answer. This is already the `agent-loop` pattern; make it a
   required prop.
2. **The number is the hero; the chart is the evidence.** The stat comes first,
   the plot supports it. Spend the page's only loud moment here and keep
   everything around it quiet.
3. **Mono means measured.** Numbers, code, dates, units, axis labels. Never
   decoration, never an eyebrow label.
4. **One accent means one thing.** Purple is what this request adds. Neutral is
   what was already sent. Three reserved tones carry gain, loss, and write.
5. **Every figure declares how it knows.** A small marker — `measured`,
   `calculated`, `assumed` — next to the caption. `FORMAT.md` already demands
   this discipline in prose. Surfacing it in the figure chrome is the
   pedagogical differentiator: it teaches the reader to ask the same question.

Principle 5 is the risk. It adds chrome to every figure. It earns its place
because the notes' whole claim is that the numbers are honest, and no
competing blog shows its epistemic status inline.

### What this is not

Two habits are dropped on purpose:

- **All-caps labels.** `ON THE EXAM`, `THE RULE`, `PAYMENT RETRY SIMULATOR`
  become sentence case. Tracked-out caps read as template chrome.
- **Trailing arrows in static link text.** `View all notes →` loses the arrow.
  The hover-reveal arrow on cards stays; it is a motion affordance, not decoration.

The `·` metadata separator stays. It is already consistent across every
surface, and changing it is churn with no gain.

---

## 3. Token layer

### 3.1 Colour

Keep the neutral base and `--primary` (`#6251E7`). Add one **data palette** with
five semantic roles and real light/dark pairs. It replaces every independent
definition of the same red and green.

```css
:root {
  --data-new:   247 76% 61%;   /* what this request adds — tracks --primary */
  --data-inert:   0  0% 42%;   /* already sent, resent, not chargeable news */
  --data-write:  38 90% 55%;   /* cache write, cost incurred */
  --data-gain:  150 55% 42%;   /* saved */
  --data-loss:    8 75% 57%;   /* penalty */
}
:root.dark {
  --data-new:   247 76% 72%;
  --data-inert:   0  0% 56%;
  --data-write:  38 85% 62%;
  --data-gain:  150 50% 55%;
  --data-loss:    8 80% 66%;
}
```

Dark values are lightened because these colours sit on tinted fills, not on
`--background`. `palette.md` already documents this measurement method for
`--skill-core`; apply it here and record the ratios.

Retire, in this order:

- the four ad-hoc hues in `Callout.astro:41-50`;
- `--alc-write` / `--alc-bad` / `--alc-good` in `agent-loop.css:8-11`
  (the other four `--alc-*` already derive from tokens correctly — keep them,
  repointed at `--data-*`);
- the red/green pairs in `SideBySide.astro:52,55` and `RetrySimulatorIsland`;
- the 12 hexes in `AlertBox.tsx` (delete the component);
- `.shiki` `#f6f8fa` → `hsl(var(--muted))`;
- `.prose a:hover` crimson → `hsl(var(--primary))`;
- inline `code` background → `hsl(var(--muted))`.

Add `.alc-fill-good` when repointing, so `LookbackWindow` renders.

### 3.2 Type

Keep IBM Plex Sans and IBM Plex Mono. The pairing is distinctive and mono
already carries a real role. Delete `--font-family-inter` and `.font-inter`.

Replace the 19 literal sizes and the dead `--text-title` / `--text-name` with
one scale. Tailwind v4 generates `text-*` utilities from these names.

| Token | Size | Line height | Use |
|---|---|---|---|
| `--text-display` | 32px | 1.2 | note h1, series h1 |
| `--text-title` | 20px | 1.3 | h2 |
| `--text-subtitle` | 16px | 1.4 | h3, card titles |
| `--text-body` | 16px | 1.65 | note prose |
| `--text-ui` | 14px | 1.5 | UI text, list descriptions |
| `--text-meta` | 12px | 1.4 | mono metadata, captions, legends |
| `--text-micro` | 11px | 1.3 | axis labels — the floor |

**11px is the floor.** No half-pixel sizes. `8.5px` and `10px` go away.

**Raise note prose from 14px to 16px.** 14px is a UI size, not a reading size.
This is the single largest readability gain available.

### 3.3 Radius

Collapse to four values and delete the duplicate `@theme` block at
`global.css:164-166`.

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 6px | chips, badges, inline code |
| `--radius-md` | 10px | figures, callouts, cards, code blocks |
| `--radius-lg` | 14px | banners, large surfaces |
| `--radius-pill` | 999px | pills, toggles |

Scoped `<style>` blocks must reference these, never literals.

### 3.4 Space and width

| Token | Value | Use |
|---|---|---|
| `--measure` | 66ch | reading column |
| `--width-bleed` | 880px | figure track |
| `--width-shell` | 800px | nav, footer, listings |

`--width-shell` becomes the one page width. The CV moves from `max-w-2xl`
(672px) onto it, so its content stops sitting 64px inside the nav above it.
The CV also adopts the site's three-step padding (`px-4 sm:px-6 lg:px-12`)
instead of its own two-step `p-4 md:p-16`.

### 3.5 Focus and motion

Add one global rule. Today only the shadcn primitives define focus; the nav,
theme toggle, language switcher, and 404 buttons fall back to the UA outline.

```css
:where(a, button, [role="button"], input, select, summary):focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

`prefers-reduced-motion` coverage is already good. Keep it.

---

## 4. The note grid

One grid. Prose holds the measure; figures bleed past it.

```css
.note {
  display: grid;
  grid-template-columns:
    [bleed-start] minmax(0, 1fr)
    [text-start] min(var(--measure), 100%) [text-end]
    minmax(0, 1fr) [bleed-end];
}
.note > *            { grid-column: text; }
.note > [data-bleed] { grid-column: bleed; max-width: var(--width-bleed); margin-inline: auto; }
```

```
        │◄──────── bleed track (880px) ─────────►│
        │        │◄── text (66ch ≈ 640) ──►│     │
┌───────┴────────┴─────────────────────────┴─────┴──────┐
│                 Part 2 of 3 · CCA Notes               │
│                 Four Short Loops                      │  display, 32px
│                 Sep 14 · 8 min                        │  mono, 12px
│                                                       │
│                 Body text at 16px in a 66-character   │
│                 measure. This is the reading rail;    │
│                 the eye returns to one left edge.     │
│                                                       │
│        ┌───────────────────────────────────────┐      │
│        │ Fig 3 — Why do four short loops send  │      │
│        │ fewer tokens than one long one?       │      │
│        │                                       │      │
│        │ 2.20M  −70% input tokens              │      │  ← the loud moment
│        │ Same tool work, dispatched in parallel│      │
│        │ ▁▂▃▄▅▆▇█                              │      │
│        │ ▪ new  ▪ resent                       │      │
│        │ calculated · Source: …                │      │
│        └───────────────────────────────────────┘      │
│                                                       │
│                 Body resumes on the same rail.        │
└───────────────────────────────────────────────────────┘
```

Everything is left-aligned, including the stat. The stat anchors to the text
column's left edge so one rail runs down the whole page.

This replaces `max-w-none` on `.prose`, which is what produces the current
~100-character line.

---

## 5. The figure kit

Extract the repeated anatomy. `AlcFigure` is the seed; it already wraps 13 of
14 visuals. `RequestAnatomy` builds a second, parallel figure shell and must
fold into the same one.

### API

```astro
<Figure
  n={3}
  question="Why do four short loops send fewer tokens than one long one?"
  basis="calculated"
  bleed
  options={[{ key: "parallel", label: "parallel" }, { key: "sequential", label: "sequential" }]}
>
  <Stat value="2.20M" unit="input tokens" delta="−70%" tone="gain" />
  <p slot="lede">Same tool work. Dispatched in parallel, the team finishes in 5m 40s.</p>

  <Plot w={480} h={180} inset={{ l: 8, r: 8, t: 24, b: 20 }}>
    <Bars series={…} tone="new" />
    <Axis x={["request 1", "request 30"]} />
  </Plot>

  <Legend items={[{ tone: "new", label: "new this turn" }, { tone: "inert", label: "sent again" }]} />
  <Source slot="caption" href="https://…">Anthropic reports ~15× the tokens of a chat.</Source>
  <DataTable slot="a11y" rows={…} />
</Figure>
```

### Basis

`Figure` requires `basis`. It renders in mono beside the caption, at
`--text-micro` and muted — quieter than the caption prose it sits next to, and
nowhere near the hero stat. When a figure mixes sources, the weakest wins.

| Basis | How the figure knows its number |
|---|---|
| `measured` | read from a cited source or an observed run; nothing derived |
| `calculated` | derived by applying documented rules and prices to a stated scenario |
| `assumed` | rests on a quantity or behaviour no source documents |

A stated workload does **not** demote a figure to `assumed`. If it did, all 14
figures would read `assumed` and the marker would carry no information. The test
is narrower: does the number rest on a behaviour or quantity nobody documents —
the 8-second wait before a response begins, the size of a subagent's brief,
whether the compaction pass reads the cache like a normal request?
`the-quadratic-loop` draws the same line in prose: "every number in this note is
calculated, and every workload size is an assumption stated under the visual
that uses it."

`basis` follows the figure the reader sees, not the component. `CompactionSawtooth`
switches on its own `variant` prop, because only the dollar headline depends on
the undocumented billing of the compaction pass.

### Primitives

| Primitive | Replaces | Found in |
|---|---|---|
| `Figure` | `AlcFigure` + `RequestAnatomy`'s own `<figure>` | 14 files |
| `Stat` | the hand-built headline + delta chip | ~10 files |
| `Plot` | `PLOT_*`, `plotX0/plotX1`, `BAR_*`, `trackX0/trackX1` — four naming conventions for one idea | 13 files |
| `Axis` | the copied 3-4 line SVG block | 6 files |
| `Legend` + `Swatch` | two implementations (`<span style="background:var(--alc-X)">` vs `<svg><rect class="alc-fill-X"/></svg>`) | 6 files |
| `Toggle` | the `Record<Key,T>` + `panelData()` + `hidden={key!==initial}` pattern | 7 files |
| `Source` | ad-hoc caption markup | 13 files |
| `DataTable` | nothing — new | all |

Move `nudgeLabels()` from `CacheBreakEven.astro:59` and `CacheCost.astro:44`
into `format.ts` with `minGap` as a parameter. `format.ts` is already the one
correctly shared module; extend it rather than starting a new one.

### Accessibility

Every SVG already carries `role="img"` and a quantitative `aria-label`. That is
the strongest pattern in the codebase — keep it. Add `DataTable` as a
visually-hidden equivalent, because a complex SVG's single label cannot carry
a series. Give `Tabs.astro` the full pattern it is missing: `role="tab"`,
`aria-selected`, `aria-controls`.

### Responsive

Every `agent-loop` SVG already scales through `viewBox` plus
`.alc-svg { width: 100% }`. One exception: `RequestAnatomy.astro:65` sets
`min-width: 380px`, so the first figure of the series needs horizontal scroll
at 375px. Remove the minimum and let the viewBox scale.

Below 480px, axis labels fall to `--text-micro` and legends stack. Do not
shrink below 11px; drop labels instead.

---

## 6. Callouts and prose

Collapse two callout systems into three variants, sentence case, no emoji, a
left rule plus a tinted fill from the data palette.

| Variant | Tone | Use |
|---|---|---|
| `note` | `--data-inert` | an aside the reader may skip |
| `rule` | `--data-new` | the thing to remember |
| `warning` | `--data-loss` | the trap |

`SideBySide` keeps red/green only when the pair really is wrong/right. In
`four-short-loops` it labels "subagent brief" and "expected result", which is
not a verdict — that instance takes neutral and `--data-new`.

Prose gaps to close, all currently unstyled and now in use:

- **Tables.** `the-cache-break` renders two raw plugin tables beside styled
  figures. Give them the figure's border, mono numerics, and `tabular-nums`.
- **Inline code.** Prose code gets the plugin's backtick pseudo-elements;
  code inside `Callout` gets a pill with no backticks. Pick the pill, drop
  `code::before/after`.
- **Blockquote, `hr`, nested lists, `figcaption`** have no override and are
  unexercised. Style them before a note needs them.

---

## 7. Series surface

Landing hierarchy, `SeriesLanding` extraction, total reading time, and
build-time guards for `seriesOrder` / missing series ids landed in MDG-133.

### Product decisions (MDG-135, 2026-09-16)

1. **Empty series are unpublished.** A series with zero published posts does
   not appear in listings and does not get a route — including `rootLevel`
   series such as `/claude-certified-architect`. JSON may exist in the repo
   before the first note ships; the site simply does not publish it yet. No
   empty-state landing, no outline teaser, no email capture.
2. **Drop the "Featured" badge.** `featured` was `rootLevel` under another
   name. Routing promotion stays as `rootLevel`; the reader-facing badge goes.
3. **Delete the series `collection` field.** It was required, unread, and
   already contradicted its posts. Collection remains a property of notes only.
4. **Related unnumbered notes stay implicit.** Companions like
   `the-cache-break` are not linked from the series landing or the note.
   No `related` list.

### Still to implement (from the decisions above)

- Filter zero-post series out of `getSeriesIndex` / static paths (en + es,
  standard and rootLevel).
- Remove `featured` from `SeriesCard` / CV series consumers and i18n strings
  that only served the badge.
- Drop `collection` from the series content schema and from every
  `src/content/series/*.json`.

---

## 8. Listings and CV

Small, high-visibility fixes:

- `PostListItem` title is 16px, `SeriesCard` title is 15px. Both take
  `--text-subtitle`.
- `PostListItem` has an unused `kicker` prop with finished styles. Feed it
  `collection`, so the taxonomy is visible outside the archive tabs.
- `"Updated {date}"` is hardcoded English and shows in `/es`. Move to i18n.
- `/notes` renders every post under "Latest Notes" with no `slice`. Cap it.
- `/notes/archive` has no empty state when a filter matches nothing, and its
  tabs have no `role`/`aria-selected`. It also reimplements `BackLink` by hand.
- CV: replace `text-gray-400` (3 uses) with `text-muted-foreground`; delete the
  dead `.card { border: 1px solid #ccc }` print rule; fix `smx:` and
  `print:visible`; give company, institution, and project names one shared
  title component instead of three.
- CV primitives: `cv/ui/Card.tsx` is a fork that only inverts padding, border,
  and shadow — deletable in favour of `ui/card.tsx` with class overrides.
  `Badge` and `Avatar` are near-free forks. Keep `cv/ui/Button.tsx`: its
  `injectClassOnSlotString` works around Astro's `SlotString` under `asChild`,
  which is a real constraint.

---

## 9. Order of work

**Phase 1 — tokens.** Data palette, type scale, radius collapse, width tokens,
global focus rule. Delete the duplicate `@theme` block, `--font-family-inter`,
`--text-name`. Repoint `--alc-*` and add `.alc-fill-good`. No visual redesign;
this is the substrate.

**Phase 2 — the note grid and prose.** 16px body, 66ch measure, bleed track,
purge legacy crimson from `code` / `.prose a:hover` / `.shiki`, style tables and
inline code.

**Phase 3 — the figure kit.** Build `Figure`, `Stat`, `Plot`, `Axis`, `Legend`,
`Toggle`, `Source`, `DataTable`. Migrate the 14 `agent-loop` components and
`RequestAnatomy` onto them. Add the `basis` marker.

**Phase 4 — callouts and the old family.** Three variants, sentence case.
Migrate `idempotency`. Delete `AlertBox`, `Counter`, `CounterIsland`, and the
stale catalogue in `README.md` / `MDX-COMPONENTS.md`.

**Phase 5 — series and listings.** Extract `SeriesLanding.astro`, fix the
hierarchy and the empty state, split `featured` from `rootLevel`, add build-time
guards.

**Phase 6 — CV alignment.** One container width, one padding scale, one title
component, primitive de-duplication, and the four confirmed bugs.

Phases 1-3 are the ones that unlock the stated goal: writing new note
components against a kit instead of against a blank file.
