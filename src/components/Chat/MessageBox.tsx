import {
    Box,
    Text as ChakraText,
    Link as ChakraLink,
    ListItem,
    UnorderedList,
    OrderedList,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { forwardRef, memo, useRef } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const schema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        a: [...(defaultSchema.attributes?.a || []), 'target', 'rel'],
        code: ['className'],
    },
};

const markdownComponents = {
    p: ({ node, children, ...props }) => (
        <ChakraText
            {...props}
            fontSize="inherit"
            lineHeight="inherit"
            mb={{ base: 1, md: 2 }}
        >
            {children}
        </ChakraText>
    ),
    ul: ({ node, children, ...props }) => (
        <UnorderedList
            {...props}
            stylePosition="inside"
            ml={{ base: 2, md: 4 }}
            mt={1}
            spacing={1}
        >
            {children}
        </UnorderedList>
    ),
    ol: ({ node, children, ...props }) => (
        <OrderedList
            {...props}
            stylePosition="inside"
            ml={{ base: 2, md: 4 }}
            mt={1}
            spacing={1}
        >
            {children}
        </OrderedList>
    ),
    li: ({ node, children, ...props }) => (
        <ListItem {...props}>{children}</ListItem>
    ),
    a: ({ href, children, ...props }) => (
        <ChakraLink
            href={href}
            isExternal
            rel="noopener noreferrer"
            color="blue.400"
            _hover={{ textDecoration: 'underline' }}
            {...props}
        >
            {children}
        </ChakraLink>
    ),
    code: ({ className, children }) => {
        const language = className?.replace('language-', '') || 'plaintext';
        const content = String(children).trim();

        return (
            <Box my={4}>
                <CopyBlock
                    text={content}
                    language={language}
                    theme={dracula}
                    showLineNumbers={false}
                    codeBlock
                />
            </Box>
        );
    },
} satisfies Components;

interface Props {
    message: string;
    isUser?: boolean;
    hidden?: boolean;
    matrixAnim?: boolean;
}

const MessageBoxComponent = forwardRef<HTMLDivElement, Props>(
    ({ message, isUser = false, hidden, matrixAnim }: Props, ref) => {
        const userColor = useColorModeValue('green.500', 'green.500');
        const botColor = useColorModeValue('gray.100', 'gray.600');
        const shadowLocation = isUser ? '2px 2px 4px 0px' : '-2px 2px 4px 0px';

        const renderedMarkdown = React.useMemo(() => {
            if (typeof message === 'string' && message.length > 4000) {
                const lines = message.split('\n');
                const lastLines = lines.slice(-40).join('\n');
                return (
                    <ReactMarkdown
                        components={markdownComponents}
                        rehypePlugins={[[rehypeSanitize, schema]]}
                    >
                        {lastLines}
                    </ReactMarkdown>
                );
            }
            return (
                <ReactMarkdown
                    components={markdownComponents}
                    rehypePlugins={[[rehypeSanitize, schema]]}
                >
                    {message}
                </ReactMarkdown>
            );
        }, [message]);

        return (
            <Box
                ref={ref}
                alignSelf={isUser ? 'flex-end' : 'flex-start'}
                bg={matrixAnim ? '#0a0f0a' : isUser ? userColor : botColor}
                color={matrixAnim ? '#39ff14' : isUser ? 'white' : undefined}
                borderRadius="lg"
                p={{ base: 2, md: 3 }}
                pb={{ base: 1, md: 2 }}
                my={2}
                mx={1}
                maxWidth={{ base: '85%', md: '75%' }}
                boxShadow={`rgba(0, 0, 0, 0.1) ${shadowLocation}`}
                position="relative"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: 'short', md: 'normal' }}
                fontFamily={
                    matrixAnim
                        ? '"Fira Mono", "Consolas", monospace'
                        : undefined
                }
                sx={
                    matrixAnim
                        ? {
                              textShadow: '0 0 8px #39ff14, 0 0 2px #39ff14',
                              fontWeight: 700,
                              letterSpacing: 1.5,
                              borderRadius: '8px',
                              padding: '2px 8px',
                              margin: '2px 0',
                              transition: 'background 0.2s',
                          }
                        : {}
                }
            >
                {renderedMarkdown}
            </Box>
        );
    }
);

MessageBoxComponent.displayName = 'MessageBox';

// memoize
const MemoizedMessageBox = React.memo(MessageBoxComponent);
const MessageBox = forwardRef<HTMLDivElement, Props>((props, ref) => (
    <MemoizedMessageBox {...props} ref={ref} />
));
MessageBox.displayName = 'MessageBox';

export default MessageBox;
