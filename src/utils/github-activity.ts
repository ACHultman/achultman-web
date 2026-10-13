import type { GitHubActivity } from '../types/github-activity';

export function activityChange(current: number, previous: number) {
    if (previous === 0) {
        return current === 0
            ? 'No recorded activity in either period'
            : `${current.toLocaleString('en-CA')} more than the previous period`;
    }
    const percent = Math.abs(((current - previous) / previous) * 100);
    if (percent < 0.5) return 'About the same as the previous period';
    return `${Math.round(percent).toLocaleString('en-CA')}% ${current > previous ? 'more' : 'fewer'} than the previous period`;
}

export function workflowComparison(months: GitHubActivity['months']) {
    const windows = [
        {
            start: '2024-07',
            end: '2025-06',
            label: 'VS Code + autocomplete',
            dates: 'Jul 2024–Jun 2025',
        },
        {
            start: '2025-09',
            end: '2026-08',
            label: 'Claude in the terminal',
            dates: 'Sep 2025–Aug 2026',
        },
    ];
    const periods = windows.map((window) => {
        const values = months.filter(
            (month) => month.month >= window.start && month.month <= window.end
        );
        if (
            values.length !== 12 ||
            new Set(values.map((value) => value.month)).size !== 12
        )
            return null;
        const total = values.reduce((sum, value) => sum + value.count, 0);
        return { ...window, total, average: total / 12 };
    });
    const [before, after] = periods;
    return before && after ? { before, after } : null;
}
