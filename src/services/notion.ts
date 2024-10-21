import { Client } from '@notionhq/client';
import {
    QueryDatabaseParameters,
    PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
    BlogPost,
    Book,
    Bookmark,
    DatabaseName,
    FormatterReturnType,
    NotionPageWithBlocks,
    pageIsPageObjectResponse,
} from '../types/notion';
import {
    getCover,
    getDateField,
    getLink,
    getRichText,
    getTags,
    getTitle,
} from '../utils/notion';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const MAP_DATABASE_CONFIG: {
    [K in DatabaseName]: {
        id: string;
        defaultFilter: QueryDatabaseParameters['filter'];
        formatter: (page: PageObjectResponse) => FormatterReturnType<K>;
    };
} = {
    books: {
        id: process.env.NOTION_DATABASE_ID_BOOKS,
        defaultFilter: undefined,
        formatter: formatBookData,
    },
    blog: {
        id: process.env.NOTION_DATABASE_ID_BLOG,
        defaultFilter: {
            property: 'Published',
            date: { is_not_empty: true },
        },
        formatter: formatBlogPostData,
    },
    bookmarks: {
        id: process.env.NOTION_DATABASE_ID_BOOKMARKS,
        defaultFilter: undefined,
        formatter: formatBookmarkData,
    },
};

function formatBookData(book: PageObjectResponse): Book | null {
    if (!pageIsPageObjectResponse(book)) {
        return null;
    }

    return {
        id: book.id,
        title: getTitle(book),
        author: getRichText(book, 'Author'),
        link: getLink(book, 'Link'),
        cover: getCover(book),
    };
}

function formatBlogPostData(page: PageObjectResponse): BlogPost | null {
    if (!pageIsPageObjectResponse(page)) {
        return null;
    }

    return {
        id: page.id,
        title: getTitle(page),
        publishedDate: getDateField(page, 'Published'),
        tags: getTags(page, 'Tags'),
        description: getRichText(page, 'AI custom autofill'),
        cover: getCover(page),
        url: page.url,
        created_time: page.created_time,
        last_edited_time: page.last_edited_time,
    };
}

function formatBookmarkData(bookmark: PageObjectResponse): Bookmark | null {
    if (!pageIsPageObjectResponse(bookmark)) {
        return null;
    }

    // get cover from https://icon.horse/icon/<domain>
    const domain = new URL(getLink(bookmark, 'Link')).hostname;
    const cover = `https://icon.horse/icon/${domain}`;

    return {
        id: bookmark.id,
        title: getTitle(bookmark),
        link: getLink(bookmark, 'Link'),
        description: getRichText(bookmark, 'Description'),
        cover,
        tags: getTags(bookmark, 'Tags'),
    };
}

interface NotionFetchOptions {
    page_size?: number;
    filter?: QueryDatabaseParameters['filter'];
    sorts?: QueryDatabaseParameters['sorts'];
}

// parsed from standard language... do something crazy and
// use GPT to parse from natural language to notion query language... 👀
// expose this search functionality to the user, so they can search for books in their own words
export async function searchBooks(query: string) {
    // pass thru gpt to parse query to notion query language

    // pass thru fetchBooks with parsed query

    return [];
}

export async function fetchNotions<T extends DatabaseName>(
    db: T,
    { page_size = 10, filter, sorts }: NotionFetchOptions = {}
): Promise<FormatterReturnType<T>[]> {
    const dbConfig = MAP_DATABASE_CONFIG[db];

    if (!dbConfig.id) {
        return [];
    }

    try {
        const r = await notion.databases.query({
            database_id: dbConfig.id,
            filter: filter ?? dbConfig.defaultFilter,
            page_size,
            sorts,
        });

        return r.results.map(
            (p) => pageIsPageObjectResponse(p) && dbConfig.formatter(p)
        );
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export async function fetchNotion<T extends DatabaseName>(
    db: T,
    id: string
): Promise<NotionPageWithBlocks<T>> {
    if (!db || !id) {
        return null;
    }

    try {
        const pageResponse = await notion.pages.retrieve({ page_id: id });

        if (!pageIsPageObjectResponse(pageResponse)) {
            return null;
        }

        const blocks = await notion.blocks.children.list({ block_id: id });
        const page = MAP_DATABASE_CONFIG[db].formatter(pageResponse);

        return { page, blocks };
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}
