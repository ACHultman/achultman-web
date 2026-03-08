import React from 'react';
import Head from 'next/head';

interface BlogPostingJsonLdProps {
    headline: string;
    datePublished?: string;
    dateModified?: string;
    description?: string;
    image?: string;
    url: string;
}

export default function BlogPostingJsonLd({
    headline,
    datePublished,
    dateModified,
    description,
    image,
    url,
}: BlogPostingJsonLdProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline,
        ...(datePublished && { datePublished }),
        ...(dateModified && { dateModified }),
        ...(description && { description }),
        ...(image && { image }),
        url,
        author: {
            '@type': 'Person',
            name: 'Adam Hultman',
            url: 'https://hultman.dev',
        },
        publisher: {
            '@type': 'Person',
            name: 'Adam Hultman',
            url: 'https://hultman.dev',
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
    };

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema),
                }}
                key="blogposting-jsonld"
            />
        </Head>
    );
}
