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
        // Google prefers an array for the image field.
        ...(image && { image: [image] }),
        url,
        author: {
            '@type': 'Person',
            name: 'Adam Hultman',
            url: 'https://hultman.dev',
        },
        // Rich Results expects an Organization publisher with a logo.
        publisher: {
            '@type': 'Organization',
            name: 'Adam Hultman',
            url: 'https://hultman.dev',
            logo: {
                '@type': 'ImageObject',
                url: 'https://hultman.dev/android-chrome-512x512.png',
                width: 512,
                height: 512,
            },
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
                    // Escape "<" so a "</script>" in any Notion-sourced field
                    // can't break out of the script tag.
                    __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
                }}
                key="blogposting-jsonld"
            />
        </Head>
    );
}
