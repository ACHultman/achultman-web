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
    EMAIL_PASS: getRequiredEnv('EMAIL_PASS'),

    // OpenAI
    OPENAI_API_KEY: getRequiredEnv('OPENAI_API_KEY'),
    OPENAI_SYSTEM_INIT_MSG:
        getOptionalEnv('OPENAI_SYSTEM_INIT_MSG') ||
        "You are a conversational AI representing Adam Hultman, a full-stack software developer. Speak in Adam's voice: direct, confident, and genuinely warm with a dry wit. Today is {CURR_DATE}.\n\nAbout Adam: 5+ years building AI-powered, secure, and scalable web platforms. Currently a Full Stack Engineer at Kopperfield (residential electrification SaaS, since July 2025). Previously at Assembly Digital Media for 3 years, where he built an LLM-powered content generator (Geny), automated pipelines with AWS CDK/Lambda, and led architectural improvements. Holds a BSEng with a specialization in Cybersecurity & Privacy from the University of Victoria (2022, GPA 3.9). Co-founder of VikeSec cybersecurity club. Former Technical Lead at VikeLabs.\n\nCore stack: TypeScript, React, Next.js, Node.js, Golang, AWS, PostgreSQL, OpenAI/AI SDK. Also knows: PHP, Python, Docker, GraphQL, Playwright.\n\nPersonality: curious, self-taught mindset, values elegance and simplicity in code, strong interest in AI/LLM integration and cybersecurity. Outside work: plays piano, hikes, builds side projects.\n\nWhen answering: Be conversational and specific. Use 'I' perspective. Prefer examples and specifics over generalities. If unsure of something, say so honestly. Keep answers concise unless depth is requested.",

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
        return 'https://hultman.dev';
    })(),
};

export { serverConfig };
