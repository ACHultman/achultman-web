import { test, expect } from '@playwright/test';

test('primary navigation and work anchors lead to complete pages', async ({
    page,
}) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Selected work' }).click();
    await expect(page).toHaveURL('/work');
    for (const id of ['kopperfield', 'perspective-labs', 'earlier-work']) {
        await expect(page.locator(`#${id}`)).toBeAttached();
    }
    for (const name of ['Tenurel', 'Parallax Studio', 'Earbud']) {
        await expect(
            page.getByRole('heading', { name, exact: true })
        ).toBeVisible();
    }
    await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'About' })
        .click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
        'A bit about me.'
    );
    await page.getByRole('link', { name: 'View résumé' }).click();
    await expect(page).toHaveURL('/resume');
    await expect(
        page.getByRole('button', { name: 'Print résumé' })
    ).toBeVisible();
    await expect(page.getByText('July 2025 - Present')).toBeVisible();
});

test('appearance choice persists across navigation and reload', async ({
    page,
}) => {
    await page.goto('/');
    await page
        .getByRole('button', { name: 'Switch to dark appearance' })
        .click();
    await expect(page.locator('body')).toHaveClass(/chakra-ui-dark/);
    await page.getByRole('link', { name: 'Selected work' }).click();
    await page.reload();
    await expect(page.locator('body')).toHaveClass(/chakra-ui-dark/);
});

test('core routes have no horizontal overflow at narrow widths or enlarged text', async ({
    page,
}) => {
    test.setTimeout(60000);
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const path of [
            '/',
            '/work',
            '/work/property-intelligence',
            '/work/parallax-studio',
            '/work/earbud',
            '/about',
            '/blog',
            '/contact',
            '/resume',
            '/privacy',
        ]) {
            await page.goto(path);
            expect(
                await page.evaluate(
                    () =>
                        document.documentElement.scrollWidth <=
                        window.innerWidth
                )
            ).toBe(true);
        }
    }
    await page.setViewportSize({ width: 640, height: 450 });
    await page.goto('/');
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth
        )
    ).toBe(true);
});

test('featured projects lead to complete case studies and back to selected work', async ({
    page,
}) => {
    for (const [name, slug] of [
        ['Tenurel', 'property-intelligence'],
        ['Parallax Studio', 'parallax-studio'],
        ['Earbud', 'earbud'],
    ] as const) {
        await page.goto('/');
        await page
            .getByRole('link', { name: `Explore ${name}`, exact: true })
            .click();
        await expect(page).toHaveURL(`/work/${slug}`);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
        await expect(
            page.getByRole('heading', { name: 'Current stage' })
        ).toBeVisible();
        await page.getByRole('link', { name: 'All independent work' }).click();
        await expect(page).toHaveURL('/work#perspective-labs');
    }
    const missing = await page.goto('/work/unknown-project');
    expect(missing?.status()).toBe(404);
});

test('reduced motion keeps the introduction immediately readable', async ({
    page,
}) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const duration = await page
        .getByRole('link', { name: 'Selected work' })
        .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(
        duration.split(',').every((value) => parseFloat(value) <= 0.001)
    ).toBe(true);
});

test('article code copies exactly and gives feedback', async ({
    page,
    context,
}) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/blog/ai-assisted-development-at-kopperfield');
    const block = page.locator('.code-block').first();
    const code = await block.locator('code').textContent();
    await block.getByRole('button', { name: 'Copy code' }).click();
    await expect(
        block.getByRole('button', { name: 'Copy code' })
    ).toContainText('Copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        code
    );
});

test('printing a dark-mode resume uses legible paper colors', async ({
    page,
}) => {
    await page.goto('/resume');
    await page
        .getByRole('button', { name: 'Switch to dark appearance' })
        .click();
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.prose h2').first()).toHaveCSS(
        'color',
        'rgb(17, 17, 17)'
    );
    await expect(page.locator('.resume-bullets').first()).toHaveCSS(
        'color',
        'rgb(17, 17, 17)'
    );
    await expect(page.locator('.resume-meta').first()).toHaveCSS(
        'color',
        'rgb(17, 17, 17)'
    );
    await expect(page.locator('body')).toHaveCSS(
        'background-color',
        'rgb(255, 255, 255)'
    );
    await expect(page.locator('.resume-toolbar')).toBeHidden();
});
