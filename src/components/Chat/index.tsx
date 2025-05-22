import {
    Box,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    chakra,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';
import {
    CHAT_BOT_WELCOME_MESSAGE,
    INIT_PROMPT_CHOICES,
} from '../../constants/chat';
import ChipList from '@components/ChipList';
import MessageBox from './MessageBox';
import LoadingIndicator from './LoadingIndicator';

function generateSuggestions(currentIndex: number): string[] {
    if (INIT_PROMPT_CHOICES.length === 0) {
        return [];
    }

    const nextIndex = currentIndex % INIT_PROMPT_CHOICES.length;
    return [INIT_PROMPT_CHOICES[nextIndex]];
}

// Memoized message list to minimize re-renders
const MessageList = memo(function MessageList({
    messages,
    isBotThinking,
}: {
    messages: any[];
    isBotThinking: boolean;
}) {
    return (
        <>
            {messages.map((m) => (
                <MessageBox
                    key={m.id}
                    message={m.content}
                    isUser={m.role === 'user'}
                />
            ))}
            {isBotThinking && <LoadingIndicator />}
        </>
    );
});

// MessageArea: only re-renders when messages or isBotThinking changes
const MessageArea = memo(function MessageArea({
    messages,
    isBotThinking,
    conversationNode,
}: {
    messages: any[];
    isBotThinking: boolean;
    conversationNode: React.RefObject<HTMLDivElement>;
}) {
    return (
        <Box
            w="100%"
            h="100%"
            borderRadius="30px"
            px={4}
            overflowY="auto"
            overflowX="hidden"
            ref={conversationNode}
            flex={1}
            display="flex"
            flexDirection="column"
            sx={{ contain: 'layout paint' }}
        >
            <MessageList messages={messages} isBotThinking={isBotThinking} />
        </Box>
    );
});

// InputArea: only re-renders when input, handlers, suggestions, etc. change
const InputArea = memo(function InputArea({
    input,
    onInputChange,
    onSubmit,
    onAppend,
    showSuggestions,
    hasTriedSuggestion,
    suggestions,
    isBotThinking,
    bgColor,
    borderColor,
    suggestionChipColor,
    msgInputColor,
}: {
    input: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onAppend: (message: { role: 'user'; content: string }) => void;
    showSuggestions: boolean;
    hasTriedSuggestion: boolean;
    suggestions: string[];
    isBotThinking: boolean;
    bgColor: string;
    borderColor: string;
    suggestionChipColor: string;
    msgInputColor: string;
}) {
    return (
        <chakra.form w="80%" onSubmit={onSubmit}>
            {showSuggestions && (
                <VStack w="100%" align="flex-end" mb={2}>
                    {!hasTriedSuggestion && (
                        <Box fontWeight="bold" color="green.500" fontSize="sm">
                            Try one of these!
                        </Box>
                    )}
                    <ChipList
                        list={suggestions}
                        onClick={(choice) => {
                            onAppend({ role: 'user', content: choice });
                        }}
                        flexProps={{
                            alignSelf: 'flex-end',
                            justifyContent: 'flex-end',
                            gap: 2,
                        }}
                        tagProps={{
                            colorScheme: 'green',
                            size: 'md',
                            variant: 'solid',
                            bg: bgColor,
                            color: suggestionChipColor,
                            border: `2px solid ${borderColor}`,
                            borderRadius: '30px',
                            boxShadow: '0 2px 8px rgba(0,128,0,0.08)',
                            fontWeight: 'bold',
                            transition: 'all 0.2s',
                            _hover: { bg: 'green.100', color: 'green.800' },
                        }}
                    />
                </VStack>
            )}
            <InputGroup size="lg" my={4} w="100%">
                <Input
                    maxLength={80}
                    placeholder={
                        showSuggestions
                            ? 'Pick a suggestion or type your own...'
                            : 'Type a message...'
                    }
                    aria-label="Message input"
                    bg={msgInputColor}
                    _focus={{
                        outline: 'none',
                    }}
                    value={input}
                    onChange={onInputChange}
                    opacity={showSuggestions ? 0.7 : 1}
                    pointerEvents={isBotThinking ? 'none' : 'auto'}
                />
                <InputRightElement>
                    <IconButton
                        type="submit"
                        aria-label="Send"
                        icon={<MdSend />}
                        isDisabled={isBotThinking}
                    />
                </InputRightElement>
            </InputGroup>
        </chakra.form>
    );
});

function Chat() {
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
    const conversationNode = useRef<HTMLDivElement>(null);
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.300', 'gray.600');
    const msgInputColor = useColorModeValue('gray.200', 'gray.600');
    const suggestionChipColor = useColorModeValue('black', 'white');

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
                // Start typing animation for bot message
                const botId = Date.now().toString() + '-bot';
                setPendingBotId(botId);
                setPendingBot(data.content);
            } finally {
                setStatus('ready');
            }
        },
        [input, messages]
    );
    // Typing animation effect for bot message
    React.useEffect(() => {
        if (pendingBot && pendingBotId) {
            let i = 0;
            const reveal = () => {
                setMessages((msgs) => {
                    // Remove any previous pending bot message
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
                    setTimeout(reveal, 12); // Typing speed (ms per char)
                } else {
                    // Finalize message
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
            // Optimistically show the user message immediately
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
        [messages]
    );
    const memoizedMessages = useMemo(() => messages, [messages]);
    return (
        <VStack
            w="100%"
            minW="300px"
            gap={2}
            justify="space-between"
            borderRadius="30px"
            overflow="hidden"
            css={{
                transition: 'height linear 500ms',
            }}
        >
            <MessageArea
                messages={memoizedMessages}
                isBotThinking={isBotThinking}
                conversationNode={conversationNode}
            />
            <InputArea
                input={input}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onAppend={handleSuggestionAppend}
                showSuggestions={showSuggestions}
                hasTriedSuggestion={hasTriedSuggestion}
                suggestions={suggestions}
                isBotThinking={isBotThinking}
                bgColor={bgColor}
                borderColor={borderColor}
                suggestionChipColor={suggestionChipColor}
                msgInputColor={msgInputColor}
            />
        </VStack>
    );
}

export default Chat;
