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
import { useChat } from '@ai-sdk/react';
import { useRef } from 'react';
import { MdSend } from 'react-icons/md';
import {
    CHAT_BOT_WELCOME_MESSAGE,
    INIT_PROMPT_CHOICES,
} from '../../constants/chat';
import ChipList from '@components/ChipList';
import MessageBox from './MessageBox';
import TypingIndicator from './TypingIndicator';

function generateSuggestions(currentIndex: number): string[] {
    if (INIT_PROMPT_CHOICES.length === 0) {
        return [];
    }

    const nextIndex = currentIndex % INIT_PROMPT_CHOICES.length;
    return [INIT_PROMPT_CHOICES[nextIndex]];
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

    const userMessagesCount = messages.filter((m) => m.role === 'user').length;
    const suggestions = generateSuggestions(userMessagesCount);

    // Track if the user has ever used a suggestion
    const hasTriedSuggestion = messages.some(
        (m) => m.role === 'user' && INIT_PROMPT_CHOICES.includes(m.content)
    );

    const showSuggestions = suggestions.length > 0 && status === 'ready';
    const isBotThinking = status === 'submitted';

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
                {isBotThinking && <TypingIndicator />}
            </VStack>
            <chakra.form w="80%" onSubmit={handleSubmit}>
                {showSuggestions && (
                    <VStack w="100%" align="flex-end" mb={2}>
                        {!hasTriedSuggestion && (
                            <Box
                                fontWeight="bold"
                                color="green.500"
                                fontSize="sm"
                                mb={1}
                            >
                                Try one of these!
                            </Box>
                        )}
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
                        onChange={handleInputChange}
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
        </VStack>
    );
}

export default Chat;
