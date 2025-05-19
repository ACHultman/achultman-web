module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run start',
            url: ['http://localhost:3000'],
            settings: {
                throttlingMethod: 'provided',
                extraHeaders: JSON.stringify({
                    'x-vercel-protection-bypass':
                        process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
                }),
            },
            chromeFlags: [
                '--no-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
            ],
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 0.95 }],
                'categories:accessibility': ['error', { minScore: 0.95 }],
                'categories:best-practices': ['error', { minScore: 0.95 }],
                'categories:seo': ['error', { minScore: 0.95 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
