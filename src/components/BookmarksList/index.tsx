import { Box, Flex } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark } from '../../types/notion';
import Message from '../Message';
import BookmarkCard from './BookmarkCard';

interface Props {
    bookmarks: Bookmark[];
}

const MotionBox = motion(Box);

function BookmarksList({ bookmarks }: Props) {
    if (!bookmarks || !bookmarks.length) {
        return <Message />;
    }

    return (
        <AnimatePresence>
            <Flex
                key="bookmarks-list"
                w="100%"
                wrap="wrap"
                justify="center"
                gap={4}
            >
                {bookmarks.map((bookmark, i) => (
                    <MotionBox
                        key={bookmark.id}
                        flexBasis={[
                            '100%',
                            'calc(50% - 20px)',
                            'calc(33.33% - 20px)',
                        ]}
                        maxW={[
                            '100%',
                            'calc(50% - 20px)',
                            'calc(33.33% - 20px)',
                        ]}
                        maxH="fit-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <BookmarkCard bookmark={bookmark} />
                    </MotionBox>
                ))}
            </Flex>
        </AnimatePresence>
    );
}

export default BookmarksList;
