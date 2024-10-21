import { Flex } from '@chakra-ui/react';

import BookCard from './BookCard';
import { Book } from '../../types/notion';

interface Props {
    books: Book[];
}

function BookList({ books }: Props) {
    return (
        <Flex
            w="100%"
            mt={10}
            mx="auto"
            sx={{ columnCount: [1, 2, 3], columnGap: '20px' }}
            wrap="wrap"
            gap={4}
        >
            {books.map((book) => (
                <BookCard book={book} key={`book-${book.title}`} />
            ))}
        </Flex>
    );
}

export default BookList;
