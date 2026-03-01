# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run prettier     # Format all files
npm run prettier:check  # Check formatting
npm run test:e2e     # Run Playwright E2E tests (starts dev server automatically if not in CI)
npm run analyze      # Bundle analyzer (sets ANALYZE=true)
```

To run a single Playwright test file:
```bash
npx playwright test e2e/navbar.desktop.spec.ts
```

## Architecture

This is Adam Hultman's personal portfolio site — a **Next.js 15 (Pages Router)** app using **Chakra UI v2** with **Emotion** for styling, deployed to Vercel.

### Pages & Routing (`src/pages/`)
- `index.tsx` — Home page (Hero + Chat + Skills + GitTimeline + Timeline + Contact)
- `about.tsx` — About page with Contact form
- `blog/index.tsx`, `blog/[id].tsx` — Blog listing and individual posts
- `books.tsx`, `bookmarks.tsx` — Content pages fed from Notion
- `api/v1/blog.ts`, `api/v1/chat.ts`, `api/v1/contact.ts`, `api/v1/post/[id].ts` — API routes

### Data Sources
All dynamic content comes from **Notion** databases:
- `src/services/notion.ts` — Generic `fetchNotions(db, options)` and `fetchNotion(db, id)` using `MAP_DATABASE_CONFIG` keyed by `DatabaseName` (`'blog'|'books'|'bookmarks'`)
- `src/types/notion.ts` — Types: `Book`, `BlogPost`, `Bookmark`, `NotionPageWithBlocks`, `FormatterReturnType<T>`

The **chat** endpoint (`api/v1/chat.ts`) uses Vercel Edge runtime with the AI SDK (`@ai-sdk/openai`) and `gpt-4.1-mini`.

### Static Data (`src/data/`, `src/constants/`)
- `src/data/gitTimelineData.ts` — `BranchDefinition` tree for the git-graph career timeline (rendered by `@gitgraph/react`)
- `src/constants/index.ts` — `ORG_MAP` and `ORG_COLORS` for organizations in the timeline
- `src/constants/timeline.ts` — `TIMELINE` record (year → `TimelineItem[]`) for the vertical text timeline

### Components (`src/components/`)
- `Home/` — `Hero`, `Skills`, `Timeline`, `GitTimeline`, `Tools` assembled in `Home/index.tsx`
- `Chat/` — AI chat widget backed by `api/v1/chat`
- `Layout/` — `Navbar`, `Footer`, wraps all pages in `_app.tsx`
- Heavy components (`Timeline`, `GitTimeline`, `Chat`) are lazy-loaded via `next/dynamic` with `ssr: false`

### Path Aliases (`tsconfig.json`)
```
@components/* → src/components/*
@hooks/*      → src/hooks/*
@pages/*      → src/pages/*
```

### Config & Middleware
- `src/config.ts` — `serverConfig` with required env var validation (throws on missing vars)
- `src/middleware.ts` — Rate limiting on all `/api/*` routes via Upstash Ratelimit + Vercel KV (5 req/10s sliding window; bypassed for localhost)
- `src/theme.ts` — Chakra UI theme (system color mode, monospace font override)

### Environment Variables
Required in `.env.local`:
```
EMAIL_PASS
OPENAI_API_KEY
NOTION_API_KEY
NOTION_DATABASE_ID_BLOG
NOTION_DATABASE_ID_BOOKS
NOTION_DATABASE_ID_BOOKMARKS
NEXT_PUBLIC_EMAIL
```
Optional: `OPENAI_SYSTEM_INIT_MSG`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`, `CI`

### E2E Tests
Tests live in `e2e/` and use file naming convention `*.desktop.spec.ts` / `*.mobile.spec.ts` to target Desktop Chrome vs Mobile Chrome/Safari projects in `playwright.config.ts`.
