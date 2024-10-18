import {
    Box,
    Button,
    ButtonProps,
    Center,
    Heading,
    SlideFade,
} from '@chakra-ui/react';

import Paragraph from '../Paragraph';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaEnvelope } from 'react-icons/fa';
import theme from 'src/theme';

export const MotionButton = motion<ButtonProps>(Button);

function Hero() {
    return (
        <SlideFade in={true} offsetY={-80}>
            <Box>
                <Heading
                    as="h1"
                    fontSize={{ base: '28px', md: '40px', lg: '48px' }}
                    mb={3}
                >
                    Hey, I’m Adam
                </Heading>
                <Paragraph fontSize="2xl" lineHeight={1.6}>
                    Full-Stack Developer and Cybersecurity Enthusiast.
                </Paragraph>
                <Paragraph fontSize="2xl" lineHeight={1.6} mt={4}>
                    Let’s build something amazing together!
                </Paragraph>
                <Center>
                    <Link href="#contact">
                        <MotionButton
                            colorScheme="green"
                            size="lg"
                            mt={8}
                            bg={theme.colors.green[500]}
                            color="white"
                            whileHover={{ scale: 1.1 }}
                            leftIcon={<FaEnvelope />}
                        >
                            Contact
                        </MotionButton>
                    </Link>
                </Center>
            </Box>
        </SlideFade>
    );
}

export default Hero;
