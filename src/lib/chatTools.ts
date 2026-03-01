import { tool } from 'ai';
import { z } from 'zod';
import { fetchNotions } from '../services/notion';
import type { BlogPost, Book, Bookmark } from '../types/notion';
import { TIMELINE } from '../constants/timeline';
import { gitTimelineRootData, type BranchDefinition } from '../data/gitTimelineData';

/**
 * Search blog posts by topic or keywords
 */
export const searchBlogTool = tool({
    description:
        "Search Adam's blog posts by keywords or topics. Returns relevant blog posts with title, description, tags, and published date. Use this when users ask about Adam's writing, blog posts, or specific technical topics he has written about.",
    parameters: z.object({
        query: z
            .string()
            .describe(
                'Keywords or topics to search for in blog posts (e.g., "react", "architecture", "performance")'
            ),
        limit: z
            .number()
            .optional()
            .default(5)
            .describe('Maximum number of results to return'),
    }),
    execute: async ({ query, limit }) => {
        try {
            const posts = await fetchNotions('blog', {
                page_size: 20,
            });

            // Filter posts based on query matching title, description, or tags
            const searchLower = query.toLowerCase();
            const filteredPosts = posts
                .filter((post: BlogPost) => {
                    const titleMatch = post.title
                        .toLowerCase()
                        .includes(searchLower);
                    const descMatch =
                        post.description?.toLowerCase().includes(searchLower) ||
                        false;
                    const tagMatch = post.tags.some((tag) =>
                        tag.toLowerCase().includes(searchLower)
                    );
                    return titleMatch || descMatch || tagMatch;
                })
                .slice(0, limit);

            if (filteredPosts.length === 0) {
                return {
                    success: false,
                    message: `No blog posts found matching "${query}". Adam hasn't written about this topic yet.`,
                };
            }

            return {
                success: true,
                posts: filteredPosts.map((post: BlogPost) => ({
                    title: post.title,
                    description: post.description,
                    tags: post.tags,
                    publishedDate: post.publishedDate,
                    url: `/blog/${post.id}`,
                })),
            };
        } catch (error) {
            console.error('Error searching blog posts:', error);
            return {
                success: false,
                message: 'Unable to search blog posts at this time.',
            };
        }
    },
});

/**
 * Get book recommendations from Adam's reading list
 */
export const getBooksTool = tool({
    description:
        "Get book recommendations from Adam's reading list. Returns books with title, author, and cover image. Use this when users ask about books Adam has read or recommends, or want reading recommendations.",
    parameters: z.object({
        limit: z
            .number()
            .optional()
            .default(5)
            .describe('Maximum number of books to return'),
    }),
    execute: async ({ limit }) => {
        try {
            const books = await fetchNotions('books', {
                page_size: limit,
            });

            if (books.length === 0) {
                return {
                    success: false,
                    message: 'No books available at this time.',
                };
            }

            return {
                success: true,
                books: books.map((book: Book) => ({
                    title: book.title,
                    author: book.author,
                    link: book.link,
                })),
            };
        } catch (error) {
            console.error('Error fetching books:', error);
            return {
                success: false,
                message: 'Unable to fetch books at this time.',
            };
        }
    },
});

/**
 * Search bookmarks/resources by topic
 */
export const searchBookmarksTool = tool({
    description:
        "Search Adam's curated bookmarks and resources by topic or keywords. Returns relevant links, articles, tools, and resources Adam has saved. Use this when users ask about resources, tools, articles, or interesting links on specific topics.",
    parameters: z.object({
        query: z
            .string()
            .describe(
                'Keywords or topics to search for in bookmarks (e.g., "typescript", "design", "AI")'
            ),
        limit: z
            .number()
            .optional()
            .default(5)
            .describe('Maximum number of results to return'),
    }),
    execute: async ({ query, limit }) => {
        try {
            const bookmarks = await fetchNotions('bookmarks', {
                page_size: 30,
            });

            // Filter bookmarks based on query matching title, description, or tags
            const searchLower = query.toLowerCase();
            const filteredBookmarks = bookmarks
                .filter((bookmark: Bookmark) => {
                    const titleMatch = bookmark.title
                        .toLowerCase()
                        .includes(searchLower);
                    const descMatch =
                        bookmark.description
                            ?.toLowerCase()
                            .includes(searchLower) || false;
                    const tagMatch = bookmark.tags.some((tag) =>
                        tag.toLowerCase().includes(searchLower)
                    );
                    return titleMatch || descMatch || tagMatch;
                })
                .slice(0, limit);

            if (filteredBookmarks.length === 0) {
                return {
                    success: false,
                    message: `No bookmarks found matching "${query}".`,
                };
            }

            return {
                success: true,
                bookmarks: filteredBookmarks.map((bookmark: Bookmark) => ({
                    title: bookmark.title,
                    link: bookmark.link,
                    description: bookmark.description,
                    tags: bookmark.tags,
                })),
            };
        } catch (error) {
            console.error('Error searching bookmarks:', error);
            return {
                success: false,
                message: 'Unable to search bookmarks at this time.',
            };
        }
    },
});

