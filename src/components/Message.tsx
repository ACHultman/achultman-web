import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { FaClock, FaInfo } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Props {
    message?: string;
    type?: 'empty';
}

function Message({ message = 'Such an empty place!', type = 'empty' }: Props) {
    const Icon = type === 'empty' ? FaClock : FaInfo;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <Box
                mt={10}
                display="flex"
                alignItems="center"
                borderColor={useColorModeValue('gray.100', 'gray.700')}
                borderWidth="1px"
                p={4}
                borderRadius="lg"
            >
                <Icon style={{ color: '#718096' }} />
                <Text color="gray.500" fontSize="lg" ml={2}>
                    {message}
                </Text>
            </Box>
        </motion.div>
    );
}

export default Message;
