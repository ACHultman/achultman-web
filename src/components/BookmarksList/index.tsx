import { Box, Button, Flex, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { Bookmark } from '../../types/notion';
import BookmarkCard from './BookmarkCard';
import BookmarkTags from './BookmarkTags';

interface Props {
    bookmarks: Bookmark[];
}

function BookmarksList({ bookmarks }: Props) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [limit, setLimit] = useState(12);
    const tags = Array.from(new Set(bookmarks.flatMap((bm) => bm.tags)));
    const filteredBookmarks = selectedTag
        ? bookmarks.filter((bm) => bm.tags.includes(selectedTag))
        : bookmarks;

    const loadMore = () => {
        setLimit((prev) => prev + 12);
    };

    return (
        <Box>
            <Box display={['none', 'none', 'flex']}>
                <BookmarkTags
                    tags={tags}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                />
            </Box>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={4}
                mt={[0, 8]}
            >
                {filteredBookmarks.slice(0, limit).map((bm) => (
                    <BookmarkCard key={bm.id} bookmark={bm} />
                ))}
            </SimpleGrid>
            {limit < filteredBookmarks.length && (
                <Flex justify="center" mt={8}>
                    <Button
                        onClick={loadMore}
                        variant="outline"
                        colorScheme="green"
                        style={{ transition: '.5s' }}
                    >
                        Load More
                    </Button>
                </Flex>
            )}
        </Box>
    );
}

export default BookmarksList;
