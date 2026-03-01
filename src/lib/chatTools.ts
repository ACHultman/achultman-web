import { tool } from 'ai';
import { z } from 'zod';

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
            const params = new URLSearchParams({
                query,
                limit: limit.toString(),
            });
            const response = await fetch(
                `/api/v1/search/blog?${params.toString()}`
            );

            if (!response.ok) {
                return {
                    success: false,
                    message: `No blog posts found matching "${query}". Adam hasn't written about this topic yet.`,
                };
            }

            const data = await response.json();
            return data;
        } catch {
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
            const params = new URLSearchParams({
                limit: limit.toString(),
            });
            const response = await fetch(
                `/api/v1/search/books?${params.toString()}`
            );

            if (!response.ok) {
                return {
                    success: false,
                    message: 'No books available at this time.',
                };
            }

            const data = await response.json();
            return data;
        } catch {
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
            const params = new URLSearchParams({
                query,
                limit: limit.toString(),
            });
            const response = await fetch(
                `/api/v1/search/bookmarks?${params.toString()}`
            );

            if (!response.ok) {
                return {
                    success: false,
                    message: `No bookmarks found matching "${query}".`,
                };
            }

            const data = await response.json();
            return data;
        } catch {
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
            const params = new URLSearchParams({ query });
            const response = await fetch(
                `/api/v1/search/timeline?${params.toString()}`
            );

            if (!response.ok) {
                return {
                    success: false,
                    message: `No career timeline information found matching "${query}".`,
                };
            }

            const data = await response.json();
            return data;
        } catch {
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
