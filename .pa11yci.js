module.exports = {
    defaults: {
        standard: 'WCAG2AA',
        runners: ['axe'],
        chromeLaunchConfig: {
            executablePath: '/usr/bin/chromium-browser',
        },
        headers: {
            'x-vercel-protection-bypass':
                process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
        },
    },
};
