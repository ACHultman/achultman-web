import { test, expect } from '@playwright/test';

test('should navigate to the writing page', async ({ page }) => {
    await page.goto('/');

    await page.click('button[aria-label="Open menu"]');
    await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Writing' })
        .click();

    await expect(page).toHaveURL('/blog');
    await expect(page.locator('h1')).toContainText('Working notes');
});

test('reading collections are reachable through the mobile menu', async ({
    page,
}) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu', exact: true }).tap();
    await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'About', exact: true })
        .tap();
    await expect(page.locator('#mobile-navigation')).toHaveCount(0);
    for (const name of ['Books', 'Bookmarks']) {
        await page
            .locator('main')
            .getByRole('link', { name, exact: true })
            .tap();
        await expect(page).toHaveURL(`/${name.toLowerCase()}`);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.goBack();
    }
});
