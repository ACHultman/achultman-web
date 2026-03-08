import {
    Box,
    Heading,
    Text,
    Tag,
    HStack,
    useColorModeValue,
    LinkBox,
    LinkOverlay,
    Flex,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import posthog from 'posthog-js';
import { BlogPost } from '../../types/notion';

interface PostBoxProps {
    post: BlogPost;
}

function readTime(description: string): string {
    const words = description?.split(/\s+/).length ?? 0;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default function PostBox({ post }: PostBoxProps) {
    const bg = useColorModeValue('white', 'gray.800');
    const border = useColorModeValue('gray.200', 'gray.700');
    const dateColor = useColorModeValue('gray.600', 'gray.400');
    const descColor = useColorModeValue('gray.700', 'gray.300');

    const handlePostClick = () => {
        posthog.capture('blog_post_clicked', {
            post_id: post.id,
            post_title: post.title,
            post_tags: post.tags,
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
            height="100%"
            display="flex"
            flexDirection="column"
            transition="all 0.25s ease"
            _hover={{
                boxShadow: '0 0 0 1px var(--chakra-colors-green-500)',
                transform: 'translateY(-3px)',
                '.post-title-link': {
                    color: 'green.500',
                },
            }}
        >
            {post.cover && (
                <Box
                    position="relative"
                    width="100%"
                    height="180px"
                    overflow="hidden"
                >
                    <NextImage
                        src={post.cover}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        placeholder="empty"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </Box>
            )}
            <Flex direction="column" flex="1" p={{ base: 5, md: 6 }}>
                <HStack spacing={2} mb={3} wrap="wrap">
                    {post.tags.slice(0, 3).map((tag) => (
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

                <Heading as="h2" size="md" mb={2} lineHeight={1.4}>
                    <LinkOverlay
                        as={NextLink}
                        href={`/blog/${post.id}`}
                        className="post-title-link"
                        transition="color 0.2s"
                    >
                        {post.title}
                    </LinkOverlay>
                </Heading>

                {post.description && (
                    <Text
                        color={descColor}
                        fontSize="sm"
                        lineHeight={1.7}
                        noOfLines={3}
                        mb={4}
                        flex="1"
                    >
                        {post.description}
                    </Text>
                )}

                <Text color={dateColor} fontSize="xs" mt="auto">
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
                    {post.description && ` · ${readTime(post.description)}`}
                </Text>
            </Flex>
        </LinkBox>
    );
}
