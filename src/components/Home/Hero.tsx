import { Badge, Box, Button, Flex, Heading } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import NextImage from 'next/image';

import Paragraph from '../Paragraph';
import Link from 'next/link';
import { FaEnvelope, FaUser } from 'react-icons/fa';

const SUBTITLES = [
    'Full-stack developer',
    'AI platform builder',
    'Security-minded engineer',
    'Occasional pianist',
];

function TypedSubtitle() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % SUBTITLES.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    return (
        <Box
            h={{ base: '32px', md: '40px' }}
            position="relative"
            overflow="hidden"
        >
            <AnimatePresence>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                    style={{ position: 'absolute', width: '100%' }}
                >
                    <Paragraph
                        fontSize={{ base: 'lg', md: '2xl' }}
                        lineHeight={1.5}
                        color="green.500"
                        fontWeight="medium"
                        m={0}
                    >
                        {SUBTITLES[index]}
                    </Paragraph>
                </motion.div>
            </AnimatePresence>
        </Box>
    );
}

function Hero() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: '100%' }}
        >
            <Flex
                direction="row"
                align="center"
                justify="space-between"
                gap={{ base: 4, md: 12 }}
                w="100%"
            >
                <Box flex="1">
                    <Heading
                        as="h1"
                        fontSize={{ base: '26px', md: '40px', lg: '48px' }}
                        mb={2}
                    >
                        Hey, I&apos;m Adam.
                    </Heading>
                    <Badge
                        colorScheme="green"
                        variant="subtle"
                        fontSize="xs"
                        mb={3}
                        px={2}
                        py={0.5}
                        borderRadius="full"
                    >
                        Currently @ Kopperfield
                    </Badge>
                    <TypedSubtitle />
                    <Paragraph
                        fontSize={{ base: 'sm', md: 'lg', lg: 'xl' }}
                        lineHeight={1.7}
                        mt={4}
                    >
                        I build things that hold up — clean architecture, AI
                        where it matters, security from the start
                    </Paragraph>
                </Box>
                <Box
                    flexShrink={0}
                    alignSelf={{ base: 'flex-start', md: 'center' }}
                    position="relative"
                    w={{ base: '88px', md: '200px' }}
                    h={{ base: '88px', md: '200px' }}
                    borderRadius="2xl"
                    overflow="hidden"
                    boxShadow="0 0 0 3px var(--chakra-colors-green-500)"
                >
                    <NextImage
                        src="/images/adam.jpg"
                        alt="Adam Hultman"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                        sizes="(max-width: 768px) 88px, 200px"
                    />
                </Box>
            </Flex>
            <Flex gap={3} mt={6} wrap="wrap">
                <Link href="#contact">
                    <Button
                        colorScheme="green"
                        size={{ base: 'md', md: 'lg' }}
                        bg="green.600"
                        _hover={{ bg: 'green.700' }}
                        color="white"
                        leftIcon={<FaEnvelope />}
                    >
                        Say hello
                    </Button>
                </Link>
                <Link href="/about">
                    <Button
                        size={{ base: 'md', md: 'lg' }}
                        variant="outline"
                        colorScheme="green"
                        leftIcon={<FaUser />}
                    >
                        Read my story
                    </Button>
                </Link>
            </Flex>
        </motion.div>
    );
}

export default Hero;
