import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchNotions } from '../../../../services/notion';
import type { BlogPost } from '../../../../types/notion';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { query, limit = '5' } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: 'Query parameter required' });
        }

        const posts = await fetchNotions('blog', {
            page_size: 20,
        });

        // Filter posts based on query matching title, description, or tags
        const searchLower = query.toLowerCase();
        const filteredPosts = posts
            .filter((post: BlogPost) => {
                const titleMatch = post.title
                    .toLowerCase()
                    .includes(searchLower);
                const descMatch =
                    post.description?.toLowerCase().includes(searchLower) ||
                    false;
                const tagMatch = post.tags.some((tag) =>
                    tag.toLowerCase().includes(searchLower)
                );
                return titleMatch || descMatch || tagMatch;
            })
            .slice(0, parseInt(limit as string, 10));

        return res.status(200).json({
            success: true,
            posts: filteredPosts.map((post: BlogPost) => ({
                title: post.title,
                description: post.description,
                tags: post.tags,
                publishedDate: post.publishedDate,
                url: `/blog/${post.id}`,
            })),
        });
    } catch (error) {
        console.error('Error searching blog posts:', error);
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
}
