import {
    Box,
    Heading,
    LinkOverlay,
    LinkBox,
    useColorModeValue,
    Tag,
    Flex,
    VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Bookmark } from '../../types/notion';
import Paragraph from '../Paragraph';

interface Props {
    bookmark: Bookmark;
}

function BookmarkCard({ bookmark }: Props) {
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            layout
        >
            <LinkBox h="100%" as="article">
                <Box
                    h="100%"
                    maxW="400px"
                    borderColor={borderColor}
                    borderRadius={10}
                    borderWidth="1px"
                    transition=".5s"
                    cursor="pointer"
                    role="group"
                    _hover={{
                        borderColor: 'green.300',
                    }}
                >
                    <VStack h="100%">
                        <motion.div
                            style={{ width: '100%' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Box w="100%" h="100%">
                                <Flex
                                    flexDirection="column"
                                    alignItems="start"
                                    justifyContent="space-between"
                                    h="100%"
                                    p={4}
                                    gap={3}
                                >
                                    <LinkOverlay
                                        href={bookmark.link}
                                        isExternal
                                    >
                                        <Heading as="h6" size="md" mb={2}>
                                            {bookmark?.title}
                                        </Heading>
                                        <Paragraph fontSize="sm">
                                            {bookmark.description}
                                        </Paragraph>
                                    </LinkOverlay>
                                    <Flex wrap="wrap" gap={2}>
                                        {bookmark.tags.length > 0 &&
                                            bookmark.tags.map((tag) => (
                                                <Tag
                                                    key={`${bookmark.id}-${tag}`}
                                                    textTransform="capitalize"
                                                    p={2}
                                                >
                                                    {tag}
                                                </Tag>
                                            ))}
                                    </Flex>
                                </Flex>
                            </Box>
                        </motion.div>
                    </VStack>
                </Box>
            </LinkBox>
        </motion.div>
    );
}

export default BookmarkCard;
