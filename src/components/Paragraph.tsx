import { Text, TextProps, useColorModeValue } from '@chakra-ui/react'

type Props = {
    children: React.ReactNode
} & TextProps

const Paragraph = ({ children, ...props }: Props) => {
    const textColor = useColorModeValue('gray.600', 'gray.400')

    return (
        <Text color={textColor} {...props}>
            {children}
        </Text>
    )
}

export default Paragraph
