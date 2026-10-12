import { test, expect } from '@playwright/test';

test('page URLs normalize permanently, retain queries, and resolve to canonical content', async ({
    request,
}) => {
    for (const path of [
        '/tools',
        '/blog',
        '/about',
        '/blog/ai-assisted-development-at-kopperfield',
    ]) {
        const response = await request.get(`${path}/?ref=crawler-check`, {
            maxRedirects: 0,
        });
        expect(response.status(), path).toBe(308);
        const destination = new URL(
            response.headers().location!,
            response.url()
        );
        expect(destination.pathname).toBe(path);
        expect(destination.search).toBe('?ref=crawler-check');
        const canonical = await request.get(destination.href, {
            maxRedirects: 0,
        });
        expect(canonical.status(), path).toBe(200);
    }
    const redirect = await request.get('/labs/sort-arena/', {
        maxRedirects: 0,
    });
    expect(redirect.status()).toBe(308);
    expect(new URL(redirect.headers().location!, redirect.url()).pathname).toBe(
        '/tools/sorting'
    );
    const legacy = await request.get('/labs/sort-arena/');
    expect(new URL(legacy.url()).pathname).toBe('/tools/sorting');
    expect(legacy.status()).toBe(200);
});

test('robots allows public content and points to a complete sitemap with honest dates', async ({
    request,
    page,
}) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(robots.headers()['content-type']).toContain('text/plain');
    expect(await robots.text()).toMatch(
        /User-agent: \*\s+Allow: \/\s+Sitemap: https:\/\/hultman\.dev\/sitemap\.xml/
    );
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const sitemap = await page.evaluate(
        (source) => {
            const xml = new DOMParser().parseFromString(
                source,
                'application/xml'
            );
            return {
                valid: !xml.querySelector('parsererror'),
                entries: Array.from(xml.querySelectorAll('url')).map((url) => ({
                    loc: url.querySelector('loc')!.textContent!,
                    lastmod: url.querySelector('lastmod')?.textContent,
                })),
            };
        },
        await response.text()
    );
    expect(sitemap.valid).toBe(true);
    const urls = sitemap.entries.map(({ loc }) => loc);
    expect(new Set(urls).size).toBe(urls.length);
    for (const path of ['/blog', '/books', '/bookmarks']) {
        expect(
            sitemap.entries.find(
                ({ loc }) => loc === `https://hultman.dev${path}`
            )
        ).toEqual({ loc: `https://hultman.dev${path}`, lastmod: undefined });
    }
    expect(urls.some((url) => /\/(api|labs|404)(\/|$)/.test(url))).toBe(false);
});

test('JSON API errors carry noindex without sending contact email', async ({
    request,
}) => {
    const response = await request.get('/api/v1/contact');
    expect(response.status()).toBe(405);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(response.headers()['x-robots-tag']).toContain('noindex');
});

test('security contact record is available, current, and canonical', async ({
    request,
}) => {
    const response = await request.get('/.well-known/security.txt');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');
    const body = await response.text();
    expect(body).toContain('Contact: mailto:adam@hultman.dev\n');
    expect(body).toContain(
        'Canonical: https://hultman.dev/.well-known/security.txt\n'
    );
    const expires = body.match(/^Expires: (.+)$/m)?.[1];
    expect(Date.parse(expires || '')).toBeGreaterThan(Date.now());
    const legacy = await request.get('/security.txt', { maxRedirects: 0 });
    expect(legacy.status()).toBe(308);
    expect(new URL(legacy.headers().location!, legacy.url()).pathname).toBe(
        '/.well-known/security.txt'
    );
});
