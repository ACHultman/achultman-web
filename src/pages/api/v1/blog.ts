import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { config } from '../../../config';

const notion = new Client({ auth: config.NOTION_API_KEY });

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const databaseId = config.NOTION_DATABASE_ID_BLOG;

    try {
        if (!databaseId) {
            return res
                .status(500)
                .json({ message: 'Database ID not provided' });
        }

        const response = await notion.databases.query({
            database_id: databaseId,
        });

        const posts = response.results
            .filter((page: any) => page.properties?.Published?.date)
            .map((page: any) => {
                const {
                    id,
                    created_time,
                    last_edited_time,
                    properties,
                    cover,
                    url,
                } = page;
                if (!properties) {
                    return null;
                }

                let title = 'Untitled';
                if (
                    properties.Name.type === 'title' &&
                    properties.Name.title.length > 0
                ) {
                    title = properties.Name.title[0].plain_text;
                }

                let description = '';
                if (
                    properties['AI custom autofill']?.type === 'rich_text' &&
                    properties['AI custom autofill']?.rich_text.length > 0
                ) {
                    description =
                        properties['AI custom autofill'].rich_text[0]
                            .plain_text;
                }

                let publishedDate = null;
                if (
                    properties.Published.type === 'date' &&
                    properties.Published.date
                ) {
                    publishedDate = properties.Published.date.start;
                }

                let tags = [];

                if (
                    properties.Tags.type === 'multi_select' &&
                    properties.Tags.multi_select.length > 0
                ) {
                    tags = properties.Tags.multi_select.map(
                        (tag: { name: string }) => tag.name
                    );
                }

                let coverImage = null;
                if (cover.type === 'external' && cover.external) {
                    coverImage = cover.external.url;
                }

                return {
                    id,
                    title,
                    description,
                    publishedDate,
                    tags,
                    coverImage,
                    url,
                    created_time,
                    last_edited_time,
                };
            });

        return res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
