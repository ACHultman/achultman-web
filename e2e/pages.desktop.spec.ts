import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
    test('loads and shows key sections', async ({ page }) => {
        await page.goto('/');

        // Hero section
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        // Buyer-fit section
        await expect(page.getByText('Who this is for')).toBeVisible();

        // Featured work and offer sections
        await expect(page.getByText('Selected case notes')).toBeVisible();
        await expect(page.getByText('The 30-day pilot')).toBeVisible();

        // Contact section
        await expect(page.locator('#contact')).toBeAttached();

        const structuredData = await page
            .locator('script[type="application/ld+json"]')
            .allTextContents();
        const schemas = structuredData.map((schema) => JSON.parse(schema));
        expect(schemas).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    '@type': 'Service',
                    name: '30-day AI workflow pilot',
                    offers: expect.objectContaining({
                        price: '5000',
                        priceCurrency: 'USD',
                    }),
                }),
            ])
        );
    });

    test('submits structured lead data with campaign attribution', async ({
        page,
    }) => {
        let submitted: Record<string, unknown> | undefined;

        await page.route('**/api/v1/contact', async (route) => {
            submitted = route.request().postDataJSON();
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    message: 'Form submission successful',
                }),
            });
        });

        await page.goto(
            '/?utm_source=linkedin&utm_medium=organic&utm_campaign=workflow-pilot'
        );
        await page.getByLabel(/^Name/).fill('Jordan Lee');
        await page.getByLabel(/^Work email/).fill('jordan@example.com');
        await page.getByLabel(/^Company/).fill('Example Operations');
        await page
            .getByLabel('Likely first-phase budget')
            .selectOption('5k-10k');
        await page
            .getByLabel(/^What is the expensive/)
            .fill(
                'Our operations team manually reconciles weekly project status across three systems.'
            );
        await page.getByRole('button', { name: 'Send the workflow' }).click();

        await expect(page.getByText('Received, Jordan.')).toBeVisible();
        expect(submitted).toMatchObject({
            name: 'Jordan Lee',
            email: 'jordan@example.com',
            company: 'Example Operations',
            budget: '5k-10k',
            workflow:
                'Our operations team manually reconciles weekly project status across three systems.',
            attribution: {
                utmSource: 'linkedin',
                utmMedium: 'organic',
                utmCampaign: 'workflow-pilot',
            },
        });
    });
});

test.describe('About page', () => {
    test('renders heading and contact form', async ({ page }) => {
        await page.goto('/about');

        await expect(page.getByRole('heading', { level: 1 })).toContainText(
            'earns its place'
        );

        await expect(page.getByText('The tools I use most.')).toBeVisible();

        // Contact form is present
        await expect(page.locator('form')).toBeAttached();
    });
});

test.describe('Blog page', () => {
    test('loads and shows blog heading', async ({ page }) => {
        await page.goto('/blog');

        await expect(page.getByRole('heading', { level: 1 })).toContainText(
            'Blog'
        );

        // Should have either posts or an info alert
        const hasPosts = await page.locator('a[href^="/blog/"]').count();
        const hasAlert = await page.locator('[role="alert"]').count();
        expect(hasPosts + hasAlert).toBeGreaterThan(0);
    });
});

test.describe('Books page', () => {
    test('renders heading and book list', async ({ page }) => {
        await page.goto('/books');

        await expect(page.getByRole('heading', { level: 1 })).toContainText(
            'Books'
        );

        // Should show book content or a fallback message
        await expect(page.locator('main')).toBeAttached();
    });
});

test.describe('Bookmarks page', () => {
    test('renders heading and bookmark content', async ({ page }) => {
        await page.goto('/bookmarks');

        await expect(page.getByRole('heading', { level: 1 })).toContainText(
            'Bookmarks'
        );

        await expect(page.getByText('Last updated:')).toBeVisible();
    });
});

test.describe('404 page', () => {
    test('renders for unknown routes', async ({ page }) => {
        const response = await page.goto('/this-page-does-not-exist');

        expect(response?.status()).toBe(404);
    });
});

test.describe('Contact API', () => {
    test('rejects incomplete and malformed inquiries before sending email', async ({
        request,
    }) => {
        const response = await request.post('/api/v1/contact', {
            data: {
                name: 'A',
                email: 'not-an-email',
                company: '',
                budget: 'free',
                workflow: 'Too short',
            },
        });

        expect(response.status()).toBe(400);
        await expect(response.json()).resolves.toEqual({
            message: 'Invalid form submission',
        });
    });
});
