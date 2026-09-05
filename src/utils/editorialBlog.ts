import type { BlogPost } from '../types/notion';

// These broad tutorials predate the site's current editorial standard. Keep
// their URLs available for old links, but remove them from discovery surfaces
// and mark the article pages noindex until they are substantially rewritten.
const RETIRED_BLOG_SLUGS = new Set([
    'architecting-a-real-world-llm-agent-workflow-beyond-chatbots',
    'optimizing-frontend-performance-beyond-lighthouse-scores',
    'react-compound-components-vs-render-props-vs-custom-hooks',
    'building-real-time-applications-with-react-and-websockets',
    'top-mistakes-to-avoid-when-deploying-react-apps-to-production',
    'security-is-fun-10-cybersecurity-practices-every-developer-should-know',
    'how-to-build-a-scalable-react-app-with-next-js-and-typescript',
    'getting-started-with-ai-driven-development-tools-and-techniques',
]);

export function isRetiredBlogSlug(slug: string): boolean {
    return RETIRED_BLOG_SLUGS.has(slug);
}

export function isEditorialBlogPost(post: Pick<BlogPost, 'slug'>): boolean {
    return !isRetiredBlogSlug(post.slug);
}
