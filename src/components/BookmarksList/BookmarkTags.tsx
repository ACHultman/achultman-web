interface Props {
    tags: string[];
    selectedTag: string | null;
    setSelectedTag: (tag: string | null) => void;
}

export default function BookmarkTags({
    tags,
    selectedTag,
    setSelectedTag,
}: Props) {
    return (
        <div
            className="bookmark-filters"
            role="group"
            aria-label="Filter bookmarks by topic"
        >
            {[null, ...tags].map((tag) => (
                <button
                    key={tag ?? 'all'}
                    type="button"
                    aria-pressed={selectedTag === tag}
                    onClick={() => setSelectedTag(tag)}
                >
                    {tag ?? 'All'}
                </button>
            ))}
        </div>
    );
}
