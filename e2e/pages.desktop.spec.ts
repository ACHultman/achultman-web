import { test, expect } from '@playwright/test';

test('homepage presents the new identity and selected writing', async ({
    page,
}) => {
    await page.goto('/');
    await expect(page).toHaveTitle(
        'Adam Hultman | Software & Independent Products'
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://hultman.dev'
    );
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
        'Adam Hultman'
    );
    await expect(
        page.getByRole('heading', { name: 'Perspective Labs Inc.' })
    ).toBeVisible();
    await expect(
        page.getByRole('link', {
            name: 'AI-assisted development at Kopperfield',
        })
    ).toHaveAttribute('href', '/blog/ai-assisted-development-at-kopperfield');
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.getByText(/PR QA Copilot|Geny/)).toHaveCount(0);
    const schemas = (
        await page
            .locator('script[type="application/ld+json"]')
            .allTextContents()
    ).map((value) => JSON.parse(value));
    expect(schemas.some((schema) => schema['@type'] === 'Person')).toBe(true);
    expect(schemas.some((schema) => schema['@type'] === 'Service')).toBe(false);
});

test('writing preserves the collection and reports a missing content service honestly', async ({
    page,
}) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'Working notes.'
    );
    const count = await page.locator('main article').count();
    if (!count)
        await expect(
            page.getByText(
                'The writing archive is temporarily unavailable. Please try again later.'
            )
        ).toBeVisible();
});

test('older published articles are discoverable and indexable', async ({
    page,
}) => {
    await page.goto('/blog');
    await expect(
        page.locator(
            'a[href="/blog/getting-started-with-ai-driven-development-tools-and-techniques"]'
        )
    ).toBeVisible();
    await page.goto(
        '/blog/getting-started-with-ai-driven-development-tools-and-techniques'
    );
    await expect(page.getByText('Archived note.')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'index,follow'
    );
});

test.describe('Workflow automation ROI calculator', () => {
    test('renders search metadata, assumptions and working calculations', async ({
        page,
    }) => {
        await page.goto('/workflow-automation-roi-calculator');

        await expect(page).toHaveTitle(
            'Workflow Automation ROI Calculator | Adam Hultman'
        );
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
            'href',
            'https://hultman.dev/workflow-automation-roi-calculator'
        );
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
            'content',
            'A free, plain-English calculator for checking whether a manual workflow might justify a $5,000 automation project.'
        );
        await expect(
            page.getByRole('heading', {
                level: 1,
                name: 'Is this workflow worth fixing?',
            })
        ).toBeVisible();
        await expect(
            page.getByRole('heading', {
                name: 'How the estimate works',
            })
        ).toBeVisible();

        await page.getByLabel('People doing the work').fill('2');
        await page.getByLabel('Hours each person spends weekly').fill('6');
        await page.getByLabel('Loaded hourly cost (USD)').fill('75');
        await page.getByLabel('Time the tool could give back (%)').fill('50');

        await expect(page.getByText('$3,897')).toBeVisible();
        await expect(page.getByText('$1,949')).toBeVisible();
        await expect(page.getByText('2.6 months')).toBeVisible();
        await expect(
            page.getByText('Estimated monthly value of time saved', {
                exact: true,
            })
        ).toBeVisible();
        await expect(
            page.getByText(/Software costs and ongoing fees are excluded/)
        ).toBeVisible();

        const structuredData = await page
            .locator('script[type="application/ld+json"]')
            .allTextContents();
        const schemas = structuredData.map((schema) => JSON.parse(schema));
        expect(schemas).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    '@type': 'WebApplication',
                    name: 'Workflow Automation ROI Calculator',
                    isAccessibleForFree: true,
                }),
            ])
        );
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
                message: '',
            },
        });

        expect(response.status()).toBe(400);
        await expect(response.json()).resolves.toEqual({
            message: 'Invalid form submission',
        });
    });
});
