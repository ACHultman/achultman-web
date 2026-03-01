import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchNotions } from '../../../../services/notion';
import type { Book } from '../../../../types/notion';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { limit = '5' } = req.query;

        const books = await fetchNotions('books', {
            page_size: parseInt(limit as string, 10),
        });

        return res.status(200).json({
            success: true,
            books: books.map((book: Book) => ({
                title: book.title,
                author: book.author,
                link: book.link,
            })),
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
}
