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
import { motion } from 'framer-motion';
import NextImage from 'next/image';

import Contact from '@components/Contact';

const MotionBox = motion.create(Box);

const PRINCIPLES = [
    {
        title: 'The next change should be easy.',
        detail: 'I prefer plain structures that another engineer can understand without a tour of my brain.',
    },
    {
        title: 'Security starts in the architecture.',
        detail: 'I studied cybersecurity and privacy at UVic. Data boundaries and failure modes belong in the first conversation.',
    },
    {
        title: 'I want users in the room.',
        detail: 'The people doing the work know the edge cases. I would rather learn from them early than polish the wrong thing.',
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

function About() {
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
            />

            <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
                <MotionBox
                    as="section"
                    py={{ base: 14, md: 20, lg: 24 }}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid
                        templateColumns={{ base: '1fr', lg: '1.15fr 0.7fr' }}
                        gap={{ base: 12, lg: 24 }}
                        alignItems="center"
                    >
                        <Box>
                            <Text className="section-label">About Adam</Text>
                            <Heading
                                as="h1"
                                mt={5}
                                maxW="790px"
                                fontSize={{
                                    base: '50px',
                                    sm: '62px',
                                    md: '76px',
                                }}
                                lineHeight={{ base: 0.98, md: 0.95 }}
                                letterSpacing="-0.045em"
                            >
                                I like software that earns its place on a busy
                                day.
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
                                focus on cybersecurity and privacy. I still work
                                directly in the product and the code.
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
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Grid
                        templateColumns={{ base: '1fr', lg: '0.8fr 1.2fr' }}
                        gap={{ base: 8, lg: 20 }}
                    >
                        <Box>
                            <Text className="section-label">Right now</Text>
                            <Heading
                                as="h2"
                                mt={4}
                                maxW="540px"
                                fontSize={{ base: '42px', md: '58px' }}
                            >
                                I turn electrical rules into tools electricians
                                can use.
                            </Heading>
                        </Box>
                        <VStack align="stretch" spacing={5} justify="center">
                            <Text
                                color={muted}
                                fontSize={{ base: 'lg', md: 'xl' }}
                                lineHeight="1.75"
                            >
                                At Kopperfield, I build permit workflows for
                                residential electrification. That includes load
                                calculations, single-line diagrams, and the
                                paperwork that slows projects down.
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
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Grid
                        templateColumns={{ base: '1fr', lg: '0.75fr 1.25fr' }}
                        gap={{ base: 9, lg: 20 }}
                    >
                        <Box>
                            <Text className="section-label">How I work</Text>
                            <Heading
                                as="h2"
                                mt={4}
                                maxW="460px"
                                fontSize={{ base: '40px', md: '54px' }}
                            >
                                What I care about while building.
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
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Grid
                        templateColumns={{ base: '1fr', lg: '0.8fr 1.2fr' }}
                        gap={{ base: 9, lg: 20 }}
                    >
                        <Box>
                            <Text className="section-label">Working set</Text>
                            <Heading
                                as="h2"
                                mt={4}
                                fontSize={{ base: '42px', md: '58px' }}
                            >
                                The tools I use most.
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
