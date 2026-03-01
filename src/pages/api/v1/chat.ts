import { NextRequest } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { serverConfig } from '../../../config';
import { tools } from '../../../lib/chatTools';

const openai = createOpenAI({
    compatibility: 'strict',
    apiKey: serverConfig.OPENAI_API_KEY,
});

const CURR_DATE = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
const systemInitMessage = serverConfig.OPENAI_SYSTEM_INIT_MSG.replace(
    '{CURR_DATE}',
    CURR_DATE
);

export default async function handler(req: NextRequest) {
    const { messages } = await req.json();

    const userAgent = req.headers.get('user-agent');
    const isMobile = /mobile/i.test(userAgent || '');

    let systemMessage = systemInitMessage;
    if (isMobile) {
        systemMessage =
            systemMessage +
            '\n\nYou are now in mobile mode. Keep your answers short and concise. Use bullet points if possible.';
    }

    // Enhanced system message to explain available tools
    const enhancedSystemMessage = `${systemMessage}

You have access to powerful tools to help answer questions about Adam:
- searchBlog: Search Adam's blog posts by topic/keywords
- getBooks: Get book recommendations from Adam's reading list
- searchBookmarks: Find resources and bookmarks Adam has curated
- queryCareerTimeline: Query Adam's career history, jobs, and education
- getCurrentDateTime: Get the current date and time

Use these tools proactively when they would enhance your response. For example:
- If asked about Adam's writing or technical topics, use searchBlog
- If asked about book recommendations or what Adam reads, use getBooks
- If asked about resources, tools, or articles on a topic, use searchBookmarks
- If asked about Adam's work history or specific companies, use queryCareerTimeline
- If asked about the current date or time, use getCurrentDateTime

Present tool results naturally in conversation, citing specific titles, authors, or dates when relevant.`;

    // Use streamText for proper streaming responses with tools
    const result = streamText({
        model: openai('gpt-4.1-mini'),
        messages: [
            { role: 'system', content: enhancedSystemMessage },
            ...messages,
        ],
        tools,
        maxSteps: 5, // Allow multi-step tool usage
    });

    // Return streaming response using toDataStreamResponse
    return result.toDataStreamResponse();
}
