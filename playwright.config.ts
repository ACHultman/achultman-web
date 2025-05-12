import { PlaywrightTestConfig, devices } from '@playwright/test';
import path from 'path';

const config: PlaywrightTestConfig = {
    timeout: 30 * 1000,
    testDir: path.join(__dirname, 'e2e'),
    retries: 2,
    outputDir: 'test-results/',

    webServer: {
        command: 'npm run dev',
        port: 3000,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },

    use: {
        trace: 'retry-with-trace',
        baseURL: 'http://localhost:3000',
    },

    projects: [
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
