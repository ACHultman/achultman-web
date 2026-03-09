import React from 'react';
import Head from 'next/head';

const SITE_URL = 'https://hultman.dev';

const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adam Hultman',
    url: SITE_URL,
    jobTitle: 'Software Engineer',
    worksFor: {
        '@type': 'Organization',
        name: 'Kopperfield',
    },
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Vancouver',
        addressRegion: 'BC',
        addressCountry: 'CA',
    },
    sameAs: [
        'https://github.com/ACHultman',
        'https://www.linkedin.com/in/adam-hultman/',
        'https://twitter.com/HultmanAdam',
    ],
    knowsAbout: [
        'TypeScript',
        'React',
        'Next.js',
        'Node.js',
        'AI/LLM Integration',
        'Cybersecurity',
        'AWS',
        'Golang',
    ],
    alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'University of Victoria',
    },
    description:
        'Software engineer in Vancouver building AI-powered platforms, developer tools, and secure web applications.',
};

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Adam Hultman',
    url: SITE_URL,
    description:
        'Software engineer in Vancouver building AI-powered platforms, developer tools, and secure web applications.',
    author: {
        '@type': 'Person',
        name: 'Adam Hultman',
    },
};

export default function JsonLd() {
    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(personSchema),
                }}
                key="person-jsonld"
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema),
                }}
                key="website-jsonld"
            />
        </Head>
    );
}
