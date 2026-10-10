import { test, expect } from '@playwright/test';

test('navigation stays reachable without moving the page and closes on outside tap', async ({
    page,
}) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.scrollTo(0, 900));
    const menu = page.getByRole('button', { name: 'Open menu', exact: true });
    await expect(menu).toBeInViewport();
    const before = await page.evaluate(() => window.scrollY);
    await menu.tap();
    await expect(page.locator('#mobile-navigation')).toBeVisible();
    // WebKit rounds the visual viewport scroll position by up to two pixels.
    expect(
        Math.abs((await page.evaluate(() => window.scrollY)) - before)
    ).toBeLessThanOrEqual(2);
    await page.touchscreen.tap(12, 520);
    await expect(page.locator('#mobile-navigation')).toHaveCount(0);
    await menu.tap();
    await page
        .locator('#mobile-navigation')
        .getByRole('link', { name: 'Work', exact: true })
        .tap();
    await expect(page).toHaveURL('/work');
    await page
        .getByRole('navigation', { name: 'Work sections' })
        .getByRole('link', { name: 'Perspective Labs' })
        .tap();
    const heading = await page.locator('#perspective-labs h2').boundingBox();
    const header = await page.locator('.site-header').boundingBox();
    expect(heading!.y).toBeGreaterThan(header!.y + header!.height);
});

test('phone layouts and enlarged text reflow across core pages', async ({
    page,
}) => {
    test.setTimeout(60000);
    for (const [width, height, scale] of [
        [320, 740, 100],
        [430, 932, 100],
        [844, 390, 100],
        [320, 740, 200],
    ] as const) {
        await page.setViewportSize({ width, height });
        for (const path of [
            '/',
            '/work',
            '/about',
            '/blog',
            '/contact',
            '/resume',
            '/privacy',
            '/labs',
        ]) {
            await page.goto(path, { waitUntil: 'networkidle' });
            await page.addStyleTag({
                content: `html { font-size: ${scale}% !important; }`,
            });
            await page.evaluate(() => document.fonts.ready);
            const dimensions = await page.evaluate(() => ({
                content: document.documentElement.scrollWidth,
                viewport: window.innerWidth,
            }));
            expect(
                dimensions.content,
                `${path} at ${width}px / ${scale}% text`
            ).toBeLessThanOrEqual(dimensions.viewport);
        }
    }
});

test('portrait belongs to the introduction and the primary action has a full touch surface', async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/');
    const action = await page
        .getByRole('link', { name: 'Selected work' })
        .boundingBox();
    const portrait = await page
        .getByAltText('Portrait of Adam Hultman')
        .boundingBox();
    expect(action!.width).toBeGreaterThanOrEqual(280);
    expect(action!.height).toBeGreaterThanOrEqual(48);
    expect(action!.y + action!.height).toBeLessThan(640);
    const identity = await page.locator('.hero-identity').boundingBox();
    expect(portrait!.y).toBeGreaterThanOrEqual(identity!.y);
    expect(portrait!.y).toBeLessThan(identity!.y + 10);
    expect(portrait!.x).toBeGreaterThan(identity!.x + identity!.width);
    expect(portrait!.height).toBeLessThanOrEqual(80);
    await expect(page.locator('.hero')).not.toContainText('Occasional pianist');
});

test('article descriptions and arrows share the article tap target', async ({
    page,
}) => {
    await page.route(
        '**/blog/ai-assisted-development-at-kopperfield',
        (route) =>
            route.fulfill({
                contentType: 'text/html',
                body: '<h1>Article destination</h1>',
            })
    );
    await page.goto('/');
    const article = page.locator('.article-row').first();
    await article.scrollIntoViewIfNeeded();
    const description = await article.locator('p').boundingBox();
    const link = await page.evaluate(
        ({ x, y }) =>
            document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href'),
        {
            x: description!.x + 20,
            y: description!.y + 15,
        }
    );
    expect(link).toBe('/blog/ai-assisted-development-at-kopperfield');
    await article.locator('a').tap();
    await expect(page).toHaveURL(
        /\/blog\/ai-assisted-development-at-kopperfield$/
    );
});

test('writing opens a complete readable article with usable next links', async ({
    page,
}) => {
    await page.goto('/');
    await page
        .getByRole('link', {
            name: 'AI-assisted development at Kopperfield',
            exact: true,
        })
        .tap();
    await expect(page.locator('.article-body')).toContainText(
        'If an engineering friend asked me'
    );
    await expect(
        page.getByRole('heading', {
            name: 'Some rules can’t depend on judgment',
        })
    ).toBeVisible();
    await page.setViewportSize({ width: 320, height: 740 });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(
        await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(320);
    await page
        .getByRole('link', { name: 'All writing', exact: true })
        .last()
        .tap();
    await expect(page).toHaveURL('/blog');
    await expect(
        page.getByRole('link', {
            name: 'AI-assisted development at Kopperfield',
            exact: true,
        })
    ).toBeVisible();
});

test('landscape menu remains scrollable and contact fields suit a phone keyboard', async ({
    page,
}) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu', exact: true }).tap();
    const contact = page
        .locator('#mobile-navigation')
        .getByRole('link', { name: 'Get in touch' });
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toBeInViewport();
    await contact.tap();
    await page.setViewportSize({ width: 390, height: 664 });
    const email = page.getByLabel(/^Email/);
    await expect(email).toHaveAttribute('inputmode', 'email');
    await expect(email).toHaveAttribute('autocapitalize', 'none');
    await email.tap();
    expect(
        await email.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    ).toBeGreaterThanOrEqual(16);
    const input = await email.boundingBox();
    const button = await page
        .getByRole('button', { name: 'Send message' })
        .boundingBox();
    expect(button!.width).toBe(input!.width);
});

test('the resume has a real PDF download', async ({ page, request }) => {
    await page.goto('/resume');
    const download = page.getByRole('link', { name: 'Download PDF' });
    await expect(download).toHaveAttribute('download', '');
    const href = await download.getAttribute('href');
    const response = await request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
});
