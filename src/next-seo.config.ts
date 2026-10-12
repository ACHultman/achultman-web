import type { NextSeoProps } from 'next-seo';
import { getBaseUrl } from './utils/baseUrl';

const baseUrl = getBaseUrl();

const config: NextSeoProps = {
    titleTemplate: '%s | Adam Hultman',
    defaultTitle: 'Adam Hultman | Software Engineer in Vancouver',
    description:
        'Adam Hultman is a software engineer in Vancouver. Explore his work, independent products, and articles on React, Next.js, performance, and applied AI.',
    canonical: baseUrl,
    openGraph: {
        url: baseUrl,
        title: 'Adam Hultman | Software Engineer in Vancouver',
        description:
            'Adam Hultman is a software engineer in Vancouver. Explore his work, independent products, and articles on React, Next.js, performance, and applied AI.',
        siteName: 'Adam Hultman',
        images: [
            {
                url: `${baseUrl}/og_homepage.png`,
                width: 1200,
                height: 630,
                alt: 'Adam Hultman | Software & Independent Products',
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
            content: '#182D28',
        },
    ],
    additionalLinkTags: [
        {
            rel: 'manifest',
            href: '/site.webmanifest',
            crossOrigin: 'use-credentials',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/apple-touch-icon.png',
        },
        {
            rel: 'mask-icon',
            href: '/safari-pinned-tab.svg',
            color: '#182D28',
        },
        {
            rel: 'icon',
            href: '/favicon.svg',
        },
        {
            rel: 'alternate',
            type: 'application/rss+xml',
            href: '/feed.xml',
        },
    ],
};

export default config;
