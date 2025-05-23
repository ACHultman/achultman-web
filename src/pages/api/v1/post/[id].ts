import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverConfig } from '../../../../config';
import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import { pageIsPageObjectResponse } from '../../../../utils/notion';

const notion = new Client({ auth: serverConfig.NOTION_API_KEY });

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        const pageResponse = await notion.pages.retrieve({ page_id: id });

        const blocks = await notion.blocks.children.list({
            block_id: id,
        });

        const page = formatPageData(pageResponse);

        return res.status(200).json({ page, blocks });
    } catch (error) {
        console.error('Error fetching page:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    function formatPageData(pageResponse: GetPageResponse) {
        if (!pageIsPageObjectResponse(pageResponse)) {
            return {
                id: pageResponse.id,
                title: 'Untitled',
                publishedDate: null,
                tags: [],
                description: '',
                coverImage: null,
            };
        }

        const properties = pageResponse.properties;

        const title =
            (properties.Name?.type === 'title' &&
                properties.Name.title[0]?.plain_text) ||
            'Untitled';

        const coverImage =
            pageResponse.cover?.type === 'external'
                ? pageResponse.cover.external.url
                : null;
        const publishedDate =
            (properties.Published?.type === 'date' &&
                properties.Published.date?.start) ||
            null;
        const tags =
            (properties.Tags?.type === 'multi_select' &&
                properties.Tags.multi_select?.map((tag) => tag.name)) ||
            [];
        const description =
            (properties['AI custom autofill']?.type === 'rich_text' &&
                properties['AI custom autofill'].rich_text[0]?.plain_text) ||
            '';

        return {
            id: pageResponse.id,
            title,
            publishedDate,
            tags,
            description,
            coverImage,
        };
    }
}
