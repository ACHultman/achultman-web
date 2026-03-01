import { NextSeo } from 'next-seo';
import {
    Box,
    Container,
    Flex,
    Heading,
    HStack,
    Image,
    SlideFade,
    Text,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
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
                                    w={{ base: '160px', md: '200px' }}
                                    h={{ base: '160px', md: '200px' }}
                                    borderRadius="2xl"
                                    overflow="hidden"
                                    boxShadow="0 0 0 3px var(--chakra-colors-green-500)"
                                >
                                    <Image
                                        src="/images/adam.jpg"
                                        alt="Adam Hultman"
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        fallback={
                                            <Box
                                                w="100%"
                                                h="100%"
                                                bg="green.100"
                                            />
                                        }
                                    />
                                </Box>
                                <VStack align="start" spacing={4} flex="1">
                                    <Paragraph
                                        fontSize={{ base: 'lg', md: 'xl' }}
                                        lineHeight={1.7}
                                    >
                                        I&apos;m a software developer who
                                        genuinely likes hard problems. I&apos;ve
                                        spent 5+ years building platforms for
                                        media, clean energy, and AI &mdash;
                                        usually at the intersection of
                                        interesting architecture and real user
                                        impact.
                                    </Paragraph>
                                    <Paragraph
                                        fontSize={{ base: 'lg', md: 'xl' }}
                                        lineHeight={1.7}
                                    >
                                        I hold a Bachelor of Software
                                        Engineering with a specialization in
                                        Cybersecurity &amp; Privacy from the
                                        University of Victoria.
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
                                    Building software at Kopperfield to help
                                    homeowners electrify their homes. Exploring
                                    LLM tooling patterns and occasionally
                                    thinking about distributed systems.
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
                                        text: 'Simplicity is a feature, not a shortcut.',
                                    },
                                    {
                                        icon: '✦',
                                        text: 'Security belongs in the first commit, not the last.',
                                    },
                                    {
                                        icon: '✦',
                                        text: 'The best system is one that nobody notices.',
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
                                    { emoji: '📅', label: '5+ years experience' },
                                    {
                                        emoji: '🎓',
                                        label: 'BSEng, Cybersecurity & Privacy (UVic 2022)',
                                    },
                                    { emoji: '📍', label: 'Vancouver, BC' },
                                    { emoji: '🎹', label: 'Plays piano' },
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
                                    Thanks for reading! Feel free to connect
                                    with me on LinkedIn or send a message using
                                    the form below.
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
