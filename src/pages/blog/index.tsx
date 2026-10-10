import { PageIntro, PageSeo } from '@components/Editorial';
import ArticleList from '@components/ArticleList';
import { fetchBlogPostsWithReadingTime } from '../../services/notion';
import { BlogPost } from '../../types/notion';

export default function BlogPage({ posts }: { posts: BlogPost[] }) {
    return (
        <>
            <PageSeo
                title="Software engineering articles"
                path="/blog"
                description="Adam Hultman’s articles on software engineering, React, Next.js, performance, and AI-assisted development."
            />
            <div className="page-container">
                <PageIntro label="Writing" title="Working notes.">
                    Notes on building products, working with AI, and making
                    better engineering decisions. I publish when there’s
                    something useful to say.{' '}
                    {/* RSS is an XML document and needs a full navigation. */}
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a className="writing-rss" href="/feed.xml">
                        Subscribe via RSS ↗
                    </a>
                </PageIntro>
                {posts.length > 0 ? (
                    <ArticleList posts={posts} />
                ) : (
                    <div className="article-list empty-writing">
                        <p>
                            The writing archive is temporarily unavailable.
                            Please try again later.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

export async function getStaticProps() {
    // Throwing on an upstream failure preserves the last successful ISR page.
    const posts = await fetchBlogPostsWithReadingTime({
        page_size: 100,
        all: true,
        sorts: [{ property: 'Published', direction: 'descending' }],
    });
    return {
        props: { posts: posts },
        revalidate: posts.length ? 3600 : 60,
    };
}
