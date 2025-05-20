import {
    Box,
    Flex,
    Heading,
    LinkBox,
    LinkOverlay,
    Tag,
    useColorModeValue,
} from '@chakra-ui/react';
import { Bookmark } from '../../types/notion';
import Paragraph from '../Paragraph';

interface Props {
    bookmark: Bookmark;
}

function BookmarkCard({ bookmark }: Props) {
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <LinkBox as="article">
            <Box
                h="100%"
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius={10}
                cursor="pointer"
                role="group"
                style={{ transition: '.5s' }}
                _hover={{ borderColor: 'green.300' }}
            >
                <Flex
                    direction="column"
                    justify="space-between"
                    align="start"
                    h="100%"
                    p={4}
                    gap={3}
                >
                    <LinkOverlay
                        href={bookmark.link}
                        isExternal
                        textDecoration="none"
                        _hover={{ textDecoration: 'none' }}
                    >
                        <Heading as="h6" size="md" mb={2}>
                            {bookmark.title}
                        </Heading>
                        <Paragraph fontSize="sm">
                            {bookmark.description}
                        </Paragraph>
                    </LinkOverlay>
                    {bookmark.tags.length > 0 && (
                        <Flex wrap="wrap" gap={2}>
                            {bookmark.tags.map((tag) => (
                                <Tag
                                    key={`${bookmark.id}-${tag}`}
                                    textTransform="capitalize"
                                    p={2}
                                >
                                    {tag}
                                </Tag>
                            ))}
                        </Flex>
                    )}
                </Flex>
            </Box>
        </LinkBox>
    );
}

export default BookmarkCard;
