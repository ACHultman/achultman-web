import { GetStaticPropsContext } from 'next';
import { NextSeo, NextSeoProps } from 'next-seo';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

import RenderBlocks from '../../components/RenderBlocks';
import BlogPostingJsonLd from '../../components/BlogPostingJsonLd';
import BreadcrumbJsonLd from '../../components/BreadcrumbJsonLd';
import ArticleList from '../../components/ArticleList';
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
    const { page, blocks } = post;

    return (
        <>
            <NextSeo {...seo} />
            {jsonLd && <BlogPostingJsonLd {...jsonLd} />}
            <BreadcrumbJsonLd items={breadcrumb} />
            <article className="reading-article page-container">
                <header className="article-intro">
                    <Link href="/blog" className="article-back">
                        <FiArrowLeft aria-hidden="true" /> All writing
                    </Link>
                    <h1>{page.title}</h1>
                    <div className="article-meta">
                        <Link href="/about" rel="author">
                            Adam Hultman
                        </Link>
                        <time dateTime={page.publishedDate || undefined}>
                            {page.publishedDate
                                ? formatNotionDate(page.publishedDate, {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                  })
                                : 'Unpublished'}
                        </time>
                        <span>{readingTime} min read</span>
                    </div>
                </header>
                <div className="article-body">
                    {/* The Notion client and renderer expose different block types. */}
                    <RenderBlocks blocks={blocks.results} />
                </div>
                {relatedPosts.length > 0 && (
                    <section
                        className="article-related"
                        aria-labelledby="related-title"
                    >
                        <h2 id="related-title">More writing</h2>
                        <ArticleList posts={relatedPosts} headingLevel={3} />
                    </section>
                )}
                <Link href="/blog" className="article-back">
                    <FiArrowLeft aria-hidden="true" /> All writing
                </Link>
            </article>
        </>
    );
}

export async function getStaticProps({
    params,
}: GetStaticPropsContext<{ slug: string }>) {
    const { slug } = params!;

    const baseUrl = getBaseUrl();

    try {
        const allPosts = await fetchNotions('blog', {
            page_size: 100,
            all: true,
        });
        // Back-compat: old /blog/<uuid> links 301 to the post's slug URL.
        // Only published posts redirect — drafts reached by id 404.
        if (isNotionId(slug)) {
            const byId = allPosts.find(
                (post) =>
                    post.id.replace(/-/g, '').toLowerCase() ===
                    slug.replace(/-/g, '').toLowerCase()
            );
            if (byId?.publishedDate) {
                return {
                    redirect: {
                        destination: `/blog/${byId.slug}`,
                        permanent: true,
                    },
                };
            }
            return { notFound: true, revalidate: 60 };
        }

        // Resolve the slug via the published-only listing. This doubles as
        // draft protection: unpublished posts aren't in the listing, so their
        // slugs simply 404.
        const match = allPosts.find((candidate) => candidate.slug === slug);
        if (!match) {
            return { notFound: true, revalidate: 60 };
        }

        const post = await fetchNotion('blog', match.id);
        if (!post?.page.publishedDate) {
            return { notFound: true, revalidate: 60 };
        }

        const { page } = post;
        const postUrl = `${baseUrl}/blog/${page.slug}`;

        // Always use a generated, branded share card. It's reliable (never
        // expires like Notion signed URLs) and consistent across every post.
        const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(
            page.title
        )}`;

        // Always provide serializable article-specific metadata, even when
        // the optional Notion description is blank.
        const description =
            page.description || `An article by Adam Hultman: ${page.title}.`;

        // Keep the modified date from preceding the editorial publication date.
        const dateModified =
            page.publishedDate && page.last_edited_time < page.publishedDate
                ? page.publishedDate
                : page.last_edited_time;

        const seoProps: NextSeoProps = {
            title: page.title,
            description,
            canonical: postUrl,
            noindex: false,
            openGraph: {
                title: page.title,
                description,
                url: postUrl,
                type: 'article',
                article: {
                    publishedTime: page.publishedDate!,
                    modifiedTime: dateModified,
                    authors: [`${baseUrl}/about`],
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
            datePublished: page.publishedDate!,
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
        console.error('Error fetching blog post');
        // Throwing preserves the last successful ISR page on upstream failure.
        throw error;
    }
}

export async function getStaticPaths() {
    try {
        // Prebuild all posts (default page_size is only 10), so older posts
        // are served statically instead of cold-rendering on first visit.
        const posts = await fetchNotions('blog', { page_size: 100, all: true });

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
