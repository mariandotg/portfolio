# Vercel / DNS consolidation: fold the CV into this project

This repo now serves the CV at `/` (temporarily) and `/cv`, replacing the old separate
CV repo + deploy. This runbook covers the Vercel/DNS steps to finish deprecating the old
CV project. **Prereqs**: this migration branch merged & deployed; `vercel.json` no longer
redirects `/` (it's now `{}`).

## 1. This project (portfolio)
- Vercel → Project (portfolio) → Settings → Domains: confirm `marianoguillaume.com`
  (+ `www` redirect) is Production here.
- Confirm the removed `/`→cv redirect is gone (Deployments → latest → no 302 on `/`).
- Verify on the deployment: `/` and `/es` serve the CV; `/cv`, `/es/cv` load; PDFs download.

## 2. Free the `cv.` subdomain from the OLD CV project
- Vercel → OLD cv project → Settings → Domains → remove `cv.marianoguillaume.com`.
- (Optional, recommended short-term) add `cv.marianoguillaume.com` to THIS project and set a
  temporary redirect → `https://marianoguillaume.com` so old links don't 404. Remove this
  redirect on the future swap day.

## 3. Deprecate the old CV project & repo
- Vercel → OLD cv project → Settings → Git: disconnect the repo (stops auto-deploys).
- Delete (or Pause) the OLD cv Vercel project.
- GitHub: archive `mariandotg/<cv-repo>` (keep history; don't delete). Remove its Vercel app access.

## 4. DNS (only if you moved the subdomain in step 2)
- Registrar/DNS: `cv` CNAME should point to Vercel (`cname.vercel-dns.com`). If re-added under
  this project, follow Vercel's verification. If parked, leave DNS + the step-2 redirect.

## 5. Post-checks
- [ ] `marianoguillaume.com` → CV (200, no redirect chain)
- [ ] `/cv`, `/es/cv` → 200; `/es` → CV; `/landing` → WIP landing
- [ ] `cv.marianoguillaume.com` → behaves as chosen (redirect to apex, or parked)
- [ ] `sitemap-index.xml` + `robots.txt` OK; no redirect loops
- [ ] Old CV deploy no longer serving

## Future swap (when the formal landing is ready — documented, not now)
1. `src/pages/index.astro` / `es/index.astro` → render the finished landing (from `/landing`)
   instead of `<CvPage />`.
2. CV already lives at `/cv`; point `cv.marianoguillaume.com` at this project rewriting
   host → `/cv` (Vercel domain + a rewrite, or a host check in middleware).
3. Drop the step-2 temporary apex redirect.
