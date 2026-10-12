import { PlaywrightTestConfig, devices } from '@playwright/test';
import path from 'path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
const externalURL =
    process.env.PLAYWRIGHT_BASE_URL || process.env.VERCEL_PREVIEW_URL;

const authState =
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET && externalURL
        ? (process.env.PLAYWRIGHT_AUTH_STATE ||= path.join(
              tmpdir(),
              `hultman-playwright-${randomUUID()}.json`
          ))
        : undefined;

const productionPreview = process.env.PLAYWRIGHT_PRODUCTION === 'true';
const localURL = productionPreview
    ? 'https://127.0.0.1:3443'
    : 'http://localhost:3000';

const config: PlaywrightTestConfig = {
    globalSetup: './e2e/auth-setup.ts',
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
        storageState: authState,
        baseURL: externalURL || localURL,
        ignoreHTTPSErrors: productionPreview && !externalURL,
        extraHTTPHeaders: {
            'x-vercel-skip-toolbar': '1',
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
