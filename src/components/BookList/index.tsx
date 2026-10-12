import BookCard from './BookCard';
import type { Book } from '../../types/notion';

export default function BookList({ books }: { books: Book[] }) {
    return (
        <div className="collection-grid">
            {books.map((book, index) => (
                <BookCard key={book.id} book={book} priority={index === 0} />
            ))}
        </div>
    );
}
