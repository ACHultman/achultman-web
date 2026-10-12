const test = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/load.cjs');
const enabled = {
    window: {},
    process: {
        env: { NEXT_PUBLIC_POSTHOG_KEY: 'test-only', NODE_ENV: 'production' },
    },
};

test('concurrent analytics calls share one initialization and preserve event properties', async () => {
    const calls = [];
    const analytics = load(
        'src/lib/analytics.ts',
        {
            'posthog-js': {
                init: (key, options) => calls.push(['init', key, options]),
                capture: (event, properties) => calls.push([event, properties]),
            },
        },
        enabled
    );
    const first = analytics.getAnalytics();
    analytics.captureEvent('bookmark_clicked', {
        bookmark_tags: ['code', 'design'],
    });
    assert.equal(analytics.getAnalytics(), first);
    await first;
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(calls.filter(([name]) => name === 'init').length, 1);
    assert.equal(calls[0][2].disable_session_recording, true);
    assert.equal(calls[0][2].autocapture, false);
    assert.deepEqual(calls[1], [
        'bookmark_clicked',
        { bookmark_tags: ['code', 'design'] },
    ]);
});

test('unconfigured or server-side analytics does not initialize a client', async () => {
    let calls = 0;
    const sdk = {
        'posthog-js': {
            init: () => {
                calls++;
            },
        },
    };
    assert.equal(await load('src/lib/analytics.ts', sdk).getAnalytics(), null);
    assert.equal(
        await load('src/lib/analytics.ts', sdk, {
            process: enabled.process,
        }).getAnalytics(),
        null
    );
    assert.equal(calls, 0);
});

test('analytics initialization or capture failures cannot reject an application action', async () => {
    const unavailable = load(
        'src/lib/analytics.ts',
        {
            'posthog-js': {
                init: () => {
                    throw new Error('blocked');
                },
            },
        },
        enabled
    );
    assert.equal(await unavailable.getAnalytics(), null);
    unavailable.captureClientException(new Error('original'));
    const faulty = load(
        'src/lib/analytics.ts',
        {
            'posthog-js': {
                init() {},
                capture() {
                    throw new Error('failed');
                },
            },
        },
        enabled
    );
    faulty.captureEvent('test');
    await new Promise((resolve) => setImmediate(resolve));
});
