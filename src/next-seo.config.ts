import type { NextSeoProps } from 'next-seo';

const baseUrl =
    typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_BASE_URL || 'https://hultman.dev';

const config: NextSeoProps = {
    title: 'Adam Hultman',
    description:
        'Full-stack software developer with 5+ years building AI-powered, secure, and scalable platforms.',
    canonical: baseUrl,
    openGraph: {
        url: baseUrl,
        title: 'Adam Hultman',
        description:
            'Full-stack software developer with 5+ years building AI-powered, secure, and scalable platforms.',
        siteName: 'Adam Hultman',
        images: [
            {
                url: `${baseUrl}/og_blog_fallback.png`,
                alt: 'Adam Hultman',
            },
        ],
    },
    twitter: {
        handle: '@HultmanAdam',
        cardType: 'summary_large_image',
    },
    additionalMetaTags: [
        {
            name: 'theme-color',
            content: '#38A169',
        },
    ],
    additionalLinkTags: [
        {
            rel: 'manifest',
            href: '/site.webmanifest',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/apple-touch-icon.png',
        },
        {
            rel: 'mask-icon',
            href: '/safari-pinned-tab.svg',
            color: '#38A169',
        },
        {
            rel: 'icon',
            href: '/favicon.svg',
        },
    ],
};

export default config;
