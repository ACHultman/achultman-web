import { useRef, useState } from "react";
import { Conversation, Speech } from "../pages/api/chat";

export default function useRealtimeConversation(initMessages: Speech[]) {
  const bioNode = useRef<HTMLParagraphElement>(null);
  const conversationNode = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Conversation>({
    history: [...initMessages],
  });
  const [streaming, setStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  return {
    bioNode,
    conversationNode,
    conversation,
    setConversation,
    streaming,
    setStreaming,
    error,
    setError,
  };
}
