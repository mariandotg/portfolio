# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — local dev server (Astro).
- `pnpm build` — production build. Runs `generate:pdf` **then** `astro build` (the CV PDFs are build outputs).
- `pnpm generate:pdf` — regenerate `public/mariano-guillaume-cv-{en,es}.pdf` from résumé data (`tsx src/pdf/generate-pdfs.tsx`). The PDFs are gitignored.
- `pnpm preview` — serve the built output locally.
- `npx shadcn@latest add <component>` — add a shadcn/ui component into `src/components/ui/` (the design system, see Styling).
- No test runner is configured (`pnpm test` is a placeholder). Verify UI changes by running `pnpm dev` and driving the flow.

Package manager is **pnpm** (`packageManager: pnpm@10.29.3`), Node >=22.

## Stack

Astro 5 (SSR via `@astrojs/vercel` adapter) + React 19 islands + Tailwind v4 (via `@tailwindcss/vite`, no config file — theme lives in CSS) + **shadcn/ui** + MDX. Email through Resend. CV PDFs via `@react-pdf/renderer`. Deployed to Vercel.

## Site structure / routes

This repo hosts the blog **and** the CV (consolidated from a former separate `cv.marianoguillaume.com` repo). Key routes:
- `/` and `/es` — **temporarily render the CV** (`src/pages/index.astro` → `<CvPage />`). This is a placeholder home until the formal landing is finished.
- `/cv`, `/es/cv` — canonical CV pages (same `CvPage` composition).
- `/landing`, `/es/landing` — the **WIP marketing landing** (heavy GSAP/DitherScene hero). Not linked from nav; still on legacy crimson tokens.
- `/blog`, `/blog/archive`, series pages, `/work`, `/about`, `/contact` — as before.
- **Future swap** (see `docs/vercel-consolidation.md`): when the landing is ready, `index.astro` renders the landing and the CV moves to the `cv.` subdomain. The CV is factored into `CvPage.astro` precisely so this is cheap.

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

**Series** are their own entity — one JSON file per series in `src/content/series/`. Fields: bilingual `title`/`description` (`{ en, es }`), `status` (`ongoing` | `complete`), `order` (position in the series index), `bannerSeed`, `rootLevel` (bool, see routing below), and a currently-unused `collection` field (see gotcha below). The series JSON does **not** list its posts. The link is **by id convention**: the series `id` is its filename (`agent-vs-cursor.json` → `agent-vs-cursor`), and each member post declares `series: "agent-vs-cursor"` + `seriesOrder: N` in its own frontmatter.

**Series routing — canonical path depends on `rootLevel`.** A series lives at exactly ONE URL, never both:
- `rootLevel: false` (default) → `/blog/series/<id>` (page `src/pages/blog/series/[slug].astro`).
- `rootLevel: true` → promoted to top level `/<id>`, sharing the namespace with static pages like `/about`, `/contact` (page `src/pages/[slug].astro`). Used for reference-material series (e.g. `cloud-certified-architect`).

Never hardcode a series URL — call `seriesPath(id, rootLevel)` from `src/lib/series.ts` (used by `SeriesCard` and `BlogPost`). The two page files split series by the flag via `getRootLevelSeries()` / `getStandardSeries()`. `getRootLevelSeries()` also enforces a build-time guard: a `rootLevel` series whose `id` hits `RESERVED_ROOT_SLUGS` (about, contact, blog, work, es, cv, landing, …) throws instead of silently colliding — so promoting a series is a deliberate, checked act. Series **posts** always stay at `/blog/<post>` regardless of the flag; only the series landing moves. If you promote an already-linked series, add a redirect in `vercel.json` for its old `/blog/series/<id>` URL.

