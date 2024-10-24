import {
    PageObjectResponse,
    PartialPageObjectResponse,
    PartialDatabaseObjectResponse,
    DatabaseObjectResponse,
    ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints';

export type DatabaseName = 'books' | 'blog' | 'bookmarks';

export type Book = {
    id: string;
    title: string;
    author: string;
    link: string;
    cover: string;
};

export type BlogPost = {
    id: string;
    title: string;
    publishedDate: string | null;
    tags: string[];
    description: string;
    cover: string | null;
    url: string;
    created_time: string;
    last_edited_time: string;
};

export type Bookmark = {
    id: string;
    title: string;
    link: string;
    description: string;
    cover: string;
    tags: string[];
    lastEditedTime: string;
};

// get type-safe return type based on database name
export type FormatterReturnType<T extends DatabaseName> = T extends 'books'
    ? Book
    : T extends 'blog'
      ? BlogPost
      : T extends 'bookmarks'
        ? Bookmark
        : never;

export type FormatterArgument =
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse;

export type NotionPageWithBlocks<T extends DatabaseName> = {
    page: FormatterReturnType<T>;
    blocks: ListBlockChildrenResponse;
};

export function pageIsPageObjectResponse(
    page: FormatterArgument
): page is PageObjectResponse {
    return page.object === 'page';
}
