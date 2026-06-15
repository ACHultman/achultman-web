/**
 * Parse a Notion date string into a Date in the viewer's local timezone.
 *
 * Notion date-only values ("2025-06-10") are parsed by the JS engine as UTC
 * midnight, so `toLocaleDateString()` renders them as the *previous* day for
 * any viewer west of UTC (all of the Americas). Appending a local-time
 * component forces local parsing so the displayed day matches what was
 * published. Datetime values (with a time/zone) are passed through unchanged.
 */
export function parseNotionDate(dateStr: string): Date {
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
    return new Date(isDateOnly ? `${dateStr}T00:00:00` : dateStr);
}

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
};

/**
 * Format a Notion date string for display, parsed in the viewer's local
 * timezone (see {@link parseNotionDate}).
 */
export function formatNotionDate(
    dateStr: string,
    options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS
): string {
    return parseNotionDate(dateStr).toLocaleDateString('en-US', options);
}
