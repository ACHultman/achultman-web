const { chromium } = require('@playwright/test');
const isPreview = process.env.VERCEL_ENV === 'preview';
const baseUrl =
    process.env.AUDIT_BASE_URL ||
    process.env.VERCEL_PREVIEW_URL ||
    'http://localhost:3000';

module.exports = {
    ci: {
        collect: {
            chromePath: chromium.executablePath(),
            puppeteerScript: './scripts/lighthouse-auth.cjs',
            puppeteerLaunchOptions: {
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                ],
            },
            url: [
                baseUrl,
                ...[
                    'work',
                    'contact',
                    'tools',
                    'workflow-automation-roi-calculator',
                    'about',
                    'blog',
                    'books',
                    'bookmarks',
                ].map((path) => `${baseUrl}/${path}`),
            ],
            settings: {
                // Lighthouse's standard simulated mobile network and CPU profile.
                throttlingMethod: 'simulate',
                // Vercel intentionally marks previews noindex. Check every other
                // SEO audit here; the browser suite asserts indexing per environment.
                skipAudits: isPreview ? ['is-crawlable'] : [],
                extraHeaders: JSON.stringify({
                    'x-vercel-skip-toolbar': '1',
                }),
            },
        },
        assert: {
            assertions: {
                'categories:performance': [
                    'error',
                    { minScore: 0.95, aggregationMethod: 'median-run' },
                ],
                'categories:accessibility': [
                    'error',
                    { minScore: 0.95, aggregationMethod: 'median-run' },
                ],
                'categories:best-practices': [
                    'error',
                    { minScore: 0.95, aggregationMethod: 'median-run' },
                ],
                'categories:seo': [
                    'error',
                    { minScore: 0.95, aggregationMethod: 'median-run' },
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
