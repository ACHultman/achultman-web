import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useServerSentEvents from "../../../hooks/useServerSentEvents";
import {
  Conversation,
  RequestQueryConversation,
} from "../../../pages/api/chat";
import {
  chakra,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SlideFade,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { MessageBox } from "./MessageBox";
import { MdSend } from "react-icons/md";
import { motion } from "framer-motion";

const CHAT_ENDPOINT = "/api/chat";
const CHAT_BOT_WELCOME_MESSAGE =
  "Hi there! I'm here to help you learn more about Adam. What would you like to know?";

const MotionMessageBox = motion(MessageBox);

interface FormData {
  prompt: string;
}

function scrollToBottom(node: React.RefObject<HTMLDivElement>) {
  const scroll = node.current.scrollHeight - node.current.clientHeight;
  node.current.scrollTo(0, scroll);
}

export default function Chat() {
  const bioNode = useRef<HTMLParagraphElement>(null);
  const conversationNode = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Conversation>({
    history: [
      {
        speaker: "bot",
        text: CHAT_BOT_WELCOME_MESSAGE,
      },
    ],
  });
  const [streaming, setStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: _formState,
    reset,
  } = useForm<FormData>();

  const bgColor = useColorModeValue("white", "gray.800");
  const msgInputColor = useColorModeValue("gray.200", "gray.600");

  const { openStream } = useServerSentEvents<RequestQueryConversation>({
    baseUrl: CHAT_ENDPOINT,
    config: {
      withCredentials: false,
    },
    onData,
    onOpen: () => {
      reset();
      if (bioNode.current) {
        bioNode.current.innerText = "";
      }
    },
    onClose: () => {
      setStreaming(false);
      setConversation((prev) => {
        return {
          ...prev,
          history: [
            ...prev.history,
            {
              speaker: "bot",
              text: bioNode.current?.innerText.replace(/<br>/g, "\n") as string,
            },
          ],
        };
      });
    },
    onError: (event) => {
      console.error(event);
      setStreaming(false);
      setError(`Something went wrong with the request`);
    },
  });

  function onData(data: string) {
    if (!bioNode.current) {
      return;
    }
    try {
      let text = JSON.parse(data).choices[0].delta.content;
      if (text) {
        bioNode.current.innerText = bioNode.current.innerText + text;
        scrollToBottom(conversationNode);
      }
    } catch (err) {
      console.error(`Failed to parse data: ${data}`);
      setError(`Failed to parse the response`);
    }
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (streaming || !data.prompt) {
      return;
    }

    if (bioNode.current) {
      bioNode.current.innerText = "...";
    }
    setStreaming(true);

    const newConversation: Conversation = {
      history: [
        ...conversation.history,
        { speaker: "user", text: data.prompt },
      ],
    };

    setConversation(newConversation);

    scrollToBottom(conversationNode);
    openStream({
      query: {
        conversation: JSON.stringify(newConversation),
        temperature: "0.7",
      },
    });
  };

  if (error) {
    setConversation((prev) => {
      return {
        ...prev,
        history: [
          ...prev.history,
          {
            speaker: "bot",
            text: error,
          },
        ],
      };
    });
    setError(null);
  }

  return (
    <SlideFade in={true} offsetY={-80}>
      <VStack
        w="100%"
        minW="300px"
        h="350px"
        gap={2}
        justify="space-between"
        borderRadius="30px"
        backgroundColor={bgColor}
        overflow="hidden"
      >
        <VStack
          w="100%"
          h="350px"
          borderRadius="30px"
          px={20}
          overflowY="auto"
          ref={conversationNode}
        >
          {conversation.history.map((x, i) =>
            x.speaker === "user" ? (
              <MotionMessageBox key={i} message={x.text} isUser={true} />
            ) : (
              <MotionMessageBox key={i} message={x.text} isUser={false} />
            )
          )}
          <MotionMessageBox
            ref={bioNode}
            message="..."
            hidden={!streaming}
            isUser={false}
          />
        </VStack>
        <chakra.form w="80%" onSubmit={handleSubmit(onSubmit)}>
          <InputGroup size="lg" mb={4} w="100%">
            <Input
              maxLength={80}
              placeholder="Type a message..."
              aria-label="Message input"
              bg={msgInputColor}
              _focus={{
                outline: "none",
              }}
              {...register("prompt", { required: true })}
            />
            <InputRightElement>
              <IconButton type="submit" aria-label="Send" icon={<MdSend />} />
            </InputRightElement>
          </InputGroup>
        </chakra.form>
      </VStack>
    </SlideFade>
  );
}
