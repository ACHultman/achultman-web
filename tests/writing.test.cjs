const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, dependencies) {
    const testModule = { exports: {} };
    const code = ts.transpileModule(readFileSync(file, 'utf8'), {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2020,
            esModuleInterop: true,
            jsx: ts.JsxEmit.ReactJSX,
        },
    }).outputText;
    vm.runInNewContext(code, {
        module: testModule,
        exports: testModule.exports,
        console: { error() {} },
        process: { env: {} },
        require: (name) => dependencies[name] ?? require(name),
    });
    return testModule.exports;
}
const published = require('../src/data/published-writing/ai-assisted-development-at-kopperfield.json');
const { estimateReadingTime } = load('src/utils/readingTime.ts', {});
const { isNotionId } = load('src/utils/slug.ts', {});
function service({ configured = false, client = {}, settings = {} } = {}) {
    client = {
        ...client,
        databases: {
            retrieve: async () => ({ data_sources: [{ id: 'test-source' }] }),
            ...client.databases,
        },
    };
    return load('src/services/notion.ts', {
        '@notionhq/client': {
            Client: function () {
                return client;
            },
        },
        '../config': {
            serverConfig: {
                ...(configured
                    ? {
                          NOTION_API_KEY: 'test-only',
                          NOTION_DATABASE_ID_BLOG: 'test-db',
                      }
                    : {}),
                ...settings,
            },
        },
        '../types/notion': {},
        '../utils/notion': {
            pageIsPageObjectResponse: (value) => value.object === 'page',
            isBlockObjectResponse: (value) =>
                value.object === 'block' && !!value.type,
            getTitle: () => 'Published note',
            getDateField: (page) => (page.unpublished ? null : '2026-01-01'),
            getCover: () => null,
            getRichText: () => '',
            getTags: () => [],
        },
        '../utils/slug': { slugify: () => 'published-note' },
        '../utils/readingTime': { estimateReadingTime },
        './publishedWriting': { publishedWriting: [published] },
    });
}

test('unconfigured previews use published text and resolve legacy compact IDs', async () => {
    const api = service();
    const posts = await api.fetchBlogPostsWithReadingTime();
    assert.equal(posts[0].slug, published.page.slug);
    assert.equal(posts[0].readingTime, 9);
    const post = await api.fetchNotion(
        'blog',
        published.page.id.replace(/-/g, '')
    );
    assert.equal(post.blocks.results.length, 60);
    assert.equal(await api.fetchNotion('blog', 'unknown'), null);
});

test('an empty configured Notion collection does not resurrect snapshot posts', async () => {
    const api = service({
        configured: true,
        client: { dataSources: { query: async () => ({ results: [] }) } },
    });
    assert.equal((await api.fetchNotions('blog')).length, 0);
});

test('production requires Notion unless a standalone preview is explicitly requested', async () => {
    const api = service({ settings: { NODE_ENV: 'production' } });
    await assert.rejects(api.fetchNotions('blog'), /Notion is required/);
    await assert.rejects(
        api.fetchNotion('blog', published.page.id),
        /Notion is required/
    );
    const preview = service({
        settings: { NODE_ENV: 'production', NOTION_PREVIEW_MODE: true },
    });
    assert.equal((await preview.fetchNotions('blog')).length, 1);
    const partial = service({ settings: { NOTION_API_KEY: 'test-only' } });
    await assert.rejects(partial.fetchNotions('blog'), /Both NOTION/);
});

test('Notion remains authoritative after an edit and across every database page', async () => {
    const queries = [];
    let edition = 1;
    const api = service({
        configured: true,
        client: {
            dataSources: {
                query: async (query) => {
                    queries.push(query);
                    return {
                        results: [
                            {
                                object: 'page',
                                id: query.start_cursor
                                    ? `older-${edition}`
                                    : `latest-${edition}`,
                                properties: {},
                            },
                        ],
                        has_more: !query.start_cursor,
                        next_cursor: query.start_cursor ? null : 'next-page',
                    };
                },
            },
        },
    });
    const posts = await api.fetchNotions('blog', { page_size: 100, all: true });
    assert.deepEqual(
        Array.from(posts, (p) => p.id),
        ['latest-1', 'older-1']
    );
    assert.equal(queries[1].start_cursor, 'next-page');
    assert.equal(queries[1].filter.property, 'Published');
    assert.equal(queries[1].filter.date.is_not_empty, true);
    edition = 2;
    assert.equal((await api.fetchNotions('blog'))[0].id, 'latest-2');
});

