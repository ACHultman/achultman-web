import React from 'react';
import Head from 'next/head';

const SITE_URL = 'https://hultman.dev';

const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adam Hultman',
    url: SITE_URL,
    jobTitle: 'Full-Stack Engineer',
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
        'Full-stack engineer at Kopperfield and independent software consultant.',
};

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Adam Hultman',
    url: SITE_URL,
    description:
        'Internal tools, AI features and web products by Adam Hultman, a software engineer in Vancouver.',
    author: {
        '@type': 'Person',
        name: 'Adam Hultman',
    },
};

const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '30-day software project',
    serviceType: 'Custom software development and product engineering',
    url: `${SITE_URL}/#offer`,
    description:
        'A focused 30-day engagement for an internal tool, AI feature, integration or web product. Ongoing product work is available month to month.',
    provider: {
        '@type': 'Person',
        name: 'Adam Hultman',
        url: SITE_URL,
    },
    areaServed: ['Canada', 'United States'],
    audience: {
        '@type': 'BusinessAudience',
        audienceType: 'B2B product and operations teams',
    },
    offers: {
        '@type': 'Offer',
        url: `${SITE_URL}/#contact`,
        priceCurrency: 'USD',
        price: '5000',
        description: 'Starting price for one focused 30-day software project.',
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(serviceSchema),
                }}
                key="service-jsonld"
            />
        </Head>
    );
}
