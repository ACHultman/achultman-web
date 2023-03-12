import { Box, Container, Heading, Divider, SlideFade } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'

import Paragraph from '@components/Paragraph'
import Message from '@components/Message'
import { Book } from '@components/BookList/types'
import BookList from '@components/BookList'

interface BooksProps {
    books: Book[]
}

const Books = ({ books }: BooksProps) => {
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
    )
}

export async function getStaticProps() {
    // list of books
    const books: Book[] = [
        {
            cover: {
                src: 'https://media.wiley.com/product_data/coverImage300/89/11197190/1119719089.jpg',
                alt: 'Kali Linux Penetration Testing Bible',
                dimensions: {
                    width: 300,
                    height: 376,
                },
            },
            name: 'Kali Linux Penetration Testing Bible',
            note: 'Your ultimate guide to pentesting with Kali Linux',
            link: 'https://www.wiley.com/en-us/Kali+Linux+Penetration+Testing+Bible-p-9781119719076',
        },
        // O'Reilly - Designing Data-Intensive Applications
        {
            cover: {
                src: 'https://learning.oreilly.com/library/cover/9781491903063/250w/',
                alt: 'Designing Data-Intensive Applications',
                dimensions: {
                    width: 250,
                    height: 328,
                },
            },
            name: 'Designing Data-Intensive Applications',
            note: 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems',
            link: 'https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/',
        },
    ]

    return {
        props: {
            books,
        },
        revalidate: 3600,
    }
}

export default Books
