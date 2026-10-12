const { previewAuthState } = require('./preview-auth.cjs');

module.exports = async (browser, { url }) => {
    const state = await previewAuthState(
        url,
        process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    );
    if (!state.cookies.length) return;
    const page = (await browser.pages())[0] || (await browser.newPage());
    await page.setCookie(...state.cookies);
    // Lighthouse's default storage reset retains cookies but clears browser caches.
};