/**
 * Query career timeline information
 */
export const queryCareerTimelineTool = tool({
    description:
        "Query specific information from Adam's career timeline. Returns details about jobs, education, co-op positions, and key career milestones. Use this when users ask about Adam's work history, specific companies he worked at, educational background, or career progression.",
    parameters: z.object({
        query: z
            .string()
            .describe(
                'What to search for in the timeline (e.g., "Assembly", "UVic", "co-op", "2021")'
            ),
    }),
    execute: async ({ query }) => {
        try {
            const searchLower = query.toLowerCase();
            const results: string[] = [];

            // Search in TIMELINE data
            Object.entries(TIMELINE).forEach(([year, items]) => {
                items.forEach((item) => {
                    const orgMatch = item.org.title
                        .toLowerCase()
                        .includes(searchLower);
                    const subtitleMatch = item.subtitle
                        .toLowerCase()
                        .includes(searchLower);
                    const dateMatch = item.dateRange
                        .toLowerCase()
                        .includes(searchLower);
                    const yearMatch = year.includes(query);

                    if (orgMatch || subtitleMatch || dateMatch || yearMatch) {
                        results.push(
                            `${item.org.title}: ${item.subtitle} (${item.dateRange})`
                        );
                    }
                });
            });

            // Helper function to recursively search git timeline
            function searchGitBranch(branch: BranchDefinition): void {
                // Search commits
                branch.commits?.forEach((commit) => {
                    const subjectMatch = commit.subject
                        .toLowerCase()
                        .includes(searchLower);
                    const bodyMatch = commit.body
                        .toLowerCase()
                        .includes(searchLower);

                    if (subjectMatch || bodyMatch) {
                        results.push(`${commit.subject} - ${commit.body}`);
                    }
                });

                // Search sub-branches recursively
                branch.subBranches?.forEach((subBranch) => {
                    searchGitBranch(subBranch);
                });

                // Search final commits
                branch.finalCommits?.forEach((commit) => {
                    const subjectMatch = commit.subject
                        .toLowerCase()
                        .includes(searchLower);
                    const bodyMatch = commit.body
                        .toLowerCase()
                        .includes(searchLower);

                    if (subjectMatch || bodyMatch) {
                        results.push(`${commit.subject} - ${commit.body}`);
                    }
                });
            }

            searchGitBranch(gitTimelineRootData);

            if (results.length === 0) {
                return {
                    success: false,
                    message: `No career timeline information found matching "${query}".`,
                };
            }

            return {
                success: true,
                events: results.slice(0, 10), // Limit to top 10 results
            };
        } catch (error) {
            console.error('Error querying career timeline:', error);
            return {
                success: false,
                message: 'Unable to query career timeline at this time.',
            };
        }
    },
});

/**
 * Get current date and time information
 */
export const getCurrentDateTimeTool = tool({
    description:
        'Get the current date and time. Use this when users ask about the current date, time, day of week, or relative time questions like "what day is it" or "what time is it".',
    parameters: z.object({}),
    execute: async () => {
        const now = new Date();
        return {
            success: true,
            date: now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            time: now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
            }),
            iso: now.toISOString(),
        };
    },
});

export const tools = {
    searchBlog: searchBlogTool,
    getBooks: getBooksTool,
    searchBookmarks: searchBookmarksTool,
    queryCareerTimeline: queryCareerTimelineTool,
    getCurrentDateTime: getCurrentDateTimeTool,
};
