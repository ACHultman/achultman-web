import React, { memo } from 'react';
import MessageBox from './MessageBox';
import LoadingIndicator from './LoadingIndicator';
import { Message } from '@ai-sdk/react';

interface MessageListProps {
    messages: Message[];
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
