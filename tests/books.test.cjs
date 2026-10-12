const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

test('book props remain serializable when cover dimensions are unavailable', async () => {
    const coverModule = { exports: {} };
    vm.runInNewContext(
        ts.transpileModule(readFileSync('src/data/bookCovers.ts', 'utf8'), {
            compilerOptions: { module: ts.ModuleKind.CommonJS },
        }).outputText,
        { module: coverModule, exports: coverModule.exports }
    );
    const [knownCover, localCover] = Object.entries(
        coverModule.exports.localBookCovers
    )[0];
    const books = [
        { id: 'no-cover', cover: null },
        { id: 'unavailable', cover: 'https://example.com/missing.png' },
        { id: 'unsupported', cover: 'https://example.com/cover.webp' },
        { id: 'available', cover: 'https://example.com/cover.png' },
        { id: 'reviewed', cover: knownCover },
    ];
    const testModule = { exports: {} };
    const code = ts.transpileModule(
        readFileSync('src/pages/books.tsx', 'utf8'),
        {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES2020,
                jsx: ts.JsxEmit.ReactJSX,
            },
        }
    ).outputText;
    vm.runInNewContext(code, {
        module: testModule,
        exports: testModule.exports,
        require: (name) => {
            if (name === '../services/notion') {
                return { fetchNotions: async () => books };
            }
            if (name === '../data/bookCovers') return coverModule.exports;
            return name === 'buffer' ? { Buffer } : {};
        },
        fetch: async () => {
            throw new Error('Book rendering must not fetch cover URLs');
        },
    });

    const result = await testModule.exports.getStaticProps();
    // Next.js rejects explicit undefined props rather than silently omitting them.
    for (const book of result.props.books) {
        for (const value of Object.values(book)) {
            assert.notEqual(value, undefined);
        }
    }
    assert.equal(result.props.books[3].cover, books[3].cover);
    assert.equal(result.props.books[4].cover, localCover);
    for (const asset of Object.values(coverModule.exports.localBookCovers)) {
        assert.equal(
            readFileSync(`public${asset}`).toString('ascii', 8, 12),
            'WEBP'
        );
    }
    assert.equal(result.props.books.length, 5);
});
