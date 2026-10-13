import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('activity supports direct inspection, keyboard exploration, history, and source context', async ({
    page,
}) => {
    const githubRequests: string[] = [];
    page.on('request', (request) => {
        if (new URL(request.url()).hostname === 'github.com')
            githubRequests.push(request.url());
    });
    await page.goto('/about');
    const section = page.getByRole('region', {
        name: 'I’ve been building a lot.',
    });
    await expect(
        section.getByRole('heading', { name: 'The last 30 days' })
    ).toBeVisible();
    await expect(
        section.getByText('in the preceding 30 days', { exact: false }).first()
    ).toBeVisible();
    const slider = section.getByRole('slider', {
        name: 'Explore monthly activity',
    });
    const initial = Number(await slider.inputValue());
    await slider.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(slider).toHaveValue(String(initial - 1));
    await expect(section.getByRole('status')).toHaveText(
        (await slider.getAttribute('aria-valuetext'))!
    );
    const chart = section.getByRole('img', {
        name: /Monthly GitHub contributions/,
    });
    const box = (await chart.boundingBox())!;
    await chart.click({ position: { x: 2, y: box.height / 2 } });
    await expect(slider).toHaveValue('0');
    await expect(
        section.getByRole('button', { name: 'Previous month' })
    ).toBeDisabled();
    await section.getByLabel('Time range').selectOption('all');
    expect(Number(await slider.getAttribute('max'))).toBeGreaterThan(11);
    await section.getByLabel('Time range').selectOption('2023');
    await expect(slider).toHaveAttribute('max', '11');
    await expect(section.getByRole('status')).toContainText('December 2023');
    await section.getByText('View monthly data', { exact: true }).click();
    await expect(section.getByRole('table')).toBeVisible();
    await expect(section.getByRole('row')).toHaveCount(13);
    await section
        .getByText('What counts—and whose work is included?', { exact: true })
        .click();
    await expect(
        section.getByText('I use the same', { exact: false })
    ).toContainText('Assembly, Kopperfield, and personal projects');
    await expect(
        section.getByRole('link', { name: 'See what I’m building' })
    ).toHaveAttribute('href', '/work');
    expect(githubRequests).toEqual([]);
});

for (const mode of ['light', 'dark']) {
    test(`${mode}: activity and workflow comparison remain accessible at phone widths`, async ({
        page,
    }) => {
        test.setTimeout(60000);
        await page.addInitScript(
            (value) => localStorage.setItem('chakra-ui-color-mode', value),
            mode
        );
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.setViewportSize({ width: 320, height: 900 });
        await page.goto('/about');
        const section = page.locator('#lately');
        await expect(section.getByRole('slider')).toBeVisible();
        for (const view of ['Activity', 'Before & after Claude CLI']) {
            await section
                .getByRole('button', { name: view, exact: true })
                .click();
            if (view !== 'Activity') {
                await expect(
                    section.getByText('Jul 2024–Jun 2025', { exact: true })
                ).toBeVisible();
                await expect(
                    section.getByText('Sep 2025–Aug 2026', { exact: true })
                ).toBeVisible();
                await expect(
                    section.getByRole('heading', {
                        name: 'From autocomplete to Claude in the terminal',
                    })
                ).toBeVisible();
            }
            const results = await new AxeBuilder({ page })
                .include('#lately')
                .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
                .analyze();
            expect(results.violations).toEqual([]);
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
        }
        await section
            .getByText('What counts—and whose work is included?', {
                exact: true,
            })
            .click();
        const results = await new AxeBuilder({ page })
            .include('#lately')
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze();
        expect(results.violations).toEqual([]);
    });
}
