/**
 * /api/chat
 * This is the API endpoint for the chatbot.
 * It uses the OpenAI API to generate a response.
 * It poses as me, so you can ask me questions on my website.
 * Expecting a POST request with a JSON body containing:
 * {
 *  "message": "message to send to the chatbot",
 *  "previousMessages": [{"role": "user", "content": "message"}, ... ] // optional
 * }
 * Returns a JSON object containing the chatbot's response:
 * {
 *  "result": "chatbot's response"
 * }
 */

import { NextApiRequest, NextApiResponse } from "next/types";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const OPENAI_MODEL = "gpt-3.5-turbo";
const OPENAI_TEMPERATURE = 0.6;
const CURR_DATE = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const systemInitMessage = process.env.OPENAI_SYSTEM_INIT_MSG.replace(
  "{CURR_DATE}",
  CURR_DATE
);

type ChatRequestBody = {
  message: string;
  prevMessages: ChatCompletionRequestMessage[];
};
type Override<T1, T2> = Omit<T1, keyof T2> & T2;
type ChatRequest = Override<NextApiRequest, { body: ChatRequestBody }>;

export default async function (req: ChatRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "Sorry, I ran out of API requests for the day. Please try again tomorrow.",
      },
    });

    return;
  }

  const userMessage = req.body.message || "";
  if (userMessage.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid message.",
      },
    });

    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: OPENAI_MODEL,
      messages: constructMessages(userMessage, req.body.prevMessages || []),
      temperature: OPENAI_TEMPERATURE,
    });

    res
      .status(200)
      .json({ result: completion.data.choices[0].message?.content });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function constructMessages(
  message: string,
  messages: ChatCompletionRequestMessage[]
): ChatCompletionRequestMessage[] {
  console.log([
    {
      role: "system",
      content: systemInitMessage,
    },
    ...messages,
    {
      role: "user",
      content: message,
    },
  ]);
  return [
    {
      role: "system",
      content: systemInitMessage,
    },
    ...messages,
    {
      role: "user",
      content: message,
    },
  ];
}

// test request body

const testReq = {
  message: "What did I say in my last message",
  previousMessages: [
    {
      role: "user",
      content: "What is your name?",
    },
    {
      role: "assistant",
      content: "My name is Adam Hultman",
    },
  ],
};
