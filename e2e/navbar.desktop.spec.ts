import { test, expect } from '@playwright/test';

test('should navigate to the writing page', async ({ page }) => {
    await page.goto('/');

    await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Writing' })
        .click();

    await expect(page).toHaveURL('/blog');
    await expect(page.locator('h1')).toContainText('Working notes');
});
