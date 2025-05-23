import { VStack } from '@chakra-ui/react';
import React, { useMemo, useRef } from 'react';
import MessageArea from './MessageArea';
import InputArea from './InputArea';
import { useChatLogic } from '../../hooks/useChatLogic';

function Chat() {
    const conversationNode = useRef<HTMLDivElement>(null);

    const {
        messages,
        input,
        suggestions,
        hasTriedSuggestion,
        showSuggestions,
        isBotThinking,
        handleInputChange,
        handleSubmit,
        handleSuggestionAppend,
    } = useChatLogic({ conversationNode });

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
            />
        </VStack>
    );
}

export default Chat;
