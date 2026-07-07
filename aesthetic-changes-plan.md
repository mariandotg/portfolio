Blog Redesign: shumer.dev-inspired Minimal Aesthetic

Context

The portfolio site (marianoguillaume.com) currently serves the blog at /blog while the root redirects to cv.marianoguillaume.com. The blog and its supporting components (nav, footer, newsletter) have a bold,
purple-heavy design with large typography, card grids, and pill-shaped filter tabs. The goal is to align these views with the clean, minimal, typography-focused aesthetic of shumer.dev — while keeping IBM Plex
fonts, purple as a subtle accent for links/interactive elements, and the collection filter tabs (restyled). The dither landing page and its components stay untouched for Phase 2 reactivation (June 1, 2026).
The contact page is out of scope.

---
Scope

In scope: Blog list, blog post, navbar, footer, newsletter, and their supporting components (TagList, BlogPostCard, SectionHeader usage).
Out of scope: Landing page (index.astro), contact page, work page, about page, DitherScene, GSAP animations, API endpoints.

---
Phase 1: Design Tokens (global.css)

File: src/styles/global.css

1. Add neutral color tokens (keep existing purple tokens for landing page):
- --color-bg: #ffffff / --color-bg-dark: #0a0a0a
- --color-fg: #111111 / --color-fg-dark: #f2f2f2
- --color-muted: #6a6a6a / --color-muted-dark: #8f8f8f
- --color-border: rgba(125, 125, 125, 0.35)
2. Adjust typography defaults:
- Body font stays --font-family-display (IBM Plex Sans) but base size → 14px, line-height → 1.65
- Headings: font-weight: 600 (not bold/700)
- Add a monospace code font variable using IBM Plex Mono (already exists as --font-family-mono)
3. Remove blanket transition from *, *::before, *::after — replace with targeted transitions only where needed (links, buttons, theme toggle)
4. Update prose styles:
- --tw-prose-links → var(--color-fg) with underline + text-underline-offset: 3px instead of purple
- Prose link hover: purple color (--color-primary) — this is the subtle accent
- Reduce prose to prose-sm sizing (14px body)
5. Update blockquote: border-left: 2px solid var(--color-border) instead of purple. Remove purple-tinted background, use var(--color-bg-dark) at 5% opacity or similar subtle bg.
6. Update scrollbar thumb: var(--color-muted) instead of purple
7. Add prefers-reduced-motion media query to gate fade-in animation

---
Phase 2: Navbar Simplification

File: src/components/Nav.astro

Current: Logo + Work/Blog/About links + LanguageSwitcher + ThemeToggle + "Hire" CTA button
Target: Site name (left) + "blog" link + LanguageSwitcher + ThemeToggle (right)

Changes:
- Remove Button import and "Hire" CTA
- Replace navLinks array with just the blog link
- Inner container: max-w-[800px] (from max-w-5xl)
- Nav height: h-14 (from h-16)
- Remove backdrop-blur-sm. Border → subtle border-b border-[var(--color-border)]
- Logo: font-weight: 600, font-size: 14px, no hover-to-purple. Hover: slight opacity change
- Blog link: text-sm, color: var(--color-muted), hover → var(--color-fg) with underline transition
- Background: var(--color-bg) / dark: var(--color-bg-dark) at 95% opacity

File: src/components/LanguageSwitcher.astro
- Active language: font-weight: 600; color: var(--color-fg). Inactive: color: var(--color-muted)
- Font size: text-xs
- Remove any purple references

File: src/components/ThemeToggle.tsx
- Keep functionality, reduce visual weight. Smaller padding/hit target

---
Phase 3: Blog List Page

File: src/pages/blog/index.astro
File: src/pages/es/blog/index.astro (mirror changes)

Changes:
- Remove SectionHeader import. Replace with plain <h1>: text-xl font-semibold (≈20px) + subtitle as a <p> in muted text below
- Container: max-w-[800px] (from max-w-5xl)
- Padding: px-12 md:px-6 sm:px-4
- Restyle filter tabs as text-based toggles:
- Remove pill styling (rounded-full, border, colored background)
- Active tab: font-weight: 600; color: var(--color-fg); border-bottom: 2px solid var(--color-fg) (or var(--color-primary) as accent)
- Inactive tabs: color: var(--color-muted); font-weight: 400
- text-sm, separated by gap-6, horizontal flex
- Subtle bottom border on the container (like a tab bar)
- Replace card grid (grid sm:grid-cols-2 lg:grid-cols-3 gap-6) with single-column list (flex flex-col gap-0), items separated by <hr> with opacity: 0.15

File: src/components/BlogPostCard.astro

Current: Bordered card with hover-to-purple, tags, "Read more" link
Target: Minimal list item

- Remove card container (border, rounded, bg-white, hover:border-primary)
- Wrap entire item in <a> tag (whole row clickable)
- Structure:
- <time> in monospace (font-family: var(--font-family-mono); font-size: 12px; color: var(--color-muted))
- <h3>: font-size: 15px; font-weight: 600; line-height: 1.4 — no purple hover
- Description: font-size: 13px; color: var(--color-muted); line-clamp-1
- Remove TagList import and usage (tags stay on post detail only)
- Remove "Read more" link (whole row is the link)
- Remove readingTime display (keep for post detail)
- Hover: title gets subtle underline or slight opacity shift
- Padding: py-4 per item (spacing comes from the hr separators + padding)

