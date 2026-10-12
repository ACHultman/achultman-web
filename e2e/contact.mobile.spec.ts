import { test, expect, type Page } from '@playwright/test';

async function fillMessage(page: Page) {
    await page.getByLabel(/^Name/).fill('Jordan Lee');
    await page.getByLabel(/^Email/).fill('jordan@example.com');
    await page
        .getByLabel(/^Message/)
        .fill('I would like to talk about a software engineering role.');
}

test('mobile menu closes with Escape and returns focus', async ({ page }) => {
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Open menu', exact: true });
    await menu.click();
    await expect(page.locator('#mobile-navigation a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(page.locator('#mobile-navigation')).toHaveCount(0);
    await menu.click();
    await page
        .locator('#mobile-navigation')
        .getByRole('link', { name: 'Get in touch' })
        .click();
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('#mobile-navigation')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'Let’s talk.'
    );
});

test('submits only the general-purpose contact fields', async ({ page }) => {
    let submitted: Record<string, unknown> | undefined;
    await page.route('**/api/v1/contact', async (route) => {
        submitted = route.request().postDataJSON();
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true }),
        });
    });
    await page.goto('/contact');
    await expect(page.getByLabel(/company|budget/i)).toHaveCount(0);
    await fillMessage(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('status')).toContainText(
        'Thanks. Your message has been sent.'
    );
    await expect(page.getByRole('status')).toBeFocused();
    expect(submitted).toEqual({
        name: 'Jordan Lee',
        email: 'jordan@example.com',
        message: 'I would like to talk about a software engineering role.',
        website: '',
    });
});

test('failed submission keeps the message visible and can be retried', async ({
    page,
}) => {
    let attempts = 0;
    await page.route('**/api/v1/contact', (route) => {
        attempts++;
        return route.fulfill({
            status: attempts === 1 ? 503 : 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: attempts > 1 }),
        });
    });
    await page.goto('/contact');
    await fillMessage(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('form').getByRole('alert')).toContainText(
        'Your text is still here.'
    );
    await expect(page.getByLabel(/^Email/)).toHaveValue('jordan@example.com');
    await expect(page.getByLabel(/^Message/)).toHaveValue(
        'I would like to talk about a software engineering role.'
    );
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('status')).toContainText(
        'Your message has been sent.'
    );
});

test('unconfirmed responses and network failures never show success', async ({
    page,
}) => {
    await page.route('**/api/v1/contact', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: '{}',
        })
    );
    await page.goto('/contact');
    await fillMessage(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('form').getByRole('alert')).toBeVisible();
    await page.unroute('**/api/v1/contact');
    await page.route('**/api/v1/contact', (route) => route.abort());
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('form').getByRole('alert')).toBeVisible();
    await expect(page.getByLabel(/^Name/)).toHaveValue('Jordan Lee');
    await expect(
        page.getByText('Thanks. Your message has been sent.')
    ).toHaveCount(0);
});

test('validates required fields before a request', async ({ page }) => {
    let requests = 0;
    await page.route('**/api/v1/contact', (route) => {
        requests++;
        return route.abort();
    });
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Enter your name.')).toBeVisible();
    await expect(page.getByText('Enter a valid email address.')).toBeVisible();
    await expect(page.getByText('Add a short message.')).toBeVisible();
    await expect(page.getByLabel(/^Name/)).toBeFocused();
    await expect(page.getByLabel(/^Name/)).toHaveAttribute(
        'aria-describedby',
        'contact-name-error'
    );
    await page.getByLabel(/^Name/).fill('Jordan Lee');
    await expect(page.getByLabel(/^Name/)).toHaveAttribute(
        'aria-invalid',
        'false'
    );
    await page.getByLabel(/^Email/).fill('invalid-email');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByLabel(/^Email/)).toBeFocused();
    await expect(page.getByLabel(/^Email/)).toHaveAttribute(
        'aria-invalid',
        'true'
    );
    expect(requests).toBe(0);
});

test('one pending submission cannot send duplicate messages', async ({
    page,
}) => {
    let requests = 0;
    let complete!: () => void;
    const pending = new Promise<void>((resolve) => {
        complete = resolve;
    });
    await page.route('**/api/v1/contact', async (route) => {
        requests++;
        await pending;
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true }),
        });
    });
    await page.goto('/contact');
    await fillMessage(page);
    await page.locator('form').evaluate((form: HTMLFormElement) => {
        form.requestSubmit();
        form.requestSubmit();
    });
    await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    await expect.poll(() => requests).toBe(1);
    complete();
    await expect(page.getByRole('status')).toContainText(
        'Your message has been sent.'
    );
    expect(requests).toBe(1);
});
