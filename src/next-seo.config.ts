import type { NextSeoProps } from 'next-seo';
import { getBaseUrl } from './utils/baseUrl';

const baseUrl = getBaseUrl();

const config: NextSeoProps = {
    titleTemplate: '%s | Adam Hultman',
    defaultTitle: 'Adam Hultman | AI product engineer for operations teams',
    description:
        'I build small AI tools for costly manual workflows. Fixed 30-day pilots for B2B operations teams.',
    canonical: baseUrl,
    openGraph: {
        url: baseUrl,
        title: 'Adam Hultman | AI product engineer for operations teams',
        description:
            'Fixed 30-day pilots that turn costly manual workflows into small AI tools built around the team using them.',
        siteName: 'Adam Hultman',
        images: [
            {
                url: `${baseUrl}/og_homepage.png`,
                width: 1200,
                height: 630,
                alt: 'Adam Hultman, AI product engineer for operations teams',
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
            content: '#536647',
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
            color: '#536647',
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
