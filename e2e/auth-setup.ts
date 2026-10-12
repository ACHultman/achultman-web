import type { FullConfig } from '@playwright/test';
import { writeFile, unlink } from 'node:fs/promises';
import { previewAuthState } from '../scripts/preview-auth.cjs';

export default async function setup(config: FullConfig) {
    const use = config.projects[0]?.use;
    if (
        !process.env.VERCEL_AUTOMATION_BYPASS_SECRET ||
        typeof use?.storageState !== 'string'
    )
        return;
    const state = await previewAuthState(
        use.baseURL,
        process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    );
    await writeFile(use.storageState, JSON.stringify(state), { mode: 0o600 });
    return () => unlink(use.storageState as string);
}
