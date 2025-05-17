const baseUrl =
    typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';

const config = {
    title: 'Adam Hultman',
    description:
        'Full-stack software developer (EIT) with 5+ years building AI-enabled, secure, and scalable platforms. B.S.Eng. in Software Engineering (Cybersecurity & Privacy) from the University of Victoria.',
    canonical: baseUrl,
    openGraph: {
        url: baseUrl,
        title: 'Adam Hultman',
        description:
            'Full-stack software developer (EIT) with 5+ years building AI-enabled, secure, and scalable platforms. B.S.Eng. in Software Engineering (Cybersecurity & Privacy) from the University of Victoria.',
        site_name: 'Adam Hultman',
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
            name: 'robots',
            content: 'index, follow',
        },
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
