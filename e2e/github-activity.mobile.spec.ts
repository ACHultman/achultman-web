import { test, expect } from '@playwright/test';

test('touch users can inspect the chart and compare workflows', async ({
    page,
}) => {
    await page.goto('/about');
    const section = page.locator('#lately');
    const chart = section.getByRole('img', {
        name: /Monthly GitHub contributions/,
    });
    await chart.scrollIntoViewIfNeeded();
    const box = (await chart.boundingBox())!;
    await page.touchscreen.tap(box.x + box.width / 24, box.y + box.height / 2);
    const slider = section.getByRole('slider', {
        name: 'Explore monthly activity',
    });
    await expect(slider).toHaveValue('0');
    await section
        .getByRole('button', { name: 'Next month', exact: true })
        .tap();
    await expect(slider).toHaveValue('1');
    await section
        .getByRole('button', {
            name: 'Before & after Claude CLI',
            exact: true,
        })
        .tap();
    await expect(
        section.getByText('Jul 2024–Jun 2025', { exact: true })
    ).toBeVisible();
    await expect(
        section.getByText('Sep 2025–Aug 2026', { exact: true })
    ).toBeVisible();
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth
        )
    ).toBe(true);
});
