import { expect, test } from '@playwright/test';

test('neural training starts, pauses, and resets when a keyboard-selected preset changes', async ({
    page,
}) => {
    await page.goto('/labs/neural-net');
    const counter = page.getByLabel('Training steps', { exact: true });
    await page.getByRole('button', { name: 'Train', exact: true }).click();
    await expect(counter).not.toHaveText('0');
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    const stopped = await counter.textContent();
    await page.waitForTimeout(150);
    await expect(counter).toHaveText(stopped!);
    const preset = page.getByRole('button', { name: /Circle Classifier/ });
    await preset.focus();
    await page.keyboard.press('Enter');
    await expect(counter).toHaveText('0');
    await expect(
        page.getByRole('button', { name: 'Train', exact: true })
    ).toBeVisible();
    const gradients = page.getByRole('button', { name: 'Show Gradients' });
    await gradients.focus();
    await page.keyboard.press('Space');
    await expect(
        page.getByRole('button', { name: 'Gradients ON' })
    ).toHaveAttribute('aria-pressed', 'true');
});

test('compression preserves emoji through the final Huffman step', async ({
    page,
}) => {
    await page.goto('/labs/compression');
    await page
        .getByRole('button', { name: /Custom Enter your own text/ })
        .click();
    await page.getByLabel('Text to compress').fill('é🧠é');
    const next = page.getByRole('button', { name: 'Next step', exact: true });
    for (let step = 0; step < 20 && (await next.isEnabled()); step++)
        await next.click();
    await expect(next).toBeDisabled();
    await expect(
        page.getByText('Compression Complete', { exact: true })
    ).toBeVisible();
    await expect(page.getByText(/Original: 64 bits/)).toBeVisible();
});

test('shader pause freezes the displayed clock and resume continues it', async ({
    page,
}) => {
    await page.goto('/labs/shader-playground');
    const clock = page.getByLabel('Shader time', { exact: true });
    await expect(clock).not.toHaveText('0.00s', { timeout: 15000 });
    await page
        .getByRole('button', { name: 'Pause', exact: true })
        .first()
        .click();
    // Display statistics are published once per second by the renderer.
    await page.waitForTimeout(1100);
    const paused = await clock.textContent();
    await page.waitForTimeout(1100);
    await expect(clock).toHaveText(paused!);
    await page
        .getByRole('button', { name: 'Resume', exact: true })
        .first()
        .click();
    await expect(clock).not.toHaveText(paused!);
});
