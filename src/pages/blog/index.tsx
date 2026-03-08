import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Alert,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { NextSeo } from 'next-seo';
import { fetchNotions } from '../../services/notion';
import { BlogPost as BlogPostType } from '../../types/notion';
import PostBox from '../../components/Blog/PostBox';
import FeaturedPost from '../../components/Blog/FeaturedPost';

interface Props {
    posts: BlogPostType[];
}

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function BlogPage({ posts }: Props) {
    const subtleColor = useColorModeValue('gray.600', 'gray.400');
    const [featured, ...rest] = posts;

    return (
        <>
            <NextSeo
                title="Blog | Adam Hultman"
                description="Notes on engineering, AI, security, and building things that last."
                canonical="https://hultman.dev/blog"
                openGraph={{
                    url: 'https://hultman.dev/blog',
                    title: 'Blog | Adam Hultman',
                    description:
                        'Notes on engineering, AI, security, and building things that last.',
                }}
            />
            <Container maxW="container.lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <VStack align="start" spacing={2} mb={10}>
                        <Heading
                            as="h1"
                            fontSize={{
                                base: '28px',
                                md: '36px',
                                lg: '42px',
                            }}
                        >
                            Blog
                        </Heading>
                        <Text
                            color={subtleColor}
                            fontSize={{ base: 'md', md: 'lg' }}
                        >
                            Notes on engineering, AI, security, and building
                            things that last.
                        </Text>
                    </VStack>
                </motion.div>

                {posts.length === 0 ? (
                    <Alert status="info" borderRadius="lg">
                        No posts found. Please check back later.
                    </Alert>
                ) : (
                    <VStack spacing={12} align="stretch">
                        {featured && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                            >
                                <FeaturedPost post={featured} />
                            </motion.div>
                        )}

                        {rest.length > 0 && (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="visible"
                            >
                                <SimpleGrid
                                    columns={{ base: 1, md: 2 }}
                                    spacing={{ base: 6, md: 8 }}
                                >
                                    {rest.map((post) => (
                                        <motion.div
                                            key={post.id}
                                            variants={item}
                                            style={{ height: '100%' }}
                                        >
                                            <PostBox post={post} />
                                        </motion.div>
                                    ))}
                                </SimpleGrid>
                            </motion.div>
                        )}
                    </VStack>
                )}
            </Container>
        </>
    );
}

export async function getStaticProps() {
    try {
        const posts = await fetchNotions('blog', {
            page_size: 100,
            sorts: [{ property: 'Published', direction: 'descending' }],
        });

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

export default BlogPage;
