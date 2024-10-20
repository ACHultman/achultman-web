import {
    PageObjectResponse,
    PartialPageObjectResponse,
    PartialDatabaseObjectResponse,
    DatabaseObjectResponse,
    ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints';

export type DatabaseName = 'books' | 'blog';

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

// get type-safe return type based on database name
export type FormatterReturnType<T extends DatabaseName> = T extends 'books'
    ? Book
    : T extends 'blog'
      ? BlogPost
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
