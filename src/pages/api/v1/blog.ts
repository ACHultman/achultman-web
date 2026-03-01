import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchNotions } from '../../../services/notion';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const posts = await fetchNotions('blog', {
            page_size: 100,
            sorts: [{ property: 'Published', direction: 'descending' }],
        });

        return res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
