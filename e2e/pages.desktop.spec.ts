import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
    test('loads and shows key sections', async ({ page }) => {
        await page.goto('/');

        await expect(page).toHaveTitle('Adam Hultman | Software Engineer & AI');
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
            'content',
            'Vancouver software engineer building web products and AI features. Experience at Kopperfield and Assembly Digital, plus independent projects.'
        );

        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
            'href',
            'https://hultman.dev'
        );
        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
            'content',
            'Adam Hultman | Software Engineer & AI'
        );
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(
            'Software engineer building with AI'
        );

        // The same portfolio should make sense for roles and projects.
        await expect(
            page.getByRole('heading', {
                name: 'How I work',
            })
        ).toBeVisible();
        await expect(
            page.getByRole('heading', {
                name: "A few things I've worked on",
            })
        ).toBeVisible();
        await expect(
            page.getByRole('heading', {
                name: 'A little more about me',
            })
        ).toBeVisible();
        await expect(
            page.getByText(/Have a role in mind or something you want to build/)
        ).toBeVisible();
        await expect(page.getByLabel('Rough budget (optional)')).toHaveCount(0);

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
                    jobTitle: 'Software Engineer',
                }),
                expect.objectContaining({
                    '@type': 'WebSite',
                    name: 'Adam Hultman',
                }),
            ])
        );
        expect(schemas.some((schema) => schema['@type'] === 'Service')).toBe(
            false
        );
    });

    test('keeps the homepage focused on experience without old projects or sales tools', async ({
        page,
    }) => {
        await page.goto('/');
        await expect(page.getByLabel('People doing the work')).toHaveCount(0);
        await expect(page.locator('#calculator')).toHaveCount(0);
        await expect(
            page.locator('a[href="/workflow-automation-roi-calculator"]')
        ).toHaveCount(0);
        await expect(page.getByText(/Wanderlust/)).toHaveCount(0);
        await expect(page.getByText(/\$5,000/)).toHaveCount(0);
        const currentRole = page.locator('article').filter({
            has: page.getByRole('heading', {
                name: 'Kopperfield',
                exact: true,
            }),
        });
        await expect(currentRole).toContainText(
            'engineering quality and reliability'
        );
        await expect(currentRole).not.toContainText(
            /React|Node\.js|PostgreSQL|Django|GraphQL/
        );
        await expect(
            page.getByText(/Geny, a small internal tool/)
        ).toBeVisible();
    });

    test('submits a founder inquiry with campaign attribution', async ({
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
        await page
            .getByLabel(/^Your message/)
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
            budget: '',
            workflow:
                'Our operations team manually reconciles weekly project status across three systems.',
            attribution: {
                utmSource: 'linkedin',
                utmMedium: 'organic',
                utmCampaign: 'workflow-pilot',
            },
        });
    });
    test('accepts a recruiter message without project-specific fields', async ({
        page,
    }) => {
        let submitted: Record<string, unknown> | undefined;
        // The browser fulfils this request; no email handler is called.
        await page.route('**/api/v1/contact', async (route) => {
            submitted = route.request().postDataJSON();
            await route.fulfill({ status: 200, body: '{}' });
        });

        await page.goto('/');
        await page
            .getByRole('link', { name: 'Get in touch', exact: true })
            .first()
            .click();
        await expect(page).toHaveURL(/\/#contact$/);
        await page.getByLabel(/^Name/).fill('Morgan Lee');
        await page.getByLabel(/^Email/).fill('morgan@example.com');
        await page.getByLabel(/^Company/).fill('Example Recruiting');
        await page
            .getByLabel(/^Your message/)
            .fill(
                'We are hiring a software engineer to build AI features with a small product team.'
            );
        await page.getByRole('button', { name: 'Send it over' }).click();

        await expect(page.getByText('Got it, Morgan')).toBeVisible();
        expect(submitted).toMatchObject({
            company: 'Example Recruiting',
            budget: '',
            workflow:
                'We are hiring a software engineer to build AI features with a small product team.',
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

        await expect(page.getByRole('heading', { level: 1 })).toHaveText(
            'A bit about me'
        );

        await expect(page.getByText('Tools I use')).toBeVisible();

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
