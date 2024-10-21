import { useEffect, useState } from 'react';
import { Bookmark } from '..//types/notion';

export default function useBookmarkTagFilter(
    rawBookmarks: Bookmark[],
    initialActiveTag?: string
) {
    const [filteredBookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [activeTag, setActiveTag] = useState<string>(initialActiveTag);

    useEffect(() => {
        let filteredBookmark = rawBookmarks.filter(
            (bookmark) => !activeTag || bookmark.tags.includes(activeTag)
        );
        setBookmarks(filteredBookmark);
    }, [activeTag]);

    function onTagClick(tag: string) {
        setActiveTag(activeTag === tag ? null : tag);
    }

    return {
        filteredBookmarks,
        activeTag,
        onTagClick,
    };
}
