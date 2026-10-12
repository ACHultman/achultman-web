# hultman.dev

Adam Hultman’s personal site: work, writing, consulting, a workflow cost calculator, and interactive browser tools. [Visit the site](https://hultman.dev).

Built with Next.js 16 Pages Router, React 19, TypeScript, Chakra UI 2, and Notion. Vercel hosts the site; Upstash Redis protects public APIs; Nodemailer delivers contact messages.

## Run locally

Use Node.js 24 and npm. `package-lock.json` is the maintained lockfile.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. With no Notion credentials, development uses saved public article snapshots. Static pages and tools need no service credentials. Books and bookmarks need their Notion databases. Contact delivery needs email credentials; tests never send real messages.

For a production build using public fixtures, explicitly enable preview mode for both commands:

```bash
NOTION_PREVIEW_MODE=true npm run build
NOTION_PREVIEW_MODE=true npm run start
```

Never enable `NOTION_PREVIEW_MODE` on the live site. A partial Notion configuration or failed live query does not fall back to snapshots.

## Configuration

Copy the variable names from `.env.example`; keep values out of source control.

| Variables                                                                                      | Purpose                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NOTION_API_KEY`, `NOTION_DATABASE_ID_BLOG`                                                    | Published writing and article bodies                                                                                                                      |
| `NOTION_DATABASE_ID_BOOKS`, `NOTION_DATABASE_ID_BOOKMARKS`                                     | Optional books and bookmarks collections                                                                                                                  |
| `NOTION_DATA_SOURCE_ID_BLOG`, `NOTION_DATA_SOURCE_ID_BOOKS`, `NOTION_DATA_SOURCE_ID_BOOKMARKS` | Select a source when a database contains more than one. A single source is discovered automatically; explicit IDs must belong to the configured database. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                                           | Production API rate limits. Existing deployments can retain a complete `KV_REST_API_URL` / `KV_REST_API_TOKEN` pair until rotation.                       |
| `CONTACT_EMAIL`, `EMAIL_PASS`                                                                  | Server-only sender/recipient address and Gmail app password                                                                                               |
| `NEXT_PUBLIC_SITE_URL`                                                                         | Canonical domain; defaults to `https://hultman.dev`                                                                                                       |
| `NEXT_PUBLIC_APP_BASE_URL`                                                                     | Optional runtime origin for local tools                                                                                                                   |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`                                          | Optional analytics and exception reporting                                                                                                                |

Missing or unavailable Redis returns a retryable 503 from production APIs. Missing email configuration returns 503 from contact. Local development alone bypasses rate limits.

## Publishing and content

Notion is the source of truth for writing. Share the intended database with the integration and keep its credentials configured on Vercel.

- The title property supplies the headline. A nonempty `Published` date makes the article public; future dates are not scheduled publishing.
- Keep the `Slug` rich-text property unique, path-safe, and stable. Without it, the slug derives from the title. Old Notion-ID links redirect to the canonical slug.
- `Description` supplies the search/social summary; `AI custom autofill` remains a fallback. `Tags` drives article topics and related posts.
- Rich text, code, lists, tables, nested blocks, and HTTPS images render explicitly. Add descriptive image captions. Embeds become links; plain text is never interpreted as HTML or Markdown.
- Pages, sitemap, and RSS revalidate hourly. New articles can render on their first request. Failed regeneration retains the last successful page; urgent unpublishing needs a cache purge or deployment.

The six maintained tools live at `/tools`, with metadata in `src/data/toolPages.ts`. Old `/labs` links redirect only for retained tools; removed demonstrations return 404 and are absent from the sitemap.

Professional content lives in `src/data/work.ts`; homepage article selections live in `src/data/writing.ts`. The résumé reuses `src/constants/timeline.ts`. Run `node scripts/export-resume.cjs` against a running local site to regenerate its tagged PDF.

`src/data/published-writing/` contains public preview fixtures, not a second CMS. Their source text is preserved; decorative expiring media and some nested material were unavailable in the original public export.

## Checks

```bash
npm run check
npm audit --audit-level=low
npx playwright install chromium webkit
NOTION_PREVIEW_MODE=true npm run build
PLAYWRIGHT_PRODUCTION=true npm run test:e2e -- --workers=2
```

`check` runs Prettier, zero-warning ESLint, TypeScript, and unit tests. The browser command starts a loopback-only HTTPS proxy and the production server, using a temporary self-signed certificate. It requires OpenSSL. The certificate is trusted only by this local test context; normal deployed tests retain TLS verification.

Without `PLAYWRIGHT_PRODUCTION`, Playwright starts the development server. Set `PLAYWRIGHT_BASE_URL` to test an existing deployment. For a Vercel preview, also set `PLAYWRIGHT_PREVIEW=true`: the SEO test requires its platform `noindex` header; the default production assertion requires indexable responses. `npm run a11y` selects the axe suite; `npx pa11y-ci --config .pa11yci.js` checks ten routes on a running server; set `AUDIT_BASE_URL` for a public deployment. See [SECURITY.md](SECURITY.md) for scope and limitations.

Unit tests cover contact validation, publication boundaries, pagination, rendering, rate-limit failures, dependency compatibility, calculator economics, sorting and compression correctness, neural training, and browser-resource teardown. Browser tests cover navigation, forms, articles, SEO, themes, mobile layouts, and accessibility. The same production browser suite runs in CI for every PR, without service credentials.

CI discovers the successful deployment for the exact commit through GitHub, with a Vercel API fallback using the existing `VERCEL_TOKEN` secret if the deployment webhook is missing. Both paths verify the environment and commit before accepting a URL.

Hosted Lighthouse and accessibility checks run against the Vercel preview on PRs and the public `hultman.dev` domain after a merge. Lighthouse uses its standard simulated mobile profile and requires at least 95 for performance, accessibility, best practices, and SEO. Preview audits skip only crawlability because Vercel adds `noindex`; production audits include it. Protected-preview checks exchange the bypass secret once for a host-scoped cookie, rather than attaching the secret to third-party browser requests. Reports and traces can still contain authentication state and must stay private. Temporary Playwright cookie files are owner-readable and removed after the run. The default branch requires the lint, production browser, CodeQL, and hosted audit checks; this status-check ruleset has no bypass actors.

## Design and maintenance

Read [ARCHITECTURE.md](ARCHITECTURE.md) for system boundaries and upgrade decisions, [SECURITY.md](SECURITY.md) for the audit, and [roadmap.md](roadmap.md) for remaining work.

Use `npm run prettier` to format changes. Keep the full dependency audit enabled, including development tools. Scoped dependency overrides have consumer-level tests and removal criteria in the architecture document.

[MIT license](LICENSE.md).
