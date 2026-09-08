import {
    Box,
    Button,
    Grid,
    Heading,
    Link as ChakraLink,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

import Contact from '../Contact';
import { captureLeadIntent } from '../../lib/analytics';
import FeaturedWork from './FeaturedWork';
import Hero from './Hero';

const CAPABILITIES = [
    {
        title: 'Internal tools',
        detail: "The small app your team keeps trying to approximate with spreadsheets, inboxes and one person's memory",
    },
    {
        title: 'AI features',
        detail: 'Search, extraction, drafting or review inside a product people already use',
    },
    {
        title: 'Product engineering',
        detail: 'A focused web feature, integration or rescue job when a team needs extra engineering capacity',
    },
];

function Home() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const linkColor = useColorModeValue('moss.700', 'moss.200');
    const border = useColorModeValue('paper.200', 'ink.700');
    const offerPanel = useColorModeValue('moss.100', 'ink.900');
    const offerMuted = useColorModeValue('ink.600', 'paper.300');
    const offerButtonBg = useColorModeValue('ink.900', 'paper.50');
    const offerButtonColor = useColorModeValue('paper.50', 'ink.900');

    return (
        <Box w="100%">
            <Hero />

            <FeaturedWork />

            <Box
                as="section"
                id="fit"
                py={{ base: 16, md: 24 }}
                borderTop="1px solid"
                borderColor={border}
            >
                <Grid
                    templateColumns={{ base: '1fr', lg: '0.72fr 1.28fr' }}
                    gap={{ base: 10, lg: 20 }}
                >
                    <Box maxW="520px">
                        <Heading
                            as="h2"
                            fontSize={{ base: '42px', md: '58px' }}
                            fontWeight="500"
                        >
                            The kind of work I take on
                        </Heading>
                        <Text mt={6} color={muted} lineHeight="1.75">
                            Usually one of these, or the awkward overlap between
                            them
                        </Text>
                    </Box>

                    <Box borderTop="1px solid" borderColor={border}>
                        {CAPABILITIES.map((capability) => (
                            <Grid
                                key={capability.title}
                                templateColumns={{
                                    base: '1fr',
                                    md: '0.55fr 1fr',
                                }}
                                gap={{ base: 3, md: 10 }}
                                py={{ base: 7, md: 9 }}
                                borderBottom="1px solid"
                                borderColor={border}
                            >
                                <Heading as="h3" fontSize="2xl">
                                    {capability.title}
                                </Heading>
                                <Text color={muted} lineHeight="1.7">
                                    {capability.detail}
                                </Text>
                            </Grid>
                        ))}
                    </Box>
                </Grid>
            </Box>

            <Box
                as="section"
                id="offer"
                bg={offerPanel}
                mx={{ base: -4, md: -8 }}
                px={{ base: 4, md: 8, lg: 12 }}
                py={{ base: 12, md: 16 }}
                borderRadius={{ base: '0', md: '24px' }}
            >
                <Grid
                    templateColumns={{ base: '1fr', lg: '0.95fr 1.05fr' }}
                    gap={{ base: 10, lg: 16 }}
                    alignItems="center"
                >
                    <Box
                        position="relative"
                        aspectRatio="3 / 2"
                        overflow="hidden"
                        borderRadius="18px"
                    >
                        <NextImage
                            src="/images/workflow-paper.webp"
                            alt="Cream paper shapes connected by olive cords on a worktable"
                            fill
                            sizes="(max-width: 992px) 100vw, 48vw"
                            style={{ objectFit: 'cover' }}
                        />
                    </Box>

                    <Box maxW="590px" justifySelf={{ lg: 'center' }}>
                        <Heading
                            as="h2"
                            fontSize={{ base: '44px', md: '62px' }}
                            fontWeight="500"
                        >
                            A focused first month
                        </Heading>
                        <Text
                            mt={6}
                            color={offerMuted}
                            lineHeight="1.75"
                            fontSize="lg"
                        >
                            We start with one clear job and scope a first
                            version for about 30 days.
                        </Text>
                        <Box
                            mt={8}
                            pt={7}
                            borderTop="1px solid"
                            borderColor="moss.300"
                        >
                            <Text
                                fontFamily="heading"
                                fontSize={{ base: '3xl', md: '4xl' }}
                                fontWeight="500"
                            >
                                Projects from $5,000 USD
                            </Text>
                            <Text mt={4} color={offerMuted} lineHeight="1.7">
                                Ongoing engineering starts at $5,000 USD a
                                month, on a month-to-month basis.
                            </Text>
                        </Box>
                        <Button
                            as={Link}
                            href="#contact"
                            onClick={() => captureLeadIntent('offer')}
                            mt={7}
                            rightIcon={<FaArrowRight size="12px" />}
                            bg={offerButtonBg}
                            color={offerButtonColor}
                            _hover={{
                                bg: 'moss.700',
                                transform: 'translateY(-2px)',
                                textDecoration: 'none',
                            }}
                            _active={{ transform: 'translateY(0)' }}
                        >
                            Start a project
                        </Button>
                    </Box>
                </Grid>
            </Box>

            <Box
                as="section"
                id="calculator"
                py={{ base: 10, md: 14 }}
                scrollMarginTop="110px"
            >
                <Heading as="h2" fontSize="2xl" fontWeight="500">
                    A quick cost check
                </Heading>
                <Text mt={3} maxW="620px" color={muted} lineHeight="1.75">
                    For repetitive work, estimate the value of time a tool could
                    save.
                </Text>
                <ChakraLink
                    as={Link}
                    href="/workflow-automation-roi-calculator"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    mt={4}
                    fontWeight="700"
                    color={linkColor}
                >
                    Calculate workflow cost <FaArrowRight size="11px" />
                </ChakraLink>
            </Box>

            <Box
                as="section"
                py={{ base: 16, md: 22 }}
                borderTop="1px solid"
                borderColor={border}
            >
                <Box maxW="780px">
                    <Heading
                        as="h2"
                        fontSize={{ base: '42px', md: '54px' }}
                        fontWeight="500"
                    >
                        I&apos;m Adam
                    </Heading>
                    <Text mt={6} color={muted} lineHeight="1.8" fontSize="lg">
                        I&apos;m a software engineer in Vancouver. Over six
                        years I&apos;ve worked on media products, electrical
                        permitting tools, cloud systems, AI features and plenty
                        of less visible engineering. I studied security and
                        privacy at UVic and like working close to the people
                        using what I build
                    </Text>
                    <ChakraLink
                        as={Link}
                        href="/about"
                        display="inline-flex"
                        alignItems="center"
                        gap={2}
                        mt={5}
                        fontWeight="700"
                        color={linkColor}
                    >
                        More about me <FaArrowRight size="11px" />
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
