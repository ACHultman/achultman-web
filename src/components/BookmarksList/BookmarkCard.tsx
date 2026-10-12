import { captureEvent } from '../../lib/analytics';
import type { Bookmark } from '../../types/notion';

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
    return (
        <article className="collection-card collection-card-copy">
            <h2>
                <a
                    href={bookmark.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                        captureEvent('bookmark_clicked', {
                            bookmark_title: bookmark.title,
                            bookmark_link: bookmark.link,
                            bookmark_tags: bookmark.tags,
                        })
                    }
                >
                    {bookmark.title}
                </a>
            </h2>
            <p>{bookmark.description}</p>
            {bookmark.tags.length > 0 && (
                <ul className="bookmark-labels" aria-label="Topics">
                    {bookmark.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                    ))}
                </ul>
            )}
        </article>
    );
}
