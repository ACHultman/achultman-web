module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run start',
        url: ['http://localhost:3000'],
        settings: {
            // Use provided network/CPU (no simulated throttling) for faster results in CI
            throttlingMethod: 'provided',
        },
        // Run Chrome in no-sandbox & disable GPU to avoid CI issues
        chromeFlags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
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
