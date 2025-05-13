import { NextRequest } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { config } from '../../../config';

const openai = createOpenAI({
    compatibility: 'strict',
    apiKey: config.OPENAI_API_KEY,
});
export const runtime = 'edge';

const CURR_DATE = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
const systemInitMessage = config.OPENAI_SYSTEM_INIT_MSG.replace(
    '{CURR_DATE}',
    CURR_DATE
);

export default async function handler(req: NextRequest) {
    const { messages } = await req.json();

    return streamText({
        model: openai('gpt-4o-mini'),
        messages: [{ role: 'system', content: systemInitMessage }, ...messages],
    }).toDataStreamResponse();
}
