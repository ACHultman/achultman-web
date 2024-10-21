import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function formatPageData(page: any) {
    const title = page.properties.Name?.title[0]?.plain_text || 'Untitled';
    const coverImage =
        page.cover?.type === 'external' ? page.cover.external.url : null;
    const publishedDate = page.properties.Published?.date?.start || null;
    const tags =
        page.properties.Tags?.multi_select?.map(
            (tag: { name: string }) => tag.name
        ) || [];
    const description =
        page.properties['AI custom autofill']?.rich_text[0]?.plain_text || '';

    return {
        id: page.id,
        title,
        publishedDate,
        tags,
        description,
        coverImage,
        url: page.url,
        created_time: page.created_time,
        last_edited_time: page.last_edited_time,
    };
}

export async function fetchPosts() {
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
        return [];
    }

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: 'Published',
                date: { is_not_empty: true },
            },
        });

        const posts = response.results
            .filter(
                (page: any) =>
                    page.object === 'page' && page.properties?.Published?.date
            )
            .map(formatPageData);

        return posts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export async function fetchPost(id: string) {
    try {
        const pageResponse = await notion.pages.retrieve({ page_id: id });
        const blocks = await notion.blocks.children.list({ block_id: id });
        const page = formatPageData(pageResponse);

        return { page, blocks };
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}