---
Phase 4: Blog Post Layout

File: src/layouts/BlogPost.astro

Changes:
- Article container: max-w-[680px] (from max-w-3xl / 768px)
- Header:
- <h1>: text-xl font-semibold leading-tight (≈20px, weight 600) — from text-3xl sm:text-4xl font-bold
- Date + reading time: monospace (font-family: var(--font-family-mono)), text-xs, color: var(--color-muted), separated by ·
- Description: text-sm, color: var(--color-muted), mb-6
- Keep TagList but with restyled tags (see below)
- Add <hr> with opacity: 0.15 after header, before prose
- Prose:
- prose-sm instead of prose-lg
- Max-width: max-w-none (stays, content width controlled by article container)
- Image: If present, render as simple <img> without rounded, aspect-video, or object-cover. Just margin.
- Share buttons: Remove entirely (website-spec.md says "No share buttons")
- Updated date: Keep, restyle to match muted monospace pattern

File: src/components/TagList.astro

- Remove purple pill styling (bg-[color-mix...], border, rounded-full)
- Tags become plain text: font-family: var(--font-family-mono); font-size: 12px; color: var(--color-muted)
- Prefix each tag with #
- No background, no border. Separated by spacing only

---
Phase 5: Footer & Newsletter

File: src/components/Footer.astro

Current: Newsletter card + copyright/social row
Target: Minimal footer matching content width

- Container: max-w-[800px] (from max-w-5xl)
- Top border: border-t border-[var(--color-border)] (subtle, using new token)
- Newsletter section: inline row (label + pill input + button). See NewsletterCard changes below.
- Below newsletter: another <hr> with opacity: 0.15
- Bottom: copyright on left, social links on right — single row
- Remove "Made with" text
- Padding: match blog page padding

File: src/components/NewsletterCard.tsx

Current: Card with title, description, bordered container, purple accents
Target: Inline minimal form

- Remove card wrapper (rounded, border, bg color-mix)
- Remove title <h3> and description <p> — form becomes a single line: label text + input + button
- Input: border-radius: 999px; border: 1px solid var(--color-border); padding: 8px 16px; font-size: 13px
- Submit button: text-based or subtle bordered pill. No purple background. border: 1px solid var(--color-border); border-radius: 999px; font-size: 13px; font-weight: 500. Hover: bg: var(--color-fg); color:
var(--color-bg)
- Success/error messages: text-xs below
- Remove privacy text (or tiny footnote)
- Update labels interface to reflect removed fields (title, description, privacy become optional)

File: src/components/SocialLinks.astro

- Hover: remove purple. Use opacity: 0.5 default → opacity: 1 on hover
- Icon size: 16px (from 20px)

---
Phase 6: Polish & QA

1. Verify landing page isn't broken: Run dev server, check that index.astro and es/index.astro still render with their GSAP animations and purple palette (they reference old tokens which are preserved)
2. Test dark mode on all blog pages — every component must use the new --color-*-dark tokens correctly
3. Test i18n: /blog, /es/blog, /blog/[slug], /es/blog/[slug] all render correctly
4. Test filter tabs on blog list — JS still works with restyled tabs
5. Verify responsive: Check mobile (< 550px), tablet (< 834px), desktop layouts
6. Remove unused imports: If SectionHeader is no longer imported in blog pages, verify it's still used elsewhere before considering cleanup
7. Check Google Fonts loading: IBM Plex links stay in BaseLayout (used by all pages). No change needed — font just renders at different sizes now.

---
Files Modified (Summary)

┌───────────────────────────────────────┬──────────────────────────────────────────────────────────────────┐
│                 File                  │                           Change Type                            │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/styles/global.css                 │ Add neutral tokens, adjust typography, remove blanket transition │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/components/Nav.astro              │ Simplify to name + blog link, narrow width                       │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/components/LanguageSwitcher.astro │ Neutral colors, smaller size                                     │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/components/ThemeToggle.tsx        │ Reduce visual weight                                             │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/pages/blog/index.astro            │ Single-column list, restyled tabs, narrower width                │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/pages/es/blog/index.astro         │ Mirror English blog list changes                                 │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/components/BlogPostCard.astro     │ Minimal list item, no card, no tags                              │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/layouts/BlogPost.astro            │ Smaller heading, narrower width, remove share buttons            │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/components/TagList.astro          │ Plain monospace text with # prefix                               │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/components/Footer.astro           │ Minimal, narrower, subtle border                                 │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/components/NewsletterCard.tsx     │ Inline pill input, no card wrapper                               │
├───────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ src/components/SocialLinks.astro      │ Neutral hover, smaller icons                                     │
└───────────────────────────────────────┴──────────────────────────────────────────────────────────────────┘

---
Verification

1. pnpm dev — run dev server and visually check:
- /blog — list renders as single column with text tabs and minimal items
- /blog/[any-slug] — post renders with small heading, monospace date, clean prose
- Nav appears minimal on all pages
- Footer has inline newsletter input
- Dark/light mode toggle works correctly
- Language switcher still works
2. pnpm build — ensure no build errors
3. Check that the Vercel redirect still works (vercel.json untouched)