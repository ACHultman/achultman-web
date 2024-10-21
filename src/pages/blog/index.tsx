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
import { motion } from 'framer-motion';
import { fetchPosts } from '../../services/blog';
import { rgbaGreen } from '../../utils/theme';

const MotionBox = motion(Box);

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
                            <Link
                                key={post.id}
                                className="blog-postbox"
                                href={`/blog/${post.id}`}
                            >
                                <MotionBox
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    boxShadow="md"
                                    height="100%"
                                    style={{ transition: 'box-shadow 0.2s' }}
                                    whileHover={{ scale: 1.02 }}
                                    _hover={{
                                        boxShadow: `0 0 10px ${rgbaGreen(0.6)}`,
                                    }}
                                    whileTap={{ scale: 0.9 }}
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
                                        <Heading as="h2" fontSize="xl" mb={2}>
                                            {post.title}
                                        </Heading>
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
                                                <Tag
                                                    key={tag}
                                                    colorScheme="green"
                                                >
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </Stack>
                                    </Box>
                                </MotionBox>
                            </Link>
                        ))}
                    </SimpleGrid>
                )}
            </SlideFade>
        </Container>
    );
}

export async function getStaticProps() {
    try {
        const posts = await fetchPosts();
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

export default Blog;
