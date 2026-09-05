import { GetServerSideProps } from 'next';
import { fetchNotions } from '../services/notion';
import type { BlogPost } from '../types/notion';
import { getBaseUrl } from '../utils/baseUrl';

const SITE_URL = getBaseUrl();

function Sitemap() {
    // getServerSideProps will handle the response
    return null;
}

// These dates represent meaningful content changes, not the time the sitemap
// happens to be requested. False daily updates waste crawl attention and make
// the signal less useful to search engines.
const STATIC_PATHS: Array<{ path: string; lastmod: string }> = [
    { path: '', lastmod: '2026-09-05' },
    { path: '/about', lastmod: '2026-09-04' },
    { path: '/privacy', lastmod: '2026-09-04' },
    { path: '/blog', lastmod: '2026-06-15' },
    { path: '/books', lastmod: '2026-03-09' },
    { path: '/bookmarks', lastmod: '2026-03-09' },
    { path: '/labs', lastmod: '2026-03-11' },
    { path: '/labs/interaction-checker', lastmod: '2026-03-09' },
    { path: '/labs/token-viz', lastmod: '2026-03-09' },
    { path: '/labs/prompt-duel', lastmod: '2026-03-09' },
    { path: '/labs/agent-flow', lastmod: '2026-03-09' },
    { path: '/labs/evidence-viz', lastmod: '2026-03-09' },
    { path: '/labs/beatmaker', lastmod: '2026-03-09' },
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
                    `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
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
        'public, s-maxage=43200, stale-while-revalidate=86400'
    );

    try {
        const posts: BlogPost[] = await fetchNotions('blog', {
            page_size: 100,
        });

        const postUrls: SitemapUrl[] = posts.map((post) => ({
            loc: `${SITE_URL}/blog/${post.slug}`,
            lastmod: post.last_edited_time.slice(0, 10),
        }));

        res.write(buildSitemapXml([...staticUrls, ...postUrls]));
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // Still emit a valid sitemap of static paths so a transient Notion
        // outage doesn't drop every URL from a crawl.
        res.write(buildSitemapXml(staticUrls));
    }

    res.end();
    return { props: {} };
};

export default Sitemap;
