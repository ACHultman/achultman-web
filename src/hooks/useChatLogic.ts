import { useCallback, useEffect, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import posthog from 'posthog-js';
import {
    CHAT_BOT_WELCOME_MESSAGE,
    INIT_PROMPT_CHOICES,
} from '../constants/chat';
import { generateSuggestions } from '../components/Chat/utils';

interface UseChatLogicProps {
    conversationNode: React.RefObject<HTMLDivElement>;
}

export function useChatLogic({ conversationNode }: UseChatLogicProps) {
    const {
        messages,
        input,
        handleInputChange: aiHandleInputChange,
        handleSubmit: aiHandleSubmit,
        isLoading,
        append,
    } = useChat({
        api: '/api/v1/chat',
        initialMessages: [
            {
                id: '0',
                content: CHAT_BOT_WELCOME_MESSAGE,
                role: 'assistant',
            },
        ],
    });

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

    const showSuggestions = suggestions.length > 0 && !isLoading;
    const isBotThinking = isLoading;

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => aiHandleInputChange(e),
        [aiHandleInputChange]
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!input.trim()) return;
            if (userMessagesCount === 0) {
                posthog.capture('chat_started');
            }
            posthog.capture('chat_message_sent', {
                message_number: userMessagesCount + 1,
            });
            await aiHandleSubmit(e);
        },
        [input, userMessagesCount, aiHandleSubmit]
    );

    const handleSuggestionAppend = useCallback(
        async (msgContent: string) => {
            if (userMessagesCount === 0) {
                posthog.capture('chat_started');
            }
            posthog.capture('chat_suggestion_used', {
                suggestion: msgContent,
                message_number: userMessagesCount + 1,
            });
            await append({
                role: 'user',
                content: msgContent,
            });
        },
        [userMessagesCount, append]
    );

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
