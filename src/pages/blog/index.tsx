import {
    Box,
    Container,
    Grid,
    Heading,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';

import { NextSeo } from 'next-seo';
import { fetchBlogPostsWithReadingTime } from '../../services/notion';
import { BlogPost as BlogPostType } from '../../types/notion';
import PostBox from '../../components/Blog/PostBox';
import FeaturedPost from '../../components/Blog/FeaturedPost';
import { isEditorialBlogPost } from '../../utils/editorialBlog';

interface Props {
    posts: BlogPostType[];
}

function BlogPage({ posts }: Props) {
    const subtleColor = useColorModeValue('gray.600', 'gray.400');
    const ruleColor = useColorModeValue('gray.300', 'gray.700');
    const [featured, ...rest] = posts;

    return (
        <>
            <NextSeo
                title="Working notes"
                description="Field notes from building AI-assisted products, coordinating agents, and keeping software trustworthy in production."
                canonical="https://hultman.dev/blog"
                openGraph={{
                    url: 'https://hultman.dev/blog',
                    title: 'Working notes | Adam Hultman',
                    description:
                        'Field notes from building AI-assisted products, coordinating agents, and keeping software trustworthy in production.',
                    images: [
                        {
                            url: 'https://hultman.dev/og_homepage.png',
                            width: 1200,
                            height: 630,
                            alt: 'Adam Hultman — Blog',
                        },
                    ],
                }}
            />
            <Container maxW="container.xl" py={{ base: 8, md: 14 }}>
                <Grid
                    templateColumns={{
                        base: '1fr',
                        lg: 'minmax(0, 1fr) minmax(0, 2fr)',
                    }}
                    columnGap={{ base: 0, lg: 16 }}
                    rowGap={{ base: 10, lg: 0 }}
                    alignItems="start"
                >
                    <Box
                        as="header"
                        position={{ base: 'static', lg: 'sticky' }}
                        top={{ lg: 28 }}
                        borderTopWidth="1px"
                        borderColor={ruleColor}
                        pt={5}
                    >
                        <Heading
                            as="h1"
                            fontSize={{
                                base: '42px',
                                md: '56px',
                                lg: '64px',
                            }}
                            lineHeight="0.98"
                            letterSpacing="-0.045em"
                            maxW="8ch"
                        >
                            Working notes
                        </Heading>
                        <Text
                            color={subtleColor}
                            fontSize={{ base: 'md', md: 'lg' }}
                            lineHeight="1.7"
                            maxW="34ch"
                            mt={6}
                        >
                            What I learn while building AI-assisted products,
                            coordinating agents, and keeping software
                            trustworthy in production.
                        </Text>
                        <Text
                            color={subtleColor}
                            fontSize="sm"
                            lineHeight="1.65"
                            maxW="34ch"
                            mt={8}
                        >
                            A small, edited collection. I keep pieces that still
                            reflect how I work and retire the rest.
                        </Text>
                    </Box>

                    <Box as="section" aria-label="Published notes">
                        {posts.length === 0 ? (
                            <Text
                                borderTopWidth="1px"
                                borderColor={ruleColor}
                                pt={6}
                                color={subtleColor}
                            >
                                New notes are being edited now.
                            </Text>
                        ) : (
                            <VStack spacing={0} align="stretch">
                                {featured && <FeaturedPost post={featured} />}
                                {rest.map((post) => (
                                    <PostBox key={post.id} post={post} />
                                ))}
                            </VStack>
                        )}
                    </Box>
                </Grid>
            </Container>
        </>
    );
}

export async function getStaticProps() {
    try {
        const posts = await fetchBlogPostsWithReadingTime({
            page_size: 100,
            sorts: [{ property: 'Published', direction: 'descending' }],
        });

        return {
            props: {
                posts: posts.filter(isEditorialBlogPost),
            },
            // Match the post page so Notion signed cover URLs (~1h TTL) and
            // newly published posts don't stay stale for half a day.
            revalidate: 3600, // 1 hour
        };
    } catch {
        return {
            props: {
                posts: [],
            },
        };
    }
}

export default BlogPage;
