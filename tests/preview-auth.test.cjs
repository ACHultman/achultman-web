const test = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/load.cjs');

test('preview authentication scopes the secret to one request and filters returned cookies by host', async () => {
    const calls = [];
    let disposed = false;
    const { previewAuthState } = load('scripts/preview-auth.cjs', {
        '@playwright/test': {
            request: {
                newContext: async () => ({
                    get: async (...args) => {
                        calls.push(args);
                        return { status: () => 307 };
                    },
                    storageState: async () => ({
                        cookies: [
                            {
                                name: 'auth',
                                value: 'test',
                                domain: 'preview.vercel.app',
                            },
                            {
                                name: 'bad',
                                value: 'test',
                                domain: '.vercel.app',
                            },
                        ],
                    }),
                    dispose: async () => {
                        disposed = true;
                    },
                }),
            },
        },
    });
    const result = await previewAuthState(
        'https://preview.vercel.app/tools',
        'test-secret'
    );
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], 'https://preview.vercel.app');
    assert.equal(calls[0][1].maxRedirects, 0);
    assert.equal(
        calls[0][1].headers['x-vercel-protection-bypass'],
        'test-secret'
    );
    assert.equal(result.cookies.length, 1);
    assert.equal(result.cookies[0].domain, 'preview.vercel.app');
    assert.ok(disposed);
});

test('public, insecure, or credential-bearing URLs never receive preview secrets', async () => {
    const { previewAuthState } = load('scripts/preview-auth.cjs', {
        '@playwright/test': {
            request: {
                newContext: async () => {
                    throw new Error('must not request');
                },
            },
        },
    });
    for (const url of [
        'https://hultman.dev',
        'http://preview.vercel.app',
        'https://preview.vercel.app.evil.example',
        'https://user@preview.vercel.app',
    ]) {
        assert.equal(
            (await previewAuthState(url, 'test-secret')).cookies.length,
            0
        );
    }
    assert.equal(
        (await previewAuthState('https://preview.vercel.app', undefined))
            .cookies.length,
        0
    );
});

test('rejected preview authentication fails closed and releases its context', async () => {
    let disposed = false;
    const { previewAuthState } = load('scripts/preview-auth.cjs', {
        '@playwright/test': {
            request: {
                newContext: async () => ({
                    get: async () => ({ status: () => 401 }),
                    dispose: async () => {
                        disposed = true;
                    },
                }),
            },
        },
    });
    await assert.rejects(
        previewAuthState('https://preview.vercel.app', 'test-secret'),
        /authentication was rejected/
    );
    assert.ok(disposed);
});
