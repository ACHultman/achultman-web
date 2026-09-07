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
    description: 'Fixed 30-day AI product pilots for B2B operations teams.',
    author: {
        '@type': 'Person',
        name: 'Adam Hultman',
    },
};

const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '30-day AI workflow automation pilot',
    serviceType: 'AI workflow automation consulting and product engineering',
    url: `${SITE_URL}/#offer`,
    description:
        'A fixed 30-day engagement to build and test a small AI tool around one costly manual workflow. Ongoing product work is offered month to month after a useful pilot.',
    provider: {
        '@type': 'Person',
        name: 'Adam Hultman',
        url: SITE_URL,
    },
    areaServed: ['Canada', 'United States'],
    audience: {
        '@type': 'BusinessAudience',
        audienceType: 'B2B software and service operations teams',
    },
    offers: {
        '@type': 'Offer',
        url: `${SITE_URL}/#contact`,
        priceCurrency: 'USD',
        price: '5000',
        description: 'Starting price for one defined 30-day workflow pilot.',
        availability: 'https://schema.org/LimitedAvailability',
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
