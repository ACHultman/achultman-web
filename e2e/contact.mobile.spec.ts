import { test, expect, type Page } from '@playwright/test';

async function fillInquiry(page: Page) {
    await page.getByLabel(/^Name/).fill('Jordan Lee');
    await page.getByLabel(/^Email/).fill('jordan@example.com');
    await page.getByLabel(/^Company/).fill('Example Operations');
    await page
        .getByLabel(/^What are you trying to make or improve/)
        .fill('We need an internal tool to reconcile weekly project status.');
}

test.describe('Mobile contact feedback', () => {
    test('shows the next step after a successful inquiry without a budget', async ({
        page,
    }) => {
        let submitted: Record<string, unknown> | undefined;
        // Fulfil in the browser so this test cannot reach the email handler.
        await page.route('**/api/v1/contact', async (route) => {
            submitted = route.request().postDataJSON();
            await route.fulfill({ status: 200, body: '{}' });
        });

        await page.goto('/#contact');
        await fillInquiry(page);
        await page.getByRole('button', { name: 'Send it over' }).click();

        await expect(page.getByText('Got it, Jordan')).toBeVisible();
        await expect(
            page.getByText(
                "I'll read through this and get back to you within one business day."
            )
        ).toBeVisible();
        expect(submitted).toMatchObject({ budget: '' });
    });

    test('shows recovery instructions and retains the inquiry on retry', async ({
        page,
    }) => {
        // Fulfil in the browser so this test cannot reach the email handler.
        await page.route('**/api/v1/contact', (route) =>
            route.fulfill({ status: 503, body: '{}' })
        );

        await page.goto('/#contact');
        await fillInquiry(page);
        await page.getByRole('button', { name: 'Send it over' }).click();

        await expect(page.getByText("That didn't go through")).toBeVisible();
        await expect(
            page.getByText('Sorry, Jordan. Try again or copy my email address.')
        ).toBeVisible();
        await page.getByRole('button', { name: 'Try again' }).click();
        await expect(page.getByLabel(/^Email/)).toHaveValue(
            'jordan@example.com'
        );
        await expect(
            page.getByLabel(/^What are you trying to make or improve/)
        ).toHaveValue(
            'We need an internal tool to reconcile weekly project status.'
        );
    });
});
