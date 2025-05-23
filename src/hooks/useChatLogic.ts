import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    CHAT_BOT_WELCOME_MESSAGE,
    INIT_PROMPT_CHOICES,
} from '../constants/chat';

import { generateSuggestions } from '../components/Chat/utils';

interface UseChatLogicProps {
    conversationNode: React.RefObject<HTMLDivElement>;
}

export function useChatLogic({ conversationNode }: UseChatLogicProps) {
    const [messages, setMessages] = useState([
        {
            id: '0',
            content: CHAT_BOT_WELCOME_MESSAGE,
            role: 'assistant',
        },
    ]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'ready' | 'submitted'>('ready');
    const [pendingBot, setPendingBot] = useState<string | null>(null);
    const [pendingBotId, setPendingBotId] = useState<string | null>(null);

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

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!input.trim()) return;
            const userMsg = {
                id: Date.now().toString(),
                role: 'user',
                content: input,
            };
            setMessages((msgs) => [...msgs, userMsg]);
            setInput('');
            setStatus('submitted');
            try {
                const res = await fetch('/api/v1/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: [...messages, userMsg] }),
                });
                const data = await res.json();
                const botId = Date.now().toString() + '-bot';
                setPendingBotId(botId);
                setPendingBot(data.content);
            } finally {
                setStatus('ready');
            }
        },
        [input, messages]
    );

    useEffect(() => {
        if (pendingBot && pendingBotId) {
            let i = 0;
            const reveal = () => {
                setMessages((msgs) => {
                    const filtered = msgs.filter((m) => m.id !== pendingBotId);
                    return [
                        ...filtered,
                        {
                            id: pendingBotId,
                            role: 'assistant',
                            content: pendingBot.slice(0, i),
                        },
                    ];
                });
                if (i < pendingBot.length) {
                    i++;
                    setTimeout(reveal, 12);
                } else {
                    setMessages((msgs) => {
                        const filtered = msgs.filter(
                            (m) => m.id !== pendingBotId
                        );
                        return [
                            ...filtered,
                            {
                                id: pendingBotId,
                                role: 'assistant',
                                content: pendingBot,
                            },
                        ];
                    });
                    setPendingBot(null);
                    setPendingBotId(null);
                }
            };
            reveal();
        }
    }, [pendingBot, pendingBotId]);

    const handleSuggestionAppend = useCallback(
        (msg: { role: 'user'; content: string }) => {
            const userMsg = {
                id: Date.now().toString(),
                role: 'user',
                content: msg.content,
            };
            setMessages((msgs) => [...msgs, userMsg]);
            setInput('');
            setStatus('submitted');
            fetch('/api/v1/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            })
                .then((res) => res.json())
                .then((data) => {
                    const botId = Date.now().toString() + '-bot';
                    setPendingBotId(botId);
                    setPendingBot(data.content);
                })
                .finally(() => {
                    setStatus('ready');
                });
            setTimeout(() => {
                if (conversationNode.current) {
                    conversationNode.current.scrollTop =
                        conversationNode.current.scrollHeight;
                }
            }, 100);
        },
        [messages, conversationNode]
    );

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
