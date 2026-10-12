const { existsSync, readdirSync, readFileSync } = require('node:fs');

// Raw Lighthouse settings can contain authentication state. Emit only metrics
// and resource paths, never report settings, headers, cookies, or URL queries.
const directory = '.lighthouseci';
if (existsSync(directory)) {
    for (const file of readdirSync(directory).filter((name) =>
        /^lhr-.*\.json$/.test(name)
    )) {
        const report = JSON.parse(readFileSync(`${directory}/${file}`, 'utf8'));
        const metrics = Object.fromEntries(
            [
                'first-contentful-paint',
                'largest-contentful-paint',
                'total-blocking-time',
                'cumulative-layout-shift',
            ].map((name) => [name, report.audits[name]?.numericValue])
        );
        const scripts = (report.audits['bootup-time']?.details?.items ?? [])
            .filter((item) => item.url?.startsWith('https://'))
            .map((item) => ({
                path: new URL(item.url).pathname,
                evaluationMs: item.scripting,
                parseMs: item.scriptParseCompile,
            }))
            .sort((a, b) => b.evaluationMs - a.evaluationMs)
            .slice(0, 5);
        process.stdout.write(
            JSON.stringify({
                route: new URL(report.requestedUrl).pathname,
                categories: Object.fromEntries(
                    [
                        'performance',
                        'accessibility',
                        'best-practices',
                        'seo',
                    ].map((name) => [name, report.categories[name]?.score])
                ),
                metrics,
                scripts,
            }) + '\n'
        );
    }
}
