import { PlaywrightTestConfig, devices } from '@playwright/test';
import path from 'path';
const externalURL =
    process.env.PLAYWRIGHT_BASE_URL || process.env.VERCEL_PREVIEW_URL;

const productionPreview = process.env.PLAYWRIGHT_PRODUCTION === 'true';
const localURL = productionPreview
    ? 'https://127.0.0.1:3443'
    : 'http://localhost:3000';

const config: PlaywrightTestConfig = {
    timeout: 30 * 1000,
    testDir: path.join(__dirname, 'e2e'),
    retries: 2,
    outputDir: 'test-results/',

    webServer: externalURL
        ? undefined
        : {
              command: productionPreview
                  ? 'node scripts/serve-test-preview.cjs'
                  : 'npm run dev',
              url: localURL,
              ignoreHTTPSErrors: productionPreview,
              timeout: 120 * 1000,
              reuseExistingServer: !process.env.CI,
          },

    use: {
        trace: 'retry-with-trace',
        baseURL: externalURL || localURL,
        ignoreHTTPSErrors: productionPreview && !externalURL,
        extraHTTPHeaders: {
            'x-vercel-skip-toolbar': '1',
            ...(process.env.VERCEL_AUTOMATION_BYPASS_SECRET
                ? {
                      'x-vercel-protection-bypass':
                          process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
                  }
                : {}),
        },
    },

    projects: [
        {
            name: 'accessibility',
            testMatch: /accessibility\.spec\.ts/,
            use: devices['Desktop Chrome'],
        },
        {
            name: 'Desktop Chrome',
            testMatch: /e2e(\\|\/).*\.desktop\.(test|spec)\.(js|ts|mjs)/,
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'Mobile Chrome',
            testMatch: /e2e(\\|\/).*\.mobile\.(test|spec)\.(js|ts|mjs)/,
            use: {
                ...devices['Pixel 5'],
            },
        },
        {
            name: 'Mobile Safari',
            testMatch: /e2e(\\|\/).*\.mobile\.(test|spec)\.(js|ts|mjs)/,
            use: devices['iPhone 12'],
        },
    ],
};
export default config;
