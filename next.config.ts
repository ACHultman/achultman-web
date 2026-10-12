// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

// Hash the exact Chakra bootstrap so static pages need no unsafe-inline scripts.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createHash } = require('node:crypto');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getScriptSrc } = require('@chakra-ui/react');
const colorModeHash = createHash('sha256')
    .update(getScriptSrc({ initialColorMode: 'light' }))
    .digest('base64');
const development = process.env.NODE_ENV === 'development';
const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' ${development ? "'unsafe-inline' 'unsafe-eval'" : `'sha256-${colorModeHash}'`} https://va.vercel-scripts.com`,
    "script-src-attr 'none'",
    // Emotion and Chakra generate inline styles, including dynamic positioning.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https: data: blob:",
    "font-src 'self'",
    `connect-src 'self' https://vitals.vercel-insights.com https://us.i.posthog.com ${development ? 'ws: wss:' : ''}`,
    "media-src 'self' https: blob:",
    "worker-src 'self' blob:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(development ? [] : ['upgrade-insecure-requests']),
].join('; ');

module.exports = withBundleAnalyzer({
    poweredByHeader: false,
    serverExternalPackages: ['next-seo'],
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
    async redirects() {
        return [
            { source: '/labs', destination: '/tools', permanent: true },
            ...Object.entries({
                'sort-arena': 'sorting',
                'regex-debugger': 'regex-tester',
                compression: 'compression',
                'shader-playground': 'shader-editor',
                beatmaker: 'step-sequencer',
                'neural-net': 'neural-network',
            }).map(([oldPath, newPath]) => ({
                source: `/labs/${oldPath}`,
                destination: `/tools/${newPath}`,
                permanent: true,
            })),
        ];
    },
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
    // CMS images load in the browser; only local assets use the server optimizer.
    images: { remotePatterns: [], dangerouslyAllowSVG: false },
    async headers() {
        return [
            {
                // Security headers on all routes
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: contentSecurityPolicy,
                    },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
                    },
                ],
            },
            {
                source: '/tools/shader-editor',
                headers: [
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(self), geolocation=(), payment=(), usb=()',
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
                        value: 'public, max-age=0, must-revalidate, no-transform',
                    },
                ],
            },
        ];
    },
    compiler: {
        emotion: true,
    },
});
