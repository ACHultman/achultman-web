import {
    Box,
    Heading,
    Text,
    Tag,
    Stack,
    useColorModeValue,
    LinkBox,
    LinkOverlay,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { BlogPost } from '../../types/notion';

interface PostBoxProps {
    post: BlogPost;
}

export default function PostBox({ post }: PostBoxProps) {
    const dateColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <LinkBox
            as="article"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            height="100%"
            transition="all 0.2s ease-in-out"
            _hover={{
                shadow: 'xl',
                transform: 'translateY(-5px)',
                boxShadow: '0 0 10px rgba(56, 161, 105, 0.6)',
                '.post-title-link': {
                    textDecoration: 'underline',
                },
            }}
            _active={{
                transform: 'translateY(0)',
                boxShadow: '0 0 5px rgba(56, 161, 105, 0.6)',
            }}
        >
            {post.cover && (
                <Box position="relative" width="100%" height="200px">
                    <NextImage
                        src={post.cover}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        placeholder="empty"
                    />
                </Box>
            )}
            <Box p={6}>
                <Heading as="h2" fontSize="xl" mb={2}>
                    <LinkOverlay
                        as={NextLink}
                        href={`/blog/${post.id}`}
                        className="post-title-link"
                    >
                        {post.title}
                    </LinkOverlay>
                </Heading>
                <Text color={dateColor} mb={4}>
                    {post.publishedDate
                        ? new Date(post.publishedDate).toLocaleDateString()
                        : 'Unpublished'}
                </Text>
                <Text mb={4} noOfLines={3}>
                    {' '}
                    {/* Added noOfLines for consistency */}
                    {post.description}
                </Text>
                <Stack wrap="wrap" direction="row" spacing={2} mb={4}>
                    {post.tags.map((tag) => (
                        <Tag key={tag} colorScheme="green">
                            {tag}
                        </Tag>
                    ))}
                </Stack>
            </Box>
        </LinkBox>
    );
}
