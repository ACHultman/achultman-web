const { chromium } = require('@playwright/test');
const baseUrl = process.env.VERCEL_PREVIEW_URL || 'http://localhost:3000';

module.exports = {
    defaults: {
        standard: 'WCAG2AA',
        chromeLaunchConfig: {
            executablePath: chromium.executablePath(),
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--headless',
            ],
        },
        headers: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
            ? {
                  'x-vercel-protection-bypass':
                      process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
              }
            : {},
        timeout: 30000,
    },
    urls: [
        baseUrl,
        ...[
            'workflow-automation-roi-calculator',
            'work',
            'contact',
            'resume',
            'privacy',
            'about',
            'blog',
            'books',
            'bookmarks',
        ].map((path) => `${baseUrl}/${path}`),
    ],
};
