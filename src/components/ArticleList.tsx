import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { formatNotionDate } from '../utils/date';
import { captureEvent } from '../lib/analytics';

export interface ArticleSummary {
    slug: string;
    title: string;
    description: string;
    publishedDate: string | null;
}

export default function ArticleList({
    posts,
    headingLevel = 2,
}: {
    posts: ArticleSummary[];
    headingLevel?: 2 | 3;
}) {
    const Heading = headingLevel === 3 ? 'h3' : 'h2';
    return (
        <div className="article-list">
            {posts.map((post) => (
                <article className="article-row" key={post.slug}>
                    <time dateTime={post.publishedDate || undefined}>
                        {post.publishedDate
                            ? formatNotionDate(post.publishedDate)
                            : ''}
                    </time>
                    <div>
                        <Heading>
                            <Link
                                href={`/blog/${post.slug}`}
                                prefetch={false}
                                onClick={() =>
                                    captureEvent('blog_post_clicked', {
                                        post_slug: post.slug,
                                    })
                                }
                            >
                                {post.title}
                            </Link>
                        </Heading>
                        {post.description && <p>{post.description}</p>}
                    </div>
                    <span className="article-arrow" aria-hidden="true">
                        <FiArrowRight />
                    </span>
                </article>
            ))}
        </div>
    );
}
