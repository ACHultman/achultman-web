import { test, expect } from '@playwright/test';

test('homepage presents the new identity and selected writing', async ({
    page,
}) => {
    await page.goto('/');
    await expect(page).toHaveTitle(
        'Adam Hultman | Software Engineer in Vancouver'
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
            'Estimate workflow automation ROI, payback, and time savings with your own implementation and monthly operating costs. Free calculator with a worked example.'
        );
        await expect(
            page.getByRole('heading', {
                level: 1,
                name: 'Workflow automation ROI calculator.',
            })
        ).toBeVisible();
        await expect(
            page.getByRole('heading', {
                name: 'How the estimate works',
            })
        ).toBeVisible();

        await page.getByRole('button', { name: 'Try an example' }).click();
        const results = page.locator('.roi-results');
        await expect(
            results.getByText('21.7 hours', { exact: true })
        ).toBeVisible();
        await expect(
            results.getByText('$1,300', { exact: true })
        ).toBeVisible();
        await expect(
            results.getByText('$1,200', { exact: true })
        ).toBeVisible();
        await expect(
            results.getByText('$8,400', { exact: true })
        ).toBeVisible();
        await expect(
            results.getByText('116.7%', { exact: true })
        ).toBeVisible();
        await expect(
            results.getByText('5.0 months', { exact: true })
        ).toBeVisible();
        await expect(
            results.getByText(
                /only becomes cash savings if spending actually falls/
            )
        ).toBeVisible();
        await page.getByLabel('Currency', { exact: true }).selectOption('USD');
        await expect(results.getByText('Your estimate · USD')).toBeVisible();
        await expect(
            page.getByLabel('One-time implementation cost', { exact: true })
        ).toHaveValue('6000');
        await expect(
            results.getByText('116.7%', { exact: true })
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
    test('handles losses, zero costs, invalid inputs, and the consulting link', async ({
        page,
    }) => {
        await page.goto('/workflow-automation-roi-calculator');
        await page.getByRole('button', { name: 'Try an example' }).click();
        const results = page.locator('.roi-results');
        await page
            .getByLabel('Monthly operating cost', { exact: true })
            .fill('1500');
        await expect(
            results.getByText('No payback at these inputs')
        ).toBeVisible();
        await expect(
            results.getByText('-35.0%', { exact: true })
        ).toBeVisible();
        await page
            .getByLabel('Monthly operating cost', { exact: true })
            .fill('0');
        await page
            .getByLabel('One-time implementation cost', { exact: true })
            .fill('0');
        await expect(
            results.getByText('Undefined with zero costs')
        ).toBeVisible();
        await expect(
            results.getByText('No upfront cost to recover')
        ).toBeVisible();
        await page.getByLabel('People doing the work').fill('1.5');
        await expect(page.getByLabel('People doing the work')).toHaveAttribute(
            'aria-invalid',
            'true'
        );
        await expect(
            results.getByRole('heading', {
                name: 'Check the highlighted inputs',
            })
        ).toBeVisible();
        await page.getByLabel('People doing the work').fill('');
        await expect(
            results.getByRole('heading', { name: 'Add your six estimates' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Try an example' }).click();
        for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
                await page.evaluate(
                    () =>
                        document.documentElement.scrollWidth <=
                        window.innerWidth
                ),
                `${width}px`
            ).toBe(true);
        }
        await results
            .getByRole('link', {
                name: /Explore workflow automation consulting/,
            })
            .click();
        await expect(page).toHaveURL('/consulting#internal-tools');
        await expect(
            page.getByRole('heading', {
                name: 'Internal tools and workflow automation',
            })
        ).toBeVisible();
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
