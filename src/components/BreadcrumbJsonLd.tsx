import Head from 'next/head';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbJsonLdProps {
    items: BreadcrumbItem[];
}

/**
 * Emits BreadcrumbList structured data so Google can show a breadcrumb trail
 * (e.g. Home › Blog › Post) in search results.
 */
export default function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
                }}
                key="breadcrumb-jsonld"
            />
        </Head>
    );
}
