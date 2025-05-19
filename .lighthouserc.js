const isPreview = process.env.VERCEL_ENV === 'preview';
const baseUrl = process.env.VERCEL_PREVIEW_URL || 'http://localhost:3000';

module.exports = {
    ci: {
        collect: {
            url: [
                baseUrl,
                ...['about', 'blog', 'books', 'bookmarks'].map(
                    (path) => `${baseUrl}/${path}`
                ),
            ],
            settings: {
                throttlingMethod: 'provided',
                extraHeaders: JSON.stringify({
                    'x-vercel-protection-bypass':
                        process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
                }),
            },
            chromeFlags: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--headless',
            ],
        },
        assert: {
            assertions: {
                'categories:performance': [
                    'error',
                    { minScore: isPreview ? 0.85 : 0.95 },
                ],
                'categories:accessibility': ['error', { minScore: 0.95 }],
                'categories:best-practices': ['error', { minScore: 0.95 }],
                'categories:seo': [
                    'warn',
                    { minScore: isPreview ? 0.6 : 0.95 },
                ],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
