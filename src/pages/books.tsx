import { Box, Container, Heading, Divider, SlideFade } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

import Paragraph from '@components/Paragraph';
import Message from '@components/Message';
import BookList from '@components/BookList';
import { fetchNotions } from '../services/notion';
import { Book } from '../types/notion';

interface Props {
    books: Book[];
}

function Books({ books }: Props) {
    return (
        <>
            <NextSeo
                title="Adam Hultman | Books"
                description="A list of my favorite tech books."
                openGraph={{
                    title: 'Adam Hultman | Books',
                    description: 'A list of my favorite tech books.',
                    url: 'https://hultman.dev/books',
                }}
            />
            <Container maxW="container.lg">
                <SlideFade in={true} offsetY={80}>
                    <Box>
                        <Heading
                            as="h1"
                            fontSize={{ base: '24px', md: '30px', lg: '36px' }}
                            mb={4}
                        >
                            Books
                        </Heading>
                        <Paragraph fontSize="xl" lineHeight={1.6}>
                            A list of my favourite tech books.
                        </Paragraph>
                    </Box>
                    <Divider my={10} />
                </SlideFade>
                <SlideFade in={true} offsetY={80} delay={0.2}>
                    {!books || books.length === 0 ? (
                        <Message />
                    ) : (
                        <BookList books={books} />
                    )}
                </SlideFade>
            </Container>
        </>
    );
}

export async function getStaticProps() {
    const books = await fetchNotions('books');

    return {
        props: {
            books,
        },
    };
}

export default Books;
