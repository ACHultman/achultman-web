/**
 * /api/chat
 * This is the API endpoint for the chatbot.
 * It uses the OpenAI API to generate a response.
 * It poses as me, so the user can ask me questions on my website.
 */

import { NextRequest } from 'next/server'
import { Configuration, OpenAIApi } from 'openai-edge'

export const config = {
    runtime: 'experimental-edge',
}

const OPENAI_MODEL = 'gpt-3.5-turbo'
const OPENAI_TEMPERATURE = 0.6
const CURR_DATE = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
})

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const systemInitMessage = process.env.OPENAI_SYSTEM_INIT_MSG.replace(
    '{CURR_DATE}',
    CURR_DATE
)

export interface RequestQueryConversation {
    conversation: string
    temperature: string
}

type Messages = Parameters<typeof openai.createChatCompletion>[0]['messages']

function getMessages({
    conversation,
}: {
    conversation: Conversation
}): Messages {
    let messages: Messages = [{ role: 'system', content: systemInitMessage }]
    conversation.history.forEach((message: Message, i) => {
        messages.push({
            role: message.author === 'user' ? 'user' : 'assistant',
            content: message.text,
        })
    })
    return messages
}

function validateConversation(conversation: Conversation) {
    if (!conversation) {
        throw new Error('Invalid conversation')
    }
    if (!conversation.history) {
        throw new Error('Invalid conversation')
    }
}

export default async function (req: NextRequest) {
    if (!configuration.apiKey) {
        return constructResponse(500, {
            error: {
                message:
                    'Sorry, I ran out of API requests for the day. Please try again tomorrow.',
            },
        })
    }

    // TODO: store conversation in redis or something (with expirey)
    const { searchParams } = new URL(req.url)

    let conversation: Conversation
    try {
        conversation = JSON.parse(searchParams.get('conversation') as string)
        validateConversation(conversation)
    } catch (error) {
        return constructResponse(400, {
            error: { message: 'Please enter a valid message.' },
        })
    }

    try {
        const completion = await openai.createChatCompletion({
            model: OPENAI_MODEL,
            messages: getMessages({ conversation }),
            temperature: OPENAI_TEMPERATURE,
            stream: true,
        })

        return new Response(completion.body, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/event-stream;charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'X-Accel-Buffering': 'no',
            },
        })
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data)
            return constructResponse(error.response.status, error.response.data)
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`)
            return constructResponse(500, {
                error: { message: 'An error occurred during your request.' },
            })
        }
    }
}

function constructResponse(status: number, data: Object | string) {
    return new Response(JSON.stringify({ data }), {
        status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    })
}
