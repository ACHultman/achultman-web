function getRequiredEnv(key: string): string {
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

export const config = {
    NODE_ENV,
    IS_CI: !!getOptionalEnv('CI'),

    // Email
    NEXT_PUBLIC_EMAIL: getRequiredEnv('NEXT_PUBLIC_EMAIL'),
    EMAIL_PASS: getRequiredEnv('EMAIL_PASS'),

    // OpenAI
    OPENAI_API_KEY: getRequiredEnv('OPENAI_API_KEY'),
    OPENAI_SYSTEM_INIT_MSG:
        getOptionalEnv('OPENAI_SYSTEM_INIT_MSG') || 'Today is {CURR_DATE}.',

    // Notion
    NOTION_API_KEY: getRequiredEnv('NOTION_API_KEY'),
    NOTION_DATABASE_ID_BLOG: getRequiredEnv('NOTION_DATABASE_ID_BLOG'),
    NOTION_DATABASE_ID_BOOKS: getRequiredEnv('NOTION_DATABASE_ID_BOOKS'),
    NOTION_DATABASE_ID_BOOKMARKS: getRequiredEnv(
        'NOTION_DATABASE_ID_BOOKMARKS'
    ),

    VERCEL_PROJECT_PRODUCTION_URL: getOptionalEnv(
        'VERCEL_PROJECT_PRODUCTION_URL'
    ),
    VERCEL_URL: getOptionalEnv('VERCEL_URL'), // URL of the specific Vercel deployment

    APP_BASE_URL: (() => {
        if (
            NODE_ENV === 'production' &&
            process.env.VERCEL_PROJECT_PRODUCTION_URL
        ) {
            return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
        }
        if (process.env.VERCEL_URL) {
            return `https://${process.env.VERCEL_URL}`;
        }
        return 'http://localhost:3000';
    })(),
};
