const isCI = process.env.CI === 'true';
const baseUrl = process.env.VERCEL_PREVIEW_URL || 'http://localhost:3000';

module.exports = {
    defaults: {
        standard: 'WCAG2AA',
        chromeLaunchConfig: {
            executablePath: isCI ? undefined : '/usr/bin/chromium-browser',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--headless',
            ],
        },
        headers: {
            'x-vercel-protection-bypass':
                process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
        },
        timeout: 30000,
    },
    urls: [
        baseUrl,
        ...['about', 'blog', 'books', 'bookmarks'].map(
            (path) => `${baseUrl}/${path}`
        ),
    ],
};
