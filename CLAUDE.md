# Repository guidance

This is Adam Hultman’s personal site: Next.js 16 Pages Router, React 19, Chakra UI 2, TypeScript, Notion, and Vercel. See README.md for publishing and SECURITY.md for the audit and security boundaries.

## Commands and checks

Use Node.js 24 and npm with package-lock.json. Security overrides have consumer-level regression tests in `tests/tooling.test.cjs`; recheck those APIs before changing overrides. Run the full dependency audit, including development tools. Lighthouse reports stay local because they can contain preview-access headers.

```bash
npm ci
npm run dev
npm test
npm run typecheck
npm run lint
npm run prettier:check
npm run a11y
npm run test:e2e
npm audit --audit-level=low
npm run build
```

Playwright starts the local development server when needed. Install Chromium and WebKit with `npx playwright install chromium webkit`. `PLAYWRIGHT_BASE_URL` selects an existing server. For production-mode checks without Notion, explicitly set `NOTION_PREVIEW_MODE=true` for both build and start. Never enable preview fixtures on the live site.

Run lint and accessibility checks before committing UI changes. The accessibility project discovers all maintained tools and covers public pages in light and dark modes, keyboard interactions, result panels, and mobile layouts. The supplementary `npx pa11y-ci --config .pa11yci.js` requires a running site and checks 10 routes. Automated checks do not replace keyboard, screen-reader, zoom, or content review.

Use `accessible.gray`, `accessible.green`, and the other semantic foreground tokens instead of fixed pale colors for text. Preserve visible focus indicators, semantic controls, accessible names, reduced motion, and a single primary heading.

## Architecture

- Pages: home, work, about, contact, résumé, writing (`blog/[slug].tsx`), books, bookmarks, privacy, calculator, and interactive tools.
- Public APIs: `/api/v1/blog`, `/api/v1/post/[id]`, `/api/v1/contact`. There is no chat API or AI integration.
- `src/services/notion.ts`: configured databases and data-source discovery, publication/membership checks, pagination, bounded nested blocks, and hourly ISR through page callers.
- `src/data/published-writing/`: public article snapshots for standalone previews only. Never replace live-query failures with fixtures.
- `src/components/RenderBlocks/`: explicit escaped React rendering; `src/utils/safeUrl.ts` controls CMS URLs. Do not add raw HTML, Markdown reinterpretation, arbitrary iframes, or server fetches of CMS image URLs.
- `src/lib/rate-limit.ts`: shared fail-closed Upstash limits. Production API availability depends on Upstash credentials or a complete legacy KV credential pair. Only local development bypasses limits; headers must never enable a bypass.
- The contact handler enforces its own limit before SMTP, requires JSON, validates input, escapes email HTML, and uses a fixed recipient. Tests stub delivery.
- `src/config.ts`: service configuration; `.env.example` documents inputs. Secrets belong in environment variables, never source.
- `next.config.ts`: production CSP (Chakra bootstrap hash), security headers, local-only image optimization, and fixed PostHog proxy destinations.
- `src/theme.ts` and `src/main.css`: shared theme, typography, contrast, focus, and article styles.

For changes to Chakra’s color-mode bootstrap, verify the CSP hash against a production build. Preserve a restrictive script policy and test hydration/theme persistence. Test any new browser integration against CSP explicitly.
