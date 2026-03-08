import {
    Box,
    Flex,
    Heading,
    Text,
    Tag,
    HStack,
    useColorModeValue,
    LinkBox,
    LinkOverlay,
    Badge,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import posthog from 'posthog-js';
import { BlogPost } from '../../types/notion';

interface FeaturedPostProps {
    post: BlogPost;
}

function readTime(description: string): string {
    const words = description?.split(/\s+/).length ?? 0;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
    const bg = useColorModeValue('white', 'gray.800');
    const border = useColorModeValue('gray.200', 'gray.700');
    const dateColor = useColorModeValue('gray.500', 'gray.500');
    const descColor = useColorModeValue('gray.700', 'gray.300');

    const handlePostClick = () => {
        posthog.capture('blog_post_clicked', {
            post_id: post.id,
            post_title: post.title,
            post_tags: post.tags,
            featured: true,
        });
    };

    return (
        <LinkBox
            as="article"
            onClick={handlePostClick}
            bg={bg}
            borderWidth="1px"
            borderColor={border}
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.25s ease"
            _hover={{
                boxShadow: '0 0 0 1px var(--chakra-colors-green-500)',
                transform: 'translateY(-3px)',
                '.featured-title-link': {
                    color: 'green.500',
                },
            }}
        >
            <Flex direction={{ base: 'column', md: 'row' }}>
                {post.cover && (
                    <Box
                        position="relative"
                        width={{ base: '100%', md: '45%' }}
                        minH={{ base: '200px', md: '280px' }}
                        flexShrink={0}
                        overflow="hidden"
                    >
                        <NextImage
                            src={post.cover}
                            alt={post.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            placeholder="empty"
                            priority
                            sizes="(max-width: 768px) 100vw, 45vw"
                        />
                    </Box>
                )}
                <Flex
                    direction="column"
                    justify="center"
                    p={{ base: 6, md: 8 }}
                    flex="1"
                >
                    <HStack spacing={2} mb={3}>
                        <Badge
                            colorScheme="green"
                            variant="subtle"
                            fontSize="xs"
                            px={2}
                            py={0.5}
                            borderRadius="full"
                        >
                            Latest
                        </Badge>
                    </HStack>

                    <Heading
                        as="h2"
                        size="lg"
                        mb={3}
                        lineHeight={1.3}
                    >
                        <LinkOverlay
                            as={NextLink}
                            href={`/blog/${post.id}`}
                            className="featured-title-link"
                            transition="color 0.2s"
                        >
                            {post.title}
                        </LinkOverlay>
                    </Heading>

                    {post.description && (
                        <Text
                            color={descColor}
                            fontSize={{ base: 'sm', md: 'md' }}
                            lineHeight={1.7}
                            noOfLines={4}
                            mb={5}
                        >
                            {post.description}
                        </Text>
                    )}

                    <HStack spacing={2} wrap="wrap" mb={4}>
                        {post.tags.map((tag) => (
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

                    <Text color={dateColor} fontSize="xs">
                        {post.publishedDate
                            ? new Date(post.publishedDate).toLocaleDateString(
                                  'en-US',
                                  {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                  }
                              )
                            : 'Unpublished'}
                        {post.description &&
                            ` · ${readTime(post.description)}`}
                    </Text>
                </Flex>
            </Flex>
        </LinkBox>
    );
}
