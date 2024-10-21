import { NextSeoProps } from 'next-seo';

type SimpleSeoData = {
    title: NextSeoProps['title'];
    description: NextSeoProps['description'];
    image: NextSeoProps['openGraph']['images'][0]['url'];
    url: NextSeoProps['canonical'];
    type: NextSeoProps['openGraph']['type'];
    /** Fields `section` and `authors` are pre-set */
    article: NextSeoProps['openGraph']['article'];
};

export function constructSeoData({
    title,
    description,
    image,
    url,
    type,
    article,
}: SimpleSeoData): NextSeoProps {
    return {
        title: `${title} | Adam Hultman`,
        description,
        canonical: url,
        openGraph: {
            title,
            description,
            url,
            type,
            siteName: 'Adam Hultman',
            images: [
                {
                    url: image,
                    secureUrl: image, // assume https
                    type: 'image/jpeg',
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            article: {
                section: 'Technology',
                authors: ['Adam Hultman'],
                ...article,
            },
        },
        twitter: {
            handle: '@RecursiveAge',
            cardType: 'summary_large_image',
        },
    };
}
