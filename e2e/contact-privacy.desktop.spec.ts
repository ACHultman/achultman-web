import { test, expect } from '@playwright/test';

test('public pages, page data, and browser scripts do not expose the delivery address', async ({
    request,
    page,
}) => {
    test.setTimeout(120_000);
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const routes = await page.evaluate(
        (source) =>
            Array.from(
                new DOMParser()
                    .parseFromString(source, 'application/xml')
                    .querySelectorAll('url > loc')
            ).map((node) => new URL(node.textContent!).pathname),
        await sitemap.text()
    );
    const scripts = new Set<string>();
    for (const path of [...routes, '/404']) {
        const response = await request.get(path);
        expect(response.status()).toBe(path === '/404' ? 404 : 200);
        const html = await response.text();
        expect(html, path).not.toMatch(/[a-z0-9._%+-]+@hultman\.dev\b/i);
        const content = await page.evaluate((source) => {
            const document = new DOMParser().parseFromString(
                source,
                'text/html'
            );
            return {
                text: document.body.textContent || '',
                ownerEmailLinks: Array.from(
                    document.querySelectorAll('a[href^="mailto:"]')
                )
                    .map((link) => link.getAttribute('href')!)
                    .filter((href) =>
                        /@hultman\.dev\b/i.test(decodeURIComponent(href))
                    ),
                scripts: Array.from(document.querySelectorAll('script[src]'))
                    .map((script) => script.getAttribute('src')!)
                    .filter((src) => src.startsWith('/_next/')),
            };
        }, html);
        expect(content.text, path).not.toMatch(
            /[a-z0-9._%+-]+@hultman\.dev\b/i
        );
        expect(content.ownerEmailLinks, path).toEqual([]);
        content.scripts.forEach((src) => scripts.add(src));
    }
    for (const path of scripts) {
        const response = await request.get(path);
        expect(response.status(), path).toBe(200);
        expect(await response.text(), path).not.toMatch(
            /[a-z0-9._%+-]+@hultman\.dev\b/i
        );
    }
});

test('privacy and security reporting lead to the usable contact form', async ({
    page,
    request,
}) => {
    await page.goto('/privacy');
    await page
        .locator('main')
        .getByRole('link', { name: 'contact form', exact: true })
        .click();
    await expect(page).toHaveURL('/contact');
    await expect(page.getByLabel(/^Message/)).toBeVisible();
    await expect(
        page.getByRole('button', { name: 'Send message', exact: true })
    ).toBeVisible();
    const record = await request.get('/.well-known/security.txt');
    expect(record.status()).toBe(200);
    expect(await record.text()).toContain(
        'Contact: https://hultman.dev/contact'
    );
    expect(await record.text()).not.toContain('mailto:');
});
