const { chromium } = require('@playwright/test');
const path = require('node:path');

// Run against the current local site after changing resume copy or print styles.
async function exportResume() {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ colorScheme: 'light' });
        const url = new URL(
            '/resume',
            process.env.RESUME_BASE_URL || 'http://localhost:3000'
        );
        const response = await page.goto(url.href, {
            waitUntil: 'networkidle',
        });
        if (!response?.ok()) throw new Error('The resume page did not load');
        await page.evaluate(() => document.fonts.ready);
        await page.emulateMedia({ media: 'print' });
        await page.addStyleTag({ content: 'nextjs-portal { display: none; }' });
        await page.pdf({
            path: path.join(__dirname, '../public/adam-hultman-resume.pdf'),
            format: 'A4',
            printBackground: true,
            tagged: true,
            outline: true,
            margin: {
                top: '12mm',
                bottom: '12mm',
                left: '16mm',
                right: '16mm',
            },
        });
        process.stdout.write('Saved public/adam-hultman-resume.pdf\n');
    } finally {
        await browser.close();
    }
}
exportResume().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
