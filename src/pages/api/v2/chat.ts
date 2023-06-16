import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

const CURR_DATE = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
})
const systemInitMessage = process.env.OPENAI_SYSTEM_INIT_MSG.replace(
    '{CURR_DATE}',
    CURR_DATE
)

export default async function handler(req: Request) {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json()

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        stream: true,
        // add the system init message to the beginning of the conversation
        messages: [{ role: 'system', content: systemInitMessage }, ...messages],
    })
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)
    // Respond with the stream
    return new StreamingTextResponse(stream)
}
