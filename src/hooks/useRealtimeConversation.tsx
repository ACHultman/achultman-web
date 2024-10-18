import { useRef, useState } from 'react';

export default function useConversation(initMessages: Message[]) {
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
                        author: 'bot',
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
