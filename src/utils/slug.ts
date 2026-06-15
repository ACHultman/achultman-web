const UUID_PATTERN =
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

// Combining diacritical marks (U+0300–U+036F), stripped after NFKD normalize.
// Built via RegExp() so the source stays plain ASCII.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

/**
 * Turn a title (or any string) into a URL-safe slug:
 *   "Notion's Image Expiry, Explained!" -> "notions-image-expiry-explained"
 */
export function slugify(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .normalize('NFKD')
        .replace(COMBINING_MARKS, '') // strip accents
        .replace(/['’]/g, '') // drop apostrophes (Notion's -> notions)
        .replace(/[^a-z0-9]+/g, '-') // non-alphanumerics -> hyphen
        .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}

/** Whether a path segment is a Notion page id (UUID, with or without hyphens). */
export function isNotionId(value: string): boolean {
    return UUID_PATTERN.test(value);
}
