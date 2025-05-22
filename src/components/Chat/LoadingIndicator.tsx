import React, { useState, useEffect } from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

export const loadingMessages = [
    'Consulting my digital tea leaves',
    'Rummaging through my bits and bytes',
    'Warming up the hamsters',
    "Don't rush the genius",
    'Almost there, just polishing the pixels',
    'Counting to infinity (almost done)',
    'Asking the magic 8-ball',
    'Brewing some digital coffee',
];

const LoadingIndicator: React.FC = () => {
    const [message, setMessage] = useState('');
    const [ellipsis, setEllipsis] = useState('.');

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        setMessage(loadingMessages[randomIndex]);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setEllipsis((prev) => {
                if (prev === '...') return '.';
                return prev + '.';
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const backgroundColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('black', 'white');

    return (
        <Box
            role="status"
            display="flex"
            justifyContent="flex-start"
            p={3}
            m={2}
        >
            <Box
                bg={backgroundColor}
                color={textColor}
                borderRadius="lg"
                p={3}
                maxWidth="80%"
            >
                <Text>
                    {message}
                    {ellipsis}
                </Text>
            </Box>
        </Box>
    );
};

export default LoadingIndicator;
