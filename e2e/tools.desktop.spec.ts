import { test, expect } from '@playwright/test';
import { toolPages } from '../src/data/toolPages';

test('the tools index links to the six maintained tools', async ({ page }) => {
    const toolBundles: string[] = [];
    page.on('request', (request) => {
        if (
            /_next\/static\/chunks\/pages\/tools\/(?!index-)/.test(
                new URL(request.url()).pathname
            )
        )
            toolBundles.push(request.url());
    });
    await page.goto('/tools');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'Interactive tools.'
    );
    await expect(page.locator('.tool-list article')).toHaveCount(6);
    for (const tool of Object.values(toolPages)) {
        await expect(
            page.getByRole('link', { name: tool.title, exact: true })
        ).toHaveAttribute('href', tool.path);
    }
    await page.locator('.tool-list article').last().scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');
    expect(toolBundles).toEqual([]);
});

for (const tool of Object.values(toolPages)) {
    test(`${tool.path} loads without browser errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') errors.push(message.text());
        });
        await page.goto(tool.path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.waitForTimeout(500);
        expect(errors).toEqual([]);
    });
}

test('old URLs redirect only to retained tools and removed pages are absent from the sitemap', async ({
    request,
}) => {
    const retained = {
        'sort-arena': 'sorting',
        'regex-debugger': 'regex-tester',
        compression: 'compression',
        'shader-playground': 'shader-editor',
        beatmaker: 'step-sequencer',
        'neural-net': 'neural-network',
    };
    for (const [oldPath, newPath] of Object.entries(retained)) {
        const response = await request.get(`/labs/${oldPath}`, {
            maxRedirects: 0,
        });
        expect(response.status()).toBe(308);
        expect(
            new URL(response.headers().location!, response.url()).pathname
        ).toBe(`/tools/${newPath}`);
    }
    const index = await request.get('/labs', { maxRedirects: 0 });
    expect(index.status()).toBe(308);
    const sitemap = await request.get('/sitemap.xml');
    const xml = await sitemap.text();
    expect(xml).not.toContain('/labs');
    for (const slug of [
        'interaction-checker',
        'evidence-viz',
        'ast-explorer',
        'distributed',
        'exploit-viz',
        'gpu-pipeline',
        'agent-flow',
        'prompt-duel',
        'token-viz',
    ]) {
        expect((await request.get(`/labs/${slug}`)).status()).toBe(404);
    }
});

test('regex matching handles backtracking, invalid input, empty matches, and a CPU timeout', async ({
    page,
}) => {
    await page.goto('/tools/regex-tester');
    const pattern = page.getByLabel('Pattern', { exact: true });
    const input = page.getByLabel('Test text', { exact: true });
    const run = page.getByRole('button', { name: 'Test pattern' });
    await pattern.fill('a+a');
    await input.fill('aa');
    await run.click();
    await expect(page.getByRole('status')).toHaveText('1 match.');
    await expect(page.locator('.regex-matches pre')).toHaveText('aa');
    await pattern.fill('[');
    await run.click();
    await expect(page.locator('.regex-tool').getByRole('alert')).toContainText(
        'Invalid regular expression'
    );
    await pattern.fill('(?:)');
    await run.click();
    await expect(page.getByRole('status')).toHaveText('3 matches.');
    await pattern.fill('(a+)+$');
    await input.fill('a'.repeat(1000) + '!');
    await run.click();
    await expect(page.locator('.regex-tool').getByRole('alert')).toContainText(
        'Stopped after one second'
    );
    await pattern.fill('a{2}');
    await input.fill('aa');
    await run.click();
    await expect(page.getByRole('status')).toHaveText('1 match.');
});

test('theme persists across native pages, interactive pages, and reloads', async ({
    page,
}) => {
    await page.goto('/');
    await page
        .locator('footer')
        .getByRole('button', { name: 'Switch to dark appearance' })
        .click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page
        .locator('footer')
        .getByRole('link', { name: 'Tools', exact: true })
        .click();
    await page
        .getByRole('link', { name: 'Neural network', exact: true })
        .click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page
        .locator('footer')
        .getByRole('button', { name: 'Switch to light appearance' })
        .click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page
        .locator('footer')
        .getByRole('link', { name: 'Tools', exact: true })
        .click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('editorial pages have no browser errors, including injected scripts', async ({
    page,
}) => {
    const errors: string[] = [];
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    for (const route of ['/', '/work', '/contact', '/tools']) {
        await page.goto(route);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.waitForTimeout(500);
    }
    expect(errors).toEqual([]);
});
