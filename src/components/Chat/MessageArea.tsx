import { Box } from '@chakra-ui/react';
import React, { memo } from 'react';
import MessageList from './MessageList';

interface MessageAreaProps {
    messages: any[];
    isBotThinking: boolean;
    conversationNode: React.RefObject<HTMLDivElement>;
}

const MessageArea = memo(function MessageArea({
    messages,
    isBotThinking,
    conversationNode,
}: MessageAreaProps) {
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

export default MessageArea;
