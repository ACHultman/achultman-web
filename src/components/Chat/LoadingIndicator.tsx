import React, { useState, useEffect } from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

export const loadingMessages = [
    'Politely threatening the server',
    'Making up facts at high speed',
    'Waiting for GPT to stop being dramatic',
    'Downloading extra charisma',
    'Reading your mind... oh. Oh no.',
    'Trying to look busy while doing absolutely nothing',
    'Pretending this takes effort',
    'Just one more existential crisis...',
    'Negotiating with the laws of physics (they’re being difficult)',
    'Recalibrating my nonsense-to-truth ratio',
    'Checking if it’s too late to pivot to goat farming',
    'Patching reality—please hold',
    'Performing unsanctioned magic',
    'Rewiring my personality for this response',
    'Defragging the vibes',
    'Googling how to Google faster',
];

function LoadingIndicator() {
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
}

export default LoadingIndicator;
