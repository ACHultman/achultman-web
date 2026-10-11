const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');
const { spawnSync } = require('node:child_process');

const nextRequire = createRequire(require.resolve('@next/eslint-plugin-next'));
const lhciRequire = createRequire(require.resolve('@lhci/cli/package.json'));
const yamlRequire = createRequire(
    lhciRequire.resolve('@lhci/utils/src/lighthouserc.js')
);
const yamlCli = path.join(
    path.dirname(yamlRequire.resolve('js-yaml/package.json')),
    'bin/js-yaml.js'
);

// Exercise the consuming APIs, not just override version strings.
test('Next project discovery and page-link linting work with the glob replacement', async () => {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'next-lint-'));
    try {
        for (const name of ['web', 'admin']) {
            fs.mkdirSync(path.join(fixture, name, 'pages'), {
                recursive: true,
            });
            fs.writeFileSync(
                path.join(fixture, name, 'pages/index.tsx'),
                'export default function Home() { return null; }'
            );
        }
        fs.writeFileSync(path.join(fixture, 'not-a-directory'), '');
        const { getRootDirs } = nextRequire('./utils/get-root-dirs');
        const context = (rootDir) => ({
            cwd: fixture,
            settings: { next: { rootDir } },
        });
        const normalize = (roots) =>
            roots.map((root) => path.resolve(root)).sort();
        const expected = ['admin', 'web'].map((name) =>
            path.join(fixture, name)
        );
        assert.deepEqual(getRootDirs({ cwd: fixture, settings: {} }), [
            fixture,
        ]);
        assert.deepEqual(
            normalize(getRootDirs(context(`${fixture}/*`))),
            expected
        );
        assert.deepEqual(getRootDirs(context(`${fixture}/missing-*`)), []);

        const { ESLint } = require('eslint');
        for (const rootDir of [
            `${fixture}/*`,
            `${fixture}/{web,admin}`,
            [`${fixture}/web`, `${fixture}/admin`],
        ]) {
            // Literal directories also expand descendants in tinyglobby. Next must
            // still find each application's pages and enforce its link rule.
            const discovered = normalize(getRootDirs(context(rootDir)));
            for (const directory of expected)
                assert.ok(discovered.includes(directory));
            assert.ok(
                discovered.every((directory) =>
                    fs.statSync(directory).isDirectory()
                )
            );
            const eslint = new ESLint({
                overrideConfig: { settings: { next: { rootDir } } },
            });
            const [bad] = await eslint.lintText(
                'export default function Example() { return <a href="/">Home</a>; }',
                { filePath: 'src/pages/tooling-fixture.tsx' }
            );
            assert.ok(
                bad.messages.some(
                    (message) =>
                        message.ruleId === '@next/next/no-html-link-for-pages'
                )
            );
            const [good] = await eslint.lintText(
                'export default function Example() { return <a href="https://example.com">Elsewhere</a>; }',
                { filePath: 'src/pages/tooling-fixture.tsx' }
            );
            assert.ok(
                !good.messages.some(
                    (message) =>
                        message.ruleId === '@next/next/no-html-link-for-pages'
                )
            );
        }
    } finally {
        fs.rmSync(fixture, { recursive: true, force: true });
    }
});

test('the updated argument parser preserves the YAML CLI and rejects malformed input', () => {
    const valid = spawnSync(process.execPath, [yamlCli], {
        input: 'ci:\n  collect:\n    numberOfRuns: 1\n',
        encoding: 'utf8',
        timeout: 5000,
    });
    assert.equal(valid.status, 0, valid.stderr);
    assert.deepEqual(JSON.parse(valid.stdout), {
        ci: { collect: { numberOfRuns: 1 } },
    });
    const invalid = spawnSync(process.execPath, [yamlCli], {
        input: 'ci: [unterminated',
        encoding: 'utf8',
        timeout: 5000,
    });
    assert.equal(invalid.status, 1);
});

