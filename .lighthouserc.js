const { chromium } = require('@playwright/test');
const isPreview = process.env.VERCEL_ENV === 'preview';
const baseUrl = process.env.VERCEL_PREVIEW_URL || 'http://localhost:3000';

module.exports = {
    ci: {
        collect: {
            chromePath: chromium.executablePath(),
            url: [
                baseUrl,
                ...[
                    'workflow-automation-roi-calculator',
                    'about',
                    'blog',
                    'books',
                    'bookmarks',
                ].map((path) => `${baseUrl}/${path}`),
            ],
            settings: {
                chromeFlags:
                    '--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --disable-gpu',
                throttlingMethod: 'provided',
                extraHeaders: JSON.stringify({
                    'x-vercel-protection-bypass':
                        process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
                }),
            },
        },
        assert: {
            assertions: {
                'categories:performance': [
                    'error',
                    { minScore: isPreview ? 0.6 : 0.95 },
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
            // Reports may contain the protected-preview request header.
            target: 'filesystem',
            outputDir: '.lighthouseci/reports',
        },
    },
};
