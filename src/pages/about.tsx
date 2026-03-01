import { NextSeo } from 'next-seo';
import {
    Box,
    Container,
    Flex,
    Heading,
    HStack,
    SlideFade,
    Text,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { motion } from 'framer-motion';

import Paragraph from '@components/Paragraph';
import Contact from '@components/Contact';
import Skills from '@components/Home/Skills';

const MotionBox = motion(Box);

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function About() {
    const calloutBg = useColorModeValue('green.50', 'green.900');
    const calloutBorder = useColorModeValue('green.400', 'green.500');
    const subtleText = useColorModeValue('gray.600', 'gray.400');
    const cardBg = useColorModeValue('gray.50', 'gray.700');

    return (
        <>
            <NextSeo
                title="About | Adam Hultman"
                description="Learn about Adam Hultman's background, experience, and skills as a full-stack software developer specializing in AI, security, and scalable platforms."
                canonical="https://hultman.dev/about"
            />
            <Container maxW="container.lg">
                <SlideFade in={true} offsetY={80}>
                    <Box>
                        <Heading
                            as="h1"
                            fontSize={{ base: '28px', md: '32px', lg: '36px' }}
                            mb={8}
                        >
                            About
                        </Heading>

                        {/* Section 1: Photo + Quick Bio */}
                        <MotionBox
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            mb={12}
                        >
                            <Flex
                                direction={{ base: 'column', md: 'row' }}
                                gap={8}
                                align={{ base: 'center', md: 'flex-start' }}
                            >
                                <Box
                                    flexShrink={0}
                                    position="relative"
                                    w={{ base: '160px', md: '200px' }}
                                    h={{ base: '160px', md: '200px' }}
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
                                        sizes="(max-width: 768px) 160px, 200px"
                                    />
                                </Box>
                                <VStack align="start" spacing={4} flex="1">
                                    <Paragraph
                                        fontSize={{ base: 'lg', md: 'xl' }}
                                        lineHeight={1.7}
                                    >
                                        I&apos;m a software developer who likes
                                        hard problems &mdash; 5+ years building
                                        platforms across media, clean energy,
                                        and AI
                                    </Paragraph>
                                    <Paragraph
                                        fontSize={{ base: 'lg', md: 'xl' }}
                                        lineHeight={1.7}
                                    >
                                        Software Engineering degree from UVic
                                        with a focus on Cybersecurity &amp;
                                        Privacy
                                    </Paragraph>
                                </VStack>
                            </Flex>
                        </MotionBox>

                        {/* Section 2: Right Now callout */}
                        <MotionBox
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            mb={12}
                        >
                            <Box
                                bg={calloutBg}
                                borderLeftWidth="4px"
                                borderLeftColor={calloutBorder}
                                borderRadius="md"
                                px={6}
                                py={5}
                            >
                                <Text
                                    fontWeight="bold"
                                    mb={1}
                                    color={calloutBorder}
                                >
                                    Right now
                                </Text>
                                <Paragraph lineHeight={1.7}>
                                    Building permit tools for electricians at
                                    Kopperfield — load calcs, diagrams, and the
                                    paperwork that slows projects down. Also
                                    deep in LLM tooling and thinking about
                                    distributed systems
                                </Paragraph>
                            </Box>
                        </MotionBox>

                        {/* Section 3: What I believe */}
                        <MotionBox
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            mb={12}
                        >
                            <Heading as="h2" size="md" mb={5}>
                                What I believe about software
                            </Heading>
                            <VStack align="start" spacing={4}>
                                {[
                                    {
                                        icon: '✦',
                                        text: 'Simple beats clever — almost always',
                                    },
                                    {
                                        icon: '✦',
                                        text: 'Security belongs in the first commit, not the last sprint',
                                    },
                                    {
                                        icon: '✦',
                                        text: 'The best infrastructure is the kind nobody talks about',
                                    },
                                ].map(({ icon, text }) => (
                                    <HStack key={text} spacing={3} align="start">
                                        <Text
                                            color="green.500"
                                            fontSize="sm"
                                            pt={1}
                                            flexShrink={0}
                                        >
                                            {icon}
                                        </Text>
                                        <Paragraph lineHeight={1.7}>
                                            {text}
                                        </Paragraph>
                                    </HStack>
                                ))}
                            </VStack>
                        </MotionBox>

                        {/* Section 4: Quick facts */}
                        <MotionBox
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            mb={12}
                        >
                            <Flex
                                wrap="wrap"
                                gap={4}
                                direction={{ base: 'column', sm: 'row' }}
                            >
                                {[
                                    { emoji: '📅', label: '5+ years building things' },
                                    { emoji: '📍', label: 'Vancouver, BC' },
                                    {
                                        emoji: '🎓',
                                        label: 'BSEng, Security & Privacy (UVic)',
                                    },
                                    { emoji: '🏃', label: 'Runs' },
                                    { emoji: '🔐', label: 'Picks locks' },
                                    { emoji: '🌌', label: 'Astrophysics rabbit holes' },
                                    { emoji: '🎭', label: 'Goes to stand-ups' },
                                    { emoji: '✈️', label: 'Travels' },
                                    { emoji: '🎮', label: 'Games' },
                                ].map(({ emoji, label }) => (
                                    <Box
                                        key={label}
                                        bg={cardBg}
                                        borderRadius="lg"
                                        px={4}
                                        py={3}
                                        flex={{ base: '1 1 100%', sm: '1 1 45%', md: '0 1 auto' }}
                                    >
                                        <Text fontSize="sm" color={subtleText}>
                                            {emoji}&nbsp;&nbsp;{label}
                                        </Text>
                                    </Box>
                                ))}
                            </Flex>
                        </MotionBox>

                        {/* Section 5: Skills */}
                        <MotionBox
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            mb={12}
                        >
                            <Skills />
                        </MotionBox>

                        {/* Section 6: Contact */}
                        <MotionBox
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <VStack w="100%" gap={8}>
                                <Paragraph
                                    fontSize={{ base: 'lg', md: 'xl' }}
                                    lineHeight={1.7}
                                >
                                    Want to connect? Find me on LinkedIn or
                                    drop a message below
                                </Paragraph>
                                <Contact />
                            </VStack>
                        </MotionBox>
                    </Box>
                </SlideFade>
            </Container>
        </>
    );
}

export default About;
