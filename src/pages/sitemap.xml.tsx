import { GetServerSideProps } from 'next';
import { fetchNotions } from '../services/notion';
import type { BlogPost } from '../types/notion';
import { getBaseUrl } from '../utils/baseUrl';

const SITE_URL = getBaseUrl();

function Sitemap() {
    // getServerSideProps will handle the response
    return null;
}

const STATIC_PATHS = [
    '',
    '/about',
    '/bookmarks',
    '/books',
    '/blog',
    '/labs',
    '/labs/interaction-checker',
    '/labs/token-viz',
    '/labs/prompt-duel',
    '/labs/agent-flow',
    '/labs/evidence-viz',
    '/labs/beatmaker',
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
    const today = new Date().toISOString().slice(0, 10);
    const staticUrls: SitemapUrl[] = STATIC_PATHS.map((path) => ({
        loc: `${SITE_URL}${path}`,
        lastmod: today,
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
            loc: `${SITE_URL}/blog/${post.id}`,
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