test('CMS outages propagate instead of becoming empty archives or missing articles', async () => {
    const outage = new Error('Notion timeout');
    const api = service({
        configured: true,
        client: {
            dataSources: {
                query: async () => {
                    throw outage;
                },
            },
            pages: {
                retrieve: async () => {
                    throw outage;
                },
            },
        },
    });
    await assert.rejects(api.fetchNotions('blog'), /Notion timeout/);
    await assert.rejects(
        api.fetchNotion('blog', published.page.id),
        /Notion timeout/
    );
    const inaccessible = service({
        configured: true,
        client: {
            pages: {
                retrieve: async () => {
                    throw { code: 'object_not_found' };
                },
            },
        },
    });
    await assert.rejects(inaccessible.fetchNotion('blog', published.page.id));
});

test('formatted Notion titles and descriptions keep every rich-text segment', () => {
    const { getTitle, getRichText } = load('src/utils/notion.ts', {
        './safeUrl': load('src/utils/safeUrl.ts', {}),
    });
    const page = {
        properties: {
            Title: {
                type: 'title',
                title: [
                    { plain_text: 'Hand-written ' },
                    { plain_text: 'article' },
                ],
            },
            Description: {
                type: 'rich_text',
                rich_text: [
                    { plain_text: 'First ' },
                    { plain_text: 'and second.' },
                ],
            },
        },
    };
    assert.equal(getTitle(page), 'Hand-written article');
    assert.equal(getRichText(page, 'Description'), 'First and second.');
});

const { getBaseUrl } = load('src/utils/baseUrl.ts', {});
const { escapeXml } = load('src/utils/xml.ts', {});

test('syntax highlighting escapes code as text and leaves unsupported languages readable', () => {
    const { highlightCode } = load('src/utils/highlightCode.ts', {});
    const html = highlightCode(
        'const html = "<img src=x onerror=alert(1)>";',
        'javascript'
    );
    assert.ok(html.includes('token keyword'));
    assert.ok(html.includes('&lt;img'));
    assert.ok(!html.includes('<img'));
    assert.equal(highlightCode('flowchart LR; A --> B', 'mermaid'), null);
});

test('article ISR keeps failures distinct from genuine 404s and legacy redirects', async () => {
    let mode = 'published';
    const { getStaticProps } = load('src/pages/blog/[slug].tsx', {
        '../../components/RenderBlocks': {},
        '../../components/BlogPostingJsonLd': {},
        '../../components/BreadcrumbJsonLd': {},
        '../../components/ArticleList': {},
        '../../services/notion': {
            fetchNotions: async () => {
                if (mode === 'listing-outage')
                    throw new Error('Notion listing timeout');
                return mode === 'unpublished' ? [] : [published.page];
            },
            fetchNotion: async () => {
                if (mode === 'body-outage')
                    throw new Error('Notion body timeout');
                return mode === 'blank-description'
                    ? {
                          ...published,
                          page: { ...published.page, description: '' },
                      }
                    : published;
            },
        },
        '../../utils/readingTime': { estimateReadingTime },
        '../../utils/baseUrl': { getBaseUrl },
        '../../utils/date': {},
        '../../utils/slug': { isNotionId },
        '../../utils/relatedPosts': { getRelatedPosts: () => [] },
    });
    const request = { params: { slug: published.page.slug } };
    const page = await getStaticProps(request);
    assert.equal(
        page.props.seo.canonical,
        `https://hultman.dev/blog/${published.page.slug}`
    );
    assert.equal(
        page.props.seo.openGraph.article.authors[0],
        'https://hultman.dev/about'
    );
    const redirect = await getStaticProps({
        params: { slug: published.page.id.replace(/-/g, '') },
    });
    assert.equal(redirect.redirect.destination, `/blog/${published.page.slug}`);
    assert.equal(redirect.redirect.permanent, true);
    mode = 'blank-description';
    assert.ok((await getStaticProps(request)).props.seo.description);
    mode = 'listing-outage';
    await assert.rejects(getStaticProps(request), /Notion listing timeout/);
    mode = 'body-outage';
    await assert.rejects(getStaticProps(request), /Notion body timeout/);
    mode = 'unpublished';
    assert.equal((await getStaticProps(request)).notFound, true);
});

