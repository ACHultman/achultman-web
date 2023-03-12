import { SubmitHandler, useForm } from 'react-hook-form'
import {
    chakra,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    SlideFade,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react'
import { MdSend } from 'react-icons/md'
import { motion } from 'framer-motion'

import { MessageBox } from './MessageBox'
import useServerSentEvents from '@hooks/useServerSentEvents'
import useRealtimeConversation from '@hooks/useRealtimeConversation'
import { RequestQueryConversation } from '@pages/api/chat'
import { useLayoutEffect, useState } from 'react'

const CHAT_ENDPOINT = '/api/chat'
const CHAT_BOT_WELCOME_MESSAGE =
    "Hi there! I'm here to help you learn more about Adam. What would you like to know?"

const MotionMessageBox = motion(MessageBox)

interface FormData {
    prompt: string
}

function scrollToBottom(node: React.RefObject<HTMLDivElement>) {
    if (!node.current) return
    const scroll = node.current.scrollHeight - node.current.clientHeight
    node.current.scrollTo({ top: scroll, behavior: 'smooth' })
}

export default function Chat() {
    const {
        bioNode,
        conversationNode,
        conversation,
        setConversation,
        streaming,
        setStreaming,
        setError,
    } = useRealtimeConversation([
        {
            speaker: 'bot',
            text: CHAT_BOT_WELCOME_MESSAGE,
        },
    ])
    const {
        register,
        handleSubmit,
        formState: _formState,
        reset,
    } = useForm<FormData>()

    useLayoutEffect(() => {
        scrollToBottom(conversationNode)
    }, [conversation])

    const [conversationBoxIsOpen, setConversationBoxIsOpen] = useState(false)

    const bgColor = useColorModeValue('white', 'gray.800')
    const msgInputColor = useColorModeValue('gray.200', 'gray.600')

    const { openStream } = useServerSentEvents<RequestQueryConversation>({
        baseUrl: CHAT_ENDPOINT,
        config: {
            withCredentials: false,
        },
        onData: (data: string) => {
            if (!bioNode.current) {
                return
            }
            try {
                let text = JSON.parse(data).choices[0].delta.content
                if (text) {
                    bioNode.current.innerText = bioNode.current.innerText + text
                    scrollToBottom(conversationNode)
                }
            } catch (err) {
                console.error(`Failed to parse data: ${data}`)
                setError(`Failed to parse the response`)
            }
        },
        onOpen: () => {
            reset()
            if (bioNode.current) {
                bioNode.current.innerText = ''
            }
        },
        onClose: () => {
            setStreaming(false)
            setConversation((prev) => {
                return {
                    ...prev,
                    history: [
                        ...prev.history,
                        {
                            speaker: 'bot',
                            text: bioNode.current?.innerText.replace(
                                /<br>/g,
                                '\n'
                            ) as string,
                        },
                    ],
                }
            })
        },
        onError: (event) => {
            console.error(event)
            setStreaming(false)
            setError(`Something went wrong with the request`)
        },
    })

    const onMessageSubmit: SubmitHandler<FormData> = (data) => {
        if (streaming || !data.prompt) {
            return
        }

        !conversationBoxIsOpen && setConversationBoxIsOpen(true)

        const newConversation: Conversation = {
            history: [
                ...conversation.history,
                { speaker: 'user', text: data.prompt },
            ],
        }

        setConversation(newConversation)

        if (bioNode.current) {
            bioNode.current.innerText = '...'
        }
        setStreaming(true)

        openStream({
            query: {
                conversation: JSON.stringify(newConversation),
                temperature: '0.7',
            },
        })
    }

    return (
        <SlideFade in={true} offsetY={-80}>
            <VStack
                w="100%"
                minW="300px"
                h={conversationBoxIsOpen ? '350px' : '200px'}
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
                    px={20}
                    overflowY="auto"
                    ref={conversationNode}
                >
                    {conversation.history.map((x, i) =>
                        x.speaker === 'user' ? (
                            <MotionMessageBox
                                key={i}
                                message={x.text}
                                isUser={true}
                            />
                        ) : (
                            <MotionMessageBox
                                key={i}
                                message={x.text}
                                isUser={false}
                            />
                        )
                    )}
                    <MotionMessageBox
                        ref={bioNode}
                        message="..."
                        hidden={!streaming}
                        isUser={false}
                    />
                </VStack>
                <chakra.form w="80%" onSubmit={handleSubmit(onMessageSubmit)}>
                    <InputGroup size="lg" mb={4} w="100%">
                        <Input
                            maxLength={80}
                            placeholder="Type a message..."
                            aria-label="Message input"
                            bg={msgInputColor}
                            _focus={{
                                outline: 'none',
                            }}
                            {...register('prompt', { required: true })}
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