**Series post count is derived, not stored.** `src/lib/series.ts` computes it by filtering published blog posts that reference the series. Consequence: a series with **0 posts renders as "coming soon"** (`comingSoon: count === 0`) — you can create a series JSON before writing any post and it shows up as upcoming (that's the current state of `cloud-certified-architect.json`). Always go through the helpers, never re-query ad hoc:
- `getSeriesIndex(lang, t)` → the series index: counts posts, sorts by `order`, localizes, builds the `meta` label ("Complete · 3 parts").
- `getSeriesPosts(slug)` → a series' posts sorted by `seriesOrder`.

**Where each page pulls from:**
- `/blog` (`index.astro`) — "Series" section (`getSeriesIndex` → `SeriesCard`) + "Latest Notes" (3 most recent posts → `PostListItem`) + link to archive.
- `/blog/archive` — all posts + collection filter tabs.
- Series landing — banner + bilingual header + ordered post list (or empty-state when coming soon). Rendered by two mirror pages: `blog/series/[slug].astro` (standard) and `[slug].astro` (rootLevel). See "Series routing" above.
- All of the above are **duplicated under `/es/`**. Series titles/descriptions are bilingual via `localizedSeries`; post MDX bodies are single-language.

**i18n** (`src/i18n/`). Two locales: `en` (default, unprefixed) and `es` (prefixed `/es`), configured in `astro.config.mjs` with `prefixDefaultLocale: false`. Translations are plain typed objects in `en.ts` / `es.ts`; `es` must stay structurally identical to `en` (the `Translations` type is inferred from `en`). Spanish pages are **duplicated files** under `src/pages/es/` — adding a page usually means adding both the root version and the `es/` version. In pages: `const lang = getLangFromUrl(Astro.url); const t = useTranslations(lang);` then build cross-locale links with `getLocalizedPath(path, lang)`. Bilingual content-collection fields go through `localizedSeries`.

**Identicon banners** (`src/lib/identicon.ts`). Deterministic, dependency-free halftone SVG generated from a `bannerSeed` string at build time (same seed → same SVG). Blog cards and post headers must use the same aspect ratio for the banner to line up. Preview/tooling lives at `src/pages/dev/banners.astro` and `src/pages/api/dev/banner-seed.ts`.

**API routes** (`src/pages/api/`). Must set `export const prerender = false` (they run as Vercel functions). `contact.ts` and `newsletter.ts` use Resend and read `RESEND_API_KEY` / `RESEND_AUDIENCE_ID` from env. `contact.ts` uses a `_honeypot` field for spam filtering.

**Styling — shadcn/ui is the design system.** `components.json` at root, `cn()` in `src/lib/utils.ts`, components in `src/components/ui/`, `@/*` alias → `src/*`. Add components with `npx shadcn@latest add <name>`. Tokens live in `src/styles/global.css` as shadcn CSS vars in `:root`/`.dark` (`--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--muted-foreground`, `--border`, `--ring`, `--radius`) mapped to Tailwind utilities via `@theme inline` — so `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary` etc. exist. **`--primary` is purple `#6251E7`** (the brand accent; links/CTAs/the series "Featured" badge). Dark mode is class-based (`.dark` on `<html>`, `@variant dark`); shadcn vars auto-flip, so **don't write `dark:` pairs for foreground/bg/muted** — use `text-foreground` etc. and let the token flip.
- **Legacy crimson tokens** (`--color-legacy-primary`/`--color-legacy-light-*`/`--color-legacy-dark-*`) remain in the `@theme` block **only** for the WIP landing + marketing pages (`about`, `contact`, `work`, and their components `CTABanner`, `TrustBar`, `Button.astro`, `ProjectCard`, `SectionHeader`). Do **not** use them on blog/nav/footer/CV — those are fully on shadcn tokens.
- Known nit: `.prose a:hover` in `global.css` is still crimson (shared between blog posts and work pages); flip to `hsl(var(--primary))` if you want blog prose links purple.

**CV module.** The CV is a self-contained port under `src/components/cv/` (`CvPage.astro` + `sections/` + `ui/` primitives + `icons/`), content in `src/data/resume.datav2.ts` (+ `src/data/dictionaries.ts`, types in `src/models/`), rendered by `/cv`, `/es/cv`, and `/` (temp). Sections take a `lang` prop (not `Astro.currentLocale`). CV UI strings live in `dictionaries.ts` (kept out of `i18n/en.ts`/`es.ts`) to stay portable for the future subdomain move. The **PDF generator** in `src/pdf/` (`@react-pdf/renderer`, run by `tsx` in the `generate:pdf` prebuild step) reads the same résumé data and writes the gitignored PDFs the Download button serves. Print styles are gated on `body.cv-print` (set by an inline script on the CV page).

## Conventions & gotchas

- The `series` schema has a `collection` field that **nothing reads** (`series.ts` never touches it), and it can even contradict its posts — `agent-vs-cursor.json` says `building-in-public` while its posts are `engineering-notes`. Treat it as dead until a decision is made to either drop it or make series inherit/validate a collection.
- The old `/`→`cv.marianoguillaume.com` redirect in `vercel.json` is **gone** (`vercel.json` is now `{}`). `/` renders the CV directly. Finishing the deploy-side consolidation (deprecating the old CV project/subdomain) is a manual runbook in `docs/vercel-consolidation.md`.
- `src/legacy/` holds the frozen `DitherScene` halftone renderer (canvas 2D, CPU). Two consumers: `/landing` (the scene itself) and `/dev/series-banner`, which imports `applyHalftone` from it. Don't add more — it's slated for replacement by a WebGL backdrop (see `docs/tickets/T3-backdrop-paper-dithering.md`).
- `deprecated-nextjs/` is a dead prior implementation. Ignore it. `/Users/marianoguillaume/Code/projects/cv` is the former CV repo (now the source of this port) — also being deprecated.
- Blog MDX authoring (custom components, `client:*` directives) is documented in `src/components/README.md` and `docs/MDX-COMPONENTS.md`.
- `docs/` also holds product/strategy notes unrelated to the portfolio code; don't treat them as engineering specs.
- `remark-reading-time.mjs` injects reading time into blog frontmatter via a remark plugin wired in `astro.config.mjs`.
