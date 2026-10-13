import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';

test.describe.configure({ mode: 'parallel' });

const routes = [
    '/',
    '/work',
    '/work/property-intelligence',
    '/work/parallax-studio',
    '/work/earbud',
    '/about',
    '/contact',
    '/consulting',
    '/blog',
    '/blog/ai-assisted-development-at-kopperfield',
    '/books',
    '/bookmarks',
    '/resume',
    '/privacy',
    '/workflow-automation-roi-calculator',
    '/404',
    '/tools',
    ...readdirSync('src/pages/tools')
        .filter((name) => name !== 'index.tsx')
        .map((name) => `/tools/${name.replace('.tsx', '')}`),
];

for (const mode of ['light', 'dark']) {
    for (const route of routes) {
        test(`${mode}: ${route} meets automated WCAG 2.2 AA rules`, async ({
            page,
        }) => {
            test.setTimeout(60000);
            await page.addInitScript(
                (value) => localStorage.setItem('chakra-ui-color-mode', value),
                mode
            );
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(route);
            await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
            // Allow entrance fades to finish before measuring rendered contrast.
            await page.waitForTimeout(2000);
            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
                .analyze();
            expect(results.violations).toEqual([]);
        });
    }
}

test('tool controls and bookmark filters work from the keyboard', async ({
    page,
}) => {
    await page.goto('/tools/step-sequencer');
    const cell = page.getByRole('button', {
        name: 'Kick, step 1',
        exact: true,
    });
    await cell.focus();
    const pressed = await cell.getAttribute('aria-pressed');
    await page.keyboard.press('Space');
    await expect(cell).toHaveAttribute(
        'aria-pressed',
        pressed === 'true' ? 'false' : 'true'
    );
    await page.goto('/tools/regex-tester');
    await page.getByRole('button', { name: 'Test pattern' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('1 match.');
    await page.goto('/bookmarks');
    const all = page.getByRole('button', { name: 'All', exact: true });
    await all.focus();
    await page.keyboard.press('Space');
    await expect(all).toHaveAttribute('aria-pressed', 'true');
    await page.goto('/tools/neural-network');
    await page.getByRole('button', { name: 'Add class 0' }).focus();
    await page.keyboard.press('Enter');
    await expect(
        page.getByRole('status', { name: 'Custom training points' })
    ).toContainText('1 custom points');
});

for (const mode of ['light', 'dark']) {
    for (const route of ['compression', 'regex-tester', 'step-sequencer']) {
        test(`${mode}: interactive ${route} states remain accessible`, async ({
            page,
        }) => {
            test.setTimeout(120000);
            await page.addInitScript(
                (value) => localStorage.setItem('chakra-ui-color-mode', value),
                mode
            );
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(`/tools/${route}`);
            const scan = async () => {
                await page.waitForTimeout(700);
                const results = await new AxeBuilder({ page })
                    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
                    .analyze();
                expect(results.violations).toEqual([]);
            };
            if (route === 'compression') {
                await page
                    .getByRole('button', {
                        name: 'Run-Length Encoding',
                        exact: true,
                    })
                    .click();
                await scan();
                await page
                    .getByRole('button', {
                        name: 'Huffman Coding',
                        exact: true,
                    })
                    .click();
                const next = page.getByRole('button', {
                    name: 'Next step',
                    exact: true,
                });
                for (let i = 0; i < 100 && (await next.isEnabled()); i++)
                    await next.click();
                await expect(next).toBeDisabled();
                await scan();
                await page.getByRole('button', { name: /^Custom/ }).click();
                await page
                    .getByLabel('Text to compress')
                    .fill('Accessible input');
            } else if (route === 'regex-tester') {
                await page
                    .getByRole('button', { name: 'Test pattern' })
                    .click();
                await expect(page.getByRole('status')).toHaveText('1 match.');
                await scan();
                await page.getByLabel('Pattern', { exact: true }).fill('[');
                await page
                    .getByRole('button', { name: 'Test pattern' })
                    .click();
                await expect(
                    page.locator('.regex-tool').getByRole('alert')
                ).toBeVisible();
            } else {
                await page
                    .getByRole('button', { name: 'Kick, step 1', exact: true })
                    .click();
            }
            await scan();
        });
    }
    for (const route of [
        '/',
        '/work',
        '/contact',
        '/blog',
        '/blog/ai-assisted-development-at-kopperfield',
        '/tools',
    ]) {
        test(`${mode}: mobile ${route} remains accessible`, async ({
            page,
        }) => {
            test.setTimeout(60000);
            await page.setViewportSize({ width: 390, height: 844 });
            await page.addInitScript(
                (value) => localStorage.setItem('chakra-ui-color-mode', value),
                mode
            );
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(route);
            await page.waitForTimeout(2000);
            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
                .analyze();
            expect(results.violations).toEqual([]);
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth + 1
                )
            ).toBe(true);
        });
    }
}
