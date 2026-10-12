import { PageIntro, PageSeo } from '@components/Editorial';
import BookmarksList from '@components/BookmarksList';
import { fetchNotions } from '../services/notion';
import type { Bookmark } from '../types/notion';

export default function Bookmarks({ bookmarks }: { bookmarks: Bookmark[] }) {
    const updated = Math.max(
        0,
        ...bookmarks
            .map((bookmark) => Date.parse(bookmark.lastEditedTime))
            .filter(Number.isFinite)
    );
    const formattedDate = updated
        ? new Date(updated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
          })
        : 'No bookmarks published yet.';
    return (
        <>
            <PageSeo
                title="Bookmarks"
                path="/bookmarks"
                description="Saved articles, websites, and tools on software and technology, collected by Adam Hultman."
            />
            <div className="page-container collection-page">
                <PageIntro label="Reading" title="Bookmarks">
                    My favourite articles, websites, and tools.
                </PageIntro>
                <p className="collection-updated">
                    Last updated: {formattedDate}
                </p>
                <BookmarksList bookmarks={bookmarks} />
            </div>
        </>
    );
}

export async function getStaticProps() {
    const bookmarks = await fetchNotions('bookmarks');
    return { props: { bookmarks }, revalidate: 86400 };
}
