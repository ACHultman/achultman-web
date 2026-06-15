import { NextRequest } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { serverConfig } from '../../../config';

const openai = createOpenAI({
    compatibility: 'strict',
    apiKey: serverConfig.OPENAI_API_KEY,
});
export const runtime = 'edge';

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

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;

function isValidMessage(
    message: unknown
): message is { role: 'user' | 'assistant'; content: string } {
    if (typeof message !== 'object' || message === null) {
        return false;
    }
    const record = message as Record<string, unknown>;
    return (
        (record.role === 'user' || record.role === 'assistant') &&
        typeof record.content === 'string' &&
        record.content.length > 0 &&
        record.content.length <= MAX_MESSAGE_LENGTH
    );
}

export default async function handler(req: NextRequest) {
    // The client maxLength is cosmetic — validate server-side to keep this
    // public, billable endpoint from being abused to drain the OpenAI key.
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', {
            status: 405,
            headers: { Allow: 'POST' },
        });
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return new Response('Invalid JSON body', { status: 400 });
    }

    const messages = (body as { messages?: unknown })?.messages;
    if (
        !Array.isArray(messages) ||
        messages.length === 0 ||
        messages.length > MAX_MESSAGES ||
        !messages.every(isValidMessage)
    ) {
        return new Response('Invalid request', { status: 400 });
    }

    const userAgent = req.headers.get('user-agent');
    const isMobile = /mobile/i.test(userAgent || '');

    let systemMessage = systemInitMessage;
    if (isMobile) {
        systemMessage =
            systemMessage +
            '\n\nYou are now in mobile mode. Keep your answers short and concise. Use bullet points if possible.';
    }

    // Use streamText for proper streaming responses
    const result = streamText({
        model: openai('gpt-4.1-mini'),
        messages: [{ role: 'system', content: systemMessage }, ...messages],
    });

    // Return streaming response using toDataStreamResponse
    return result.toDataStreamResponse();
}
