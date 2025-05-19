
Below is a high-level roadmap for getting all your Lighthouse assertions back green
(performance ≥ 0.95, best-practices ≥ 0.95, SEO ≥ 0.95) across `/`, `/about`, `/blog`, `/books`
and `/bookmarks`. Because this spans multiple pages and many categories (Performance,
Best-Practices, SEO), it’s best to tackle it in a few focused sweeps rather than try to
“fix everything” in one giant PR.

--------------------------------------------------------------------------------------

## 1. Performance ≥ 0.95

### A. Optimize Images with next/image

* Blog & Books pages are still rendering raw `<Image src={…} />` from Chakra, so you’re
  shipping full-size images & no lazy-loading.
* **Action:** Switch all cover images (post covers, book covers) to Next.js’s `<Image>`
  with explicit `width`/`height` and `placeholder="blur"` (or `"empty"`) to get
  automatic resizing, modern formats, and lazy-loading.
* **Lift:** This alone usually nets you 0.05–0.10 in the Performance score.

### B. Defer Third-Party Scripts

* You include Vercel Analytics (or any other scripts) up front.
* **Action:** Wrap any non-critical `<Script>` tags with `strategy="lazyOnload"` (or at
  least `afterInteractive`), so they don’t block First Contentful Paint.

### C. Preload & Preconnect Critical Assets

* Fonts (e.g. Google Fonts) and the site’s hero images (if any) should be preloaded.
* **Action:** In your custom `<Head>` (via `_document.tsx` or `next-seo.config.js`
  `extraLinkTags`), add `<link rel="preconnect">` to font origins and `<link
  rel="preload" as="font">` for the primary font files.

### D. Remove Unused CSS/JS

* Chakra ships the full component library even if you only use a handful of components.
* **Action:** Audit bundle size (`next build && ANALYZE=true next build`) and consider:
  1. Dynamically importing very heavy components (`dynamic(import(…), { ssr: false })`).
  2. Moving rarely-used widgets (e.g. `<SlideFade>`, `<Highlight>`) into client-only bundles.

--------------------------------------------------------------------------------------

## 2. Best-Practices ≥ 0.95

### A. External Links Need `rel="noopener noreferrer"`

* Any `<a href="…" target="_blank">` (e.g. in bookmarks, blog links) should include
  `rel="noopener noreferrer"`.
* **Action:** Audit your Link components and Chakra’s `<LinkOverlay>` to ensure you add
  `rel="noopener noreferrer"` whenever `isExternal` or `target="_blank"` is used.

### B. All Images Must Have alt Text

* Even decorative or fallback images.
* **Action:** Give every `<Image>`/`<img>` a non-empty `alt` attribute (for decorative
  images, `alt=""`).

### C. No Console Errors/Warnings

* Make sure `console.error(...)` is silenced in production and no React prop-type or
  accessibility warnings fire at runtime.
* **Action:** Clean up any lingering warnings during SSR or hydration.

--------------------------------------------------------------------------------------

## 3. SEO ≥ 0.95

You already have a solid site-wide DefaultSeo setup (via `src/next-seo.config.js`), but
you need page-specific overrides so that each route has its own `<title>`, `<meta
name="description">`, and `<link rel="canonical">` pointing at the exact URL.

### A. Per-Page Meta Tags with NextSeo

* Blog index currently has no `<Head>` or `<NextSeo>` ⇒ it falls back to site-wide
  title/description only.
* **Action:** In each page component (`/`, `/about`, `/blog`, `/books`, `/bookmarks`),
  add a small `<NextSeo … />` (from `next-seo`) with:
  * `title:` e.g. "Blog | Adam Hultman"
  * `description:` a one-sentence summary (e.g. "My collection of technical writing about …")
  * `canonical:` e.g. `https://hultman.dev/blog`
  * (optionally) an OpenGraph image override if you have a page-specific hero graphic.

### B. Sitemap & robots.txt

* While not strictly in Lighthouse, having a `/robots.txt` and a generated `/sitemap.xml`
  not only helps real-world SEO but often nudges the Lighthouse SEO score upward.
* **Action:** Drop a static `public/robots.txt` and use `next-sitemap` (or similar) to
  generate `/sitemap.xml` at build time.

--------------------------------------------------------------------------------------

## 4. Incremental Rollout Plan

Because this is a multi-page, multi-category effort, tackle it iteratively:

| Phase | Scope                                   | Expected Lift                   |
|:-----:|:----------------------------------------|:--------------------------------|
| 1     | Blog & Books `<Image>` → next/image      | +0.05–0.10 Performance          |
| 2     | Defer analytics scripts & preload fonts  | +0.03–0.07 Performance          |
| 3     | Audit external links & add alt tags      | +0.01–0.03 Best-Practices       |
| 4     | Add `<NextSeo>` to each page             | +0.02–0.05 SEO                  |
| 5     | Sitemap & robots.txt                     | +0.00–0.02 SEO + real-world SEO |

_After landing each phase, rerun `npm run lhci` to see the scores climb. By the end of
Phase 4 you should be comfortably above 0.95 in all asserted categories._
