import { PageIntro, PageSeo } from '@components/Editorial';
import BookList from '@components/BookList';
import { fetchNotions } from '../services/notion';
import type { Book } from '../types/notion';

export default function Books({ books }: { books: Book[] }) {
    return (
        <>
            <PageSeo
                title="Books"
                path="/books"
                description="Books on software, technology, and product development from Adam Hultman’s reading list."
            />
            <div className="page-container collection-page">
                <PageIntro label="Reading" title="Books">
                    A list of my favourite tech books.
                </PageIntro>
                {books.length ? (
                    <BookList books={books} />
                ) : (
                    <p>No books published yet.</p>
                )}
            </div>
        </>
    );
}

export async function getStaticProps() {
    const books = await fetchNotions('books');
    return { props: { books }, revalidate: 86400 };
}
