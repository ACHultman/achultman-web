import { Client } from '@notionhq/client';
import type {
    PageObjectResponse,
    QueryDatabaseParameters,
    ListBlockChildrenResponse,
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
import { estimateReadingTime } from '../utils/readingTime';
import { slugify } from '../utils/slug';

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

    const title = getTitle(page);
    // Prefer an explicit Notion "Slug" property (stable, author-controlled);
    // otherwise derive one from the title so every post gets a clean URL.
    const slug = getRichText(page, 'Slug') || slugify(title);

    return {
        id: page.id,
        slug,
        title,
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

/**
 * List a page's top-level child blocks, following pagination.
 *
 * Notion returns at most 100 blocks per call; long posts would otherwise be
 * silently truncated in both rendering and reading-time estimation. Bounded by
 * `maxPages` to keep on-demand renders fast. Nested children (toggles, columns)
 * are still not recursed — that would require a call per parent block.
 */
async function listAllBlockChildren(
    blockId: string,
    maxPages = 5
): Promise<ListBlockChildrenResponse> {
    const first = await notion.blocks.children.list({ block_id: blockId });
    const results = [...first.results];

    let cursor = first.next_cursor;
    let page = 1;
    while (cursor && page < maxPages) {
        const next = await notion.blocks.children.list({
            block_id: blockId,
            start_cursor: cursor,
        });
        results.push(...next.results);
        cursor = next.next_cursor;
        page++;
    }

    return { ...first, results, has_more: false, next_cursor: null };
}

/**
 * Estimate a single blog post's reading time from its content. Falls back to
 * 1 minute if the block fetch fails so the listing never breaks on a transient
 * Notion error.
 */
async function fetchBlogPostReadingTime(id: string): Promise<number> {
    try {
        const blocks = (await listAllBlockChildren(id)).results.filter(
            isBlockObjectResponse
        );
        return estimateReadingTime(blocks);
    } catch (error) {
        console.error('Error fetching reading time for', id, error);
        return 1;
    }
}

/**
 * Fetch blog posts and enrich each with a real `readingTime` derived from
 * its content. The plain database query does not return block content, so
 * the listing cannot compute reading time without this extra lookup.
 *
 * Block fetches run in small batches to stay within Notion's rate limit.
 */
export async function fetchBlogPostsWithReadingTime(
    options: NotionFetchOptions = {}
): Promise<BlogPost[]> {
    const posts = await fetchNotions('blog', options);

    const BATCH_SIZE = 5;
    const enriched: BlogPost[] = [];

    for (let i = 0; i < posts.length; i += BATCH_SIZE) {
        const batch = posts.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
            batch.map(async (post) => ({
                ...post,
                readingTime: await fetchBlogPostReadingTime(post.id),
            }))
        );
        enriched.push(...batchResults);
    }

    return enriched;
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

        const blockChildrenResponse = await listAllBlockChildren(id);
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
