import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverConfig } from '../../../config';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: serverConfig.NOTION_API_KEY });

function isFullPageObjectResponse(page: any): page is PageObjectResponse {
    return page && page.object === 'page' && page.properties;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const databaseId = serverConfig.NOTION_DATABASE_ID_BLOG;

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
            .filter((page): page is PageObjectResponse => {
                if (!isFullPageObjectResponse(page)) {
                    return false;
                }
                const publishedProp = page.properties.Published;
                return !!(
                    publishedProp &&
                    publishedProp.type === 'date' &&
                    publishedProp.date
                );
            })
            .map((page: PageObjectResponse) => {
                const {
                    id,
                    created_time,
                    last_edited_time,
                    properties,
                    cover,
                    url,
                } = page;

                let title = 'Untitled';
                const nameProp = properties.Name;
                if (
                    nameProp &&
                    nameProp.type === 'title' &&
                    nameProp.title.length > 0
                ) {
                    title = nameProp.title[0].plain_text;
                }

                let description = '';
                const descriptionProp = properties['AI custom autofill'];
                if (
                    descriptionProp &&
                    descriptionProp.type === 'rich_text' &&
                    descriptionProp.rich_text.length > 0
                ) {
                    description = descriptionProp.rich_text[0].plain_text;
                }

                let publishedDate = null;
                const publishedProp = properties.Published;
                if (
                    publishedProp &&
                    publishedProp.type === 'date' &&
                    publishedProp.date
                ) {
                    publishedDate = publishedProp.date.start;
                }

                let tags: string[] = [];
                const tagsProp = properties.Tags;
                if (
                    tagsProp &&
                    tagsProp.type === 'multi_select' &&
                    tagsProp.multi_select.length > 0
                ) {
                    tags = tagsProp.multi_select.map(
                        (tag: { name: string }) => tag.name
                    );
                }

                let coverImage = null;
                if (cover && cover.type === 'external' && cover.external) {
                    coverImage = cover.external.url;
                } else if (cover && cover.type === 'file' && cover.file) {
                    coverImage = cover.file.url;
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
            })
            .filter(Boolean);

        return res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
