# Architecture

This is a public content site with small interactive tools. It has no user accounts, chat endpoint, or server-side model integration.

## Request and content boundaries

Next.js Pages Router serves static pages and Notion-backed ISR articles. Page functions call `src/services/notion.ts`; that service discovers the selected data source within each configured database, queries published content, and verifies source membership and publication before reading article bodies. Nested reads share request, block, and depth limits. The Notion SDK uses API version `2026-03-11`.

`src/components/RenderBlocks/` renders supported blocks as escaped React elements. `src/utils/safeUrl.ts` validates URLs. CMS images load in the browser, and embeds become links. The application does not fetch arbitrary CMS image URLs on the server.

Public preview fixtures are available only when no Notion connection is configured. Production requires an explicit preview opt-in. Live collection failures propagate so ISR preserves the last successful content.

`src/proxy.ts` applies the shared Upstash read limiter to public APIs. Contact enforces its separate limit inside the handler before SMTP. `src/lib/rate-limit.ts` initializes the Redis client lazily and fails closed on missing configuration, errors, or timeout-success responses. It accepts either a complete Upstash credential pair or a complete legacy KV pair, never a mixture.

The contact API requires JSON, bounds and validates fields, escapes email HTML, and sends only to the configured owner. Tests mock SMTP. `next.config.ts` supplies the CSP and security headers; the Chakra color-mode script is allowed by its exact hash. OpenGraph images use the Node.js API runtime.

## UI and interactive tools

Native editorial, books, bookmarks, and contact pages share a small layout and color-mode hook with the existing bootstrap/storage key. Chakra and Motion load only around the five tools that use their components. CSS palette fallbacks keep static pages independent of the provider. The shared layout, editorial components, theme, and CSS define the site's typography, colors, focus indicators, and responsive behavior. Tool-specific components live under `src/components/tools/`.

- Regex evaluation uses the browser’s native engine inside a disposable worker. Inputs and results are bounded; a one-second deadline terminates expensive patterns. Editing input or leaving the page cancels pending work.
- Compression separates the page controls from the Huffman tree, statistics, encoded-bit display, and run-length view. Its algorithms operate on Unicode code points; UTF-8 byte size is used for the original bit count.
- Neural-network training and interaction state live in `useNeuralNetwork`; visualization, controls, and metrics are separate components. `startFrameLoop` owns scheduling and cancellation. Changing datasets replaces the active loop, and unmount cancels training and forward-pass animation.
- Shader rendering lives in `shader-renderer.ts`; its controller owns the WebGL program, buffer, clock, and frame loop. Pause changes the clock used by rendering. Failed compilation retains the last working program.
- Microphone ownership is separate from rendering. Pending permission requests cannot retain streams after unmount; setup failures release acquired resources. `useShaderCanvas` connects the controllers to React and publishes display statistics through state.
- Tone.js is imported only after a user playback action. Its shipped types describe the instruments and sequence; no ambient declaration erases those types.

Algorithm tests assert outcomes and lifecycle tests assert teardown. Browser and axe tests exercise the composed interfaces. These checks complement manual screen-reader and device review.

## Technology decisions

**Next.js 16 and React 19:** upgraded with the Pages Router retained. Static generation, ISR, and API routes fit this site's needs. An App Router migration would be a separate architectural decision with a demonstrated data-fetching or rendering benefit. Production builds use Next’s supported webpack mode: Turbopack emits per-page inline bootstrap scripts that the static CSP blocks. Webpack preserves hydration without broadening script permissions. Reevaluate Turbopack when its bootstrap supports this CSP strategy.

**Chakra UI 2:** retained at the latest compatible patch after evaluating v3. Version 3 changes provider, theme, color-mode, and component APIs across the tools. Its benefits do not presently justify that additional migration during the runtime upgrade. It still uses Emotion. Reconsider with a UI redesign or a support/security requirement, with visual, CSP, keyboard, and screen-reader checks.

**TypeScript:** strict mode and unchecked-index checking remain enabled. Node types match Node 24. React types match React 19; Nodemailer and Tone supply their own types. Compiler-major updates should be validated separately from application behavior changes.

**ESLint 10:** flat configuration retains Next, React, hooks, TypeScript, import, and accessibility rules. The Next-bundled React, import, and JSX accessibility plugins still advertise ESLint peer ranges ending at 9. Scoped peer overrides select the installed ESLint 10; consumer tests exercise their diagnostics and the complete project lint runs with zero warnings. This is a tested compatibility accommodation, not an upstream support guarantee. Remove it when their published peer ranges include ESLint 10.

Client analytics loads after the initial document load at idle, or on the first explicit event. Initialization is shared and failures never interrupt application actions. Remote recording, surveys, and autocapture remain disabled.

## Dependency exceptions

The lockfile is authoritative; `npm ci`, `npm ls --all`, and the full `npm audit` must succeed. No advisories are suppressed. Overrides remain scoped to their consumers where possible:

| Override                                      | Reason and removal condition                                                                                                                               |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next plugin `fast-glob` → `tinyglobby`        | Avoid the vulnerable braces/micromatch chain. Tests cover real Next project discovery and page-link rules. Remove when Next adopts a safe glob dependency. |
| Next's bundled lint plugins → root ESLint     | Bridge lagging peer metadata as described above. Remove after declared ESLint 10 support.                                                                  |
| LHCI → Lighthouse 13, UUID 11, proxy-agent 8  | Keep the audit tooling on patched dependencies while preserving its consuming APIs. Remove after LHCI updates its ranges.                                  |
| js-yaml 3 → argparse 2; get-uri → basic-ftp 6 | Eliminate vulnerable transitive versions. CLI/parser tests cover the APIs these consumers use. Remove when upstream ranges include the safe versions.      |
| postcss, qs, tmp                              | Patched transitive dependency floors. Reevaluate against the full tree when upstream consumers update.                                                     |

## Verification and release

CI runs formatting, lint, TypeScript, unit tests, dependency auditing, CodeQL, and production browser journeys using public fixtures. The browser suite uses local HTTPS to preserve the production CSP in WebKit. Hosted Lighthouse and axe checks additionally exercise connected preview content. The maintained browser suite also checks console errors and route journeys; the duplicate third-party QA workflow was removed.

A release needs successful checks for its exact commit, a connected Notion preview, API rate-limit probes, and public production smoke tests. The default-branch status-check ruleset requires lint, browser journeys, CodeQL, and the hosted audit, with no bypass actors. The hosted audit uses simulated mobile throttling and a 95-point minimum. Preview crawlability is deliberately excluded; production is audited through the public domain, including its CDN behavior. Keep production credentials in Vercel; never publish preview bypass headers, cookie state, or secret-bearing reports.
