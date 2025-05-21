import { Box } from '@chakra-ui/react';
import React from 'react';
import { GiArtificialIntelligence } from 'react-icons/gi';
import { TfiThought } from 'react-icons/tfi';

function injectKeyframes() {
    if (typeof window === 'undefined') return;
    if (!document.getElementById('bot-thinking-whimsy-keyframes')) {
        const style = document.createElement('style');
        style.id = 'bot-thinking-whimsy-keyframes';
        style.innerHTML = `
        @keyframes botThinkingWhimsy {
          0% { transform: scaleX(-1) translateY(-8px) scale(1) rotate(-8deg); opacity: 0.7; filter: blur(0px) brightness(1.1); }
          20% { transform: scaleX(-1) translateY(-20px) scale(1.15) rotate(8deg) translateX(0px); opacity: 1; filter: blur(0.2px) brightness(1.2); }
          40% { transform: scaleX(-1) translateY(-16px) scale(1.1) rotate(-6deg) translateX(-8px); opacity: 0.85; filter: blur(0.1px) brightness(1.15); }
          60% { transform: scaleX(-1) translateY(-24px) scale(1.2) rotate(10deg) translateX(-16px); opacity: 1; filter: blur(0.3px) brightness(1.3); }
          80% { transform: scaleX(-1) translateY(-12px) scale(1.05) rotate(-10deg) translateX(-8px); opacity: 0.8; filter: blur(0.1px) brightness(1.05); }
          100% { transform: scaleX(-1) translateY(-8px) scale(1) rotate(-8deg) translateX(0px); opacity: 0.7; filter: blur(0px) brightness(1.1); }
        }
        @keyframes robotNod {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-10deg); }
          40% { transform: rotate(8deg); }
          60% { transform: rotate(-6deg); }
          80% { transform: rotate(6deg); }
        }
        `;
        document.head.appendChild(style);
    }
}

injectKeyframes();

const bubbleStyle = (delay: string) => ({
    display: 'inline-block',
    mx: '2px',
    fontSize: 'xl',
    color: 'green.300',
    animation:
        'botThinkingWhimsy 1.8s infinite cubic-bezier(0.68,-0.55,0.27,1.55)',
    animationDelay: delay,
    opacity: 0.7,
});

const robotStyle = {
    animation: 'robotNod 1.8s infinite cubic-bezier(0.68,-0.55,0.27,1.55)',
    transformOrigin: '60% 80%',
    display: 'inline-flex',
};

function TypingIndicator() {
    return (
        <Box
            display="flex"
            alignItems="center"
            alignSelf="flex-start"
            mt={2}
            mb={1}
            gap={2}
        >
            <Box
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="48px"
                h="48px"
            >
                <Box
                    color="green.400"
                    fontSize="2xl"
                    display="flex"
                    alignItems="center"
                    sx={robotStyle}
                    zIndex={1}
                >
                    <GiArtificialIntelligence size="40px" />
                </Box>
            </Box>
            <Box display="flex" alignItems="center">
                <Box as="span" sx={bubbleStyle('0s')}>
                    <TfiThought />
                </Box>
            </Box>
        </Box>
    );
}

export default TypingIndicator;
