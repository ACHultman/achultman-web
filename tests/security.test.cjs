/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const load = require('./helpers/load.cjs');
const { safeUrl } = load('src/utils/safeUrl.ts');

test('CMS URLs reject executable schemes, credentials, whitespace tricks and relative paths', () => {
    for (const url of [
        'javascript:alert(1)',
        'JaVaScRiPt:alert(1)',
        'java\nscript:alert(1)',
        'data:text/html,<script>',
        '//evil.test',
        '/api/v1/contact',
        'https://user:pass@example.com',
        '',
        null,
    ]) {
        assert.equal(safeUrl(url, true), undefined, String(url));
    }
    assert.equal(safeUrl('https://example.com/a'), 'https://example.com/a');
    assert.equal(safeUrl('http://example.com/a', true), 'http://example.com/a');
    assert.equal(
        safeUrl('mailto:hello@example.com', true),
        'mailto:hello@example.com'
    );
    assert.equal(safeUrl('mailto:hello@example.com'), undefined);
});

const { default: RenderBlocks } = load('src/components/RenderBlocks/index.tsx');
const rich = (plain_text, href = null) => ({
    type: 'text',
    plain_text,
    href,
    text: { content: plain_text, link: href ? { url: href } : null },
    annotations: { bold: true },
});
const block = (type, content, id = type) => ({
    object: 'block',
    id,
    type,
    [type]: content,
});

test('hostile Notion markup renders as inert text, including old shorthand-parser inputs', () => {
    const html = renderToStaticMarkup(
        React.createElement(RenderBlocks, {
            blocks: [
                block('paragraph', {
                    rich_text: [
                        rich('<script>alert(1)</script>'),
                        rich('[click](javascript:alert(1))'),
                        rich('hello](broken)'),
                        rich('unsafe', 'javascript:alert(1)'),
                        rich('safe', 'https://example.com'),
                    ],
                }),
                block('embed', {
                    url: 'data:text/html,<script>alert(1)</script>',
                }),
                block('image', { external: { url: 'javascript:alert(1)' } }),
                block(
                    'embed',
                    { url: 'https://example.com/embed' },
                    'safe-embed'
                ),
            ],
        })
    );
    assert.ok(html.includes('&lt;script&gt;'));
    assert.ok(html.includes('hello](broken)'));
    assert.ok(html.includes('<strong>safe</strong>'));
    assert.ok(html.includes('href="https://example.com/"'));
    assert.ok(!/<script|<iframe|<img|href="javascript:/.test(html));
});

test('Notion table headers and nested list structure have native semantics', () => {
    const html = renderToStaticMarkup(
        React.createElement(RenderBlocks, {
            blocks: [
                block('table', {
                    has_column_header: true,
                    has_row_header: true,
                    children: [
                        block(
                            'table_row',
                            { cells: [[rich('Name')], [rich('Value')]] },
                            'head'
                        ),
                        block(
                            'table_row',
                            { cells: [[rich('First')], [rich('42')]] },
                            'row'
                        ),
                    ],
                }),
                block(
                    'numbered_list_item',
                    {
                        rich_text: [rich('One')],
                        children: [
                            block('bulleted_list_item', {
                                rich_text: [rich('Nested')],
                            }),
                        ],
                    },
                    'one'
                ),
                block(
                    'numbered_list_item',
                    { rich_text: [rich('Two')] },
                    'two'
                ),
            ],
        })
    );
    assert.match(html, /<th scope="col">/);
    assert.match(html, /<th scope="row">/);
    assert.match(html, /<ol><li>.*<ul><li>.*<\/ul><\/li><li>/);
});

test('production rate limiting never bypasses missing or loopback identities and fails closed on timeout', async () => {
    const calls = [];
    let result = {
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 10000,
    };
    const { checkRateLimit } = load('src/lib/rate-limit.ts', {
        '@vercel/kv': { kv: {} },
        '@upstash/ratelimit': {
            Ratelimit: class {
                static slidingWindow() {
                    return {};
                }
                async limit(ip) {
                    calls.push(ip);
                    if (result instanceof Error) throw result;
                    return result;
                }
            },
        },
    });
    for (const ip of ['unknown', '127.0.0.1'])
        assert.equal((await checkRateLimit(ip, true)).status, 200);
    assert.deepEqual(calls, ['unknown', '127.0.0.1']);
    result = { ...result, success: false };
    const blocked = await checkRateLimit('visitor', true);
    assert.equal(blocked.status, 429);
    assert.ok(Number(blocked.headers['Retry-After']) >= 1);
    result = { ...result, success: true, reason: 'timeout' };
    assert.equal((await checkRateLimit('visitor', true)).status, 503);
    result = new Error('redis failed');
    assert.equal((await checkRateLimit('visitor', true)).status, 503);
});
