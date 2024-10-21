import { Box, Flex } from '@chakra-ui/react';

import BookCard from './BookCard';
import { Book } from '../../types/notion';

interface Props {
    books: Book[];
}

function BookList({ books }: Props) {
    return (
        <Flex w="100%" wrap="wrap" justify="center" gap={4}>
            {books.map((book) => (
                <Box
                    key={`book-${book.title}`}
                    flexBasis={[
                        '100%',
                        'calc(50% - 20px)',
                        'calc(33.33% - 20px)',
                    ]}
                    maxW={['100%', 'calc(50% - 20px)', 'calc(33.33% - 20px)']}
                    maxH="fit-content"
                >
                    <BookCard book={book} />
                </Box>
            ))}
        </Flex>
    );
}

export default BookList;
