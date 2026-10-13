import type { GitHubActivity } from '../types/github-activity';

const DAY = 86_400_000;
const USERNAME = 'ACHultman';

function isoDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

function attributes(tag: string) {
    return Object.fromEntries(
        Array.from(tag.matchAll(/([\w-]+)="([^"]*)"/g), (match) => [
            match[1],
            match[2],
        ])
    );
}

// Read only dates and counts from GitHub's public calendar. Never render its HTML
// or use an authenticated response that could expose private repository details.
export function parseContributionCalendar(html: string) {
    const dates = new Map<string, string>();
    for (const [tag] of html.matchAll(/<td\b[^>]*>/g)) {
        const attrs = attributes(tag);
        if (attrs.id && /^\d{4}-\d{2}-\d{2}$/.test(attrs['data-date'] ?? '')) {
            dates.set(attrs.id, attrs['data-date']);
        }
    }
    const days = new Map<string, number>();
    for (const match of html.matchAll(
        /<tool-tip\b([^>]*)>([^<]*)<\/tool-tip>/g
    )) {
        const date = dates.get(attributes(match[1] ?? '').for ?? '');
        const count = (match[2] ?? '')
            .trim()
            .match(/^(No|[\d,]+) contributions? on /);
        if (!date || !count) continue;
        const value =
            count[1] === 'No' ? 0 : Number(count[1]?.replaceAll(',', ''));
        if (!Number.isSafeInteger(value) || value < 0 || days.has(date)) {
            throw new Error('Invalid GitHub contribution calendar');
        }
        days.set(date, value);
    }
    return days;
}

export async function fetchGitHubActivity(
    now = new Date()
): Promise<GitHubActivity> {
    // Calendar arithmetic uses UTC dates after determining today's Vancouver date,
    // so daylight-saving changes cannot shorten or duplicate a day in the window.
    const localDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Vancouver',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);
    const today = new Date(`${localDate}T00:00:00Z`);
    const end = new Date(today.getTime() - DAY);
    const recentStart = new Date(today.getTime() - 30 * DAY);
    const previousStart = new Date(today.getTime() - 60 * DAY);
    // Keep the Assembly/autocomplete years available alongside recent activity.
    const chartStart = new Date('2022-01-01T00:00:00Z');
    const chartEnd = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)
    );
    const years = Array.from(
        { length: end.getUTCFullYear() - chartStart.getUTCFullYear() + 1 },
        (_, index) => chartStart.getUTCFullYear() + index
    );
    const calendars = await Promise.all(
        years.map(async (year) => {
            const from =
                year === chartStart.getUTCFullYear()
                    ? isoDate(chartStart)
                    : `${year}-01-01`;
            const to =
                year === end.getUTCFullYear() ? isoDate(end) : `${year}-12-31`;
            const url = new URL(
                `https://github.com/users/${USERNAME}/contributions`
            );
            url.searchParams.set('from', from);
            url.searchParams.set('to', to);
            const response = await fetch(url, {
                headers: {
                    Accept: 'text/html',
                    'Accept-Language': 'en-US',
                    'User-Agent': 'hultman.dev',
                },
                signal: AbortSignal.timeout(8000),
                redirect: 'error',
            });
            if (!response.ok)
                throw new Error(`GitHub calendar returned ${response.status}`);
            const html = await response.text();
            if (html.length > 2_000_000)
                throw new Error('GitHub calendar exceeded size limit');
            return new Map(
                Array.from(parseContributionCalendar(html)).filter(
                    ([day]) => day >= from && day <= to
                )
            );
        })
    );
    const days = new Map(calendars.flatMap((calendar) => Array.from(calendar)));
    const months = new Map<string, number>();
    let contributions = 0;
    let activeDays = 0;
    let previousContributions = 0;
    let previousActiveDays = 0;
    for (
        let timestamp = chartStart.getTime();
        timestamp <= end.getTime();
        timestamp += DAY
    ) {
        const date = isoDate(new Date(timestamp));
        const count = days.get(date);
        // Missing days mean an upstream failure or markup change, never zero activity.
        if (count === undefined)
            throw new Error('GitHub calendar is incomplete');
        if (timestamp >= recentStart.getTime()) {
            contributions += count;
            if (count > 0) activeDays += 1;
        } else if (timestamp >= previousStart.getTime()) {
            previousContributions += count;
            if (count > 0) previousActiveDays += 1;
        }
        if (timestamp < chartEnd.getTime()) {
            const month = date.slice(0, 7);
            months.set(month, (months.get(month) ?? 0) + count);
        }
    }
    return {
        contributions,
        activeDays,
        previous: {
            contributions: previousContributions,
            activeDays: previousActiveDays,
            from: isoDate(previousStart),
            through: isoDate(new Date(recentStart.getTime() - DAY)),
        },
        from: isoDate(recentStart),
        through: isoDate(end),
        fetchedAt: now.toISOString(),
        months: Array.from(months, ([month, count]) => ({ month, count })),
    };
}
