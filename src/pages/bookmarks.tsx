import { NextSeo } from 'next-seo';
import { Box, Container, Heading, Divider, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import Paragraph from '@components/Paragraph';
import BookmarksList from '@components/BookmarksList';
import { fetchNotions } from '../services/notion';
import { Bookmark } from '../types/notion';

interface Props {
    bookmarks: Bookmark[];
}

function findMostRecentUpdate(bookmarks: Bookmark[]) {
    // lastEditedTime is a string in the format of '2024-10-21T21:07:00.000Z'
    return bookmarks.reduce((acc, bookmark) => {
        const bookmarkDate = new Date(bookmark.lastEditedTime);
        if (bookmarkDate > acc) {
            return bookmarkDate;
        }
        return acc;
    }, new Date(0));
}

function Bookmarks({ bookmarks }: Props) {
    const mostRecentUpdate = useMemo(
        () => findMostRecentUpdate(bookmarks),
        [bookmarks]
    );
    const formattedDate = mostRecentUpdate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <NextSeo
                title="Bookmarks | Adam Hultman"
                description="My favorite articles, websites, and tools."
                canonical="https://hultman.dev/bookmarks"
            />
            <Container maxW="container.lg">
                <Box>
                    <Heading
                        as="h1"
                        fontSize={{ base: '24px', md: '30px', lg: '36px' }}
                        mb={4}
                    >
                        Bookmarks
                    </Heading>
                    <Paragraph fontSize="xl" lineHeight={1.6}>
                        My favorite articles, websites, and tools.
                    </Paragraph>
                    <Paragraph fontSize="xs" mt={4}>
                        Last updated: {formattedDate}
                    </Paragraph>
                </Box>
                <Divider my={10} />
                <VStack spacing={4} align="start">
                    <BookmarksList bookmarks={bookmarks} />
                </VStack>
            </Container>
        </>
    );
}

export async function getStaticProps() {
    const bookmarks = await fetchNotions('bookmarks');
    return {
        props: { bookmarks },
        revalidate: 86400, // 24 hours
    };
}

export default Bookmarks;
