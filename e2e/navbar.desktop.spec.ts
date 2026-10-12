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

test('About exposes reading collections and the footer separates site links from profiles', async ({
    page,
}) => {
    await page.goto('/');
    await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'About', exact: true })
        .click();
    for (const name of ['Books', 'Bookmarks']) {
        await page
            .locator('main')
            .getByRole('link', { name, exact: true })
            .click();
        await expect(page).toHaveURL(`/${name.toLowerCase()}`);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.goBack();
    }
    const site = page.getByRole('navigation', { name: 'More on this site' });
    await expect(site.getByRole('link')).toHaveText([
        'Consulting',
        'Résumé',
        'Tools',
        'Contact',
        'Privacy',
    ]);
    const profiles = page.getByRole('navigation', {
        name: 'Profiles',
    });
    await expect(profiles.getByRole('link')).toHaveCount(2);
    await site.getByRole('link', { name: 'Privacy' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/privacy');
});
