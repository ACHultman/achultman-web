import type { NextSeoProps } from 'next-seo';
import { getBaseUrl } from './utils/baseUrl';

const baseUrl = getBaseUrl();

const config: NextSeoProps = {
    titleTemplate: '%s | Adam Hultman',
    defaultTitle: 'Custom software development | Adam Hultman',
    description:
        'I build internal tools, AI features and web products. Based in Vancouver. Independent projects from $5,000 USD.',
    canonical: baseUrl,
    openGraph: {
        url: baseUrl,
        title: 'Custom software development | Adam Hultman',
        description:
            'I build internal tools, AI features and web products. Based in Vancouver. Independent projects from $5,000 USD.',
        siteName: 'Adam Hultman',
        images: [
            {
                url: `${baseUrl}/og_homepage.png`,
                width: 1200,
                height: 630,
                alt: 'Adam Hultman, full-stack engineer and software consultant',
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
