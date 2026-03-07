import React from 'react';
import Head from 'next/head';

const SITE_URL = 'https://hultman.dev';

const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adam Hultman',
    url: SITE_URL,
    jobTitle: 'Full Stack Software Developer',
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
        'Full-stack software developer with 5+ years building AI-powered, secure, and scalable platforms.',
};

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Adam Hultman',
    url: SITE_URL,
    description:
        'Full-stack software developer with 5+ years building AI-powered, secure, and scalable platforms.',
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
