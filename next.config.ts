// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    serverExternalPackages: ['next-seo'],
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
    async rewrites() {
        return [
            {
                source: '/ingest/static/:path*',
                destination: 'https://us-assets.i.posthog.com/static/:path*',
            },
            {
                source: '/ingest/:path*',
                destination: 'https://us.i.posthog.com/:path*',
            },
        ];
    },
    images: {
        remotePatterns: [
            // Book covers — Wiley
            { protocol: 'https', hostname: 'media.wiley.com', pathname: '/**' },
            {
                protocol: 'https',
                hostname: 'images.wiley.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.wiley.com.au',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.wiley.com.au.s3.amazonaws.com',
                pathname: '/**',
            },
            // Book covers — O'Reilly
            {
                protocol: 'https',
                hostname: 'learning.oreilly.com',
                pathname: '/**',
            },
            // Book covers — Amazon
            {
                protocol: 'https',
                hostname: 'images-na.ssl-images-amazon.com',
                pathname: '/**',
            },
            // Bookmark / blog covers — GitHub
            { protocol: 'https', hostname: 'github.com', pathname: '/**' },
            {
                protocol: 'https',
                hostname: 'repository-images.githubusercontent.com',
                pathname: '/**',
            },
            // Bookmark / blog covers — Google Storage
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/**',
            },
            // Notion cover images
            {
                protocol: 'https',
                hostname: 's3.us-west-2.amazonaws.com',
                pathname: '/secure.notion-static.com/**',
            },
            {
                protocol: 'https',
                hostname: 'secure.notion-static.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.notion.so',
                pathname: '/images/page-cover/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            {
                // Security headers on all routes
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
            {
                // Cache-Control only on HTML pages — exclude Next.js static assets
                // which Next.js sets to immutable automatically
                source: '/((?!_next/static|_next/image|favicon|images).*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
        ];
    },
    compiler: {
        emotion: true,
    },
});
