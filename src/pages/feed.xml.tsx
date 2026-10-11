import { GetServerSideProps } from 'next';
import { fetchNotions } from '../services/notion';
import type { BlogPost } from '../types/notion';
import { getBaseUrl } from '../utils/baseUrl';
import { escapeXml } from '../utils/xml';

const SITE_URL = getBaseUrl();

function Feed() {
    return null;
}

function buildFeedXml(itemsXml: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Adam Hultman - Working notes</title>
    <link>${escapeXml(SITE_URL)}/blog</link>
    <description>Articles by Adam Hultman on software engineering, building products, and working with AI.</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(SITE_URL)}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400'
    );

    try {
        const posts: BlogPost[] = await fetchNotions('blog', {
            page_size: 100,
            all: true,
            sorts: [{ property: 'Published', direction: 'descending' }],
        });

        const items = posts.map((post) => {
            const pubDate = post.publishedDate
                ? new Date(post.publishedDate).toUTCString()
                : new Date(post.last_edited_time).toUTCString();

            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(`${SITE_URL}/blog/${post.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${SITE_URL}/blog/${post.slug}`)}</guid>
      <pubDate>${pubDate}</pubDate>${post.description ? `\n      <description>${escapeXml(post.description)}</description>` : ''}
    </item>`;
        });

        res.write(buildFeedXml(items.join('\n')));
    } catch (error) {
        console.error('Error generating RSS feed:', error);
        // Do not tell feed readers that the published collection is empty.
        res.statusCode = 503;
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Retry-After', '60');
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.write('Writing is temporarily unavailable. Please retry later.');
    }

    res.end();
    return { props: {} };
};

export default Feed;
