# My Personal Website

Adam Hultman’s personal site: professional work, independent products through Perspective Labs, writing, and contact. Built with Next.js Pages Router, Chakra UI, and TypeScript.

## 📚 Documentation

- **[Architecture Review](./ARCHITECTURE.md)** - Comprehensive architectural analysis and improvements
- **[Security Best Practices](./SECURITY.md)** - Security guidelines and implementation details
- **[Roadmap](./roadmap.md)** - Feature roadmap and planned improvements

## Features

- **Blog:** Articles on web development, cybersecurity, and other tech topics.
- **Books:** A list of books I've read and recommend.
- **Bookmarks:** A collection of useful links and resources.
- **AI Chat:** Interactive chatbot powered by OpenAI.
- **Responsive Design:** Optimized for all screen sizes.
- **Dark/Light Mode:** App-wide theme switching.
- **Sitemap:** Automatically generated sitemap for SEO.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15.5.12 (Pages Router)
- **UI Library:** [Chakra UI](https://chakra-ui.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling:** [Emotion](https://emotion.sh/) (CSS-in-JS)
- **CMS:** [Notion API](https://developers.notion.com/)
- **AI:** [OpenAI GPT-4](https://openai.com/) via [Vercel AI SDK](https://sdk.vercel.ai/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Linting/Formatting:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Testing:** [Playwright](https://playwright.dev/) for E2E tests
- **Deployment:** [Vercel](https://vercel.com/)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics) & [Speed Insights](https://vercel.com/docs/speed-insights)

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/ACHultman/achultman-web.git
    cd achultman-web
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Set up environment variables:
    Create a `.env.local` file in the root directory by copying the `.env.example` file (if you create one).
    Populate it with your API keys and other necessary configurations as described in `src/config.ts`.
    
    **Service-specific variables (only needed for the corresponding feature):**
    - `NEXT_PUBLIC_EMAIL` - Your email address (public)
    - `EMAIL_PASS` - Gmail app password for contact form
    - `OPENAI_API_KEY` - OpenAI API key for chatbot
    - `NOTION_API_KEY` - Notion integration API key
    - `NOTION_DATABASE_ID_BLOG` - Notion database ID for blog posts
    - `NOTION_DATABASE_ID_BOOKS` - Notion database ID for books
    - `NOTION_DATABASE_ID_BOOKMARKS` - Notion database ID for bookmarks
    
    **Optional variables:**
    - `OPENAI_SYSTEM_INIT_MSG` - Custom system message for OpenAI (default: "Today is {CURR_DATE}.")

The static personal pages render without service credentials. Local development without Notion credentials uses saved copies of ten public articles from October 10, 2026. Production builds require the Notion connection; a missing or partial configuration fails rather than silently publishing preview content. Books and bookmarks still require their Notion connection. The contact endpoint returns a recoverable 503 when its email configuration is missing; the legacy chat route requires its OpenAI key only when used.

### Editorial content

- Public professional and independent-work summaries: `src/data/work.ts`.
- Manually selected homepage articles: `src/data/writing.ts`. Keep their existing slugs and genuine publication dates.
- Notion remains the source for the Writing archive and article bodies when configured. `src/data/published-writing/` contains verbatim public text snapshots for standalone previews. These are never used to replace an empty live collection or failed live query. Ten public posts were available to export; the former `architecting-a-real-world-llm-agent-workflow-beyond-chatbots` URL currently returns 404 on the live site, so it has no preview snapshot. If it is published in Notion, the connected site will include it. Expiring decorative GIFs and cover images are omitted from the snapshots; the live site’s public export did not include the multi-agent article’s nested table rows. Connected Notion content now loads nested blocks.
- The résumé reuses role titles and dates from `src/constants/timeline.ts`. After updating it, run `node scripts/export-resume.cjs` with the local site running to refresh the downloadable, tagged one-page PDF. `RESUME_BASE_URL` can point the exporter at a different local port.
- The portrait is an optimized version of the supplied waterfront image. No product screenshots or individual ventures are currently featured.
- Main pages share `src/components/Editorial.tsx`, the Chakra palette, and the editorial rules in `src/main.css`.

### Publishing from Notion

Keep writing and editing in the existing Notion blog database. No Markdown migration or code edit is needed to publish an article.

- Keep `NOTION_API_KEY` and `NOTION_DATABASE_ID_BLOG` configured on the deployed site, and share the database with that integration. Do not enable `NOTION_PREVIEW_MODE` there.
- The title property supplies the headline. `Published` (date) controls publication; clearing it removes the post after cache revalidation. Keep `Slug` (rich text) stable after publication to preserve incoming links; without it, the URL is derived from the title.
- `Description` (optional rich text) supplies your handwritten search/social summary. The existing `AI custom autofill` property remains a fallback, so no schema migration is required. `Tags` supplies article topics and related-post matching.
- The complete database is paginated. Article bodies retain Notion rich text, syntax-highlighted code with copy controls, links, images, tables, and nested blocks. Old Notion-ID article links redirect permanently to the canonical slug.
- Pages revalidate on the first request after one hour, so updates are not instantaneous. Sitemap and RSS also refresh hourly. A new slug can render on its first visit without a rebuild.
- A temporary CMS failure throws during page regeneration so Next.js retains the last successful version. Sitemap/RSS return a retryable 503 instead of publishing an empty collection. Drafts and genuinely missing articles return 404.
- Every published Notion post is discoverable in Writing, sitemap, RSS, and related posts. Homepage selections remain separate; there is no hard-coded retirement/noindex list.

For a local production-mode preview without Notion, explicitly opt into the saved public snapshots for both commands:

```bash
NOTION_PREVIEW_MODE=true npm run build
NOTION_PREVIEW_MODE=true npm run start
```

Snapshots are never used to override a connected database, including an empty database or failed query. They are preview fixtures, not the CMS. `NEXT_PUBLIC_SITE_URL` controls canonical SEO URLs (default `https://hultman.dev`); `NEXT_PUBLIC_APP_BASE_URL` is the runtime/test origin.

## Running the App

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

This will create an optimized build in the `.next` folder.

To start the production server:

```bash
npm run start
# or
yarn start
```

## Running Tests

This project uses Playwright for end-to-end testing. Contact tests intercept browser requests; they do not send mail. The route tests below run the actual handler against a mocked SMTP provider and cover validation, escaping, delivery rejection, and telemetry failures:

```bash
node --test tests/*.test.cjs
```

Writing tests cover CMS pagination, rich-text preservation, drafts, legacy redirects, outage handling, SEO, and the published archive.

To run the tests:

```bash
npm run test:e2e
# or
yarn test:e2e
```

Make sure the development server is running before executing the E2E tests if `reuseExistingServer` is set to `true` in `playwright.config.ts` and `IS_CI` is false.

## Linting and Formatting

To lint the code:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

To check for formatting issues:

```bash
npm run prettier:check
```

To automatically fix formatting issues:

```bash
npm run prettier
```

## Code Quality & Security

This project follows strict TypeScript and ESLint configurations for code quality:

- **TypeScript**: Strict mode with additional safety checks
- **ESLint**: Next.js + TypeScript + React Hooks rules
- **Security**: Input validation, XSS protection, security headers
- **Error Handling**: React Error Boundaries for graceful failures

For detailed security practices, see [SECURITY.md](./SECURITY.md).

## Project Structure

```
src/
├── components/       # React components
│   ├── Chat/        # AI chatbot components
│   ├── Contact/     # Contact form
│   ├── Home/        # Homepage sections
│   └── Layout/      # Navigation and layout
├── pages/           # Next.js pages (Pages Router)
│   ├── api/         # API routes
│   └── blog/        # Blog pages
├── services/        # External service integrations (Notion)
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── constants/       # Application constants
├── config.ts        # Environment configuration
├── theme.ts         # Chakra UI theme
└── middleware.ts    # Rate limiting middleware
```

## Performance

- **ISR (Incremental Static Regeneration)**: Blog posts revalidate hourly
- **Edge Runtime**: Chat API runs on Vercel Edge Network
- **Image Optimization**: Next.js Image component with remote patterns
- **Code Splitting**: Dynamic imports for analytics
- **Streaming**: Real-time AI responses using OpenAI streaming

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- This project was bootstrapped using an example from [Next.js examples with Chakra UI and TypeScript](https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui-typescript).
- Inspiration from various open-source projects and developer portfolios.
