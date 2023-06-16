import {
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    SlideFade,
    VStack,
    chakra,
    useColorModeValue,
} from '@chakra-ui/react'
import { useChat } from 'ai/react'
import { motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MdSend } from 'react-icons/md'
import { isMobile } from 'react-device-detect'

import { MessageBox } from '@components/Chat/MessageBox'
import {
    CHAT_BOT_WELCOME_MESSAGE,
    INIT_PROMPT_CHOICES,
} from 'src/constants/chat'
import { ChipList } from '@components/ChipList'

const CHAT_ENDPOINT = '/api/v2/chat'

const MotionMessageBox = motion(MessageBox)

function scrollToBottom(node: React.RefObject<HTMLDivElement>) {
    if (!node.current) return
    const scroll = node.current.scrollHeight - node.current.clientHeight
    node.current.scrollTo({ top: scroll, behavior: 'smooth' })
}

function generateSuggestions(n: number) {
    return INIT_PROMPT_CHOICES.sort(() => Math.random() - 0.5).slice(0, n)
}

export default function Chat() {
    // const [firstChunkReceived, setFirstChunkReceived] = useState(false)

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        append,
        isLoading,
    } = useChat({
        api: CHAT_ENDPOINT,
        initialInput: isMobile
            ? undefined
            : INIT_PROMPT_CHOICES[
                  Math.floor(Math.random() * INIT_PROMPT_CHOICES.length)
              ],
        initialMessages: [
            {
                id: '0',
                content: CHAT_BOT_WELCOME_MESSAGE,
                role: 'assistant',
            },
        ],
        onResponse() {
            // setFirstChunkReceived(true)
        },
        onFinish() {
            // setFirstChunkReceived(false)
            // scrollToBottom(conversationNode)
        },
    })
    const conversationNode = useRef<HTMLDivElement>(null)
    const bgColor = useColorModeValue('white', 'gray.800')
    const msgInputColor = useColorModeValue('gray.200', 'gray.600')
    const suggestionChipColor = useColorModeValue('black', 'gray.200')

    useLayoutEffect(() => {
        scrollToBottom(conversationNode)
    })

    // Shuffle array and pick the first 2 items
    const suggestions = useMemo(
        () => generateSuggestions(isMobile ? 1 : 2),
        [isLoading, isMobile]
    )

    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])

    const showSuggestions =
        (messages.length > 1 || (isMobile && isClient)) && !isLoading

    let convoHeight = isMobile ? '400px' : '250px'
    if (messages.length > 1) {
        convoHeight = '400px'
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
                backgroundColor={bgColor}
                overflow="hidden"
                css={{
                    transition: 'linear 0.5s',
                }}
            >
                <VStack
                    w="100%"
                    h-="100%"
                    borderRadius="30px"
                    px={isMobile ? 4 : 20}
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
                    {/* <MotionMessageBox
                        message="..."
                        hidden={!(isLoading && !firstChunkReceived)}
                    /> */}
                    {showSuggestions && (
                        <ChipList
                            list={suggestions}
                            onClick={(choice) => {
                                append({ role: 'user', content: choice })
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
                </VStack>
                <chakra.form w="80%" onSubmit={handleSubmit}>
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
    )
}
