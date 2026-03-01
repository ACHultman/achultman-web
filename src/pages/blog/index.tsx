import {
    Box,
    Container,
    Heading,
    Divider,
    SimpleGrid,
    Alert,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

import { NextSeo } from 'next-seo';
import { fetchNotions } from '../../services/notion';
import { BlogPost as BlogPostType } from '../../types/notion'; // Renamed to avoid conflict
import PostBox from '../../components/Blog/PostBox'; // Import the new component

interface Props {
    posts: BlogPostType[];
}

function BlogPage({ posts }: Props) {
    const subtleColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <>
            <NextSeo
                title="Blog | Adam Hultman"
                description="My collection of technical writing about web development, cybersecurity, and other tech topics."
                canonical="https://hultman.dev/blog"
            />
            <Container maxW="container.lg">
                <Box>
                    <Heading
                        as="h1"
                        fontSize={{ base: '28px', md: '32px', lg: '36px' }}
                        mb={2}
                    >
                        Blog
                    </Heading>
                    <Text color={subtleColor} fontSize="lg">
                        Notes on engineering, AI, security, and building things
                        that last.
                    </Text>
                </Box>
                <Divider my={10} />

                {posts.length === 0 ? (
                    <Alert status="info">
                        No posts found. Please check back later.
                    </Alert>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                        {posts.map((post) => (
                            <PostBox key={post.id} post={post} />
                        ))}
                    </SimpleGrid>
                )}
            </Container>
        </>
    );
}

export async function getStaticProps() {
    try {
        const posts = await fetchNotions('blog');

        return {
            props: {
                posts,
            },
            revalidate: 43200, // 12 hours
        };
    } catch (error) {
        return {
            props: {
                posts: [],
            },
        };
    }
}

export default BlogPage; // Updated export