test('sitemap and RSS expose the full collection, valid XML, and retryable failures', async () => {
    for (const file of [
        'src/pages/feed.xml.tsx',
        'src/pages/sitemap.xml.tsx',
    ]) {
        for (const failed of [false, true]) {
            let options;
            const { getServerSideProps } = load(file, {
                '../services/notion': {
                    fetchNotions: async (_db, opts) => {
                        options = opts;
                        if (failed) throw new Error('Notion timeout');
                        return [
                            {
                                ...published.page,
                                title: 'React & TypeScript',
                                slug: 'react&type',
                            },
                        ];
                    },
                },
                '../utils/baseUrl': { getBaseUrl },
                '../utils/xml': { escapeXml },
                '../data/labPages': load('src/data/labPages.ts', {}),
            });
            const res = response();
            res.write = (body) => {
                res.body = body;
            };
            res.end = () => {};
            await getServerSideProps({ res });
            assert.equal(options.all, true);
            if (failed) {
                assert.equal(res.statusCode, 503);
                assert.equal(res.headers['Cache-Control'], 'no-store');
                assert.equal(res.headers['Retry-After'], '60');
            } else {
                assert.ok(res.body.includes('/blog/react&amp;type'));
                assert.ok(!res.body.includes('localhost'));
            }
        }
    }
});

test('published articles retain paginated blocks and nested table rows', async () => {
    const calls = [];
    const api = service({
        configured: true,
        client: {
            pages: {
                retrieve: async () => ({
                    object: 'page',
                    id: 'published',
                    parent: {
                        type: 'data_source_id',
                        data_source_id: 'test-source',
                    },
                    properties: {},
                }),
            },
            blocks: {
                children: {
                    list: async (query) => {
                        calls.push(query);
                        const results =
                            query.block_id === 'table'
                                ? [
                                      {
                                          object: 'block',
                                          id: 'row',
                                          type: 'table_row',
                                          has_children: false,
                                          table_row: { cells: [] },
                                      },
                                  ]
                                : query.start_cursor
                                  ? [
                                        {
                                            object: 'block',
                                            id: 'last',
                                            type: 'paragraph',
                                            has_children: false,
                                            paragraph: { rich_text: [] },
                                        },
                                    ]
                                  : [
                                        {
                                            object: 'block',
                                            id: 'table',
                                            type: 'table',
                                            has_children: true,
                                            table: { table_width: 3 },
                                        },
                                    ];
                        return {
                            results,
                            next_cursor:
                                query.block_id === 'published' &&
                                !query.start_cursor
                                    ? 'next'
                                    : null,
                        };
                    },
                },
            },
        },
    });
    const post = await api.fetchNotion('blog', 'published');
    assert.equal(post.blocks.results.length, 2);
    assert.equal(post.blocks.results[0].table.children[0].id, 'row');
    assert.equal(calls.length, 3);
});

function response() {
    return {
        code: 0,
        headers: {},
        setHeader(key, value) {
            this.headers[key] = value;
        },
        status(code) {
            this.code = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        },
    };
}
test('the public post API cannot retrieve a draft by guessing its ID', async () => {
    let fetched = false;
    const { default: handler } = load('src/pages/api/v1/post/[id].ts', {
        '../../../../services/notion': {
            fetchNotions: async () => [],
            fetchNotion: async () => {
                fetched = true;
            },
        },
        '../../../../utils/slug': { isNotionId },
    });
    const res = response();
    await handler(
        {
            method: 'GET',
            query: { id: '00000000-0000-4000-8000-000000000000' },
        },
        res
    );
    assert.equal(res.code, 404);
    assert.equal(fetched, false);
    assert.equal(res.headers['Cache-Control'], 'no-store');
});

