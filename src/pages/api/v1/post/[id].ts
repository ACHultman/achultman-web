import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchNotion, fetchNotions } from '../../../../services/notion';
import { isNotionId } from '../../../../utils/slug';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { id } = req.query;
    if (typeof id !== 'string' || !isNotionId(id)) {
        return res.status(400).json({ message: 'Invalid request' });
    }
    try {
        // The same published-only boundary as the article pages. Knowing a
        // Notion ID must not make an unpublished page publicly accessible.
        const posts = await fetchNotions('blog', { page_size: 100, all: true });
        const match = posts.find(
            (post) =>
                post.id.replace(/-/g, '').toLowerCase() ===
                id.replace(/-/g, '').toLowerCase()
        );
        if (!match) return res.status(404).json({ message: 'Post not found' });
        const post = await fetchNotion('blog', match.id);
        if (!post?.page.publishedDate) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({
            page: { ...post.page, coverImage: post.page.cover },
            blocks: post.blocks,
        });
    } catch {
        return res
            .status(503)
            .json({ message: 'Writing is temporarily unavailable' });
    }
}
