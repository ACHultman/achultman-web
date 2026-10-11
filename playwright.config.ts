import { PlaywrightTestConfig, devices } from '@playwright/test';
import path from 'path';
const externalURL =
    process.env.PLAYWRIGHT_BASE_URL || process.env.VERCEL_PREVIEW_URL;

const config: PlaywrightTestConfig = {
    timeout: 30 * 1000,
    testDir: path.join(__dirname, 'e2e'),
    retries: 2,
    outputDir: 'test-results/',

    webServer: externalURL
        ? undefined
        : {
              command: 'npm run dev',
              port: 3000,
              timeout: 120 * 1000,
              reuseExistingServer: !process.env.CI,
          },

    use: {
        trace: 'retry-with-trace',
        baseURL: externalURL || 'http://localhost:3000',
        extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
            ? {
                  'x-vercel-protection-bypass':
                      process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
              }
            : undefined,
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
