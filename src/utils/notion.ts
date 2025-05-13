import {
    PageObjectResponse,
    PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export function pageIsPageObjectResponse(
    page: PageObjectResponse | PartialPageObjectResponse
): page is PageObjectResponse {
    return 'parent' in page && 'properties' in page;
}

export function getTitle(
    page: PageObjectResponse,
    defaultValue: string = 'Untitled'
): string {
    if (page.properties.Name?.type === 'title') {
        return page.properties.Name.title[0]?.plain_text || defaultValue;
    }
    return defaultValue;
}

export function getCover(page: PageObjectResponse): string | null {
    if (page.cover?.type === 'external') {
        return page.cover.external.url;
    }
    if (page.cover?.type === 'file') {
        return page.cover.file.url || null;
    }
    return null;
}

export function getRichText(
    page: PageObjectResponse,
    propertyName: string
): string {
    if (page.properties[propertyName]?.type === 'rich_text') {
        return page.properties[propertyName].rich_text[0]?.plain_text || '';
    }
    return '';
}

export function getDateField(
    page: PageObjectResponse,
    propertyName: string
): string | null {
    if (page.properties[propertyName]?.type === 'date') {
        return page.properties[propertyName].date?.start || null;
    }
    return null;
}

export function getTags(
    page: PageObjectResponse,
    propertyName: string
): string[] {
    if (page.properties[propertyName]?.type === 'multi_select') {
        return page.properties[propertyName].multi_select.map(
            (tag) => tag.name
        );
    }
    return [];
}

export function getLink(
    page: PageObjectResponse,
    propertyName: string
): string {
    if (page.properties[propertyName]?.type === 'url') {
        return page.properties[propertyName].url || '';
    }
    return '';
}
