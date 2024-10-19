import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
function formatPageData(pageResponse) {
    const title =
        pageResponse.properties.Name?.title[0]?.plain_text || 'Untitled';

    const coverImage =
        pageResponse.cover?.type === 'external'
            ? pageResponse.cover.external.url
            : null;
    const publishedDate =
        pageResponse.properties.Published?.date?.start || null;
    const tags =
        pageResponse.properties.Tags?.multi_select?.map((tag) => tag.name) ||
        [];
    const description =
        pageResponse.properties['AI custom autofill']?.rich_text[0]
            ?.plain_text || '';

    return {
        id: pageResponse.id,
        title,
        publishedDate,
        tags,
        description,
        coverImage,
    };
}

export async function fetchPosts() {
    const databaseId = process.env.NOTION_DATABASE_ID;

    try {
        if (!databaseId) {
            return [];
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

        return posts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export async function fetchPost(id: string) {
    try {
        const pageResponse = await notion.pages.retrieve({ page_id: id });

        const blocks = await notion.blocks.children.list({
            block_id: id,
        });

        const page = formatPageData(pageResponse);

        return { page, blocks };
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}
