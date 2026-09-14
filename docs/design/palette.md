# Color palette

Source of truth: `src/styles/global.css`. This doc lists the tokens and the
color criterion for skill badges.

## Tokens

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
| `--accent` (shadcn hover surface) | `#f7f7f7` | `#1f1f1f` |
| `--destructive` | `#ef4444` | `#7f1d1d` |
| `--border` | `#d1d1d1` | `#333333` |
| `--skill-core` | `#6250e7` | `#aba1f7` |

Legacy crimson tokens (`--color-legacy-*`, hardcoded hex in `@theme`) stay
scoped to the WIP landing + `about`/`contact`/`work`. Not touched.

## Criterion: color means emphasis, never category

The site is grayscale with one accent: the brand purple. Skill badges follow
the same rule.

- **Category is structure.** The web Skills section groups badges in rows,
  with a small uppercase mono label per group (`text-muted-foreground`).
- **All badges are neutral** (`variant="secondary"`), the same as JobCard,
  ProjectCard and the certificate dates.
- **Only the core set gets color**: `text-skill-core` over
  `bg-skill-core/8`. The core set is positioning, not a CV variant. It stays
  at ~20% of the list (today 5 of 25). If most skills are core, the accent
  stops meaning emphasis.
- **Data**: `WEB_SKILL_GROUPS` and `CORE_SKILLS` in
  `src/data/skill-categories.ts`. A core skill that is not in the list fails
  the build.
- **Scope**: web only. The CV variants (`JAVA_SKILLS`, `TS_SKILLS`) and the
  PDF do not use this list or any color.

### Why `--skill-core` is not `--primary`

In light mode it has the same value. In dark mode `--primary` (`#7666ea`)
gives 3.81:1 on the dark badge fill, under WCAG AA. `--skill-core` uses a
lighter step of the same hue (247°).

### Text contrast

Measured against the real badge fill (the 8% tint over the page background),
not against `--background` alone.

| Pair | Light | Dark |
|---|---|---|
| `--skill-core` on its 8% tint | 4.91:1 | 7.85:1 |
| `--muted-foreground` group label on `--background` | 5.33:1 | 6.12:1 |

### History

A previous version used 6 categorical hues (`--accent-blue`, `-orange`,
`-teal`, `-amber`, `-pink`, `-green`), one per category, first saturated and
then muted. Both read as too many colors next to a grayscale site. Measured on
the badge fill, 5 of 6 also failed AA in light mode and 6 of 6 in dark mode.
The tokens were removed.

## Usage rules

- Do not add a hue per category, tag or filter. Use structure (groups,
  labels, order) for category.
- Do not reuse `--skill-core` for status. Status stays on `--destructive` and
  future status tokens.
- Measure contrast against the surface the text actually sits on.
