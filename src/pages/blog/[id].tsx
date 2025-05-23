import { GetStaticPropsContext } from 'next';
import { NextSeo, NextSeoProps } from 'next-seo';
import { Roboto } from 'next/font/google';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Center,
    Container,
    Divider,
    Heading,
    Link,
    Stack,
    Tag,
    Text,
    VStack,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { NotionBlock as RNRNotionBlock } from '@9gustin/react-notion-render';
import { useEffect } from 'react';

import RenderBlocks from '../../components/RenderBlocks';
import { fetchNotion, fetchNotions } from '../../services/notion';
import { NotionPageWithBlocks } from '../../types/notion';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    preload: true,
});

interface Props {
    post: NotionPageWithBlocks<'blog'>;
    seo: NextSeoProps;
}

function BlogPost({ post, seo }: Props) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const updateScrollProgress = () => {
                const scrollableHeight =
                    document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = window.scrollY;
                const progress =
                    scrollableHeight > 0 ? scrolled / scrollableHeight : 0;
                document.documentElement.style.setProperty(
                    '--scroll-progress',
                    String(progress)
                );
            };
            window.addEventListener('scroll', updateScrollProgress);
            updateScrollProgress(); // Initial call

            return () =>
                window.removeEventListener('scroll', updateScrollProgress);
        }
    }, []);

    if (!post) {
        return (
            <>
                <NextSeo
                    title="Post Not Found"
                    description="The blog post you are looking for could not be found."
                />
                <Container maxW="container.md">
                    <Center minH="60vh">
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
            </>
        );
    }

    const { page, blocks } = post;

    return (
        <>
            <NextSeo {...seo} />
            <Box
                as="article"
                className={roboto.className}
                p={[2, 4]}
                css={{ position: 'relative' }}
            >
                <div className="progress-bar" />

                <Heading
                    as="h1"
                    fontSize={{ base: '28px', md: '32px', lg: '36px' }}
                    mb={4}
                >
                    {page.title}
                </Heading>
                <Text
                    as="time"
                    dateTime={page.publishedDate || undefined}
                    color="gray.500"
                    mb={2}
                    display="block"
                >
                    {page.publishedDate
                        ? new Date(page.publishedDate).toLocaleDateString(
                              'en-US',
                              {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                              }
                          )
                        : 'Unpublished'}
                </Text>
                <Text color="gray.500" mb={4}>
                    By Adam Hultman
                </Text>
                {page.tags && page.tags.length > 0 && (
                    <Stack wrap="wrap" direction="row" spacing={2} mb={4}>
                        {page.tags.map((tag) => (
                            <Tag key={tag} colorScheme="green">
                                {tag}
                            </Tag>
                        ))}
                    </Stack>
                )}
                {page.cover && (
                    <Box
                        position="relative"
                        width="100%"
                        height={{ base: '300px', md: '400px' }}
                        mb={6}
                        borderRadius="md"
                        overflow="hidden"
                    >
                        <NextImage
                            src={page.cover}
                            alt={`${page.title} cover image`}
                            fill
                            style={{ objectFit: 'cover' }}
                            placeholder="empty"
                        />
                    </Box>
                )}
                <Divider my={6} />

                {/* Notion API client and block renderer do not have identical types */}
                <RenderBlocks blocks={blocks.results as RNRNotionBlock[]} />

                <Box mt={8} textAlign="center">
                    <Link href="/blog">
                        <Button leftIcon={<ArrowLeftIcon />}>
                            Back to Blog List
                        </Button>
                    </Link>
                </Box>
            </Box>
        </>
    );
}

export async function getStaticProps({
    params,
}: GetStaticPropsContext<{ id: string }>) {
    const { id } = params!;

    const baseUrl = process.env.APP_BASE_URL;

    try {
        const post = await fetchNotion('blog', id);

        if (!post || !post.page) {
            return { notFound: true };
        }

        const { page } = post;

        let ogImageUrl = `${baseUrl}/og_blog_fallback.png`;

        if (page.cover) {
            ogImageUrl = page.cover;
        }

        const seoProps: NextSeoProps = {
            title: page.title,
            description: page.description,
            canonical: `${baseUrl}/blog/${page.id}`,
            openGraph: {
                title: page.title,
                description: page.description,
                url: `${baseUrl}/blog/${page.id}`,
                type: 'article',
                article: {
                    publishedTime: page.publishedDate || undefined,
                    modifiedTime: page.last_edited_time,
                    authors: ['Adam Hultman'],
                    tags: page.tags,
                },
                images: [
                    {
                        url: ogImageUrl,
                        width: 1200,
                        height: 630,
                        alt: page.title,
                    },
                ],
            },
        };

        return {
            props: {
                post,
                seo: seoProps,
            },
            revalidate: 3600,
        };
    } catch (error) {
        console.error(`Error fetching blog post with id ${id}:`, error);
        return { notFound: true };
    }
}

export async function getStaticPaths() {
    try {
        const posts = await fetchNotions('blog');
        const paths = posts.map((post) => ({
            params: { id: post.id },
        }));

        return {
            paths,
            fallback: 'blocking',
        };
    } catch (error) {
        console.error('Error fetching blog paths:', error);
        return {
            paths: [],
            fallback: 'blocking',
        };
    }
}

export default BlogPost;
