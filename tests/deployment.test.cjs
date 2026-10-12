const test = require('node:test');
const assert = require('node:assert/strict');
const { findDeployment } = require('../scripts/resolve-deployment.cjs');
const input = {
    repo: 'owner/site',
    sha: 'a'.repeat(40),
    githubToken: 'github-test',
    vercelToken: 'vercel-test',
    production: false,
};
const response = (data) => ({ ok: true, json: async () => data });

test('deployment discovery prefers the exact GitHub commit and rejects stale or unsafe metadata', async () => {
    const request = async (url) => {
        if (url.includes('/statuses'))
            return response([
                {
                    state: 'success',
                    environment_url: 'https://preview.vercel.app',
                },
            ]);
        return response([
            { id: 1, sha: 'b'.repeat(40), environment: 'Preview' },
            { id: 2, sha: input.sha, environment: 'Preview' },
        ]);
    };
    assert.equal(
        await findDeployment(input, request),
        'https://preview.vercel.app'
    );
    assert.equal(
        await findDeployment(
            { ...input, vercelToken: undefined },
            async (url) =>
                response(
                    url.includes('/statuses')
                        ? [
                              {
                                  state: 'success',
                                  environment_url: 'https://evil.example/path',
                              },
                          ]
                        : [{ id: 2, sha: input.sha, environment: 'Preview' }]
                )
        ),
        undefined
    );
});

test('missing GitHub records fall back to Vercel without accepting another commit or environment', async () => {
    const request = async (url, options) => {
        if (new URL(url).hostname === 'api.github.com') return response([]);
        assert.equal(options.headers.Authorization, 'Bearer vercel-test');
        assert.equal(new URL(url).searchParams.get('sha'), input.sha);
        return response({
            deployments: [
                {
                    state: 'READY',
                    url: 'wrong.vercel.app',
                    meta: { githubCommitSha: 'b'.repeat(40) },
                },
                {
                    state: 'READY',
                    target: 'production',
                    url: 'production.vercel.app',
                    meta: { githubCommitSha: input.sha },
                },
                {
                    state: 'BUILDING',
                    url: 'pending.vercel.app',
                    meta: { githubCommitSha: input.sha },
                },
                {
                    state: 'READY',
                    url: 'correct.vercel.app',
                    meta: { githubCommitSha: input.sha },
                },
            ],
        });
    };
    assert.equal(
        await findDeployment(input, request),
        'https://correct.vercel.app'
    );
    assert.equal(
        await findDeployment({ ...input, production: true }, request),
        'https://production.vercel.app'
    );
});

test('deployment API failures stop the audit instead of selecting an unrelated URL', async () => {
    await assert.rejects(
        findDeployment(input, async () => ({ ok: false, status: 403 })),
        /GitHub deployment lookup failed \(403\)/
    );
    await assert.rejects(
        findDeployment(input, async (url) =>
            new URL(url).hostname === 'api.github.com'
                ? response([])
                : { ok: false, status: 401 }
        ),
        /Vercel deployment lookup failed \(401\)/
    );
});
