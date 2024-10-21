import Head from 'next/head';
import {
    Box,
    Container,
    Heading,
    Divider,
    SlideFade,
    VStack,
} from '@chakra-ui/react';

import Paragraph from '@components/Paragraph';
import BookmarksList from '@components/BookmarksList';
import BookmarkTags from '@components/BookmarksList/BookmarkTags';
import useBookmarkTagFilter from '@hooks/useTagFilter';
import { fetchNotions } from '../services/notion';
import { Bookmark } from '../types/notion';
import { use, useMemo } from 'react';

interface Props {
    bookmarks: Bookmark[];
}

function collectTags(bookmarks: Bookmark[]) {
    return bookmarks.reduce((acc, bookmark) => {
        bookmark.tags.forEach((tag) => {
            if (!acc.includes(tag)) {
                acc.push(tag);
            }
        });
        return acc;
    }, []);
}

function Bookmarks({ bookmarks }: Props) {
    const { filteredBookmarks, activeTag, onTagClick } =
        useBookmarkTagFilter(bookmarks);

    const tags = useMemo(() => collectTags(bookmarks), [bookmarks]);

    return (
        <>
            <Head>
                <title>Adam Hultman | Bookmarks</title>
            </Head>
            <Container maxW="container.lg">
                <SlideFade in={true} offsetY={80}>
                    <Box>
                        <Heading
                            as="h1"
                            fontSize={{
                                base: '24px',
                                md: '30px',
                                lg: '36px',
                            }}
                            mb={4}
                        >
                            Bookmarks
                        </Heading>
                        <Paragraph fontSize="xl" lineHeight={1.6}>
                            My favorite articles, websites, and tools.
                        </Paragraph>
                        <Paragraph fontSize="xs" mt={4}>
                            Last updated: December 28th, 2022
                        </Paragraph>
                    </Box>
                    <Divider my={10} />
                </SlideFade>
                <SlideFade in={true} offsetY={80} delay={0.2}>
                    <VStack spacing={4} align="start">
                        <BookmarkTags
                            tags={tags}
                            activeTag={activeTag}
                            onClick={onTagClick}
                        />
                        <BookmarksList bookmarks={filteredBookmarks} />
                    </VStack>
                </SlideFade>
            </Container>
        </>
    );
}

export async function getStaticProps() {
    const bookmarks = await fetchNotions('bookmarks');
    return {
        props: {
            bookmarks,
        },
        revalidate: 86400, // 24 hours
    };
}

export default Bookmarks;
