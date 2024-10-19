import {
    Box,
    Container,
    Heading,
    SlideFade,
    Divider,
    Image,
    Text,
    Tag,
    Stack,
    SimpleGrid,
    Alert,
} from '@chakra-ui/react';
import Link from 'next/link';
import { fetchPosts } from 'src/services/blog';

function Blog({ posts }) {
    return (
        <Container maxW="container.lg">
            <SlideFade in={true} offsetY={80}>
                <Box>
                    <Heading
                        as="h1"
                        fontSize={{ base: '28px', md: '32px', lg: '36px' }}
                        mb={4}
                    >
                        Blog
                    </Heading>
                </Box>
                <Divider my={10} />

                {posts.length === 0 ? (
                    <Alert status="info">
                        No posts found. Please check back later.
                    </Alert>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                        {posts.map((post) => (
                            <Box
                                key={post.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                boxShadow="md"
                            >
                                {post.coverImage && (
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        width="100%"
                                        height={200}
                                        objectFit="cover"
                                    />
                                )}
                                <Box p={6}>
                                    <Link href={`/blog/${post.id}`}>
                                        <Heading as="h2" fontSize="xl" mb={2}>
                                            {post.title}
                                        </Heading>
                                    </Link>
                                    <Text color="gray.500" mb={4}>
                                        {post.publishedDate
                                            ? new Date(
                                                  post.publishedDate
                                              ).toLocaleDateString()
                                            : 'Unpublished'}
                                    </Text>
                                    <Text mb={4}>{post.description}</Text>
                                    <Stack
                                        wrap="wrap"
                                        direction="row"
                                        spacing={2}
                                        mb={4}
                                    >
                                        {post.tags.map((tag) => (
                                            <Tag key={tag} colorScheme="green">
                                                {tag}
                                            </Tag>
                                        ))}
                                    </Stack>
                                    <Link href={`/blog/${post.id}`}>
                                        <Text
                                            color="green.500"
                                            fontWeight="bold"
                                        >
                                            Read More →
                                        </Text>
                                    </Link>
                                </Box>
                            </Box>
                        ))}
                    </SimpleGrid>
                )}
            </SlideFade>
        </Container>
    );
}

export async function getServerSideProps() {
    try {
        return {
            props: {
                posts: await fetchPosts(),
            },
        };
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return {
            props: {
                posts: [],
            },
        };
    }
}

export default Blog;
