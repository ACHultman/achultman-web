const { request } = require('@playwright/test');

async function previewAuthState(baseURL, secret) {
    const empty = { cookies: [], origins: [] };
    if (!baseURL || !secret) return empty;
    const url = new URL(baseURL);
    // The public domain needs no bypass; never send a preview secret to other hosts.
    if (
        url.protocol !== 'https:' ||
        !url.hostname.endsWith('.vercel.app') ||
        url.username ||
        url.password
    )
        return empty;
    const context = await request.newContext();
    try {
        const response = await context.get(url.origin, {
            headers: {
                'x-vercel-protection-bypass': secret,
                'x-vercel-set-bypass-cookie': 'true',
            },
            maxRedirects: 0,
            timeout: 15000,
        });
        if (![200, 302, 303, 307, 308].includes(response.status()))
            throw new Error('Preview authentication was rejected.');
        const state = await context.storageState();
        const cookies = state.cookies.filter(
            (cookie) => cookie.domain.replace(/^\./, '') === url.hostname
        );
        if (!cookies.length)
            throw new Error(
                'Preview authentication did not return a scoped cookie.'
            );
        return { cookies, origins: [] };
    } finally {
        await context.dispose();
    }
}

module.exports = { previewAuthState };
