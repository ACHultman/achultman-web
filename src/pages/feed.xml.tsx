import { GetServerSideProps } from 'next';
import { fetchNotions } from '../services/notion';
import type { BlogPost } from '../types/notion';

const SITE_URL =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_APP_BASE_URL ||
    'https://hultman.dev';

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function Feed() {
    return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    try {
        const posts: BlogPost[] = await fetchNotions('blog', {
            page_size: 100,
            sorts: [{ property: 'Published', direction: 'descending' }],
        });

        const items = posts.map((post) => {
            const pubDate = post.publishedDate
                ? new Date(post.publishedDate).toUTCString()
                : new Date(post.last_edited_time).toUTCString();

            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.id}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.id}</guid>
      <pubDate>${pubDate}</pubDate>${post.description ? `\n      <description>${escapeXml(post.description)}</description>` : ''}
    </item>`;
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Adam Hultman — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes on engineering, AI, security, and building things that last.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`;

        res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        res.setHeader(
            'Cache-Control',
            'public, s-maxage=43200, stale-while-revalidate=86400'
        );
        res.write(xml);
        res.end();

        return { props: {} };
    } catch (error) {
        console.error('Error generating RSS feed:', error);
        return { props: {} };
    }
};

export default Feed;
