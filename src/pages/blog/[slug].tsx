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
    Stack,
    Tag,
    Text,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { NotionBlock as RNRNotionBlock } from '@9gustin/react-notion-render';
import { useEffect } from 'react';

import RenderBlocks from '../../components/RenderBlocks';
import BlogPostingJsonLd from '../../components/BlogPostingJsonLd';
import BreadcrumbJsonLd from '../../components/BreadcrumbJsonLd';
import RelatedPosts from '../../components/Blog/RelatedPosts';
import { fetchNotion, fetchNotions } from '../../services/notion';
import {
    BlogPost as BlogPostType,
    NotionPageWithBlocks,
} from '../../types/notion';
import { estimateReadingTime } from '../../utils/readingTime';
import { getBaseUrl } from '../../utils/baseUrl';
import { formatNotionDate } from '../../utils/date';
import { isNotionId } from '../../utils/slug';
import { getRelatedPosts } from '../../utils/relatedPosts';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    preload: true,
});

interface BlogPostingJsonLdData {
    headline: string;
    datePublished?: string;
    dateModified?: string;
    description?: string;
    image?: string;
    url: string;
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface Props {
    post: NotionPageWithBlocks<'blog'>;
    seo: NextSeoProps;
    jsonLd: BlogPostingJsonLdData;
    readingTime: number;
    breadcrumb: BreadcrumbItem[];
    relatedPosts: BlogPostType[];
}

function BlogPost({
    post,
    seo,
    jsonLd,
    readingTime,
    breadcrumb,
    relatedPosts,
}: Props) {
    const metaColor = useColorModeValue('gray.600', 'gray.400');

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
                            <Button
                                as={NextLink}
                                href="/blog"
                                leftIcon={<ArrowLeftIcon />}
                            >
                                Back to blog
                            </Button>
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
            {jsonLd && <BlogPostingJsonLd {...jsonLd} />}
            <BreadcrumbJsonLd items={breadcrumb} />
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
                    color={metaColor}
                    mb={2}
                    display="block"
                >
                    {page.publishedDate
                        ? formatNotionDate(page.publishedDate, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                          })
                        : 'Unpublished'}
                </Text>
                <Text color={metaColor} mb={4}>
                    By Adam Hultman · {readingTime} min read
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

                <RelatedPosts posts={relatedPosts} />

                <Box mt={8} textAlign="center">
                    <Button
                        as={NextLink}
                        href="/blog"
                        leftIcon={<ArrowLeftIcon />}
                    >
                        Back to Blog List
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export async function getStaticProps({
    params,
}: GetStaticPropsContext<{ slug: string }>) {
    const { slug } = params!;

    const baseUrl = getBaseUrl();

    try {
        // Back-compat: old /blog/<uuid> links 301 to the post's slug URL.
        // Only published posts redirect — drafts reached by id 404.
        if (isNotionId(slug)) {
            const byId = await fetchNotion('blog', slug);
            if (byId?.page?.publishedDate) {
                return {
                    redirect: {
                        destination: `/blog/${byId.page.slug}`,
                        permanent: true,
                    },
                };
            }
            return { notFound: true };
        }

        // Resolve the slug via the published-only listing. This doubles as
        // draft protection: unpublished posts aren't in the listing, so their
        // slugs simply 404.
        const allPosts = await fetchNotions('blog', { page_size: 100 });
        const match = allPosts.find((candidate) => candidate.slug === slug);
        if (!match) {
            return { notFound: true };
        }

        const post = await fetchNotion('blog', match.id);
        if (!post || !post.page) {
            return { notFound: true };
        }

        const { page } = post;
        const postUrl = `${baseUrl}/blog/${page.slug}`;

        // Always use a generated, branded share card. It's reliable (never
        // expires like Notion signed URLs) and consistent across every post.
        const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(
            page.title
        )}`;

        // Omit empty descriptions entirely rather than emitting empty meta /
        // og:description tags (worse for SEO than no tag).
        const description = page.description || undefined;

        // dateModified must be >= datePublished or Rich Results rejects the
        // schema; clamp in case a post is given a future Published date.
        const dateModified =
            page.publishedDate && page.last_edited_time < page.publishedDate
                ? page.publishedDate
                : page.last_edited_time;

        const seoProps: NextSeoProps = {
            title: page.title,
            description,
            canonical: postUrl,
            openGraph: {
                title: page.title,
                description,
                url: postUrl,
                type: 'article',
                article: {
                    publishedTime: page.publishedDate || undefined,
                    modifiedTime: dateModified,
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

        const jsonLd: BlogPostingJsonLdData = {
            headline: page.title,
            datePublished: page.publishedDate || undefined,
            dateModified,
            description,
            image: ogImageUrl,
            url: postUrl,
        };

        const breadcrumb = [
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Blog', url: `${baseUrl}/blog` },
            { name: page.title, url: postUrl },
        ];

        const relatedPosts = getRelatedPosts(match, allPosts);

        const readingTime = estimateReadingTime(post.blocks.results);

        return {
            props: {
                post,
                seo: seoProps,
                jsonLd,
                readingTime,
                breadcrumb,
                relatedPosts,
            },
            revalidate: 3600,
        };
    } catch (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error);
        return { notFound: true };
    }
}

export async function getStaticPaths() {
    try {
        // Prebuild all posts (default page_size is only 10), so older posts
        // are served statically instead of cold-rendering on first visit.
        const posts = await fetchNotions('blog', { page_size: 100 });

        // Dedupe by slug so colliding title-derived slugs don't produce
        // duplicate paths (which would fail the build).
        const seen = new Set<string>();
        const paths = [];
        for (const post of posts) {
            if (seen.has(post.slug)) {
                continue;
            }
            seen.add(post.slug);
            paths.push({ params: { slug: post.slug } });
        }

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
