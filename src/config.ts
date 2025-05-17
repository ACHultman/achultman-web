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

const nextPublicEmail = process.env.NEXT_PUBLIC_EMAIL;
if (
    nextPublicEmail === undefined ||
    nextPublicEmail === null ||
    nextPublicEmail.trim() === ''
) {
    throw new Error(
        'Missing or empty environment variable: NEXT_PUBLIC_EMAIL. Ensure it is set in your .env file or environment.'
    );
}

export const serverConfig = {
    NODE_ENV,
    IS_CI: !!getOptionalEnv('CI'),

    // Email
    NEXT_PUBLIC_EMAIL: nextPublicEmail,
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
