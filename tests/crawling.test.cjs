const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
    unstable_getResponseFromNextConfig,
} = require('next/experimental/testing/server');
const load = require('./helpers/load.cjs');
const nextConfig = load('next.config.ts');

const responseFor = (path) =>
    unstable_getResponseFromNextConfig({
        url: `https://hultman.dev${path}`,
        nextConfig,
    });

test('page normalization preserves query parameters and does not loop', async () => {
    for (const path of ['/tools', '/blog', '/blog/a-post', '/about']) {
        const response = await responseFor(`${path}/?ref=a%26b`);
        assert.equal(response.status, 308);
        assert.equal(
            response.headers.get('location'),
            `https://hultman.dev${path}?ref=a%26b`
        );
        assert.equal((await responseFor(path)).headers.get('location'), null);
    }
    assert.equal((await responseFor('/')).headers.get('location'), null);
});

test('normalization leaves API, framework, well-known, and analytics paths intact', async () => {
    for (const path of [
        '/api/v1/blog/',
        '/api/',
        '/_next/static/chunk.js/',
        '/.well-known/example/',
        '/ingest/',
        '/ingest/e/',
        '/ingest/static/array.js',
    ]) {
        const response = await responseFor(path);
        assert.equal(response.headers.get('location'), null, path);
        if (path.startsWith('/ingest/')) {
            const rewrite = new URL(
                response.headers.get('x-middleware-rewrite')
            );
            assert.equal(
                rewrite.hostname,
                path.startsWith('/ingest/static/')
                    ? 'us-assets.i.posthog.com'
                    : 'us.i.posthog.com'
            );
        }
    }
});

test('legacy paths reach their replacement in one redirect even with a trailing slash', async () => {
    for (const [source, destination] of [
        ['/labs/', '/tools'],
        ['/labs/sort-arena/', '/tools/sorting'],
        ['/security.txt/', '/.well-known/security.txt'],
    ]) {
        const response = await responseFor(source);
        assert.equal(response.status, 308);
        assert.equal(
            response.headers.get('location'),
            `https://hultman.dev${destination}`
        );
    }
});

test('page redirects cannot turn encoded paths or query parameters into an external destination', async () => {
    for (const path of [
        '/%2fevil.test/',
        '/%5cevil.test/',
        '/about/?path=//evil.test',
    ]) {
        const response = await responseFor(path);
        assert.equal(
            new URL(response.headers.get('location')).origin,
            'https://hultman.dev'
        );
    }
});

test('versioned API responses are excluded from indexing without blocking social images or pages', async () => {
    for (const path of [
        '/api/v1/blog',
        '/api/v1/post/unknown',
        '/api/v1/contact',
    ]) {
        assert.equal(
            (await responseFor(path)).headers.get('x-robots-tag'),
            'noindex'
        );
    }
    for (const path of ['/api/og?title=About', '/about', '/robots.txt']) {
        assert.equal(
            (await responseFor(path)).headers.get('x-robots-tag'),
            null
        );
    }
});
