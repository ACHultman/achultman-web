import React, { useState, useEffect } from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

export const loadingMessages = [
    "Consulting Adam's work history",
    "Speed-reading 5 years of commits",
    "Translating engineer-speak to human",
    "Asking Adam what he'd say (he's busy, sorry)",
    "Pulling from the Adam archives",
    "Cross-referencing with past deployments",
    "Fetching opinions, one release at a time",
    "Searching for the most accurate answer",
    "Politely threatening the server",
    "Downloading extra charisma",
    "Negotiating with the laws of physics (they're being difficult)",
    "Patching reality\u2014please hold",
    "Defragging the vibes",
];

function LoadingIndicator() {
    const [message, setMessage] = useState('');
    const [ellipsis, setEllipsis] = useState('.');

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        const selectedMessage = loadingMessages[randomIndex];
        if (selectedMessage) {
            setMessage(selectedMessage);
        }
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
