import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchNotions } from '../../../../services/notion';
import type { Bookmark } from '../../../../types/notion';

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

        const bookmarks = await fetchNotions('bookmarks', {
            page_size: 30,
        });

        // Filter bookmarks based on query matching title, description, or tags
        const searchLower = query.toLowerCase();
        const filteredBookmarks = bookmarks
            .filter((bookmark: Bookmark) => {
                const titleMatch = bookmark.title
                    .toLowerCase()
                    .includes(searchLower);
                const descMatch =
                    bookmark.description?.toLowerCase().includes(searchLower) ||
                    false;
                const tagMatch = bookmark.tags.some((tag) =>
                    tag.toLowerCase().includes(searchLower)
                );
                return titleMatch || descMatch || tagMatch;
            })
            .slice(0, parseInt(limit as string, 10));

        return res.status(200).json({
            success: true,
            bookmarks: filteredBookmarks.map((bookmark: Bookmark) => ({
                title: bookmark.title,
                link: bookmark.link,
                description: bookmark.description,
                tags: bookmark.tags,
            })),
        });
    } catch (error) {
        console.error('Error searching bookmarks:', error);
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
}
