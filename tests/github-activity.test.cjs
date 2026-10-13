const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/load.cjs');

function calendar(from, through, count = () => 1) {
    const parts = [];
    for (
        let value = Date.parse(from);
        value <= Date.parse(through);
        value += 86400000
    ) {
        const day = new Date(value).toISOString().slice(0, 10);
        const n = count(day);
        parts.push(
            `<td id="day-${day}" data-date="${day}"></td><tool-tip for="day-${day}">${n === 0 ? 'No' : n.toLocaleString('en-US')} contributions on a day.</tool-tip>`
        );
    }
    return parts.join('');
}

function service(fetch) {
    return load('src/services/github-activity.ts', {}, { fetch, AbortSignal });
}

test('calendar parser extracts only dated totals, including zeros and grouped thousands', () => {
    const { parseContributionCalendar } = service();
    const html = calendar('2026-01-01', '2026-01-03', (day) =>
        day.endsWith('01') ? 1234 : 0
    );
    assert.deepEqual(
        Array.from(parseContributionCalendar(html), ([day, count]) => [
            day,
            count,
        ]),
        [
            ['2026-01-01', 1234],
            ['2026-01-02', 0],
            ['2026-01-03', 0],
        ]
    );
    assert.equal(
        parseContributionCalendar('<html>Sign in to GitHub</html>').size,
        0
    );
    assert.throws(() => parseContributionCalendar(html + html), /Invalid/);
});

test('rolling window excludes today, includes zeros, and retains complete months since 2022', async () => {
    const calls = [];
    const { fetchGitHubActivity } = service(async (url, options) => {
        calls.push({ url, options });
        return {
            ok: true,
            text: async () =>
                calendar(
                    url.searchParams.get('from'),
                    url.searchParams.get('to'),
                    (day) => (day === '2026-10-01' ? 0 : 2)
                ),
        };
    });
    const data = await fetchGitHubActivity(new Date('2026-10-13T19:00:00Z'));
    assert.equal(data.from, '2026-09-13');
    assert.equal(data.through, '2026-10-12');
    assert.equal(data.contributions, 58);
    assert.equal(data.activeDays, 29);
    assert.equal(data.previous.from, '2026-08-14');
    assert.equal(data.previous.through, '2026-09-12');
    assert.equal(data.previous.contributions, 60);
    assert.equal(data.previous.activeDays, 30);
    assert.equal(data.months.length, 57);
    assert.equal(data.months[0].month, '2022-01');
    assert.equal(data.months.at(-1).month, '2026-09');
    assert.equal(data.months.at(-1).count, 60);
    assert.equal(calls.length, 5);
    for (const { url, options } of calls) {
        assert.equal(url.origin, 'https://github.com');
        assert.equal(url.pathname, '/users/ACHultman/contributions');
        assert.equal(options.headers.Authorization, undefined);
        assert.equal(options.redirect, 'error');
    }
});

test('Vancouver midnight, year rollover, leap days, and DST retain 30 complete days', async () => {
    const { fetchGitHubActivity } = service(async (url) => ({
        ok: true,
        text: async () =>
            calendar(url.searchParams.get('from'), url.searchParams.get('to')),
    }));
    for (const [now, from, through, lastMonth] of [
        ['2026-01-01T07:30:00Z', '2025-12-01', '2025-12-30', '2025-11'],
        ['2026-01-01T08:30:00Z', '2025-12-02', '2025-12-31', '2025-12'],
        ['2024-03-01T12:00:00Z', '2024-01-31', '2024-02-29', '2024-02'],
        ['2026-03-09T12:00:00Z', '2026-02-07', '2026-03-08', '2026-02'],
    ]) {
        const data = await fetchGitHubActivity(new Date(now));
        assert.equal(data.from, from);
        assert.equal(data.through, through);
        assert.equal(data.activeDays, 30);
        assert.equal(data.contributions, 30);
        assert.equal(data.previous.contributions, 30);
        assert.equal(data.previous.activeDays, 30);
        assert.equal(data.months[0].month, '2022-01');
        assert.equal(data.months.at(-1).month, lastMonth);
    }
});

test('comparison uses two complete years and excludes both transition months', () => {
    const { workflowComparison } = load('src/utils/github-activity.ts');
    const months = Array.from({ length: 26 }, (_, index) => {
        const month = new Date(Date.UTC(2024, 6 + index, 1))
            .toISOString()
            .slice(0, 7);
        return { month, count: index < 12 ? 100 : index < 14 ? 99999 : 200 };
    });
    const comparison = workflowComparison(months);
    assert.equal(comparison.before.total, 1200);
    assert.equal(comparison.before.average, 100);
    assert.equal(comparison.after.total, 2400);
    assert.equal(comparison.after.average, 200);
    assert.equal(workflowComparison(months.slice(1)), null);
    assert.equal(workflowComparison([...months.slice(1), months[1]]), null);
});

test('change descriptions handle zero baselines, decreases, and rounding without invented ratios', () => {
    const { activityChange } = load('src/utils/github-activity.ts');
    assert.equal(activityChange(12, 0), '12 more than the previous period');
    assert.equal(activityChange(0, 0), 'No recorded activity in either period');
    assert.equal(activityChange(50, 100), '50% fewer than the previous period');
    assert.equal(activityChange(184, 100), '84% more than the previous period');
    assert.equal(
        activityChange(1001, 1000),
        'About the same as the previous period'
    );
});

test('rate limits, transport failures, changed markup, and missing days fail instead of showing zero', async () => {
    const responses = [
        async () => ({ ok: false, status: 429 }),
        async () => {
            throw new Error('timeout');
        },
        async () => ({ ok: true, text: async () => '<html>Sign in</html>' }),
        async (url) => ({
            ok: true,
            text: async () =>
                calendar(
                    url.searchParams.get('from'),
                    url.searchParams.get('to')
                ).replace(
                    'data-date="2026-10-01"',
                    'data-missing="2026-10-01"'
                ),
        }),
    ];
    for (const fetch of responses)
        await assert.rejects(
            service(fetch).fetchGitHubActivity(new Date('2026-10-13T19:00:00Z'))
        );
});

test('About refreshes every six hours and preserves cached stats on regeneration failure', async () => {
    const globals = { console: { warn() {} } };
    const mocks = {
        '@components/Editorial': {},
        '../styles/editorialFont': {},
        '../components/GitHubActivity': {},
        '../services/github-activity': {
            fetchGitHubActivity: async () => ({ contributions: 12 }),
        },
    };
    const page = load('src/pages/about.tsx', mocks, globals);
    const result = await page.getStaticProps({ revalidateReason: 'build' });
    assert.equal(result.revalidate, 21600);
    assert.equal(result.props.activity.contributions, 12);
    mocks['../services/github-activity'].fetchGitHubActivity = async () => {
        throw new Error('upstream unavailable');
    };
    const failed = await page.getStaticProps({ revalidateReason: 'build' });
    assert.equal(failed.props.activity, null);
    assert.equal(failed.revalidate, 300);
    await assert.rejects(
        page.getStaticProps({ revalidateReason: 'stale' }),
        /upstream unavailable/
    );
});
