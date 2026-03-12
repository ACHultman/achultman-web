# Roadmap

> Last groomed: 2026-03-12

---

## Completed (Previous Roadmap)

These items from the original Lighthouse-focused roadmap have been shipped:

- [x] **next/image migration** — Blog covers, book cards, hero, about page, and featured posts all use `next/image` with lazy-loading and automatic resizing (6 files).
- [x] **Per-page NextSeo** — Every public page (`/`, `/about`, `/blog`, `/blog/[id]`, `/books`, `/bookmarks`, `/labs`) has its own `<NextSeo>` with title, description, and canonical URL.
- [x] **Sitemap generation** — Dynamic server-side `sitemap.xml.tsx` produces entries for all static pages + all Notion blog posts with `lastmod` dates.
- [x] **robots.txt** — Static `public/robots.txt` pointing to `https://hultman.dev/sitemap.xml`.
- [x] **External link safety** — `rel="noopener noreferrer"` is used consistently across external links (Footer, ExternalLink, FeaturedWork, ToolCard, Timeline, Contact, Chat, Labs).
- [x] **Lighthouse CI** — `.lighthouserc.js` asserts performance ≥ 0.85, accessibility ≥ 0.95, best-practices ≥ 0.95, SEO ≥ 0.95 across 5 pages.
- [x] **Accessibility testing** — Pa11y-CI checks WCAG AA compliance on all public pages.
- [x] **Labs page** — 6 interactive AI experiments (agent-flow, beatmaker, evidence-viz, interaction-checker, prompt-duel, token-viz).

---

## Completed (Phase 1 — Performance Push)

- [x] **1A. Defer third-party scripts** — Speed Insights dynamically imported (`ssr: false`) alongside Analytics to avoid blocking FCP.
- [x] **1B. Preconnect & preload critical fonts** — Google Fonts preconnect already in `_document.tsx`; added `dns-prefetch` for PostHog ingest domain. Blog uses `next/font/google` (Roboto) which self-hosts and preloads automatically.
- [x] **1C. Bundle audit & code splitting** — Verified: Timeline, GitTimeline, Chat, Contact are all lazy-loaded with `ssr: false`. Framer Motion 12.x ships ESM and tree-shakes properly. `@gitgraph/react` is chunked via dynamic import.
- [x] **1D. Raise Lighthouse CI threshold** — Bumped `.lighthouserc.js` performance assertion from `0.85` → `0.95`.

---

## Completed (Phase 2 — Test Coverage Expansion)

- [x] **2A. Page-level E2E tests** — `e2e/pages.desktop.spec.ts` covers Home (Hero, Chat, FeaturedWork, Contact), Blog listing, Books, Bookmarks, About (heading + form), and 404 page.
- [x] **2B. Labs E2E tests** — `e2e/labs.desktop.spec.ts` smoke-tests the labs index and all 6 individual experiments (loads without JS errors, heading visible).

### 2C. API route tests
- No tests for `api/v1/blog`, `api/v1/chat`, `api/v1/contact`, `api/v1/post/[id]`.
- **Action:** Add integration tests (or lightweight E2E) validating status codes, response shapes, and rate limiting behavior.

---

## Completed (Phase 3 — SEO & Discoverability)

- [x] **3A. Add labs pages to sitemap** — Added `/labs` and all 6 individual experiment pages to static paths in `sitemap.xml.tsx`.
- [x] **3B. Structured data (JSON-LD)** — `JsonLd` component with `Person` and `WebSite` schemas is rendered on the home page. `BlogPostingJsonLd` is rendered on all blog post pages.

### 3C. OpenGraph images per page
- The default OG image (`og_homepage.png`) is used site-wide.
- **Action:** Generate or design page-specific OG images for `/about`, `/blog`, `/books`, `/labs` to improve social sharing click-through.

---

## Completed (Phase 5 — Content & Features, partial)

- [x] **5A. Blog reading time** — `estimateReadingTime()` utility extracts word count from Notion blocks; displayed as "X min read" on blog post pages.
- [x] **5A. RSS feed** — Server-rendered `/feed.xml` with RSS 2.0 + Atom self-link. Autodiscovery `<link rel="alternate">` added to global SEO config.

---

## Phase 4 — Infrastructure & DX

### 4A. Upgrade to Chakra UI v3
- Currently on Chakra UI v2 (2.10.3). v3 drops Emotion in favor of Panda CSS, improving bundle size and performance.
- **Action:** Track Chakra v3 stable release and plan migration. This is a breaking change — scope it as a dedicated effort.

### 4B. Stricter TypeScript
- Audit `tsconfig.json` for `strict: true` and related flags (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- **Action:** Incrementally enable stricter checks to catch more bugs at compile time.

### 4C. Error monitoring
- No error tracking service is configured (no Sentry, no LogRocket).
- **Action:** Add lightweight error monitoring (e.g., Sentry free tier) to catch production issues early.

---

## Remaining Phase 5 — Content & Features

### 5A. Blog enhancements (remaining)
- Add related posts / next-prev navigation at the bottom of blog post pages.

### 5B. Labs improvements
- Add a "featured" or "new" badge system to highlight recent experiments.
- Consider adding analytics to track which experiments get the most engagement.
- Add share buttons / OG metadata per experiment for social sharing.

### 5C. Resume / CV page
- Add a `/resume` page (or downloadable PDF) for recruiters and hiring managers.

---

## Priority & Sequencing

| Priority | Phase | Key Outcome | Status |
|:--------:|:------|:------------|:-------|
| **P0** | 1A–1D | Lighthouse perf ≥ 0.95 | **Done** |
| **P1** | 2A–2B | E2E coverage beyond navbar | **Done** |
| **P1** | 3A–3B | Labs in sitemap + JSON-LD | **Done** |
| **P1** | 5A | Reading time + RSS feed | **Done** |
| **P2** | 2C | API route tests | Planned |
| **P2** | 3C | Page-specific OG images | Planned |
| **P2** | 4A | Chakra v3 migration | Planned |
| **P3** | 4B–4C | Stricter TS + error monitoring | Planned |
| **P3** | 5B–5C | Labs improvements + Resume page | Planned |

_Revisit and re-groom quarterly or after major feature launches._
