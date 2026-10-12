const { appendFileSync } = require('node:fs');

function deploymentUrl(value) {
    try {
        const url = new URL(value);
        if (
            url.protocol === 'https:' &&
            url.hostname.endsWith('.vercel.app') &&
            !url.username &&
            !url.password
        )
            return url.origin;
    } catch {
        /* Ignore missing or malformed deployment metadata. */
    }
    return undefined;
}

async function findDeployment(
    { repo, sha, githubToken, vercelToken, production },
    request = fetch
) {
    const github = async (path) => {
        const response = await request(
            `https://api.github.com/repos/${repo}/${path}`,
            {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: 'application/vnd.github+json',
                },
                signal: AbortSignal.timeout(15000),
            }
        );
        if (!response.ok)
            throw new Error(
                `GitHub deployment lookup failed (${response.status}).`
            );
        return response.json();
    };
    const deployments = await github(
        `deployments?sha=${encodeURIComponent(sha)}&per_page=10`
    );
    for (const deployment of deployments) {
        if (
            deployment.sha !== sha ||
            (deployment.environment === 'Production') !== production
        )
            continue;
        const statuses = await github(`deployments/${deployment.id}/statuses`);
        if (statuses[0]?.state === 'success') {
            const url = deploymentUrl(statuses[0].environment_url);
            if (url) return url;
        }
    }
    if (!vercelToken) return undefined;
    // GitHub's deployment webhook can lag or be missing after a successful build.
    const query = new URLSearchParams({
        projectId: 'prj_6qiEQE6E8zWSDdoQevzDTmjf3ISv',
        teamId: 'team_PAFSMWJBrKR0ug5ULzsuCB1D',
        sha,
        limit: '20',
    });
    const response = await request(
        `https://api.vercel.com/v7/deployments?${query}`,
        {
            headers: { Authorization: `Bearer ${vercelToken}` },
            signal: AbortSignal.timeout(15000),
        }
    );
    if (!response.ok)
        throw new Error(
            `Vercel deployment lookup failed (${response.status}). Check VERCEL_TOKEN access to this project.`
        );
    const data = await response.json();
    const match = data.deployments.find(
        (deployment) =>
            (deployment.readyState || deployment.state) === 'READY' &&
            deployment.meta?.githubCommitSha === sha &&
            (deployment.target === 'production') === production
    );
    return match ? deploymentUrl(`https://${match.url}`) : undefined;
}

async function main() {
    const {
        GH_REPO: repo,
        DEPLOYMENT_SHA: sha,
        GH_TOKEN: githubToken,
        VERCEL_TOKEN: vercelToken,
        GITHUB_OUTPUT: output,
    } = process.env;
    if (!repo || !/^[a-f0-9]{40}$/.test(sha || '') || !githubToken || !output)
        throw new Error('Missing deployment lookup configuration.');
    for (let attempt = 0; attempt < 90; attempt++) {
        const url = await findDeployment({
            repo,
            sha,
            githubToken,
            vercelToken,
            production: process.env.DEPLOYMENT_ENV === 'production',
        });
        if (url) {
            appendFileSync(output, `url=${url}\n`);
            process.stdout.write(`Deployment ready for ${sha}: ${url}\n`);
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    throw new Error(`No successful deployment found for ${sha}.`);
}

module.exports = { findDeployment };
if (require.main === module)
    main().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
