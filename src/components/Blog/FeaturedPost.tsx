import {
    Box,
    Grid,
    Heading,
    Text,
    useColorModeValue,
    LinkBox,
    LinkOverlay,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import posthog from 'posthog-js';
import { BlogPost } from '../../types/notion';
import { formatNotionDate } from '../../utils/date';

interface FeaturedPostProps {
    post: BlogPost;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
    const border = useColorModeValue('gray.300', 'gray.700');
    const dateColor = useColorModeValue('gray.600', 'gray.400');
    const descColor = useColorModeValue('gray.700', 'gray.300');
    const titleHover = useColorModeValue('green.700', 'green.400');

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
            borderTopWidth="1px"
            borderBottomWidth="1px"
            borderColor={border}
            py={{ base: 5, md: 6 }}
            _hover={{
                '.featured-title-link': {
                    color: titleHover,
                },
            }}
        >
            <Grid
                templateColumns={{
                    base: '1fr',
                    md: 'minmax(0, 0.95fr) minmax(0, 1.05fr)',
                }}
                gap={{ base: 6, md: 8 }}
                alignItems="center"
            >
                {post.cover && (
                    <Box
                        position="relative"
                        width="100%"
                        minH={{ base: '220px', md: '310px' }}
                        overflow="hidden"
                        borderRadius="md"
                    >
                        <NextImage
                            src={post.cover}
                            alt=""
                            fill
                            style={{ objectFit: 'cover' }}
                            placeholder="empty"
                            priority
                            sizes="(max-width: 768px) 100vw, 34vw"
                        />
                    </Box>
                )}
                <Box>
                    <Text
                        color={dateColor}
                        fontSize="xs"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        mb={4}
                    >
                        Latest note
                        {post.publishedDate &&
                            ` · ${formatNotionDate(post.publishedDate)}`}
                    </Text>

                    <Heading
                        as="h2"
                        fontSize={{ base: '30px', md: '38px' }}
                        mb={4}
                        lineHeight="1.08"
                        letterSpacing="-0.035em"
                        sx={{ textWrap: 'balance' }}
                    >
                        <LinkOverlay
                            as={NextLink}
                            href={`/blog/${post.slug}`}
                            className="featured-title-link"
                            transition="color 0.2s"
                        >
                            {post.title}
                        </LinkOverlay>
                    </Heading>

                    {post.description && (
                        <Text
                            color={descColor}
                            fontSize={{ base: 'md', md: 'lg' }}
                            lineHeight={1.7}
                            maxW="48ch"
                            mb={6}
                            sx={{ textWrap: 'pretty' }}
                        >
                            {post.description}
                        </Text>
                    )}

                    <Text color={dateColor} fontSize="sm">
                        {post.tags.join(' · ')}
                        {post.readingTime != null &&
                            ` · ${post.readingTime} min read`}
                    </Text>
                </Box>
            </Grid>
        </LinkBox>
    );
}
