import {
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    Link as ChakraLink,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaArrowRight, FaCheck } from 'react-icons/fa';

import Contact from '../Contact';
import { captureLeadIntent } from '../../lib/analytics';
import FeaturedWork from './FeaturedWork';
import Hero from './Hero';
import WorkflowCostCalculator from './WorkflowCostCalculator';

const FIT_SIGNALS = [
    'Your team repeats the same judgement-heavy work every week.',
    'The workflow crosses spreadsheets, inboxes and a system of record.',
    'Your current software handles the easy cases. People still close the gap.',
    'You can name an owner and measure the hours, delay or risk involved.',
];

const PILOT_STEPS = [
    {
        title: 'Watch the work',
        detail: 'Walk through the workflow with the people who run it. Record the edge cases and establish a baseline.',
    },
    {
        title: 'Build the first working version',
        detail: 'Connect the tools you already use. Keep a person in control of high-risk decisions.',
    },
    {
        title: "Put it in the team's hands",
        detail: 'Start with a small user group. Track failures and compare the result with the baseline.',
    },
];

function Home() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const surface = useColorModeValue('paper.100', 'ink.900');
    const border = useColorModeValue('paper.200', 'ink.700');
    const offerPanel = useColorModeValue('moss.100', 'ink.900');
    const offerBorder = useColorModeValue('moss.300', 'ink.700');
    const offerMuted = useColorModeValue('ink.600', 'paper.300');
    const offerButtonBg = useColorModeValue('ink.900', 'paper.50');
    const offerButtonColor = useColorModeValue('paper.50', 'ink.900');

    return (
        <Box w="100%">
            <Hero />

            <Box
                as="section"
                id="fit"
                py={{ base: 16, md: 24 }}
                borderTop="1px solid"
                borderColor={border}
            >
                <Grid
                    templateColumns={{ base: '1fr', lg: '0.8fr 1.2fr' }}
                    gap={{ base: 10, lg: 20 }}
                >
                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: '42px', md: '58px' }}
                            lineHeight="1"
                        >
                            You can point to the work that keeps getting stuck.
                        </Heading>
                        <Text
                            mt={7}
                            color={muted}
                            lineHeight="1.75"
                            maxW="520px"
                        >
                            I work best with B2B software and service teams of
                            15-150 people: enough process for manual work to
                            hurt, small enough to decide quickly.
                        </Text>
                    </Box>

                    <VStack align="stretch" spacing={0}>
                        {FIT_SIGNALS.map((signal) => (
                            <Flex
                                key={signal}
                                gap={5}
                                py={6}
                                borderBottom="1px solid"
                                borderColor={border}
                                align="flex-start"
                            >
                                <Box
                                    mt="3px"
                                    w="26px"
                                    h="26px"
                                    flexShrink={0}
                                    display="grid"
                                    placeItems="center"
                                    borderRadius="50%"
                                    bg={surface}
                                    color="moss.600"
                                >
                                    <FaCheck size="10px" />
                                </Box>
                                <Text fontSize={{ base: 'lg', md: 'xl' }}>
                                    {signal}
                                </Text>
                            </Flex>
                        ))}
                    </VStack>
                </Grid>
            </Box>

            <WorkflowCostCalculator />

            <FeaturedWork />

            <Box
                as="section"
                id="offer"
                bg={offerPanel}
                mx={{ base: -4, md: -8 }}
                px={{ base: 6, md: 12, lg: 16 }}
                py={{ base: 14, md: 20 }}
                borderRadius={{ base: '0', md: '4px 52px 4px 52px' }}
                position="relative"
                overflow="hidden"
            >
                <Box className="organic-ring" aria-hidden="true" />
                <Grid
                    templateColumns={{ base: '1fr', lg: '1.05fr 0.95fr' }}
                    gap={{ base: 12, lg: 20 }}
                    position="relative"
                >
                    <Box>
                        <Text className="section-label">The 30-day pilot</Text>
                        <Heading
                            as="h2"
                            mt={4}
                            fontSize={{ base: '44px', md: '62px' }}
                            maxW="620px"
                        >
                            Start with one month of work.
                        </Heading>
                        <Text
                            mt={7}
                            maxW="570px"
                            color={offerMuted}
                            lineHeight="1.75"
                            fontSize="lg"
                        >
                            Bring one workflow. I&apos;ll build the smallest
                            version your team can use within a month, then
                            measure whether it saves enough work to continue.
                        </Text>
                    </Box>

                    <Box
                        borderTop="1px solid"
                        borderBottom="1px solid"
                        borderColor={offerBorder}
                        py={8}
                        alignSelf="end"
                    >
                        <Flex justify="space-between" gap={4} align="baseline">
                            <Text fontWeight="600">Fixed pilot</Text>
                            <Text
                                fontFamily="heading"
                                fontSize={{ base: '3xl', md: '4xl' }}
                            >
                                from $5,000
                            </Text>
                        </Flex>
                        <Text mt={2} color={offerMuted} fontSize="sm">
                            USD, 30 days, one defined workflow
                        </Text>
                        <Text mt={6} color={offerMuted} lineHeight="1.7">
                            At the end, we review the numbers together. If the
                            pilot proves useful, ongoing product work starts at
                            $5,000 per month. I keep improving the tool,
                            watching failures and adapting it as the surrounding
                            systems change. The agreement stays month to month,
                            and you keep the code and operating notes.
                        </Text>
                        <Button
                            as={Link}
                            href="#contact"
                            onClick={() => captureLeadIntent('offer')}
                            mt={7}
                            rightIcon={<FaArrowRight size="12px" />}
                            bg={offerButtonBg}
                            color={offerButtonColor}
                            _hover={{
                                bg: 'moss.200',
                                transform: 'translateY(-2px)',
                                textDecoration: 'none',
                            }}
                        >
                            Send the workflow
                        </Button>
                    </Box>
                </Grid>
            </Box>

            <Box as="section" id="process" py={{ base: 16, md: 24 }}>
                <Grid
                    templateColumns={{ base: '1fr', lg: '0.8fr 1.2fr' }}
                    gap={{ base: 10, lg: 20 }}
                >
                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: '42px', md: '58px' }}
                        >
                            Four weeks with the people doing the work.
                        </Heading>
                    </Box>
                    <VStack align="stretch" spacing={0}>
                        {PILOT_STEPS.map((step) => (
                            <Box
                                key={step.title}
                                py={7}
                                borderBottom="1px solid"
                                borderColor={border}
                            >
                                <Heading as="h3" fontSize="2xl">
                                    {step.title}
                                </Heading>
                                <Text mt={2} color={muted} lineHeight="1.7">
                                    {step.detail}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                </Grid>
            </Box>

            <Box
                as="section"
                py={{ base: 14, md: 20 }}
                borderTop="1px solid"
                borderColor={border}
            >
                <Box maxW="760px">
                    <Heading
                        as="h2"
                        fontSize={{ base: '38px', md: '50px' }}
                        maxW="580px"
                    >
                        I still write the code.
                    </Heading>
                    <Text mt={6} color={muted} lineHeight="1.75">
                        I&apos;m Adam. I have spent six years building software
                        for media and residential electrification, plus a fair
                        amount of applied AI. I studied security and privacy at
                        UVic, and I still like working directly with the people
                        who use what I build.
                    </Text>
                    <ChakraLink
                        as={Link}
                        href="/about"
                        display="inline-flex"
                        alignItems="center"
                        gap={2}
                        mt={5}
                        fontWeight="700"
                        color="moss.700"
                    >
                        More about Adam <FaArrowRight size="11px" />
                    </ChakraLink>
                </Box>
            </Box>

            <Box id="contact" scrollMarginTop="110px">
                <Contact />
            </Box>
        </Box>
    );
}

export default Home;
