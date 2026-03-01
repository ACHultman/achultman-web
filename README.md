# My Personal Website

This is my personal website, showcasing my timeline, blog, and skills. It's built with Next.js, Chakra UI, and TypeScript!

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

- **Framework:** [Next.js](https://nextjs.org/) 15.3.8 (Pages Router)
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
    
    **Required variables:**
    - `NEXT_PUBLIC_EMAIL` - Your email address (public)
    - `EMAIL_PASS` - Gmail app password for contact form
    - `OPENAI_API_KEY` - OpenAI API key for chatbot
    - `NOTION_API_KEY` - Notion integration API key
    - `NOTION_DATABASE_ID_BLOG` - Notion database ID for blog posts
    - `NOTION_DATABASE_ID_BOOKS` - Notion database ID for books
    - `NOTION_DATABASE_ID_BOOKMARKS` - Notion database ID for bookmarks
    
    **Optional variables:**
    - `OPENAI_SYSTEM_INIT_MSG` - Custom system message for OpenAI (default: "Today is {CURR_DATE}.")

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

This project uses Playwright for end-to-end testing.

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

- **ISR (Incremental Static Regeneration)**: Blog posts revalidate every 12 hours
- **Edge Runtime**: Chat API runs on Vercel Edge Network
- **Image Optimization**: Next.js Image component with remote patterns
- **Code Splitting**: Dynamic imports for analytics
- **Streaming**: Real-time AI responses using OpenAI streaming

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- This project was bootstrapped using an example from [Next.js examples with Chakra UI and TypeScript](https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui-typescript).
- Inspiration from various open-source projects and developer portfolios.
