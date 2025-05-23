import React, { memo } from 'react';
import MessageBox from './MessageBox';
import LoadingIndicator from './LoadingIndicator';

interface MessageListProps {
    messages: any[]; // Consider defining a more specific type for messages
    isBotThinking: boolean;
}

const MessageList = memo(function MessageList({
    messages,
    isBotThinking,
}: MessageListProps) {
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

export default MessageList;
