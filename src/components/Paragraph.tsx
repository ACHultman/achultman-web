import { Text, TextProps, useColorModeValue } from '@chakra-ui/react';

interface Props extends TextProps {
    children: React.ReactNode;
}

function Paragraph({ children, ...props }: Props) {
    const textColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Text color={textColor} {...props}>
            {children}
        </Text>
    );
}

export default Paragraph;
