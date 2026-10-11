import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';

test.describe.configure({ mode: 'parallel' });

const routes = [
    '/',
    '/work',
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
    '/labs',
    ...readdirSync('src/pages/labs')
        .filter((name) => name !== 'index.tsx')
        .map((name) => `/labs/${name.replace('.tsx', '')}`),
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

test('lab inspection controls and bookmark filters work from the keyboard', async ({
    page,
}) => {
    await page.goto('/labs/ast-explorer');
    const node = page
        .getByRole('button', { name: /VariableDeclaration/ })
        .first();
    await node.focus();
    await page.keyboard.press('Enter');
    await expect(node).toHaveAttribute('aria-pressed', 'true');
    await page.goto('/labs/regex-debugger');
    const step = page.getByRole('button', { name: /^#2\s/ });
    await step.focus();
    await page.keyboard.press('Enter');
    await expect(step).toHaveAttribute('aria-pressed', 'true');
    await page.goto('/bookmarks');
    const all = page.getByRole('button', { name: 'All', exact: true });
    await all.focus();
    await page.keyboard.press('Space');
    await expect(all).toHaveAttribute('aria-pressed', 'true');
    await page.goto('/labs/evidence-viz');
    await page.getByLabel('Inspect a supplement').selectOption({ index: 1 });
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await page.goto('/labs/neural-net');
    await page.getByRole('button', { name: 'Add class 0' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toContainText('1 custom points');
});

for (const mode of ['light', 'dark']) {
    for (const route of [
        'compression',
        'exploit-viz',
        'regex-debugger',
        'evidence-viz',
    ]) {
        test(`${mode}: interactive ${route} states remain accessible`, async ({
            page,
        }) => {
            test.setTimeout(120000);
            await page.addInitScript(
                (value) => localStorage.setItem('chakra-ui-color-mode', value),
                mode
            );
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(`/labs/${route}`);
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
            } else if (route === 'exploit-viz') {
                const next = page.getByRole('button', {
                    name: 'Next step',
                    exact: true,
                });
                for (let i = 0; i < 100 && (await next.isEnabled()); i++)
                    await next.click();
                await expect(next).toBeDisabled();
            } else if (route === 'regex-debugger') {
                await page
                    .getByRole('button', { name: 'Go to end', exact: true })
                    .click();
            } else {
                await page
                    .getByLabel('Inspect a supplement')
                    .selectOption({ index: 1 });
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
        '/labs',
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
