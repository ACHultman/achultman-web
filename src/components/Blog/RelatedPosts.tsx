import {
    Box,
    Grid,
    Heading,
    LinkBox,
    LinkOverlay,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { BlogPost } from '../../types/notion';
import { formatNotionDate } from '../../utils/date';

interface RelatedPostsProps {
    posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    const border = useColorModeValue('gray.300', 'gray.700');
    const dateColor = useColorModeValue('gray.600', 'gray.400');
    const titleHover = useColorModeValue('green.700', 'green.400');

    if (posts.length === 0) {
        return null;
    }

    return (
        <Box
            as="section"
            mt={16}
            pt={6}
            borderTopWidth="1px"
            borderColor={border}
            aria-label="Related notes"
        >
            <Heading as="h2" size="md" mb={6}>
                Elsewhere in the notebook
            </Heading>
            <VStack spacing={0} align="stretch">
                {posts.map((post) => (
                    <LinkBox
                        key={post.id}
                        as="article"
                        borderBottomWidth="1px"
                        borderColor={border}
                        py={5}
                        _hover={{
                            '.related-title': { color: titleHover },
                        }}
                    >
                        <Grid
                            templateColumns={{
                                base: '1fr',
                                md: '8rem minmax(0, 1fr)',
                            }}
                            gap={{ base: 2, md: 6 }}
                        >
                            <Text color={dateColor} fontSize="xs">
                                {post.publishedDate
                                    ? formatNotionDate(post.publishedDate)
                                    : 'Unpublished'}
                            </Text>
                            <Box>
                                <Heading
                                    as="h3"
                                    size="sm"
                                    mb={2}
                                    lineHeight={1.4}
                                >
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
                                    {post.tags.slice(0, 2).join(' · ')}
                                    {post.readingTime != null &&
                                        ` · ${post.readingTime} min read`}
                                </Text>
                            </Box>
                        </Grid>
                    </LinkBox>
                ))}
            </VStack>
        </Box>
    );
}
