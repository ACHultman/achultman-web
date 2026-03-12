import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
    test('loads and shows key sections', async ({ page }) => {
        await page.goto('/');

        // Hero section
        await expect(
            page.getByRole('heading', { level: 1 })
        ).toBeVisible();

        // Chat section
        await expect(page.getByText('Ask me anything about Adam')).toBeVisible();

        // Featured work section
        await expect(page.getByText('Featured Work')).toBeVisible();

        // Contact section
        await expect(page.locator('#contact')).toBeAttached();
    });
});

test.describe('About page', () => {
    test('renders heading and contact form', async ({ page }) => {
        await page.goto('/about');

        await expect(
            page.getByRole('heading', { level: 1 })
        ).toContainText('About');

        // Skills section is present
        await expect(page.getByText('What I believe about software')).toBeVisible();

        // Contact form is present
        await expect(page.locator('form')).toBeAttached();
    });
});

test.describe('Blog page', () => {
    test('loads and shows blog heading', async ({ page }) => {
        await page.goto('/blog');

        await expect(
            page.getByRole('heading', { level: 1 })
        ).toContainText('Blog');

        // Should have either posts or an info alert
        const hasPosts = await page.locator('a[href^="/blog/"]').count();
        const hasAlert = await page.locator('[role="alert"]').count();
        expect(hasPosts + hasAlert).toBeGreaterThan(0);
    });
});

test.describe('Books page', () => {
    test('renders heading and book list', async ({ page }) => {
        await page.goto('/books');

        await expect(
            page.getByRole('heading', { level: 1 })
        ).toContainText('Books');

        // Should show book content or a fallback message
        await expect(
            page.locator('main, [role="main"], .chakra-container')
        ).toBeAttached();
    });
});

test.describe('Bookmarks page', () => {
    test('renders heading and bookmark content', async ({ page }) => {
        await page.goto('/bookmarks');

        await expect(
            page.getByRole('heading', { level: 1 })
        ).toContainText('Bookmarks');

        await expect(page.getByText('Last updated:')).toBeVisible();
    });
});

test.describe('404 page', () => {
    test('renders for unknown routes', async ({ page }) => {
        const response = await page.goto('/this-page-does-not-exist');

        expect(response?.status()).toBe(404);
    });
});
