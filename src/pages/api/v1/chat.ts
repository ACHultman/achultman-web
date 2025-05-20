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

    return streamText({
        model: openai('gpt-4.1-mini'),
        messages: [{ role: 'system', content: systemMessage }, ...messages],
    }).toDataStreamResponse();
}
