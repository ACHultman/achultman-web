import { Flex } from '@chakra-ui/react';

import Message from '../Message';
import BookmarkCard from './BookmarkCard';
import { Bookmark } from './types';

interface Props {
    bookmarks: Bookmark[];
}

function BookmarksList({ bookmarks }: Props) {
    if (!bookmarks || !bookmarks.length) {
        return <Message />;
    }

    return (
        <Flex
            wrap="wrap"
            direction="row"
            gap={4}
            w="100%"
            mt={10}
            mx="auto"
            sx={{ columnCount: [1, 2, 3], columnGap: '20px' }}
        >
            {bookmarks.map((bookmark, i) => (
                <BookmarkCard
                    key={`bookmark-${i}`}
                    bookmark={{ ...bookmark, id: i }}
                />
            ))}
        </Flex>
    );
}

export default BookmarksList;
