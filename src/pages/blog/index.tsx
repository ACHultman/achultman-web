import { PageIntro, PageSeo } from '@components/Editorial';
import ArticleList from '@components/ArticleList';
import { fetchBlogPostsWithReadingTime } from '../../services/notion';
import { BlogPost } from '../../types/notion';

const topics = [
    {
        id: 'ai-development',
        title: 'AI-assisted development',
        description:
            'Coding agents, multi-agent workflows, and reviewing AI-assisted changes before shipping them.',
    },
    {
        id: 'react-nextjs',
        title: 'React and Next.js',
        description:
            'Component patterns, TypeScript, real-time data with WebSockets, and deploying React applications.',
    },
    {
        id: 'performance-and-systems',
        title: 'Performance, architecture, and security',
        description:
            'Frontend performance beyond Lighthouse scores, full-stack architecture, and safer software.',
    },
];

function topicFor(post: BlogPost) {
    if (post.tags.includes('AI')) return 'ai-development';
    if (
        post.tags.some((tag) =>
            ['React', 'NextJS', 'Next.js', 'TypeScript'].includes(tag)
        )
    )
        return 'react-nextjs';
    return 'performance-and-systems';
}

export default function BlogPage({ posts }: { posts: BlogPost[] }) {
    const sections = topics
        .map((topic) => ({
            ...topic,
            posts: posts.filter((post) => topicFor(post) === topic.id),
        }))
        .filter((topic) => topic.posts.length > 0);

    return (
        <>
            <PageSeo
                title="Writing on React, Next.js & AI Development"
                path="/blog"
                description="Adam Hultman’s articles on software engineering, React, Next.js, performance, and AI-assisted development."
            />
            <div className="page-container">
                <PageIntro label="Writing" title="Working notes.">
                    Notes on React and Next.js, AI-assisted development,
                    performance, and software architecture. I write about the
                    tools and engineering decisions behind the work.{' '}
                    {/* RSS is an XML document and needs a full navigation. */}
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a className="writing-rss" href="/feed.xml">
                        Subscribe via RSS ↗
                    </a>
                </PageIntro>
                {posts.length > 0 ? (
                    <>
                        <nav
                            className="section-nav"
                            aria-label="Writing topics"
                        >
                            {sections.map((topic) => (
                                <a key={topic.id} href={`#${topic.id}`}>
                                    {topic.title}
                                </a>
                            ))}
                        </nav>
                        {sections.map((topic) => (
                            <section
                                key={topic.id}
                                id={topic.id}
                                className="writing-topic"
                                aria-labelledby={`${topic.id}-title`}
                            >
                                <header>
                                    <h2 id={`${topic.id}-title`}>
                                        {topic.title}
                                    </h2>
                                    <p>{topic.description}</p>
                                </header>
                                <ArticleList
                                    posts={topic.posts}
                                    headingLevel={3}
                                />
                            </section>
                        ))}
                    </>
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
