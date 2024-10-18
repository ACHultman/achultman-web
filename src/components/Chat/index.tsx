import {
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    SlideFade,
    VStack,
    chakra,
    useColorModeValue,
} from '@chakra-ui/react';
import { useChat } from 'ai/react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { MdSend } from 'react-icons/md';
import {
    CHAT_BOT_WELCOME_MESSAGE,
    INIT_PROMPT_CHOICES,
} from '../../constants/chat';
import MessageBox from '@components/Chat/MessageBox';
import ChipList from '@components/ChipList';

const MotionMessageBox = motion(MessageBox);

function scrollToBottom(node: React.RefObject<HTMLDivElement>) {
    if (!node.current) return;
    const scroll = node.current.scrollHeight - node.current.clientHeight;
    node.current.scrollTo({ top: scroll, behavior: 'smooth' });
}

function generateSuggestions(n: number) {
    return INIT_PROMPT_CHOICES.sort(() => Math.random() - 0.5).slice(0, n);
}

function Chat() {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        append,
        isLoading,
    } = useChat({
        api: '/api/v2/chat',
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
    const msgInputColor = useColorModeValue('gray.200', 'gray.600');
    const suggestionChipColor = useColorModeValue('black', 'gray.200');

    const suggestions = generateSuggestions(1);
    const showSuggestions = messages.length === 1 && !isLoading;

    let convoHeight = '300px';
    if (messages.length > 1) {
        convoHeight = '400px';
    }

    return (
        <SlideFade in={true} offsetY={-80}>
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
                        <MotionMessageBox
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
                                color: suggestionChipColor,
                                variant: 'outline',
                                cursor: 'pointer',
                                padding: 4,
                                background: `linear-gradient(white, white) padding-box, linear-gradient(to top, #00ff0078, ${bgColor}) border-box`,
                                borderRadius: '30px',
                                border: '4px solid transparent',
                            }}
                        />
                    )}
                    <InputGroup size="lg" mb={4} w="100%">
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
        </SlideFade>
    );
}

export default Chat;
