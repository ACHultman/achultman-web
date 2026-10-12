# Maintenance roadmap

Reviewed October 12, 2026. Completed implementation details belong in the source and [architecture document](ARCHITECTURE.md); audit evidence belongs in [SECURITY.md](SECURITY.md).

## Operational follow-up

- Restore automatic GitHub deployment records from the Vercel integration. The audit can discover ready deployments directly through the Vercel API using a current team-scoped `VERCEL_TOKEN`, and verifies their exact commit and environment. Never paste credential values into issues or PRs.
- Remove and revoke any credential dedicated to the retired OpenAI chat feature, after confirming it has no other consumers.
- Review Vercel firewall, traffic/spending alerts, and alerts for Redis outages. Per-IP limits do not impose a global traffic ceiling.

## Accessibility

- Review the site with VoiceOver or NVDA, including chart alternatives, keyboard focus, and enlarged text in the tools.
- Review Notion image captions for descriptive alternatives. Automated tools cannot assess their usefulness.
- Exercise specialized live Notion blocks beyond the saved preview fixtures before extending the safe renderer.

## Dependency maintenance

- Remove scoped overrides as upstream packages adopt safe versions and ESLint 10 peer support. Retain consumer tests while exceptions remain.
- Reevaluate Chakra 3 when UI requirements or its support status justify the provider/theme/component migration. Preserve the existing appearance and accessibility during that work.
- Keep the compiler and other compatible packages current through tested dependency PRs; retain one maintained npm lockfile.

## Content growth

- Profile archive generation and reading-time lookups before the Notion collection becomes large. Add caching or pagination based on measured build/ISR cost.
- Keep article slugs unique and stable. Add explicit scheduled-publishing behavior only if needed; future `Published` dates currently make articles public immediately.
- Define an urgent content-removal procedure using cache purge or deployment because ISR can retain old content during an upstream outage.
