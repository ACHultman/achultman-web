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
    'Someone does the same fiddly work every week',
    'The answer lives across a spreadsheet, an inbox and another tool',
    'Your software handles the happy path and a person handles the rest',
    'Someone owns the job and knows roughly how much time it eats',
];

const PILOT_STEPS = [
    {
        title: 'See the work up close',
        detail: 'We walk through the job as it happens, including the weird cases and workarounds',
    },
    {
        title: 'Build something small',
        detail: 'I connect the tools already in use and leave the important decisions with a person',
    },
    {
        title: 'Try it with a few people',
        detail: 'We see what breaks, fix it and compare the result with how the work happened before',
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
                            Good problems to bring me
                        </Heading>
                        <Text
                            mt={7}
                            color={muted}
                            lineHeight="1.75"
                            maxW="520px"
                        >
                            The sweet spot is a B2B software or service team of
                            15 to 150 people: enough moving parts to make a
                            workaround painful, small enough to fix it.
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
                        <Text className="section-label">
                            One month, one workflow
                        </Text>
                        <Heading
                            as="h2"
                            mt={4}
                            fontSize={{ base: '44px', md: '62px' }}
                            maxW="620px"
                        >
                            Let&apos;s make one annoying task easier
                        </Heading>
                        <Text
                            mt={7}
                            maxW="570px"
                            color={offerMuted}
                            lineHeight="1.75"
                            fontSize="lg"
                        >
                            Bring the messy version and I&apos;ll sit with the
                            people who do it, build something small and see
                            whether it helps.
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
                            <Text fontWeight="600">30-day project</Text>
                            <Text
                                fontFamily="heading"
                                fontSize={{ base: '3xl', md: '4xl' }}
                            >
                                from $5,000
                            </Text>
                        </Flex>
                        <Text mt={2} color={offerMuted} fontSize="sm">
                            USD · one workflow · small group
                        </Text>
                        <Text mt={6} color={offerMuted} lineHeight="1.7">
                            After a month, we look at what changed and decide
                            whether to keep going. Ongoing work starts at $5,000
                            a month, stays month to month, and the code and
                            notes are yours.
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
                            Tell me about it
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
                            What the month looks like
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
                        A bit about me
                    </Heading>
                    <Text mt={6} color={muted} lineHeight="1.75">
                        I&apos;m a software engineer in Vancouver. I&apos;ve
                        spent six years building products for media and
                        residential electrification, with a fair bit of AI mixed
                        in. I studied security and privacy at UVic and still
                        prefer working directly with the people using what I
                        build.
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
                        The longer version <FaArrowRight size="11px" />
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
