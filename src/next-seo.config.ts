import type { NextSeoProps } from 'next-seo';
import { getBaseUrl } from './utils/baseUrl';

const baseUrl = getBaseUrl();

const config: NextSeoProps = {
    titleTemplate: '%s | Adam Hultman',
    defaultTitle: 'Adam Hultman | Software Engineer & AI',
    description:
        'Vancouver software engineer building web products and AI features. Experience at Kopperfield and Assembly Digital, plus independent projects.',
    canonical: baseUrl,
    openGraph: {
        url: baseUrl,
        title: 'Adam Hultman | Software Engineer & AI',
        description:
            'Vancouver software engineer building web products and AI features. Experience at Kopperfield and Assembly Digital, plus independent projects.',
        siteName: 'Adam Hultman',
        images: [
            {
                url: `${baseUrl}/og_homepage.png`,
                width: 1200,
                height: 630,
                alt: 'Adam Hultman, software engineer building web products and AI features',
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
