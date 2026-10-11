import { useState } from 'react';
import { Bookmark } from '../types/notion';

export default function useBookmarkTagFilter(
    rawBookmarks: Bookmark[],
    initialActiveTag?: string
) {
    const [activeTag, setActiveTag] = useState<string | undefined>(
        initialActiveTag
    );

    const filteredBookmarks = rawBookmarks.filter(
        (bookmark) => !activeTag || bookmark.tags.includes(activeTag)
    );

    function onTagClick(tag: string) {
        setActiveTag(activeTag === tag ? undefined : tag);
    }

    return {
        filteredBookmarks,
        activeTag,
        onTagClick,
    };
}
