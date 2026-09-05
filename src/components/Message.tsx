import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { FaClock, FaInfo } from 'react-icons/fa';

interface Props {
    message?: string;
    type?: 'empty';
}

function Message({ message = 'No items yet.', type = 'empty' }: Props) {
    const Icon = type === 'empty' ? FaClock : FaInfo;
    const borderColor = useColorModeValue('paper.200', 'ink.700');
    const textColor = useColorModeValue('ink.700', 'paper.200');
    const iconColor = useColorModeValue('moss.700', 'moss.200');

    return (
        <Box
            mt={10}
            display="flex"
            alignItems="center"
            color={textColor}
            borderColor={borderColor}
            borderWidth="1px"
            p={4}
            borderRadius="lg"
        >
            <Box as={Icon} color={iconColor} />
            <Text color={textColor} fontSize="lg" ml={2}>
                {message}
            </Text>
        </Box>
    );
}

export default Message;
