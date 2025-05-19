import { Box, Button, Center, Heading } from '@chakra-ui/react';

import Paragraph from '../Paragraph';
import Link from 'next/link';
import { FaEnvelope } from 'react-icons/fa';

function Hero() {
    return (
        <Box>
            <Heading
                as="h1"
                fontSize={{ base: '28px', md: '40px', lg: '48px' }}
                mb={3}
            >
                Hey, I’m Adam
            </Heading>
            <Paragraph fontSize="2xl" lineHeight={1.6}>
                Full-stack software developer (EIT) with a focus on AI-powered,
                secure, and scalable platforms. I help teams turn complex
                challenges into reliable, elegant systems.
            </Paragraph>
            <Paragraph fontSize="2xl" lineHeight={1.6} mt={4}>
                Let’s build something great together.
            </Paragraph>
            <Center>
                <Link href="#contact">
                    <Button
                        colorScheme="green"
                        size="lg"
                        mt={8}
                        bg="green.600"
                        _hover={{ bg: 'green.700' }}
                        color="white"
                        leftIcon={<FaEnvelope />}
                    >
                        Contact
                    </Button>
                </Link>
            </Center>
        </Box>
    );
}

export default Hero;
