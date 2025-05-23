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
import React, { memo } from 'react';
import { MdSend } from 'react-icons/md';
import ChipList from '@components/ChipList';

interface InputAreaProps {
    input: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onAppend: (messageContent: string) => void;
    showSuggestions: boolean;
    hasTriedSuggestion: boolean;
    suggestions: string[];
    isBotThinking: boolean;
}

const InputArea = memo(function InputArea({
    input,
    onInputChange,
    onSubmit,
    onAppend,
    showSuggestions,
    hasTriedSuggestion,
    suggestions,
    isBotThinking,
}: InputAreaProps) {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.300', 'gray.600');
    const msgInputColor = useColorModeValue('gray.200', 'gray.600');
    const suggestionChipColor = useColorModeValue('black', 'white');

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
                            onAppend(choice);
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

export default InputArea;
