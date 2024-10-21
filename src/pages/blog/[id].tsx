import { Roboto } from 'next/font/google';
import {
    Box,
    Container,
    Heading,
    Text,
    Image,
    Divider,
    Stack,
    Tag,
    Alert,
    Center,
    VStack,
    Button,
    AlertIcon,
} from '@chakra-ui/react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { fetchPost, fetchPosts } from '../../services/blog';
import { motion, useScroll, useSpring } from 'framer-motion';
import RenderBlocks from '@components/RenderBlocks';
import { NextSeo } from 'next-seo';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

function BlogPost({ post, seo }) {
    const { scrollYProgress } = useScroll();
    const scale = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 40,
        bounce: 20,
    });

    if (!post) {
        return (
            <Container maxW="container.md">
                <Center>
                    <VStack textAlign="center" spacing={8}>
                        <Alert status="error">
                            <AlertIcon />
                            Sorry, this post could not be found. Please try
                            again later.
                        </Alert>
                        <Link href="/blog">
                            <Button leftIcon={<ArrowLeftIcon />}>
                                Back to blog
                            </Button>
                        </Link>
                    </VStack>
                </Center>
            </Container>
        );
    }

    const { page, blocks } = post;

    return (
        <>
            <NextSeo {...seo} />
            <motion.div
                style={{
                    scaleX: scale,
                    transformOrigin: 'left',
                    background: 'green',
                    position: 'sticky',
                    top: 74,
                    width: '100%',
                    height: '8px',
                    borderRadius: '20px',
                    zIndex: 1,
                }}
            />
            <Container maxW="container.md" className={roboto.className}>
                <Box>
                    <Heading
                        as="h1"
                        fontSize={{ base: '28px', md: '32px', lg: '36px' }}
                        mb={4}
                    >
                        {page.title}
                    </Heading>
                    <Text
                        as="time"
                        dateTime={page.publishedDate}
                        color="gray.500"
                        mb={2}
                    >
                        {page.publishedDate
                            ? page.publishedDate
                            : 'Unpublished'}
                    </Text>
                    <Text color="gray.500" mb={4}>
                        By Adam Hultman
                    </Text>
                    <Stack wrap="wrap" direction="row" spacing={2} mb={4}>
                        {page.tags.map((tag) => (
                            <Tag key={tag} colorScheme="green">
                                {tag}
                            </Tag>
                        ))}
                    </Stack>
                    {page.coverImage && (
                        <Image
                            src={page.coverImage}
                            alt={page.title}
                            width="100%"
                            height={400}
                            objectFit="cover"
                            mb={6}
                        />
                    )}
                    <Divider my={6} />

                    <RenderBlocks blocks={blocks.results} />

                    <Link href="/blog">
                        <Button leftIcon={<ArrowLeftIcon />}>
                            Back to list
                        </Button>
                    </Link>
                </Box>
            </Container>
        </>
    );
}

export async function getStaticProps({ params, draftMode }) {
    const { id } = params;

    let baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    if (draftMode) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NODE_ENV === 'development') {
        baseUrl = `http://localhost:3000`;
    }

    try {
        const post = await fetchPost(id);
        let ogImageUrl = `${baseUrl}/og_blog_fallback.png`;

        if (post.page.coverImage) {
            // assume the cover image is an external URL
            ogImageUrl = post.page.coverImage;
        }

        return {
            props: {
                post,
                seo: {
                    title: post.page.title,
                    description: post.page.description,
                    canonical: `${baseUrl}/blog/${id}`,
                    openGraph: {
                        title: post.page.title,
                        description: post.page.description,
                        url: `${baseUrl}/blog/${id}`,
                        type: 'article',
                        siteName: 'Adam Hultman',
                        images: [
                            {
                                url: ogImageUrl,
                                width: 1200,
                                height: 630,
                                alt: post.page.title,
                            },
                        ],
                        article: {
                            secion: 'Technology',
                            authors: ['Adam Hultman'],
                            publishedTime: post.page.publishedDate,
                            modifiedTime: post.page.publishedDate,
                            tags: post.page.tags,
                        },
                    },
                    twitter: {
                        handle: '@RecursiveAge',
                        cardType: 'summary_large_image',
                    },
                },
            },
            revalidate: 43200, // 12 hours
        };
    } catch (error) {
        console.error('Failed to fetch post:', error);
        return {
            notFound: true,
        };
    }
}

export async function getStaticPaths() {
    try {
        const posts = await fetchPosts();
        const paths = posts.map((post) => ({
            params: { id: post.id },
        }));

        return {
            paths,
            fallback: 'blocking',
        };
    } catch (error) {
        console.error('Failed to fetch paths:', error);
        return {
            paths: [],
            fallback: 'blocking',
        };
    }
}

export default BlogPost;
