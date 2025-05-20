import {
    VStack,
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    useColorModeValue,
} from '@chakra-ui/react';
import { MdSend } from 'react-icons/md';
import {
    CHAT_BOT_WELCOME_MESSAGE,
    INIT_PROMPT_CHOICES,
} from '../../constants/chat';
import MessageBox from '@components/Chat/MessageBox';
import ChipList from '@components/ChipList';

const ChatPlaceholder = () => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.300', 'gray.600');
    const msgInputColor = useColorModeValue('gray.200', 'gray.600');
    const suggestionChipColor = useColorModeValue('black', 'white');

    const firstSuggestion =
        INIT_PROMPT_CHOICES.length > 0 ? INIT_PROMPT_CHOICES[0] : '';

    return (
        <VStack
            w="100%"
            minW="300px"
            minHeight="268px"
            spacing={2}
            justifyContent="space-between"
            borderRadius="30px"
            overflow="hidden"
            bg={bgColor}
            py={3}
            px={2}
        >
            <VStack
                w="100%"
                h="100%"
                borderRadius="30px"
                px={4}
                overflowY="auto"
                overflowX="hidden"
            >
                <MessageBox message={CHAT_BOT_WELCOME_MESSAGE} isUser={false} />
            </VStack>

            <VStack w="80%" alignSelf="center" spacing={3} pb={1}>
                {firstSuggestion && (
                    <ChipList
                        list={[firstSuggestion]}
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
                        placeholder="Loading..."
                        aria-label="Message input (loading)"
                        bg={msgInputColor}
                        isDisabled={true}
                        _disabled={{
                            cursor: 'default',
                            opacity: 0.7,
                        }}
                    />
                    <InputRightElement>
                        <IconButton
                            aria-label="Send (loading)"
                            icon={<MdSend />}
                            isDisabled={true}
                        />
                    </InputRightElement>
                </InputGroup>
            </VStack>
        </VStack>
    );
};

export default ChatPlaceholder;
