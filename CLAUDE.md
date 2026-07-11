# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — local dev server (Astro).
- `pnpm build` — production build (runs `astro check`-free; type errors surface via editor/`astro build`).
- `pnpm preview` — serve the built output locally.
- No test runner is configured (`pnpm test` is a placeholder). Verify UI changes by running `pnpm dev` and driving the flow.

Package manager is **pnpm** (`packageManager: pnpm@10.29.3`), Node >=22.

## Stack

Astro 5 (SSR via `@astrojs/vercel` adapter) + React 19 islands + Tailwind v4 (via `@tailwindcss/vite`, no config file — theme lives in CSS) + MDX. Email through Resend. Deployed to Vercel.

## Architecture

**Rendering model.** Pages are `.astro` (server-rendered/static). Interactive pieces are React islands hydrated per-use with `client:*` directives — never assume a `.tsx` component is hydrated unless a directive is present. Some islands are wrapped in a `*Island.astro` file (e.g. `Counter` → `CounterIsland.astro`, `RetrySimulator` → `RetrySimulatorIsland.astro`) so MDX/pages import the Astro wrapper, not the raw component.

**Content collections** (`src/content.config.ts`, glob loaders): `blog` (MDX), `series` (JSON), `work` (MDX case studies), `testimonials` (JSON). Always filter blog listings with `({ data }) => !data.draft`.

### Blog content model — two orthogonal axes

Blog posts are classified along **two independent dimensions**. They are unrelated; don't conflate them.

| Axis | Field(s) | What it is | Required |
|------|----------|-----------|----------|
| **Collection** | `collection` | Category/taxonomy of the post | ✅ yes |
| **Series** | `series` + `seriesOrder` | Ordered narrative arc across several posts | ❌ optional |

A post **always** has one `collection` and **optionally** also belongs to a series.

**Collections = "Engineering Notes" / "Building in Public".** These are NOT series — they are the `collection` enum (`engineering-notes` | `building-in-public`) in each post's frontmatter. They are no longer standalone sections/landings; today they exist only as **filter tabs on `/blog/archive`** (client-side JS shows/hides posts by `data-collection`). There is no per-collection route.

**Series** are their own entity — one JSON file per series in `src/content/series/`. Fields: bilingual `title`/`description` (`{ en, es }`), `status` (`ongoing` | `complete`), `order` (position in the series index), `bannerSeed`, and a currently-unused `collection` field (see gotcha below). The series JSON does **not** list its posts. The link is **by id convention**: the series `id` is its filename (`agent-vs-cursor.json` → `agent-vs-cursor`), and each member post declares `series: "agent-vs-cursor"` + `seriesOrder: N` in its own frontmatter.

**Series post count is derived, not stored.** `src/lib/series.ts` computes it by filtering published blog posts that reference the series. Consequence: a series with **0 posts renders as "coming soon"** (`comingSoon: count === 0`) — you can create a series JSON before writing any post and it shows up as upcoming (that's the current state of `cloud-certified-architect.json`). Always go through the helpers, never re-query ad hoc:
- `getSeriesIndex(lang, t)` → the series index: counts posts, sorts by `order`, localizes, builds the `meta` label ("Complete · 3 parts").
- `getSeriesPosts(slug)` → a series' posts sorted by `seriesOrder`.

**Where each page pulls from:**
- `/blog` (`index.astro`) — "Series" section (`getSeriesIndex` → `SeriesCard`) + "Latest Notes" (3 most recent posts → `PostListItem`) + link to archive.
- `/blog/archive` — all posts + collection filter tabs.
- `/blog/series/[slug]` — `getStaticPaths` over the `series` collection; banner + bilingual header + ordered post list (or empty-state when coming soon).
- All of the above are **duplicated under `/es/`**. Series titles/descriptions are bilingual via `localizedSeries`; post MDX bodies are single-language.

**i18n** (`src/i18n/`). Two locales: `en` (default, unprefixed) and `es` (prefixed `/es`), configured in `astro.config.mjs` with `prefixDefaultLocale: false`. Translations are plain typed objects in `en.ts` / `es.ts`; `es` must stay structurally identical to `en` (the `Translations` type is inferred from `en`). Spanish pages are **duplicated files** under `src/pages/es/` — adding a page usually means adding both the root version and the `es/` version. In pages: `const lang = getLangFromUrl(Astro.url); const t = useTranslations(lang);` then build cross-locale links with `getLocalizedPath(path, lang)`. Bilingual content-collection fields go through `localizedSeries`.

**Identicon banners** (`src/lib/identicon.ts`). Deterministic, dependency-free halftone SVG generated from a `bannerSeed` string at build time (same seed → same SVG). Blog cards and post headers must use the same aspect ratio for the banner to line up. Preview/tooling lives at `src/pages/dev/banners.astro` and `src/pages/api/dev/banner-seed.ts`.

**API routes** (`src/pages/api/`). Must set `export const prerender = false` (they run as Vercel functions). `contact.ts` and `newsletter.ts` use Resend and read `RESEND_API_KEY` / `RESEND_AUDIENCE_ID` from env. `contact.ts` uses a `_honeypot` field for spam filtering.

**Styling.** Tailwind v4 with theme tokens defined in `src/styles/global.css` under `@theme`. There are **two token families**: legacy `--color-primary`/`--color-light-*`/`--color-dark-*` (used by the landing `index.astro`) and neutral `--color-fg`/`--color-bg`/`--color-muted` (used by blog, nav, footer). Dark mode is class-based via `@variant dark (&:where(.dark, .dark *))` — toggled by `ThemeToggle.tsx`. When touching blog/nav/footer, prefer the neutral tokens.

## Conventions & gotchas

- The `series` schema has a `collection` field that **nothing reads** (`series.ts` never touches it), and it can even contradict its posts — `agent-vs-cursor.json` says `building-in-public` while its posts are `engineering-notes`. Treat it as dead until a decision is made to either drop it or make series inherit/validate a collection.
- The site root `/` is redirected to `https://cv.marianoguillaume.com` by `vercel.json` in production — the built homepage (`src/pages/index.astro`) is not the live landing.
- `deprecated-nextjs/` is a dead prior implementation. Ignore it.
- Blog MDX authoring (custom components, `client:*` directives) is documented in `src/components/README.md` and `docs/MDX-COMPONENTS.md`.
- `docs/` also holds product/strategy notes unrelated to the portfolio code; don't treat them as engineering specs.
- `remark-reading-time.mjs` injects reading time into blog frontmatter via a remark plugin wired in `astro.config.mjs`.
