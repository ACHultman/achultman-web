import { test, expect } from '@playwright/test';

test.describe('Labs index page', () => {
    test('loads and shows experiment cards', async ({ page }) => {
        await page.goto('/labs');

        await expect(
            page.getByRole('heading', { level: 1 })
        ).toContainText('Labs');

        // Should show experiment cards
        await expect(page.getByText('Interaction Checker')).toBeVisible();
        await expect(page.getByText('Token Probability Visualizer')).toBeVisible();
        await expect(page.getByText('BeatMaker')).toBeVisible();
    });
});

test.describe('Labs experiments load without errors', () => {
    const experiments = [
        { path: '/labs/interaction-checker', heading: 'Interaction Checker' },
        { path: '/labs/token-viz', heading: 'Token' },
        { path: '/labs/prompt-duel', heading: 'Prompt Duel' },
        { path: '/labs/agent-flow', heading: 'Agent' },
        { path: '/labs/evidence-viz', heading: 'Evidence' },
        { path: '/labs/beatmaker', heading: 'BeatMaker' },
    ];

    for (const { path, heading } of experiments) {
        test(`${path} loads successfully`, async ({ page }) => {
            const errors: string[] = [];
            page.on('pageerror', (err) => errors.push(err.message));

            await page.goto(path);

            // Page heading should be visible
            await expect(
                page.getByRole('heading', { level: 1 })
            ).toContainText(heading);

            // No uncaught JS errors
            expect(errors).toHaveLength(0);
        });
    }
});
