import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const CURR_DATE = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
const systemInitMessage = (
    process.env.OPENAI_SYSTEM_INIT_MSG || 'Today is {CURR_DATE}.'
).replace('{CURR_DATE}', CURR_DATE);

export default async function handler(req: NextRequest) {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        stream: true,
        messages: [{ role: 'system', content: systemInitMessage }, ...messages],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}
