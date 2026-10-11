function getRequiredEnv(key: string) {
    if (typeof window !== 'undefined') {
        throw new Error(
            `Environment variable ${key} is not available in the browser.`
        );
    }

    const value = process.env[key];

    if (value === undefined || value === null || value.trim() === '') {
        throw new Error(
            `Missing or empty environment variable: ${key}. Ensure it is set in your .env file or environment.`
        );
    }
    return value;
}

function getOptionalEnv(key: string): string | undefined {
    const value = process.env[key];
    return value === undefined || value === null || value.trim() === ''
        ? undefined
        : value;
}

const NODE_ENV = getOptionalEnv('NODE_ENV') || 'development';

const serverConfig = {
    NODE_ENV,
    IS_CI: !!getOptionalEnv('CI'),

    // Email
    get EMAIL_PASS() {
        return getRequiredEnv('EMAIL_PASS');
    },

    // Notion
    NOTION_PREVIEW_MODE: getOptionalEnv('NOTION_PREVIEW_MODE') === 'true',
    NOTION_API_KEY: getOptionalEnv('NOTION_API_KEY'),
    NOTION_DATABASE_ID_BLOG: getOptionalEnv('NOTION_DATABASE_ID_BLOG'),
    NOTION_DATABASE_ID_BOOKS: getOptionalEnv('NOTION_DATABASE_ID_BOOKS'),
    NOTION_DATABASE_ID_BOOKMARKS: getOptionalEnv(
        'NOTION_DATABASE_ID_BOOKMARKS'
    ),

    VERCEL_PROJECT_PRODUCTION_URL: getOptionalEnv(
        'VERCEL_PROJECT_PRODUCTION_URL'
    ),
    VERCEL_URL: getOptionalEnv('VERCEL_URL'), // URL of the specific Vercel deployment

    APP_BASE_URL: (() => {
        const explicitBaseUrl = getOptionalEnv('NEXT_PUBLIC_APP_BASE_URL');
        if (explicitBaseUrl) {
            return explicitBaseUrl;
        }
        if (NODE_ENV !== 'production') {
            return 'http://localhost:3000';
        }
        if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
            return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
        }
        if (process.env.VERCEL_URL) {
            return `https://${process.env.VERCEL_URL}`;
        }
        return 'https://hultman.dev';
    })(),
};

export { serverConfig };
