# Portfolio Project Memory

## Stack
- Astro 5 + React + TypeScript + Tailwind v4 + MDX
- pnpm as package manager
- Static output, deploying to Vercel

## Tailwind v4 Notes
- Use `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind` which is v3 only)
- Typography plugin: `@plugin "@tailwindcss/typography"` in CSS (NOT `@import`)
- Theme tokens in CSS `@theme {}` block

## i18n
- Default locale: `en` (no prefix), secondary: `es` (`/es/...`)
- `getLangFromUrl(Astro.url)` detects locale from path
- All page content goes through `useTranslations(lang)` → `t.section.key`
- Mirror pages in `src/pages/es/` duplicate layout but pick up Spanish via URL

## Content Collections
- `blog`: `src/content/blog/*.{md,mdx}` — has `tags`, `draft` fields
- `work`: `src/content/work/*.{md,mdx}` — has `featured`, `order`, case study fields
- `testimonials`: `src/content/testimonials/*.json`

## Key Files
- `src/config.ts` — SITE constants (name, email, social links)
- `src/i18n/en.ts` + `es.ts` — all UI text
- `src/styles/global.css` — Tailwind v4 @theme tokens + global styles
- `src/layouts/BaseLayout.astro` — html/head/fonts/CSS
- `src/layouts/PageLayout.astro` — Nav + main + Footer wrapper

## Reading Time
- Custom remark plugin at `src/lib/remark-reading-time.mjs`
- Requires `unist-util-visit` package
- Stores `readingTime` in `remarkPluginFrontmatter`

## Build
- `pnpm build` → 15 pages, sitemap auto-generated
- `pnpm dev` for development
