import { BlogPost } from '../types/notion';

function byNewest(a: BlogPost, b: BlogPost): number {
    return (b.publishedDate || '').localeCompare(a.publishedDate || '');
}

/**
 * Pick posts related to `current`, ranked by number of shared tags (newest
 * breaks ties). If too few share a tag, pad with the most-recent other posts
 * so the section is always useful.
 */
export function getRelatedPosts(
    current: BlogPost,
    all: BlogPost[],
    limit = 3
): BlogPost[] {
    const currentTags = new Set(current.tags);
    const others = all.filter((post) => post.id !== current.id);

    const related = others
        .map((post) => ({
            post,
            score: post.tags.filter((tag) => currentTags.has(tag)).length,
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || byNewest(a.post, b.post))
        .slice(0, limit)
        .map((entry) => entry.post);

    if (related.length < limit) {
        const chosen = new Set(related.map((post) => post.id));
        const recent = others
            .filter((post) => !chosen.has(post.id))
            .sort(byNewest);
        related.push(...recent.slice(0, limit - related.length));
    }

    return related;
}
