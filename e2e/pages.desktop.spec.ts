import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
    test('loads and shows key sections', async ({ page }) => {
        await page.goto('/');

        await expect(page).toHaveTitle(
            'Custom software development | Adam Hultman'
        );
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
            'content',
            'I build internal tools, AI features and web products. Based in Vancouver. Independent projects from $5,000 USD.'
        );

        // Hero section
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        // Services and optional workflow calculator
        await expect(
            page.getByRole('heading', {
                name: 'The kind of work I take on',
            })
        ).toBeVisible();
        await expect(
            page.getByRole('heading', { name: 'A quick cost check' })
        ).toBeVisible();

        // Featured work and offer sections
        await expect(
            page.getByRole('heading', {
                name: 'Product work and open source',
            })
        ).toBeVisible();
        await expect(
            page.getByRole('heading', {
                name: 'A focused first month',
            })
        ).toBeVisible();
        await expect(
            page.getByText(/ongoing engineering starts at \$5,000 USD a month/i)
        ).toBeVisible();

        // Contact section
        await expect(page.locator('#contact')).toBeAttached();

        const structuredData = await page
            .locator('script[type="application/ld+json"]')
            .allTextContents();
        const schemas = structuredData.map((schema) => JSON.parse(schema));
        expect(schemas).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    '@type': 'Person',
                    name: 'Adam Hultman',
                    jobTitle: 'Full-Stack Engineer',
                }),
                expect.objectContaining({
                    '@type': 'Service',
                    name: '30-day software project',
                    offers: expect.objectContaining({
                        price: '5000',
                        priceCurrency: 'USD',
                    }),
                }),
            ])
        );
        const service = schemas.find((schema) => schema['@type'] === 'Service');
        expect(service.offers).not.toHaveProperty('availability');
    });

    test('links to a working calculator without adding inputs to the homepage', async ({
        page,
    }) => {
        await page.goto('/');
        await expect(page.getByLabel('People doing the work')).toHaveCount(0);
        await page
            .getByRole('link', { name: 'Calculate workflow cost' })
            .click();
        await expect(page).toHaveURL(/\/workflow-automation-roi-calculator$/);

        await page.getByLabel('People doing the work').fill('2');
        await page.getByLabel('Hours each person spends weekly').fill('6');
        await page.getByLabel('Loaded hourly cost (USD)').fill('75');
        await page.getByLabel('Time the tool could give back (%)').fill('50');

        await expect(page.getByText('$3,897')).toBeVisible();
        await expect(page.getByText('$1,949')).toBeVisible();
        await expect(page.getByText('2.6 months')).toBeVisible();
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
        await page.getByLabel(/^Email/).fill('jordan@example.com');
        await page.getByLabel(/^Company/).fill('Example Operations');
        await page.getByLabel('Rough budget (optional)').selectOption('5k-10k');
        await page
            .getByLabel(/^What are you trying to make or improve/)
            .fill(
                'Our operations team manually reconciles weekly project status across three systems.'
            );
        await page
            .locator('form')
            .getByRole('button', { name: 'Send it over' })
            .click();

        await expect(page.getByText('Got it, Jordan')).toBeVisible();
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

test.describe('About page', () => {
    test('renders heading and contact form', async ({ page }) => {
        await page.goto('/about');
        await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
            'content',
            'https://hultman.dev/about'
        );

        await expect(page.getByRole('heading', { level: 1 })).toContainText(
            'earns its place'
        );

        await expect(page.getByText('The tools I use most.')).toBeVisible();

        // Contact form is present
        await expect(page.locator('form')).toBeAttached();
    });
});

test.describe('Working notes', () => {
    test('shows the edited collection and hides retired tutorials', async ({
        page,
    }) => {
        await page.goto('/blog');

        await expect(page.getByRole('heading', { level: 1 })).toContainText(
            'Working notes'
        );

        await expect(
            page.locator(
                'a[href="/blog/getting-started-with-ai-driven-development-tools-and-techniques"]'
            )
        ).toHaveCount(0);

        const hasPosts = await page.locator('main article').count();
        const hasEditorialFallback = await page
            .getByText('New notes are being edited now.')
            .count();
        expect(hasPosts + hasEditorialFallback).toBeGreaterThan(0);
    });

    test('keeps an old tutorial available but removes it from indexing', async ({
        page,
    }) => {
        await page.goto(
            '/blog/getting-started-with-ai-driven-development-tools-and-techniques'
        );

        await expect(page.getByText('Archived note.')).toBeVisible();
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
            'content',
            /noindex/
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
                workflow: 'Too short',
            },
        });

        expect(response.status()).toBe(400);
        await expect(response.json()).resolves.toEqual({
            message: 'Invalid form submission',
        });
    });
});
