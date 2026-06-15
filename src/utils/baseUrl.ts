/**
 * Resolve the site's base origin (scheme + host) with any trailing slashes
 * removed, so callers can safely append a leading-slash path without
 * producing a double slash:
 *
 *   `${getBaseUrl()}/blog/${id}` -> "https://hultman.dev/blog/<id>"
 *
 * A trailing slash on the SITE_URL / NEXT_PUBLIC_APP_BASE_URL env var would
 * otherwise leak into canonical, og:url, JSON-LD, sitemap, and RSS URLs.
 *
 * On the client the current origin is preferred; on the server the value is
 * resolved from environment configuration, falling back to the production
 * domain.
 */
export function getBaseUrl(): string {
    const resolved =
        typeof window !== 'undefined'
            ? window.location.origin
            : process.env.SITE_URL ||
              process.env.NEXT_PUBLIC_APP_BASE_URL ||
              (process.env.VERCEL_PROJECT_PRODUCTION_URL
                  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
                  : null) ||
              'https://hultman.dev';

    return stripTrailingSlashes(resolved);
}

function stripTrailingSlashes(url: string): string {
    return url.replace(/\/+$/, '');
}
