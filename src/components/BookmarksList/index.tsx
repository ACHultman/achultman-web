import { useState } from 'react';
import type { Bookmark } from '../../types/notion';
import BookmarkCard from './BookmarkCard';
import BookmarkTags from './BookmarkTags';

export default function BookmarksList({
    bookmarks,
}: {
    bookmarks: Bookmark[];
}) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [limit, setLimit] = useState(12);
    const counts = new Map<string, number>();
    for (const bookmark of bookmarks)
        for (const tag of bookmark.tags)
            counts.set(tag, (counts.get(tag) ?? 0) + 1);
    const tags = [...counts]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag]) => tag);
    const filtered = selectedTag
        ? bookmarks.filter((bookmark) => bookmark.tags.includes(selectedTag))
        : bookmarks;
    return (
        <>
            <BookmarkTags
                tags={tags}
                selectedTag={selectedTag}
                setSelectedTag={(tag) => {
                    setSelectedTag(tag);
                    setLimit(12);
                }}
            />
            <p role="status" className="collection-updated">
                {filtered.length} bookmarks
                {selectedTag ? ` tagged ${selectedTag}` : ''}.
            </p>
            <div className="collection-grid">
                {filtered.slice(0, limit).map((bookmark) => (
                    <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))}
            </div>
            {limit < filtered.length && (
                <button
                    type="button"
                    className="button-primary collection-more"
                    onClick={() => setLimit((value) => value + 12)}
                >
                    Load More
                </button>
            )}
        </>
    );
}
