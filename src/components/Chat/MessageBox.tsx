import { Flex, Text, useColorModeValue } from '@chakra-ui/react'
import React, { forwardRef, LegacyRef } from 'react'

interface Props {
    message: string
    isUser?: boolean
    hidden?: boolean
    ref?: LegacyRef<HTMLDivElement>
}

const MessageBox: React.FC<Props> = forwardRef(
    (
        { message, isUser = false, hidden }: Props,
        ref?: LegacyRef<HTMLDivElement>
    ) => {
        const msgBoxShadowColor = useColorModeValue('#000000', '#ffffff')
        const userColor = useColorModeValue('green.100', 'green.600')
        const botColor = useColorModeValue('gray.100', 'gray.600')
        const shadowLocation = isUser ? '2px 2px 4px 0px' : '-2px 2px 4px 0px'

        return (
            <Flex
                my={2}
                p={2}
                hidden={hidden}
                alignSelf={isUser ? 'flex-end' : 'flex-start'}
            >
                <Flex
                    bg={isUser ? userColor : botColor}
                    px={4}
                    py={2}
                    borderRadius={12}
                    boxShadow={`${shadowLocation} ${msgBoxShadowColor}`}
                >
                    <Text ref={ref} fontSize={15} maxWidth={400}>
                        {message}
                    </Text>
                </Flex>
            </Flex>
        )
    }
)

export default MessageBox
