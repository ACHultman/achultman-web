import {
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    chakra,
    useColorModeValue,
} from '@chakra-ui/react';
import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';
import {
    CHAT_BOT_WELCOME_MESSAGE,
    INIT_PROMPT_CHOICES,
} from '../../constants/chat';
import ChipList from '@components/ChipList';
import MessageBox from './MessageBox';

function generateSuggestions(n: number) {
    return INIT_PROMPT_CHOICES.slice(n - 1, n);
}

function Chat() {
    const { messages, input, handleInputChange, handleSubmit, append, status } =
        useChat({
            api: '/api/v1/chat',
            initialMessages: [
                {
                    id: '0',
                    content: CHAT_BOT_WELCOME_MESSAGE,
                    role: 'assistant',
                },
            ],
        });
    const conversationNode = useRef<HTMLDivElement>(null);
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.300', 'gray.600');
    const msgInputColor = useColorModeValue('gray.200', 'gray.600');
    const suggestionChipColor = useColorModeValue('black', 'white');

    const [suggestions, setSuggestions] = useState<string[]>([]);

    const assistantMessagesCount = messages.filter(
        (m) => m.role === 'assistant'
    ).length;
    useEffect(() => {
        setSuggestions(generateSuggestions(assistantMessagesCount));
    }, [assistantMessagesCount]);

    const showSuggestions = suggestions.length > 0 && status === 'ready';

    let convoHeight = '20%';
    if (messages.length > 1) {
        convoHeight = '30%';
    }

    return (
        <VStack
            w="100%"
            minW="300px"
            h={convoHeight}
            gap={2}
            justify="space-between"
            borderRadius="30px"
            overflow="hidden"
            css={{
                transition: 'height linear 500ms',
            }}
        >
            <VStack
                w="100%"
                h="100%"
                borderRadius="30px"
                px={4}
                overflowY="auto"
                overflowX="hidden"
                ref={conversationNode}
            >
                {messages.map((m) => (
                    <MessageBox
                        key={m.id}
                        message={m.content}
                        isUser={m.role === 'user'}
                    />
                ))}
            </VStack>
            <chakra.form w="80%" onSubmit={handleSubmit}>
                {showSuggestions && (
                    <ChipList
                        list={suggestions}
                        onClick={(choice) => {
                            append({ role: 'user', content: choice });
                        }}
                        flexProps={{
                            alignSelf: 'flex-end',
                            justifyContent: 'flex-end',
                            gap: 2,
                        }}
                        tagProps={{
                            colorScheme: 'green',
                            size: 'md',
                            variant: 'outline',
                            bg: bgColor,
                            color: suggestionChipColor,
                            border: `1px solid ${borderColor}`,
                            borderRadius: '30px',
                        }}
                    />
                )}
                <InputGroup size="lg" my={4} w="100%">
                    <Input
                        maxLength={80}
                        placeholder="Type a message..."
                        aria-label="Message input"
                        bg={msgInputColor}
                        _focus={{
                            outline: 'none',
                        }}
                        value={input}
                        onChange={handleInputChange}
                    />
                    <InputRightElement>
                        <IconButton
                            type="submit"
                            aria-label="Send"
                            icon={<MdSend />}
                        />
                    </InputRightElement>
                </InputGroup>
            </chakra.form>
        </VStack>
    );
}

export default Chat;