test('Lighthouse CI writes and cleans up flags using the updated UUID implementation', () => {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'lhci-flags-'));
    try {
        const runner = lhciRequire.resolve('./src/collect/node-runner.js');
        const result = spawnSync(
            process.execPath,
            [
                '-e',
                `
            const assert = require('node:assert/strict');
            const fs = require('node:fs');
            const Runner = require(${JSON.stringify(runner)});
            fs.mkdirSync('.lighthouseci');
            const {args, cleanupFn} = Runner.computeArgumentsAndCleanup('http://localhost', {settings: {throttlingMethod: 'provided'}});
            const flags = args[args.indexOf('--cli-flags-path') + 1];
            assert.match(flags, /flags-[a-f0-9-]+\\.json$/);
            assert.equal(JSON.parse(fs.readFileSync(flags)).throttlingMethod, 'provided');
            cleanupFn();
            assert.equal(fs.existsSync(flags), false);
        `,
            ],
            { cwd: fixture, encoding: 'utf8', timeout: 5000 }
        );
        assert.equal(result.status, 0, result.stderr);
    } finally {
        fs.rmSync(fixture, { recursive: true, force: true });
    }
});

test('the patched FTP parser handles normal listings and bounds malformed-list work', () => {
    const uriRequire = createRequire(lhciRequire.resolve('get-uri'));
    const ftpPath = uriRequire.resolve('basic-ftp');
    const parserPath = uriRequire.resolve('basic-ftp/dist/parseList');
    const unixPath = uriRequire.resolve('basic-ftp/dist/parseListUnix');
    const result = spawnSync(
        process.execPath,
        [
            '-e',
            `
        const assert = require('node:assert/strict');
        const {Client} = require(${JSON.stringify(ftpPath)});
        const {parseList} = require(${JSON.stringify(parserPath)});
        const {testLine} = require(${JSON.stringify(unixPath)});
        const client = new Client();
        for (const method of ['access', 'lastMod', 'list', 'downloadTo', 'close']) assert.equal(typeof client[method], 'function');
        client.close();
        const [file] = parseList('-rw-r--r-- 1 owner group 42 Jan 01 2026 example.txt');
        assert.equal(file.name, 'example.txt');
        assert.equal(file.size, 42);
        assert.equal(testLine(' '.repeat(100000) + '!'), false);
    `,
        ],
        { encoding: 'utf8', timeout: 5000 }
    );
    assert.equal(result.status, 0, result.stderr || result.error?.message);
});

test('Lighthouse CI can fetch through its updated proxy agent on Node 24', async (t) => {
    const http = require('node:http');
    const fetch = lhciRequire('./src/fetch.js');
    const { ProxyAgent } = lhciRequire('proxy-agent');
    const agent = new ProxyAgent({ getProxyForUrl: () => '' });
    const server = http.createServer((_request, response) =>
        response.end('transport OK')
    );
    t.after(async () => {
        agent.destroy();
        await new Promise((resolve) => server.close(resolve));
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const response = await fetch(`http://127.0.0.1:${server.address().port}`, {
        agent,
        signal: AbortSignal.timeout(3000),
    });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'transport OK');
});

test('Next bundled React, accessibility, and import rules run under ESLint 10', async () => {
    const { ESLint } = require('eslint');
    const eslint = new ESLint();
    const [result] = await eslint.lintText(
        'export default () => <div>{[1, 2].map(n => <span>{n}</span>)}<img src="/x.png" /></div>;',
        { filePath: 'src/components/ToolingCompatibility.tsx' }
    );
    const rules = new Set(result.messages.map((message) => message.ruleId));
    for (const rule of [
        'react/jsx-key',
        'jsx-a11y/alt-text',
        'import/no-anonymous-default-export',
    ]) {
        assert.ok(rules.has(rule), `Missing expected ${rule} diagnostic`);
    }
    assert.ok(!result.messages.some((message) => message.fatal));
});
