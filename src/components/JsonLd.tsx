import React from 'react';
import Head from 'next/head';

const SITE_URL = 'https://hultman.dev';

const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Adam Hultman',
    url: SITE_URL,
    image: `${SITE_URL}/images/adam.jpg`,
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
        'Vancouver software engineer building web products and AI features. Experience at Kopperfield and Assembly Digital, plus independent projects.',
};

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Adam Hultman',
    url: SITE_URL,
    description:
        'The portfolio of Adam Hultman, a software engineer in Vancouver building web products and AI features.',
    author: {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
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
