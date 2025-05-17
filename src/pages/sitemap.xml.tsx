import { GetServerSideProps } from 'next';
import { fetchNotions } from '../services/notion';
import type { BlogPost } from '../types/notion';

const SITE_URL =
    process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';

function Sitemap() {
    // getServerSideProps will handle the response
    return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    try {
        const staticPaths = ['', '/about', '/bookmarks', '/books', '/blog'];
        const posts: BlogPost[] = await fetchNotions('blog', {
            page_size: 100,
        });

        const urls = staticPaths.map((path) => ({
            loc: `${SITE_URL}${path}`,
            lastmod: new Date().toISOString().split('T')[0],
        }));

        const postUrls = posts.map((post) => ({
            loc: `${SITE_URL}/blog/${post.id}`,
            lastmod: post.last_edited_time.split('T')[0],
        }));

        const allUrls = [...urls, ...postUrls];

        const xml =
            `<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            allUrls
                .map(
                    ({ loc, lastmod }) =>
                        `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
                )
                .join('\n') +
            `\n</urlset>`;

        res.setHeader('Content-Type', 'text/xml');
        res.write(xml);
        res.end();

        return { props: {} };
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return { props: {} };
    }
};

export default Sitemap;
