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

## Phase 1 — Performance Push (Target: Lighthouse perf ≥ 0.95)

### 1A. Defer third-party scripts
- Vercel Analytics (`@vercel/analytics`) and Speed Insights (`@vercel/speed-insights`) load eagerly.
- PostHog (`posthog-js`) may also block FCP.
- **Action:** Use `next/script` with `strategy="lazyOnload"` for non-critical analytics scripts so they don't block First Contentful Paint.
- **Lift:** +0.03–0.07 Performance.

### 1B. Preconnect & preload critical fonts
- If Google Fonts or custom fonts are fetched at runtime, add `<link rel="preconnect">` and `<link rel="preload" as="font">` in `_document.tsx`.
- **Lift:** +0.01–0.03 Performance (reduces font-swap CLS).

### 1C. Bundle audit & code splitting
- Chakra UI v2 ships the full component library. Run `npm run analyze` to identify heavy chunks.
- **Action:** Dynamically import rarely-used heavy components (e.g., labs experiments are already `ssr: false` — verify they are also chunked properly).
- Consider tree-shaking Framer Motion (12.x ships ESM — ensure only used features are bundled).
- **Lift:** +0.02–0.05 Performance.

### 1D. Raise Lighthouse CI threshold
- Once scores consistently hit ≥ 0.95, bump `.lighthouserc.js` performance assertion from `0.85` → `0.95`.

---

## Phase 2 — Test Coverage Expansion

### 2A. Page-level E2E tests
- Current E2E tests only cover the navbar (desktop + mobile).
- **Action:** Add E2E tests for core user journeys:
  - Home page loads and key sections visible (Hero, Skills, GitTimeline, Contact).
  - Blog listing loads posts from Notion, clicking a post navigates to `/blog/[id]`.
  - Books and Bookmarks pages render cards.
  - About page renders and contact form submits.
  - 404 page renders for unknown routes.

### 2B. Labs E2E tests
- No tests exist for any of the 6 lab experiments.
- **Action:** Add smoke tests that verify each labs page loads without errors and key interactive elements are present.

### 2C. API route tests
- No tests for `api/v1/blog`, `api/v1/chat`, `api/v1/contact`, `api/v1/post/[id]`.
- **Action:** Add integration tests (or lightweight E2E) validating status codes, response shapes, and rate limiting behavior.

---

## Phase 3 — SEO & Discoverability

### 3A. Add labs pages to sitemap
- The sitemap currently covers `/`, `/about`, `/bookmarks`, `/books`, `/blog`, and blog posts — but **not** `/labs` or individual lab pages.
- **Action:** Add `/labs` (and optionally individual experiment pages) to the static paths in `sitemap.xml.tsx`.

### 3B. Structured data (JSON-LD)
- `BlogPostingJsonLd.tsx` and `JsonLd.tsx` components exist — verify they're rendered on all blog post pages.
- **Action:** Add `WebSite` and `Person` JSON-LD to the home page for richer search results (knowledge panel, sitelinks).

### 3C. OpenGraph images per page
- The default OG image (`og_homepage.png`) is used site-wide.
- **Action:** Generate or design page-specific OG images for `/about`, `/blog`, `/books`, `/labs` to improve social sharing click-through.

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

## Phase 5 — Content & Features

### 5A. Blog enhancements
- Add reading time estimate to blog posts.
- Add related posts / next-prev navigation at the bottom of blog post pages.
- Add RSS feed (`/feed.xml`) for blog subscribers.

### 5B. Labs improvements
- Add a "featured" or "new" badge system to highlight recent experiments.
- Consider adding analytics to track which experiments get the most engagement.
- Add share buttons / OG metadata per experiment for social sharing.

### 5C. Resume / CV page
- Add a `/resume` page (or downloadable PDF) for recruiters and hiring managers.

---

## Priority & Sequencing

| Priority | Phase | Key Outcome |
|:--------:|:------|:------------|
| **P0** | 1A–1C | Lighthouse perf ≥ 0.95 |
| **P1** | 2A–2B | E2E coverage beyond navbar |
| **P1** | 3A | Labs in sitemap |
| **P2** | 3B–3C | Richer search presence |
| **P2** | 4A | Chakra v3 migration |
| **P3** | 5A–5C | Content & feature polish |

_Revisit and re-groom quarterly or after major feature launches._
