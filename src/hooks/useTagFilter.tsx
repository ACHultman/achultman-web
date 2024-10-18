import { useEffect, useState } from 'react';
import { Bookmark, Tag } from '../components/BookmarksList/types';

export default function useBookmarkTagFilter(
    rawBookmarks: Bookmark[],
    initialActiveTag?: Tag
) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [activeTag, setActiveTag] = useState<Tag>(initialActiveTag);

    useEffect(() => {
        let filteredBookmark = rawBookmarks.filter(
            (bookmark) => !activeTag || bookmark.tags.includes(activeTag)
        );
        setBookmarks(filteredBookmark);
    }, [activeTag]);

    const onTagClick = (tag: string) =>
        activeTag === tag ? setActiveTag(null) : setActiveTag(tag);

    return {
        bookmarks,
        activeTag,
        onTagClick,
    };
}