test('the public post API preserves the published response shape', async () => {
    const { default: handler } = load('src/pages/api/v1/post/[id].ts', {
        '../../../../services/notion': {
            fetchNotions: async () => [published.page],
            fetchNotion: async () => published,
        },
        '../../../../utils/slug': { isNotionId },
    });
    const res = response();
    await handler(
        { method: 'GET', query: { id: published.page.id.replace(/-/g, '') } },
        res
    );
    assert.equal(res.code, 200);
    assert.equal(res.body.page.title, published.page.title);
    assert.equal(res.body.page.coverImage, null);
    assert.equal(res.body.blocks.results.length, 60);
});

test('the Notion service refuses foreign, archived, trashed, and unpublished pages before reading blocks', async () => {
    for (const overrides of [
        {
            parent: {
                type: 'data_source_id',
                data_source_id: 'private-source',
            },
        },
        { parent: { type: 'page_id', page_id: 'private-page' } },
        { archived: true },
        { in_trash: true },
        { unpublished: true },
    ]) {
        let reads = 0;
        const api = service({
            configured: true,
            client: {
                pages: {
                    retrieve: async () => ({
                        object: 'page',
                        id: 'post',
                        properties: {},
                        parent: {
                            type: 'data_source_id',
                            data_source_id: 'test-source',
                        },
                        ...overrides,
                    }),
                },
                blocks: {
                    children: {
                        list: async () => {
                            reads++;
                            return { results: [] };
                        },
                    },
                },
            },
        });
        assert.equal(await api.fetchNotion('blog', 'post'), null);
        assert.equal(reads, 0);
    }
});

test('a wide nested Notion document cannot exceed the shared request budget', async () => {
    let requests = 0;
    const api = service({
        configured: true,
        client: {
            pages: {
                retrieve: async () => ({
                    object: 'page',
                    id: 'post',
                    properties: {},
                    parent: {
                        type: 'data_source_id',
                        data_source_id: 'test-source',
                    },
                }),
            },
            blocks: {
                children: {
                    list: async ({ block_id }) => {
                        requests++;
                        return {
                            results:
                                block_id === 'post'
                                    ? Array.from({ length: 100 }, (_, i) => ({
                                          object: 'block',
                                          id: `child-${i}`,
                                          type: 'paragraph',
                                          has_children: true,
                                          paragraph: { rich_text: [] },
                                      }))
                                    : [],
                        };
                    },
                },
            },
        },
    });
    await assert.rejects(api.fetchNotion('blog', 'post'), /request limit/);
    assert.ok(requests <= 50);
});

test('Notion resolves the configured database to a data source and queries that source', async () => {
    const queries = [];
    const api = service({
        configured: true,
        client: {
            dataSources: {
                query: async (query) => {
                    queries.push(query);
                    return { results: [] };
                },
            },
        },
    });
    await api.fetchNotions('blog');
    assert.equal(queries[0].data_source_id, 'test-source');
    assert.equal('database_id' in queries[0], false);
});

test('multiple Notion sources require an explicit selection belonging to the database', async () => {
    const client = {
        databases: {
            retrieve: async () => ({
                data_sources: [{ id: 'first' }, { id: 'second' }],
            }),
        },
        dataSources: {
            query: async (query) => {
                assert.equal(query.data_source_id, 'second');
                return { results: [] };
            },
        },
    };
    await assert.rejects(
        service({ configured: true, client }).fetchNotions('blog'),
        /NOTION_DATA_SOURCE_ID_BLOG/
    );
    await assert.rejects(
        service({
            configured: true,
            client,
            settings: { NOTION_DATA_SOURCE_ID_BLOG: 'foreign' },
        }).fetchNotions('blog'),
        /does not belong/
    );
    assert.equal(
        (
            await service({
                configured: true,
                client,
                settings: { NOTION_DATA_SOURCE_ID_BLOG: 'second' },
            }).fetchNotions('blog')
        ).length,
        0
    );
});

test('Notion discovery failures do not fall back to public fixtures', async () => {
    const api = service({
        configured: true,
        client: {
            databases: {
                retrieve: async () => {
                    throw new Error('Discovery unavailable');
                },
            },
        },
    });
    await assert.rejects(api.fetchNotions('blog'), /Discovery unavailable/);
});
