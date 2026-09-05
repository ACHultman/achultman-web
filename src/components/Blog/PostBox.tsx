import {
    Box,
    Grid,
    Heading,
    Text,
    useColorModeValue,
    LinkBox,
    LinkOverlay,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import posthog from 'posthog-js';
import { BlogPost } from '../../types/notion';
import { formatNotionDate } from '../../utils/date';

interface PostBoxProps {
    post: BlogPost;
}

export default function PostBox({ post }: PostBoxProps) {
    const border = useColorModeValue('gray.300', 'gray.700');
    const dateColor = useColorModeValue('gray.600', 'gray.400');
    const descColor = useColorModeValue('gray.700', 'gray.300');
    const titleHover = useColorModeValue('green.700', 'green.400');

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
            borderBottomWidth="1px"
            borderColor={border}
            py={{ base: 7, md: 9 }}
            _hover={{
                '.post-title-link': {
                    color: titleHover,
                },
            }}
        >
            <Grid
                templateColumns={{ base: '1fr', md: '9rem minmax(0, 1fr)' }}
                gap={{ base: 3, md: 8 }}
            >
                <Box>
                    <Text color={dateColor} fontSize="sm">
                        {post.publishedDate
                            ? formatNotionDate(post.publishedDate)
                            : 'Unpublished'}
                    </Text>
                    <Text color={dateColor} fontSize="xs" mt={2}>
                        {post.tags.slice(0, 3).join(' · ')}
                    </Text>
                </Box>

                <Box>
                    <Heading
                        as="h2"
                        fontSize={{ base: '24px', md: '30px' }}
                        mb={3}
                        lineHeight="1.15"
                        letterSpacing="-0.025em"
                        sx={{ textWrap: 'balance' }}
                    >
                        <LinkOverlay
                            as={NextLink}
                            href={`/blog/${post.slug}`}
                            className="post-title-link"
                            transition="color 0.2s"
                        >
                            {post.title}
                        </LinkOverlay>
                    </Heading>

                    {post.description && (
                        <Text
                            color={descColor}
                            fontSize="md"
                            lineHeight={1.7}
                            maxW="58ch"
                            sx={{ textWrap: 'pretty' }}
                        >
                            {post.description}
                        </Text>
                    )}

                    {post.readingTime != null && (
                        <Text color={dateColor} fontSize="xs" mt={4}>
                            {post.readingTime} min read
                        </Text>
                    )}
                </Box>
            </Grid>
        </LinkBox>
    );
}
