import Image from 'next/image';
import type { Book } from '../../types/notion';

export default function BookCard({
    book,
    priority,
}: {
    book: Book;
    priority: boolean;
}) {
    const { title, author, link, cover } = book;
    return (
        <article className="collection-card book-card">
            <a href={link} target="_blank" rel="noreferrer">
                {cover && (
                    <div className="book-cover">
                        <Image
                            src={cover}
                            alt=""
                            fill
                            unoptimized
                            priority={priority}
                            referrerPolicy="no-referrer"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                )}
                <div className="collection-card-copy">
                    <h2>{title}</h2>
                    <p>{author}</p>
                </div>
            </a>
        </article>
    );
}
