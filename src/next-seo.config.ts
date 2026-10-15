import type { NextSeoProps } from 'next-seo';
import { getBaseUrl } from './utils/baseUrl';

const baseUrl = getBaseUrl();

const config: NextSeoProps = {
    titleTemplate: '%s | Adam Hultman',
    defaultTitle: 'Adam Hultman | Software Engineer in Vancouver',
    description:
        'Adam Hultman builds web and mobile software at Kopperfield, and independent products in property intelligence, AI video, and audio through Perspective Labs.',
    canonical: baseUrl,
    openGraph: {
        url: baseUrl,
        title: 'Adam Hultman | Software Engineer in Vancouver',
        description:
            'Adam Hultman builds web and mobile software at Kopperfield, and independent products in property intelligence, AI video, and audio through Perspective Labs.',
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
            href: '/site.webmanifest?v=ah-monogram',
            crossOrigin: 'use-credentials',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/apple-touch-icon.png?v=ah-monogram',
        },
        {
            rel: 'mask-icon',
            href: '/safari-pinned-tab.svg?v=ah-monogram',
            color: '#182D28',
        },
        {
            rel: 'icon',
            href: '/favicon-32x32.png?v=ah-monogram',
            type: 'image/png',
            sizes: '32x32',
        },
        {
            rel: 'icon',
            href: '/favicon-16x16.png?v=ah-monogram',
            type: 'image/png',
            sizes: '16x16',
        },
        {
            rel: 'icon',
            href: '/favicon.svg?v=ah-monogram',
            type: 'image/svg+xml',
            sizes: 'any',
        },
        {
            rel: 'alternate',
            type: 'application/rss+xml',
            href: '/feed.xml',
        },
    ],
};

export default config;
