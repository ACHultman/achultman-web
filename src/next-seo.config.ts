import type { NextSeoProps } from 'next-seo';

const baseUrl =
    typeof window !== 'undefined'
        ? window.location.origin
        : process.env.SITE_URL ||
          process.env.NEXT_PUBLIC_APP_BASE_URL ||
          'https://hultman.dev';

const config: NextSeoProps = {
    titleTemplate: '%s | Adam Hultman',
    defaultTitle: 'Adam Hultman — Software Engineer, Vancouver',
    description:
        'Software engineer in Vancouver building AI-powered platforms, developer tools, and secure web applications. 5+ years of full-stack experience.',
    canonical: baseUrl,
    openGraph: {
        url: baseUrl,
        title: 'Adam Hultman — Software Engineer, Vancouver',
        description:
            'Software engineer in Vancouver building AI-powered platforms, developer tools, and secure web applications.',
        siteName: 'Adam Hultman',
        images: [
            {
                url: `${baseUrl}/og_homepage.png`,
                width: 1200,
                height: 630,
                alt: 'Adam Hultman — Full-Stack Developer & AI Engineer',
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
