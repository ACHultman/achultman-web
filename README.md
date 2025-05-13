# My Personal Website

This is my personal website, showcasing my timeline, blog, and skills. It's built with Next.js, Chakra UI, and TypeScript!

## Features

- **Blog:** Articles on web development, cybersecurity, and other tech topics.
- **Books:** A list of books I've read and recommend.
- **Bookmarks:** A collection of useful links and resources.
- **Responsive Design:** Optimized for all screen sizes.
- **Dark/Light Mode:** App-wide theme switching.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **UI Library:** [Chakra UI](https://chakra-ui.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Emotion](https://emotion.sh/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Linting/Formatting:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Testing:** [Playwright](https://playwright.dev/) for E2E tests.
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
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
    Key variables include:
    - `NEXT_PUBLIC_EMAIL`
    - `EMAIL_PASS`
    - `OPENAI_API_KEY`
    - `NOTION_API_KEY`
    - `NOTION_DATABASE_ID_BLOG`
    - `NOTION_DATABASE_ID_BOOKS`
    - `NOTION_DATABASE_ID_BOOKMARKS`

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

To check for linting and formatting issues:

```bash
npm run prettier:check
```

To automatically fix linting and formatting issues:

```bash
npm run prettier
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- This project was bootstrapped using an example from [Next.js examples with Chakra UI and TypeScript](https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui-typescript).
- Inspiration from various open-source projects and developer portfolios.
