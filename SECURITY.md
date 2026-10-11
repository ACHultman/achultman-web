# Security and accessibility audit

Reviewed October 11, 2026. This records the repository changes and local verification, not a certification or a production penetration test.

## Method and scope

What this repo does: A public personal site serves professional information, Notion articles/books/bookmarks, browser-based lab demos, and an email contact form. The audit assumes normal personal-site traffic and a modest, editor-managed CMS collection; it does not assume hostile users can edit Notion.

Applied [Ponytail](https://github.com/dietrichgebert/ponytail) (`9b58c1ffb790c075ca32e70a89cf1d80588f4abf`) audit/refactoring guidance and [Trail of Bits skills](https://github.com/trailofbits/skills) (`442fc9d6c89b1e937e6f7a477e7071ea75fcbea4`): audit-context-building, sharp-edges, and variant-analysis. Traced public inputs through API handlers, Notion reads, rendering, image loading, analytics, and email; inspected related variants; added regression checks for confirmed risks.

Reviewed the Next.js Pages Router application, middleware, dependencies, CI, public pages, and labs. Initial browser checks used a local production build with saved public article fixtures. Follow-up hosted checks exercised live public Notion content and Redis read rate limiting; their release-specific evidence is recorded in the PR. No real email was sent. SMTP delivery, credential rotation, firewall rules, and repository protection changes remain outside this audit. The existing CodeQL workflow was re-enabled after GitHub disabled it for inactivity, and the project's preview toolbar was disabled as described below.

## Findings addressed

Severity reflects this site's threat model. CMS findings require control of content or an upstream response; they are not presented as anonymous write access to Notion.

| Priority                 | Finding and previous behavior                                                                                                                                                                                             | Change and evidence                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High                     | Rate limiting treated a missing IP as loopback and bypassed it. Contact used the general limiter, which failed open on errors. The Upstash SDK can also return `success: true` on timeout.                                | Shared limiter fails closed on exceptions and timeout results. No IP/header can select a production bypass. Contact independently enforces 5 attempts per 10 minutes before SMTP; read APIs allow 5 per 10 seconds. Unit tests cover denial, timeout, failure, missing/loopback identities, and no SMTP delivery when denied.                                                                 |
| High, CMS-dependent      | Book rendering fetched arbitrary CMS cover URLs on the build/ISR server, followed redirects, and buffered the entire response to calculate dimensions. The image optimizer also accepted overly broad remote hosts.       | Removed server-side dimension fetching. HTTPS CMS images load in the visitor's browser; only local assets use the Next.js optimizer. A regression test rejects any server fetch during book generation; a production request to optimize a remote URL returns 400.                                                                                                                            |
| High, CMS-dependent      | The third-party Notion renderer forwarded URLs and reinterpreted plain text as Markdown-like links/media. This introduced an additional path for unsafe protocols and malformed text; embeds produced unsandboxed frames. | Replaced it with explicit React rendering and a centralized protocol/credential/control-character check. Plain text stays text, safe structured links remain links, and media embeds become labeled links. Production CSP denies frames and arbitrary inline scripts. Tests cover malicious structured URLs, Markdown-like text, escaping, lists, and tables.                                 |
| Medium                   | An unused public chat endpoint still offered billable model access even though no current site page imported the chat interface.                                                                                          | Removed the endpoint, orphaned components/hooks, OpenAI configuration, and AI/Markdown dependencies after the owner confirmed removal if unused.                                                                                                                                                                                                                                              |
| Medium, defense in depth | The Notion service depended on callers to enforce database membership/publication; nested document limits applied per node without a shared budget.                                                                       | The service now checks configured database membership, archive/trash status, and publication before reading bodies. Nested reads share limits of 50 requests and 2,000 blocks, in addition to existing depth/pagination limits. Tests cover the service boundary and a wide nested document. Current routes already checked published membership; no preexisting draft disclosure is claimed. |
| Medium                   | Missing CSP left fewer browser defenses against injected scripts. Permission defaults also disabled the shader lab's intended microphone feature.                                                                         | Production scripts require the same origin, the exact Chakra bootstrap hash, or the explicit Vercel analytics host. Inline handlers, eval, objects, arbitrary frames, and embedding this site are denied. Microphone permission is limited to the shader route and still requires browser consent. Production checks verify injection blocking, hydration, and persisted theme switching.     |
| Medium                   | Dependency and CI maintenance gaps increased supply-chain exposure.                                                                                                                                                       | Removed unused dependencies, upgraded affected packages/tooling, aligned Next.js tooling, pinned workflow actions to verified commit SHAs, disabled persisted checkout credentials, modernized CodeQL, and added full dependency/unit/type/accessibility CI gates. See the development-tool follow-up below.                                                                                  |

Contact also requires `application/json`, rejects invalid/oversized input, retains a honeypot, escapes HTML, removes subject line breaks, and disables Nodemailer file/URL access. It sends only to the configured owner address; visitors control only the validated reply address and message. Simple cross-site form submissions are rejected. There is no credentialed user session or permissive CORS policy on this endpoint.

## Accessibility and usability changes

- Added/retained clear primary headings, proper book/bookmark heading levels, semantic table headers with scope, native lists, and descriptive form/control labels.
- Replaced clickable noninteractive elements and nested link/button controls with keyboard-operable buttons or links. Bookmark filters expose selection with `aria-pressed`; AST and regex controls work with Enter/Space.
- Added keyboard alternatives for chart inspection and neural-network training-point input. Tables can be focused and scrolled.
- Fixed foreground, button, badge, and focus contrast through light/dark semantic theme tokens. Decorative separators are hidden from assistive technology.
- Respected reduced-motion preferences, disabled automatic agent-flow playback, and paused the shader animation for reduced motion.
- Moved focus to the contact confirmation after successful submission, so removing the form does not lose keyboard focus.
- Let footer link columns collapse as text grows, preventing horizontal overflow at 320px with 200% text size.
- Removed duplicate derived tag-filter state and unused rendering/chat code to reduce maintenance work.

Automated axe checks target WCAG 2.0/2.1/2.2 A and AA rules on 29 routes in both themes, including the current consulting page, plus a keyboard interaction flow, eight interactive-state checks, and twelve mobile checks (79 cases total). Pa11y provides a second check of 10 main routes. Neither tool proves full WCAG conformance. Informative article images still require author-supplied descriptive captions; complex visual labs need manual screen-reader, high-zoom, and interaction review beyond these automated checks.

## Verification

Reproduce with Node.js 24 and the committed npm lockfile:

```bash
npm ci
npx playwright install chromium webkit
npm test
npm run typecheck
npm run lint
npm audit --audit-level=low
NOTION_PREVIEW_MODE=true npm run build
NOTION_PREVIEW_MODE=true npm run start
# In another terminal:
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run a11y -- --workers=2
npx pa11y-ci --config .pa11yci.js
VERCEL_ENV=preview npx --no-install lhci autorun --config=.lighthouserc.js --collect.numberOfRuns=1
# Use an HTTPS production preview for Safari, or stop this server and test development:
npx playwright test --project='Desktop Chrome' --project='Mobile Chrome' --project='Mobile Safari'
```

Safari upgrades localhost resource requests under the production HTTPS policy. The production desktop/mobile run used a temporary local TLS proxy with a self-signed certificate trusted only by the test context. Plain HTTP production preview results in Safari are not meaningful.

The production preview is deliberate: development permits framework inline/eval scripts, so it cannot verify the production CSP. SMTP and rate-limit behavior are exercised with mocks and fail-closed production requests rather than real messages.

Final results:

| Check                                                  | Result                                                                                                                                                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Security/content/contact/tooling/calculator unit tests | 35 passed; SMTP and Redis are mocked                                                                                                                                                                                |
| TypeScript                                             | Passed, including a check without generated `.next` types                                                                                                                                                           |
| ESLint                                                 | Passed with `--max-warnings=0`; removed the unused ToolCard import, typed the Emotion document wrapper, and narrowed reading-time input safely                                                                      |
| Production build                                       | Passed with explicit public preview fixtures; 38 pages generated                                                                                                                                                    |
| Desktop Chrome, Mobile Chrome, Mobile Safari journeys  | 57 passed against the HTTPS production preview, including current consulting/search/calculator behavior and 200% text reflow                                                                                        |
| Accessibility regression suite                         | 79 passed against the local production preview, including the current consulting page; zero reported axe violations in the tested states                                                                            |
| Pa11y WCAG AA                                          | 10/10 main routes passed                                                                                                                                                                                            |
| Lighthouse CI with Lighthouse 13.5.0                   | All assertions passed on six local production routes; one run per route, preview thresholds, provided throttling                                                                                                    |
| Production security checks                             | Injected inline script blocked; hydration/theme persistence/article rendering worked; remote optimizer returned 400; missing Redis returned uncached 503 even with a loopback header; non-JSON contact returned 415 |
| Full dependency audit                                  | 0 advisories, including development dependencies; clean npm install verified                                                                                                                                        |
| Patch whitespace check                                 | Passed                                                                                                                                                                                                              |

These results cover the checked-in public article snapshots and locally available pages. Books/bookmarks had no connected live database; URL/rendering boundaries also have fixture-based regression tests. Live content and provider connections need their own deployment verification.

## Repository-quality follow-up

The October 11 follow-up upgrades Next.js to 16.4, React to 19.3, ESLint to 10.12 with flat configuration, the Notion SDK to 5.27, and Node types to 24. The deprecated KV wrapper is replaced with Upstash Redis; complete legacy credential pairs remain supported. Notion's data-source API now verifies that an explicitly selected source belongs to its configured database, and rejects ambiguous multi-source databases. Existing publication, membership, pagination, and nested-read boundaries remain tested.

Unused UI, duplicate algorithms, obsolete type shims, and their dependencies were removed after tracing imports from route entry points. Compression, neural-network training, and shader rendering now have separate components/controllers. Regression tests cover Unicode round trips, training outcomes, frame cancellation, shader pause/resume and GPU cleanup, and microphone permission resolving after unmount. Keyboard preset controls and dark hover contrast were corrected.

Formatting, zero-warning lint, types, tests, and the full dependency audit are enforced in CI. A new secret-free production-build browser job runs Chromium and WebKit with local HTTPS and explicit public content fixtures. Production uses Next's supported webpack mode because Turbopack's inline bootstrap conflicts with the existing CSP. The script policy was not broadened to accommodate it. The architecture document explains the temporary ESLint peer overrides and the decision to retain Chakra 2.

Local verification for this follow-up uses a clean `npm ci`, 54 unit tests, 139 browser cases (79 accessibility and 60 user journeys), and a 38-page production build. Release-specific connected Notion, Redis, CSP, and production evidence belongs in the follow-up PR. Automated accessibility checks do not establish full WCAG conformance or replace manual assistive-technology review.

The first full CodeQL analysis after merging the stack into `main` identified two alerts in the article ISR error logger: an externally controlled format string and log injection. The logger now emits a fixed message without interpolating the requested slug or upstream error. The original exception still propagates so failed regeneration preserves the last successful article. The ISR regression test verifies that a slug containing format specifiers and forged log lines cannot enter the application log.

## Dependency results and remaining risks

`npm audit` reported 66 advisories before changes (1 critical, 31 high, 24 moderate, 10 low). After changes, `npm audit --omit=dev` reports **zero production advisories**. This is an advisory database result, not a claim that the application has no vulnerabilities.

The first pass left 22 development-tool advisories. The follow-up on October 11 resolved those as well: **the complete npm dependency tree now reports zero advisories**, including development and production packages. No audit findings are suppressed or omitted. A clean `npm ci` and full `npm audit --audit-level=low` verify the lockfile.

The upstream tool packages still select older transitive releases, so the root manifest contains scoped, pinned overrides:

| Consumer                        | Replacement                                                                                                                                           | Compatibility check                                                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next ESLint plugin              | Replace `fast-glob` with [tinyglobby 0.2.17](https://github.com/SuperchupuDev/tinyglobby), removing micromatch/braces                                 | Project discovery with wildcard, brace, and array roots; the real Next page-link rule still rejects internal HTML anchors and accepts external links |
| Lighthouse CI CLI and utilities | [Lighthouse 13.5.0](https://github.com/GoogleChrome/lighthouse/releases/tag/v13.5.0), using the current Puppeteer browser tooling without extract-zip | Real Lighthouse collection, report generation, and score assertions against the local production site                                                |
| Lighthouse CI CLI               | UUID 11.1.1, retaining CommonJS and the `v4` API                                                                                                      | Actual CLI flag-file creation and cleanup                                                                                                            |
| js-yaml 3                       | argparse 2.0.1, eliminating sprintf-js while preserving `safeLoad` in js-yaml                                                                         | CLI parses valid YAML and rejects malformed YAML                                                                                                     |
| Lighthouse CI CLI               | proxy-agent 8.0.2, satisfying the newer Puppeteer browser tool’s peer requirement                                                                     | Real loopback HTTP request through Lighthouse CI’s fetch helper and the proxy agent on Node 24                                                       |
| get-uri                         | basic-ftp 6.2.3                                                                                                                                       | FTP client methods used by get-uri, normal directory parsing, and a bounded malformed-list parser check                                              |

`tests/tooling.test.cjs` guards the consuming APIs. The glob replacement is deliberately limited to Next's use of `globSync` with directory matching; it is not a general replacement for every fast-glob API. Tinyglobby also discovers descendants of literal directory patterns; the tests verify that Next still finds the configured applications and enforces the relevant rule. Recheck this override if Next adds another glob consumer or changes project discovery, and remove overrides when upstream packages adopt safe compatible dependencies.

Both CI audit gates now check **all** dependencies and fail on any reported severity. The performance workflow calls the repository's locked Lighthouse CLI instead of the third-party action's separate dependency tree. Lighthouse and Pa11y use the Playwright-managed Chromium executable; CI installs it explicitly and skips Puppeteer's unused separate browser download. Reports are written to ignored `.lighthouseci/reports/` instead of public storage because report settings can include the protected-preview access header.

The project's Vercel preview toolbar is disabled because its injected loader conflicts with the site's CSP. Browser audits also send Vercel's documented `x-vercel-skip-toolbar` header; this header alone did not suppress the loader in the previously built deployment. The site's security policy and Lighthouse score thresholds remain enforced.

Other explicit limits:

- Per-IP API limits do not provide a global traffic ceiling for page generation or replace hosting-level protection against volumetric attacks. Hosting controls were outside this local audit.
- Redis outages now intentionally make public APIs unavailable (503 with `Retry-After`); static/ISR pages remain available. A distributed botnet can still evade per-IP limits, and the contact honeypot is not a bot-proof challenge.
- Unknown client IPs share a bucket. Vercel uses its trusted `x-real-ip`; self-hosted read middleware uses a shared bucket, while contact uses the socket address. A future reverse-proxy deployment needs an explicit trusted-proxy design before accepting forwarded headers.
- Article body retrieval is bounded, but the published archive is still paginated in full and reading-time calculation can be expensive for a very large collection. Notion editors are trusted to publish manageable content.
- Explicit slugs remain editorial data: keep them unique and path-safe. A nonempty `Published` date means published now, including future dates; this is not scheduled publishing.
- ISR can retain old public content during an upstream outage. Unpublishing is not an immediate revocation mechanism; use a deployment/cache purge for urgent takedowns.
- Inline styles remain permitted because Chakra/Emotion and lab positioning use them. External HTTPS images still contact their hosts from the visitor's browser; browser-loaded CMS images use `no-referrer`. Embeds now open as links, which changes their presentation.
- Public article fixtures cannot establish compatibility with every block in the live Notion databases. Unknown blocks preserve available rich text/nested children, but custom embeds and unsupported specialized content may need an explicit safe renderer.
- No live credential/secret rotation, comprehensive hosting configuration review, SMTP end-to-end delivery, manual screen-reader certification, or exhaustive fuzzing was performed. Release CI results are recorded in the PR.

## Deployment and maintenance

1. Keep `NOTION_API_KEY` and the intended database IDs configured. Grant the integration access only to content intended for this site. Leave `NOTION_PREVIEW_MODE=false` on the live deployment.
2. Set `KV_REST_API_URL` and `KV_REST_API_TOKEN` for production and protected previews that exercise APIs. Verify successful requests, then a 429 with `Retry-After`, against that environment before promotion. The local audit verified failures and mocked success/denial, not the live Redis connection.
3. Keep `NEXT_PUBLIC_EMAIL` (public address) and `EMAIL_PASS` (server-only Gmail app password) configured for contact delivery. Validate one owner-approved delivery after deployment. Provider credentials remain managed secrets; no credential values are stored in this report.
4. After deploying the removal, delete/revoke the site's unused OpenAI credential if it is dedicated to this retired feature. No other consumer's key should be revoked.
5. Require the updated checks before merging. Keep production dependencies and action pins current; rerun both production and full dependency audits.
6. Recheck CSP in a production build after changing Chakra bootstrap, analytics, or third-party integrations. Do not fix CSP failures by adding broad script wildcards or `unsafe-inline`.

Release status and hosted verification are recorded in the associated pull request. The evidence above describes local audit checks unless explicitly stated otherwise.
