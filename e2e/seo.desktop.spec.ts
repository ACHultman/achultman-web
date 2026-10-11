import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';
import path from 'node:path';

// Discover routes independently of the sitemap/metadata registry so a new
// tool cannot silently inherit the homepage's canonical URL again.
const labPaths = readdirSync(path.join(process.cwd(), 'src/pages/labs'))
    .filter((file) => file.endsWith('.tsx') && file !== 'index.tsx')
    .map((file) => `/labs/${file.replace(/\.tsx$/, '')}`);

test('consulting and every lab have page-specific server HTML and correct indexing', async ({
    page,
    request,
}) => {
    test.setTimeout(120_000);
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    const titles = new Set<string>();

    for (const route of [
        '/consulting',
        '/workflow-automation-roi-calculator',
        ...labPaths,
    ]) {
        const response = await request.get(route);
        expect(response.status(), route).toBe(200);
        const robotsHeader = response.headers()['x-robots-tag'] || '';
        if (process.env.PLAYWRIGHT_PREVIEW === 'true') {
            expect(robotsHeader, route).toMatch(/noindex/);
        } else {
            expect(robotsHeader, route).not.toMatch(/noindex/);
        }
        const html = await response.text();
        const seo = await page.evaluate((source) => {
            const document = new DOMParser().parseFromString(
                source,
                'text/html'
            );
            return {
                title: document.title,
                canonicals: Array.from(
                    document.querySelectorAll('link[rel="canonical"]')
                ).map((link) => link.getAttribute('href')),
                og: document
                    .querySelector('meta[property="og:url"]')
                    ?.getAttribute('content'),
                description: document
                    .querySelector('meta[name="description"]')
                    ?.getAttribute('content'),
                robots: document
                    .querySelector('meta[name="robots"]')
                    ?.getAttribute('content'),
                headings: document.querySelectorAll('h1').length,
            };
        }, html);
        const canonical = `https://hultman.dev${route}`;
        expect(seo.canonicals, route).toEqual([canonical]);
        expect(seo.og, route).toBe(canonical);
        expect(seo.description?.length, route).toBeGreaterThan(40);
        expect(seo.robots, route).not.toMatch(/noindex/);
        expect(seo.headings, route).toBe(1);
        expect(titles.has(seo.title), `Duplicate title at ${route}`).toBe(
            false
        );
        titles.add(seo.title);
        expect(xml, route).toContain(`<loc>${canonical}</loc>`);
    }
});

test('consulting is reachable and leads prospective clients to contact', async ({
    page,
}) => {
    await page.goto('/');
    await page
        .locator('footer')
        .getByRole('link', { name: 'Consulting', exact: true })
        .click();
    await expect(page).toHaveURL('/consulting');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'AI and software consulting in Vancouver.'
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://hultman.dev/consulting'
    );
    const schemas = (
        await page
            .locator('script[type="application/ld+json"]')
            .allTextContents()
    ).map((value) => JSON.parse(value));
    const service = schemas.find((value) => value['@type'] === 'Service');
    expect(service.provider.name).toBe('Adam Hultman');
    expect(service.url).toBe('https://hultman.dev/consulting');
    await page.getByRole('link', { name: 'Discuss a project' }).first().click();
    await expect(page).toHaveURL('/contact');
    await expect(
        page.getByRole('link', { name: /adam@hultman.dev/ }).first()
    ).toBeVisible();
});

test('consulting reflows on phones and tablets', async ({ page }) => {
    await page.goto('/consulting');
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= window.innerWidth
            ),
            `${width}px`
        ).toBe(true);
    }
});
