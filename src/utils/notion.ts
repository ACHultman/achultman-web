import { safeUrl } from './safeUrl';
import {
    PageObjectResponse,
    PartialPageObjectResponse,
    BlockObjectResponse,
    PartialBlockObjectResponse,
} from '@notionhq/client';

export function pageIsPageObjectResponse(
    page: PageObjectResponse | PartialPageObjectResponse
): page is PageObjectResponse {
    return 'parent' in page && 'properties' in page;
}

export function isBlockObjectResponse(
    block: PartialBlockObjectResponse | BlockObjectResponse
): block is BlockObjectResponse {
    return block.object === 'block' && 'type' in block;
}

export function getTitle(
    page: PageObjectResponse,
    defaultValue: string = 'Untitled'
): string {
    // Find the title property by type rather than hardcoding the name "Name" —
    // a renamed title column would otherwise make every post "Untitled".
    const titleProp = Object.values(page.properties).find(
        (prop): prop is Extract<typeof prop, { type: 'title' }> =>
            prop.type === 'title'
    );
    return (
        titleProp?.title.map((part) => part.plain_text).join('') || defaultValue
    );
}

export function getCover(page: PageObjectResponse): string | null {
    if (page.cover?.type === 'external') {
        return safeUrl(page.cover.external.url) || null;
    }
    if (page.cover?.type === 'file') {
        return safeUrl(page.cover.file.url) || null;
    }
    return null;
}

export function getRichText(
    page: PageObjectResponse,
    propertyName: string
): string {
    if (page.properties[propertyName]?.type === 'rich_text') {
        return page.properties[propertyName].rich_text
            .map((part) => part.plain_text)
            .join('');
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
        return safeUrl(page.properties[propertyName].url, true) || '';
    }
    return '';
}
