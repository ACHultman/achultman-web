import { useCallback, useEffect, useMemo, useState } from 'react';
import { Message } from '@ai-sdk/react';
import {
    CHAT_BOT_WELCOME_MESSAGE,
    INIT_PROMPT_CHOICES,
} from '../constants/chat';
import { generateSuggestions } from '../components/Chat/utils';

interface UseChatLogicProps {
    conversationNode: React.RefObject<HTMLDivElement>;
}

interface PendingBotMessageDetails {
    id: string;
    fullContent: string;
}

async function sendMessageToServer(
    existingMessages: Message[],
    newUserMessage: Message,
    setPendingBotMessageDetails: (
        details: PendingBotMessageDetails | null
    ) => void,
    setStatus: (status: 'ready' | 'submitted') => void,
    addMessageToStateCallback: (message: Message) => void
) {
    try {
        const res = await fetch('/api/v1/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [...existingMessages, newUserMessage],
            }),
        });
        const data = await res.json();
        const botMessageId = Date.now().toString() + '-bot';
        addMessageToStateCallback({
            id: botMessageId,
            role: 'assistant',
            content: '',
        });
        setPendingBotMessageDetails({
            id: botMessageId,
            fullContent: data.content,
        });
    } finally {
        setStatus('ready');
    }
}

export function useChatLogic({ conversationNode }: UseChatLogicProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            content: CHAT_BOT_WELCOME_MESSAGE,
            role: 'assistant',
        },
    ]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'ready' | 'submitted'>('ready');
    const [pendingBotMessageDetails, setPendingBotMessageDetails] =
        useState<PendingBotMessageDetails | null>(null);

    const addMessageToState = useCallback((message: Message) => {
        setMessages((prev) => [...prev, message]);
    }, []);

    const userMessagesCount = useMemo(
        () => messages.filter((m) => m.role === 'user').length,
        [messages]
    );

    const suggestions = useMemo(
        () => generateSuggestions(userMessagesCount),
        [userMessagesCount]
    );

    const hasTriedSuggestion = useMemo(
        () =>
            messages.some(
                (m) =>
                    m.role === 'user' && INIT_PROMPT_CHOICES.includes(m.content)
            ),
        [messages]
    );

    const showSuggestions = suggestions.length > 0 && status === 'ready';
    const isBotThinking = status === 'submitted';

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
        []
    );

    const initiateMessageSend = useCallback(
        async (content: string) => {
            const userMsg: Message = {
                id: Date.now().toString(),
                role: 'user',
                content: content,
            };

            addMessageToState(userMsg);
            setInput('');
            setStatus('submitted');

            await sendMessageToServer(
                messages,
                userMsg,
                setPendingBotMessageDetails,
                setStatus,
                addMessageToState
            );
        },
        [
            messages,
            addMessageToState,
            setInput,
            setStatus,
            setPendingBotMessageDetails,
        ]
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!input.trim()) return;
            await initiateMessageSend(input);
        },
        [input, initiateMessageSend]
    );

    const handleSuggestionAppend = useCallback(
        async (msgContent: string) => {
            await initiateMessageSend(msgContent);
        },
        [initiateMessageSend]
    );

    useEffect(() => {
        if (!pendingBotMessageDetails) return;

        const { id: pendingId, fullContent } = pendingBotMessageDetails;
        const currentMessage = messages.find((m) => m.id === pendingId);

        if (!currentMessage) {
            setPendingBotMessageDetails(null);
            return;
        }

        if (currentMessage.content.length >= fullContent.length) {
            if (currentMessage.content !== fullContent) {
                setMessages((prevMsgs) =>
                    prevMsgs.map((m) =>
                        m.id === pendingId ? { ...m, content: fullContent } : m
                    )
                );
            }
            setPendingBotMessageDetails(null);
            return;
        }

        const timerId = setTimeout(() => {
            const nextContentLength = currentMessage.content.length + 1;
            setMessages((prevMsgs) =>
                prevMsgs.map((m) =>
                    m.id === pendingId
                        ? {
                              ...m,
                              content: fullContent.slice(0, nextContentLength),
                          }
                        : m
                )
            );
        }, 4);

        return () => clearTimeout(timerId);
    }, [messages, pendingBotMessageDetails, setMessages]);

    useEffect(() => {
        if (conversationNode.current) {
            queueMicrotask(() => {
                if (conversationNode.current) {
                    conversationNode.current.scrollTop =
                        conversationNode.current.scrollHeight;
                }
            });
        }
    }, [messages, conversationNode]);

    return {
        messages,
        input,
        suggestions,
        hasTriedSuggestion,
        showSuggestions,
        isBotThinking,
        handleInputChange,
        handleSubmit,
        handleSuggestionAppend,
    };
}
