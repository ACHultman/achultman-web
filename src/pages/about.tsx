import { NextSeo } from 'next-seo';
import {
    Box,
    Container,
    Grid,
    Heading,
    Text,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { motion, useReducedMotion } from 'framer-motion';
import NextImage from 'next/image';

import Contact from '@components/Contact';

const MotionBox = motion.create(Box);

const PRINCIPLES = [
    {
        title: 'Code others can change',
        detail: 'I prefer simple code that another engineer can pick up and change.',
    },
    {
        title: 'Security and privacy',
        detail: 'I think through data access and failure modes when planning a feature.',
    },
    {
        title: 'Learning from users',
        detail: 'I like talking to the people using the software early. They know the edge cases.',
    },
];

const WORKING_SET = [
    {
        label: 'Product',
        tools: 'TypeScript, React, Next.js, Node.js',
    },
    {
        label: 'Data and systems',
        tools: 'PostgreSQL, AWS, Go, Docker',
    },
    {
        label: 'Applied AI',
        tools: 'OpenAI API, AI SDK, LLM product integration',
    },
    {
        label: 'Quality',
        tools: 'Playwright, system design, security and privacy',
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staticMotion = {
    opacity: 1,
    y: 0,
    transition: { duration: 0 },
};

function About() {
    const shouldReduceMotion = useReducedMotion();
    const muted = useColorModeValue('ink.600', 'paper.300');
    const border = useColorModeValue('paper.200', 'ink.700');
    const surface = useColorModeValue('paper.100', 'ink.900');
    const portraitBg = useColorModeValue('moss.100', 'moss.900');

    return (
        <>
            <NextSeo
                title="About"
                description="Adam Hultman is a software engineer in Vancouver. He has spent six years building products for media, residential electrification, and applied AI."
                canonical="https://hultman.dev/about"
                openGraph={{
                    title: 'About | Adam Hultman',
                    description:
                        'Adam Hultman is a software engineer in Vancouver. He has spent six years building products for media, residential electrification, and applied AI.',
                    url: 'https://hultman.dev/about',
                }}
            />

            <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
                <MotionBox
                    as="section"
                    py={{ base: 14, md: 20, lg: 24 }}
                    variants={fadeUp}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    animate={shouldReduceMotion ? staticMotion : 'visible'}
                >
                    <Grid
                        templateColumns={{ base: '1fr', lg: '1.15fr 0.7fr' }}
                        gap={{ base: 12, lg: 24 }}
                        alignItems="center"
                    >
                        <Box>
                            <Heading
                                as="h1"
                                maxW="790px"
                                fontSize={{
                                    base: '44px',
                                    sm: '56px',
                                    md: '64px',
                                }}
                                lineHeight={{ base: 0.98, md: 0.95 }}
                                letterSpacing="-0.045em"
                            >
                                A bit about me
                            </Heading>
                            <Text
                                mt={{ base: 7, md: 9 }}
                                maxW="620px"
                                color={muted}
                                fontSize={{ base: 'lg', md: 'xl' }}
                                lineHeight="1.75"
                            >
                                I&apos;m Adam, a software engineer in Vancouver.
                                Over six years, I&apos;ve built products for
                                media, residential electrification, and applied
                                AI.
                            </Text>
                            <Text
                                mt={4}
                                maxW="620px"
                                color={muted}
                                fontSize={{ base: 'lg', md: 'xl' }}
                                lineHeight="1.75"
                            >
                                I studied Software Engineering at UVic with a
                                focus on cybersecurity and privacy.
                            </Text>
                        </Box>

                        <Box
                            position="relative"
                            w={{ base: '82%', sm: '62%', lg: '100%' }}
                            maxW="390px"
                            justifySelf={{ base: 'center', lg: 'end' }}
                        >
                            <Box
                                position="absolute"
                                inset="-18px 20px 24px -18px"
                                bg={portraitBg}
                                borderRadius="48% 52% 44% 56% / 55% 42% 58% 45%"
                                transform="rotate(-3deg)"
                            />
                            <Box
                                position="relative"
                                aspectRatio="4 / 5"
                                overflow="hidden"
                                borderRadius="46% 54% 43% 57% / 39% 42% 58% 61%"
                                filter="saturate(0.72) contrast(1.04)"
                            >
                                <NextImage
                                    src="/images/adam.jpg"
                                    alt="Adam Hultman"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority
                                    sizes="(max-width: 992px) 62vw, 390px"
                                />
                            </Box>
                        </Box>
                    </Grid>
                </MotionBox>

                <MotionBox
                    as="section"
                    py={{ base: 16, md: 24 }}
                    borderTop="1px solid"
                    borderColor={border}
                    variants={fadeUp}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    animate={shouldReduceMotion ? staticMotion : undefined}
                    whileInView={shouldReduceMotion ? undefined : 'visible'}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Grid
                        templateColumns={{ base: '1fr', lg: '0.8fr 1.2fr' }}
                        gap={{ base: 8, lg: 20 }}
                    >
                        <Box>
                            <Heading
                                as="h2"
                                maxW="540px"
                                fontSize={{ base: '42px', md: '58px' }}
                            >
                                At Kopperfield
                            </Heading>
                        </Box>
                        <VStack align="stretch" spacing={5} justify="center">
                            <Text
                                color={muted}
                                fontSize={{ base: 'lg', md: 'xl' }}
                                lineHeight="1.75"
                            >
                                I work on software for electricians, including
                                load calculations, single-line diagrams and
                                permit paperwork. My work spans product
                                planning, engineering quality and production
                                reliability.
                            </Text>
                            <Text color={muted} lineHeight="1.75">
                                Outside that work, I keep returning to LLM
                                tooling and distributed systems.
                            </Text>
                        </VStack>
                    </Grid>
                </MotionBox>

                <MotionBox
                    as="section"
                    bg={surface}
                    mx={{ base: -4, md: 0 }}
                    px={{ base: 6, md: 12, lg: 16 }}
                    py={{ base: 14, md: 18 }}
                    borderRadius={{ base: 0, md: '4px 48px 4px 48px' }}
                    variants={fadeUp}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    animate={shouldReduceMotion ? staticMotion : undefined}
                    whileInView={shouldReduceMotion ? undefined : 'visible'}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Grid
                        templateColumns={{ base: '1fr', lg: '0.75fr 1.25fr' }}
                        gap={{ base: 9, lg: 20 }}
                    >
                        <Box>
                            <Heading
                                as="h2"
                                maxW="460px"
                                fontSize={{ base: '40px', md: '54px' }}
                            >
                                How I work
                            </Heading>
                        </Box>

                        <VStack align="stretch" spacing={0}>
                            {PRINCIPLES.map((principle) => (
                                <Box
                                    key={principle.title}
                                    py={6}
                                    borderBottom="1px solid"
                                    borderColor={border}
                                >
                                    <Heading as="h3" fontSize="2xl">
                                        {principle.title}
                                    </Heading>
                                    <Text
                                        mt={2}
                                        maxW="620px"
                                        color={muted}
                                        lineHeight="1.7"
                                    >
                                        {principle.detail}
                                    </Text>
                                </Box>
                            ))}
                        </VStack>
                    </Grid>
                </MotionBox>

                <MotionBox
                    as="section"
                    py={{ base: 16, md: 24 }}
                    variants={fadeUp}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    animate={shouldReduceMotion ? staticMotion : undefined}
                    whileInView={shouldReduceMotion ? undefined : 'visible'}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Grid
                        templateColumns={{ base: '1fr', lg: '0.8fr 1.2fr' }}
                        gap={{ base: 9, lg: 20 }}
                    >
                        <Box>
                            <Heading
                                as="h2"
                                fontSize={{ base: '42px', md: '58px' }}
                            >
                                Tools I use
                            </Heading>
                        </Box>

                        <VStack
                            align="stretch"
                            spacing={0}
                            borderTop="1px solid"
                            borderColor={border}
                        >
                            {WORKING_SET.map((group) => (
                                <Grid
                                    key={group.label}
                                    templateColumns={{
                                        base: '1fr',
                                        sm: '150px 1fr',
                                    }}
                                    gap={{ base: 2, sm: 6 }}
                                    py={5}
                                    borderBottom="1px solid"
                                    borderColor={border}
                                >
                                    <Text fontWeight="700">{group.label}</Text>
                                    <Text color={muted}>{group.tools}</Text>
                                </Grid>
                            ))}
                        </VStack>
                    </Grid>

                    <Grid
                        mt={{ base: 14, md: 20 }}
                        pt={{ base: 10, md: 12 }}
                        borderTop="1px solid"
                        borderColor={border}
                        templateColumns={{ base: '1fr', md: '0.8fr 1.2fr' }}
                        gap={{ base: 5, md: 12 }}
                    >
                        <Text className="section-label">Off the clock</Text>
                        <Text
                            maxW="680px"
                            color={muted}
                            fontSize={{ base: 'lg', md: 'xl' }}
                            lineHeight="1.75"
                        >
                            I run and travel. I also pick locks, go to stand-up
                            shows, and lose time to astrophysics rabbit holes.
                        </Text>
                    </Grid>
                </MotionBox>

                <Box pb={{ base: 8, md: 12 }}>
                    <Contact />
                </Box>
            </Container>
        </>
    );
}

export default About;
