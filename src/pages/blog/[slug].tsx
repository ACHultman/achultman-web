import { GetStaticPropsContext } from 'next';
import { NextSeo, NextSeoProps } from 'next-seo';
import {
    Alert,
    AlertIcon,
    Box,
    Center,
    Container,
    Divider,
    Heading,
    Link,
    Stack,
    Text,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
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
import {
    isEditorialBlogPost,
    isRetiredBlogSlug,
} from '../../utils/editorialBlog';

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
    archived: boolean;
}

function BlogPost({
    post,
    seo,
    jsonLd,
    readingTime,
    breadcrumb,
    relatedPosts,
    archived,
}: Props) {
    const metaColor = useColorModeValue('gray.600', 'gray.400');
    const ruleColor = useColorModeValue('gray.300', 'gray.700');

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
                            <Link as={NextLink} href="/blog" color="green.600">
                                Back to working notes
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
            {jsonLd && <BlogPostingJsonLd {...jsonLd} />}
            <BreadcrumbJsonLd items={breadcrumb} />
            <Box
                as="article"
                maxW="760px"
                mx="auto"
                px={{ base: 5, md: 8 }}
                py={{ base: 8, md: 14 }}
                css={{ position: 'relative' }}
            >
                <div className="progress-bar" />

                <Heading
                    as="h1"
                    fontSize={{ base: '38px', md: '52px' }}
                    lineHeight="1.04"
                    letterSpacing="-0.04em"
                    mb={6}
                    sx={{ textWrap: 'balance' }}
                >
                    {page.title}
                </Heading>
                <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    spacing={{ base: 1, sm: 3 }}
                    color={metaColor}
                    fontSize="sm"
                    mb={6}
                >
                    <Text as="time" dateTime={page.publishedDate || undefined}>
                        {page.publishedDate
                            ? formatNotionDate(page.publishedDate, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                              })
                            : 'Unpublished'}
                    </Text>
                    <Text
                        aria-hidden="true"
                        display={{ base: 'none', sm: 'block' }}
                    >
                        ·
                    </Text>
                    <Text>{readingTime} min read</Text>
                    {page.tags && page.tags.length > 0 && (
                        <>
                            <Text
                                aria-hidden="true"
                                display={{ base: 'none', sm: 'block' }}
                            >
                                ·
                            </Text>
                            <Text>{page.tags.join(' · ')}</Text>
                        </>
                    )}
                </Stack>
                {archived && (
                    <Box
                        borderLeftWidth="2px"
                        borderColor="green.500"
                        pl={4}
                        py={1}
                        mb={8}
                    >
                        <Text color={metaColor} fontSize="sm" lineHeight="1.7">
                            Archived note. This page remains available for old
                            links, but it is no longer part of the edited
                            collection.
                        </Text>
                    </Box>
                )}
                {page.cover && (
                    <Box
                        position="relative"
                        width="100%"
                        height={{ base: '300px', md: '400px' }}
                        mb={6}
                        borderRadius="sm"
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
                <Divider my={8} borderColor={ruleColor} />

                {/* Notion API client and block renderer do not have identical types */}
                <RenderBlocks blocks={blocks.results as RNRNotionBlock[]} />

                <RelatedPosts posts={relatedPosts} />

                <Box mt={12}>
                    <Link
                        as={NextLink}
                        href="/blog"
                        color="green.600"
                        fontWeight="600"
                    >
                        ← Back to working notes
                    </Link>
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
            noindex: isRetiredBlogSlug(page.slug),
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

        const relatedPosts = getRelatedPosts(
            match,
            allPosts.filter(isEditorialBlogPost)
        );

        const readingTime = estimateReadingTime(post.blocks.results);

        return {
            props: {
                post,
                seo: seoProps,
                jsonLd,
                readingTime,
                breadcrumb,
                relatedPosts,
                archived: isRetiredBlogSlug(page.slug),
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
