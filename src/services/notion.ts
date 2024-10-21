import { Client, NotionClientError } from '@notionhq/client';
import {
    QueryDatabaseParameters,
    PageObjectResponse,
    GetPageResponse,
} from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function pageIsPageObjectResponse(
    page: GetPageResponse
): page is PageObjectResponse {
    return page.object === 'page';
}

function formatBookData(book: GetPageResponse) {
    if (!pageIsPageObjectResponse(book)) {
        return null;
    }

    let title = 'Untitled';
    if (book.properties.Name?.type === 'title') {
        title = book.properties.Name.title[0].plain_text ?? '';
    }

    let author = '';
    if (book.properties.Author?.type === 'rich_text') {
        author = book.properties.Author.rich_text[0].plain_text ?? '';
    }

    let link = '';
    if (book.properties.Link?.type === 'url') {
        link = book.properties.Link.url ?? '';
    }

    let cover = null;
    if (book.cover?.type === 'external') {
        cover = book.cover.external.url;
    } else if (book.cover?.type === 'file') {
        cover = book.cover.file.url ?? '';
    }

    return {
        id: book.id,
        title,
        author,
        link,
        cover,
    };
}

// parsed from standard language... do something crazy and
// use GPT to parse from natural language to notion query language... 👀
// expose this search functionality to the user, so they can search for books in their own words
export async function searchBooks(query: string) {
    // pass thru gpt to parse query to notion query language

    // pass thru fetchBooks with parsed query

    return [];
}

type DatabaseName = 'books' | 'blog';

const DATABASE_MAP: Record<DatabaseName, string> = {
    books: process.env.NOTION_DATABASE_ID_BOOKS,
    blog: process.env.NOTION_DATABASE_ID_BLOG,
};

const DATABASE_DEFAULT_FILTERS: Partial<
    Record<DatabaseName, QueryDatabaseParameters['filter']>
> = {
    blog: {
        property: 'Published',
        date: { is_not_empty: true },
    },
};

interface NotionFetchOptions {
    page_size?: number;
    filter?: QueryDatabaseParameters['filter'];
    sorts?: QueryDatabaseParameters['sorts'];
}

export async function fetchNotions(
    db: DatabaseName,
    { page_size = 10, filter, sorts }: NotionFetchOptions = {}
) {
    const databaseId = DATABASE_MAP[db];

    if (!databaseId) {
        return [];
    }

    const defaultFilter = DATABASE_DEFAULT_FILTERS[db];

    console.log('fetching', db, databaseId, {
        page_size,
        filter: filter ?? defaultFilter,
        sorts,
    });

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: filter ?? defaultFilter,
            page_size,
            sorts,
        });

        const posts = response.results.map(formatBookData);

        return posts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export async function fetchBook(id: string) {
    try {
        const pageResponse = await notion.pages.retrieve({ page_id: id });
        const blocks = await notion.blocks.children.list({ block_id: id });
        const page = formatBookData(pageResponse);

        return { page, blocks };
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}
