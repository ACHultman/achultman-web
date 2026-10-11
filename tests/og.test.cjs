const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/load.cjs');

test('Node OpenGraph route returns PNG bytes, bounds titles, and handles HEAD and unsupported methods', async () => {
    let renderedTitle;
    let renders = 0;
    const { default: handler } = load(
        'src/pages/api/og.tsx',
        {
            'next/og': {
                ImageResponse: class {
                    constructor(element) {
                        renderedTitle =
                            element.props.children[1].props.children[1].props
                                .children;
                    }
                    async arrayBuffer() {
                        renders++;
                        return Uint8Array.from([137, 80, 78, 71]).buffer;
                    }
                },
            },
        },
        { Buffer }
    );
    const response = () => ({
        headers: {},
        code: 0,
        body: undefined,
        setHeader(name, value) {
            this.headers[name] = value;
        },
        status(code) {
            this.code = code;
            return this;
        },
        end() {},
        send(body) {
            this.body = body;
        },
    });
    const get = response();
    await handler({ method: 'GET', query: { title: 'x'.repeat(200) } }, get);
    assert.equal(get.code, 200);
    assert.equal(get.headers['Content-Type'], 'image/png');
    assert.equal(renderedTitle.length, 110);
    assert.deepEqual([...get.body], [137, 80, 78, 71]);
    const head = response();
    await handler({ method: 'HEAD', query: {} }, head);
    assert.equal(head.code, 200);
    assert.equal(renders, 1);
    const post = response();
    await handler({ method: 'POST', query: {} }, post);
    assert.equal(post.code, 405);
    assert.equal(post.headers.Allow, 'GET, HEAD');
});
