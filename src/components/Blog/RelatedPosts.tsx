import {
    Box,
    Heading,
    HStack,
    LinkBox,
    LinkOverlay,
    SimpleGrid,
    Tag,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { BlogPost } from '../../types/notion';
import { formatNotionDate } from '../../utils/date';

interface RelatedPostsProps {
    posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    const bg = useColorModeValue('white', 'gray.800');
    const border = useColorModeValue('gray.200', 'gray.700');
    const dateColor = useColorModeValue('gray.600', 'gray.400');
    const titleHover = useColorModeValue('green.700', 'green.400');

    if (posts.length === 0) {
        return null;
    }

    const columns = posts.length >= 3 ? 3 : posts.length;

    return (
        <Box as="section" mt={12} aria-label="Related posts">
            <Heading as="h2" size="md" mb={4}>
                Keep reading
            </Heading>
            <SimpleGrid columns={{ base: 1, md: columns }} spacing={4}>
                {posts.map((post) => (
                    <LinkBox
                        key={post.id}
                        as="article"
                        bg={bg}
                        borderWidth="1px"
                        borderColor={border}
                        borderRadius="lg"
                        p={4}
                        transition="all 0.2s"
                        _hover={{
                            borderColor: 'green.500',
                            '.related-title': { color: titleHover },
                        }}
                    >
                        {post.tags.length > 0 && (
                            <HStack spacing={2} mb={2} wrap="wrap">
                                {post.tags.slice(0, 2).map((tag) => (
                                    <Tag
                                        key={tag}
                                        size="sm"
                                        colorScheme="green"
                                        variant="subtle"
                                        borderRadius="full"
                                    >
                                        {tag}
                                    </Tag>
                                ))}
                            </HStack>
                        )}
                        <Heading as="h3" size="sm" mb={2} lineHeight={1.4}>
                            <LinkOverlay
                                as={NextLink}
                                href={`/blog/${post.slug}`}
                                className="related-title"
                                transition="color 0.2s"
                            >
                                {post.title}
                            </LinkOverlay>
                        </Heading>
                        <Text color={dateColor} fontSize="xs">
                            {post.publishedDate
                                ? formatNotionDate(post.publishedDate)
                                : 'Unpublished'}
                            {post.readingTime != null &&
                                ` · ${post.readingTime} min read`}
                        </Text>
                    </LinkBox>
                ))}
            </SimpleGrid>
        </Box>
    );
}
