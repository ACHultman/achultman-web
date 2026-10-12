import { test, expect } from '@playwright/test';

test('only pages that use the editorial typeface preload it', async ({
    page,
}) => {
    for (const [path, count] of [
        ['/', 2],
        ['/about', 2],
        ['/blog', 1],
        ['/books', 1],
    ] as const) {
        await page.goto(path);
        await expect(
            page.locator('link[rel="preload"][as="font"]')
        ).toHaveCount(count);
    }

    // The page-specific face must also load on a client-side navigation.
    await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'About' })
        .click();
    await expect(page).toHaveURL('/about');
    const headingFont = await page
        .getByRole('heading', { level: 1 })
        .evaluate((node) => {
            const style = getComputedStyle(node);
            return style.fontFamily;
        });
    expect(headingFont).toContain('"Source Serif 4"');
    await expect
        .poll(() =>
            page.evaluate(() =>
                [...document.fonts].some(
                    (font) =>
                        font.family === 'Source Serif 4' &&
                        font.status === 'loaded'
                )
            )
        )
        .toBe(true);
});

test('writing waits for reader intent before fetching another page', async ({
    page,
}) => {
    const requests: string[] = [];
    page.on('request', (request) =>
        requests.push(new URL(request.url()).pathname)
    );
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    expect(
        requests.filter(
            (path) =>
                path.includes('/_next/data/') ||
                /\/pages\/(?:index-|blog\/(?:%5B|\[)slug)/.test(path)
        )
    ).toEqual([]);

    const article = page.locator('.article-row a').first();
    const href = await article.getAttribute('href');
    await article.click();
    await expect(page).toHaveURL(href!);
    await expect(page.locator('article .article-body')).toBeVisible();
});
