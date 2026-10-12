import { GetServerSideProps } from 'next';
import { fetchNotions } from '../services/notion';
import type { BlogPost } from '../types/notion';
import { getBaseUrl } from '../utils/baseUrl';
import { escapeXml } from '../utils/xml';
import { toolPages } from '../data/toolPages';

const SITE_URL = getBaseUrl();

function Sitemap() {
    // getServerSideProps will handle the response
    return null;
}

// These dates represent meaningful content changes, not the time the sitemap
// happens to be requested. False daily updates waste crawl attention and make
// the signal less useful to search engines.
const STATIC_PATHS: Array<{ path: string; lastmod: string }> = [
    { path: '', lastmod: '2026-10-11' },
    { path: '/consulting', lastmod: '2026-10-11' },
    { path: '/work', lastmod: '2026-10-12' },
    { path: '/contact', lastmod: '2026-10-10' },
    { path: '/resume', lastmod: '2026-10-10' },
    {
        path: '/workflow-automation-roi-calculator',
        lastmod: '2026-10-11',
    },
    { path: '/about', lastmod: '2026-10-10' },
    { path: '/privacy', lastmod: '2026-10-10' },
    { path: '/blog', lastmod: '2026-10-10' },
    { path: '/books', lastmod: '2026-03-09' },
    { path: '/bookmarks', lastmod: '2026-03-09' },
    { path: '/tools', lastmod: '2026-10-12' },
    ...Object.values(toolPages).map(({ path }) => ({
        path,
        lastmod: '2026-10-12',
    })),
];

interface SitemapUrl {
    loc: string;
    lastmod: string;
}

function buildSitemapXml(urls: SitemapUrl[]): string {
    return (
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
            .map(
                ({ loc, lastmod }) =>
                    `<url><loc>${escapeXml(loc)}</loc><lastmod>${escapeXml(lastmod)}</lastmod></url>`
            )
            .join('\n') +
        `\n</urlset>`
    );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const staticUrls: SitemapUrl[] = STATIC_PATHS.map(({ path, lastmod }) => ({
        loc: `${SITE_URL}${path}`,
        lastmod,
    }));

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400'
    );

    try {
        const posts: BlogPost[] = await fetchNotions('blog', {
            page_size: 100,
            all: true,
        });

        const postUrls: SitemapUrl[] = posts.map((post) => ({
            loc: `${SITE_URL}/blog/${post.slug}`,
            lastmod: post.last_edited_time.slice(0, 10),
        }));

        res.write(buildSitemapXml([...staticUrls, ...postUrls]));
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // Report a retryable outage instead of publishing an incomplete map.
        res.statusCode = 503;
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Retry-After', '60');
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.write('Sitemap is temporarily unavailable. Please retry later.');
    }

    res.end();
    return { props: {} };
};

export default Sitemap;
