/**
 * Resolve the site's base origin (scheme + host) with any trailing slashes
 * removed, so callers can safely append a leading-slash path without
 * producing a double slash:
 *
 *   `${getBaseUrl()}/blog/${id}` -> "https://hultman.dev/blog/<id>"
 *
 * A trailing slash on the NEXT_PUBLIC_SITE_URL env var would
 * otherwise leak into canonical, og:url, JSON-LD, sitemap, and RSS URLs.
 *
 * This is the canonical public site origin, not the current request origin.
 * Keeping it identical during SSR and hydration prevents localhost/preview
 * hosts from replacing production SEO URLs.
 */
export function getBaseUrl(): string {
    const resolved = process.env.NEXT_PUBLIC_SITE_URL || 'https://hultman.dev';

    return stripTrailingSlashes(resolved);
}

function stripTrailingSlashes(url: string): string {
    return url.replace(/\/+$/, '');
}
