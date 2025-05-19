import { Client } from '@notionhq/client';
import type {
    PageObjectResponse,
    QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints';
import { serverConfig } from '../config';
import {
    Book,
    Bookmark,
    BlogPost,
    DatabaseName,
    FormatterReturnType,
} from '../types/notion';
import {
    getDateField,
    getCover,
    getLink,
    getRichText,
    getTags,
    getTitle,
    pageIsPageObjectResponse,
    isBlockObjectResponse,
} from '../utils/notion';

const notion = new Client({ auth: serverConfig.NOTION_API_KEY });

const MAP_DATABASE_CONFIG: {
    [K in DatabaseName]: {
        id: string;
        defaultFilter: QueryDatabaseParameters['filter'];
        formatter: (page: PageObjectResponse) => FormatterReturnType<K> | null;
    };
} = {
    books: {
        id: serverConfig.NOTION_DATABASE_ID_BOOKS,
        defaultFilter: undefined,
        formatter: formatBookData,
    },
    blog: {
        id: serverConfig.NOTION_DATABASE_ID_BLOG,
        defaultFilter: {
            property: 'Published',
            date: { is_not_empty: true },
        },
        formatter: formatBlogPostData,
    },
    bookmarks: {
        id: serverConfig.NOTION_DATABASE_ID_BOOKMARKS,
        defaultFilter: undefined,
        formatter: formatBookmarkData,
    },
};

function formatBookData(book: PageObjectResponse): Book | null {
    if (!pageIsPageObjectResponse(book)) {
        return null;
    }

    const cover = getCover(book);

    return {
        id: book.id,
        title: getTitle(book),
        author: getRichText(book, 'Author'),
        link: getLink(book, 'Link'),
        cover,
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

    return {
        id: bookmark.id,
        title: getTitle(bookmark),
        link: getLink(bookmark, 'Link'),
        description: getRichText(bookmark, 'Description'),
        tags: getTags(bookmark, 'Tags'),
        lastEditedTime: bookmark.last_edited_time,
    };
}

interface NotionFetchOptions {
    page_size?: number;
    filter?: QueryDatabaseParameters['filter'];
    sorts?: QueryDatabaseParameters['sorts'];
}

export async function fetchNotions<T extends DatabaseName>(
    db: T,
    { page_size = 10, filter, sorts }: NotionFetchOptions = {}
) {
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

        return r.results
            .map((p) => {
                if (p.object === 'page' && pageIsPageObjectResponse(p)) {
                    return dbConfig.formatter(p);
                }
                return null;
            })
            .filter(Boolean) as FormatterReturnType<T>[];
    } catch (error) {
        console.error('Error fetching notions:', error);
        return [];
    }
}

export async function fetchNotion<T extends DatabaseName>(db: T, id: string) {
    if (!db || !id) {
        return null;
    }

    try {
        const pageResponse = await notion.pages.retrieve({
            page_id: id,
        });

        if (!pageIsPageObjectResponse(pageResponse)) {
            return null;
        }

        const blockChildrenResponse = await notion.blocks.children.list({
            block_id: id,
        });
        const filteredBlocks = blockChildrenResponse.results.filter(
            isBlockObjectResponse
        );

        const page = MAP_DATABASE_CONFIG[db].formatter(pageResponse);

        if (!page) {
            return null;
        }

        return {
            page,
            blocks: { ...blockChildrenResponse, results: filteredBlocks },
        };
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}
