import {
    Box,
    Grid,
    Heading,
    Link as ChakraLink,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

import Contact from '../Contact';
import FeaturedWork from './FeaturedWork';
import Hero from './Hero';

const APPROACH = [
    {
        title: 'Product engineering',
        detail: 'I like working with the people using the product, figuring out what matters and carrying that through to the implementation.',
    },
    {
        title: 'AI in practice',
        detail: "I've built AI features into existing workflows. I'm interested in where models help, how they fail and what it takes to make them useful.",
    },
    {
        title: 'Quality and reliability',
        detail: 'Tests, code review, deployment checks and production fixes are part of the work, too.',
    },
];

function Home() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const linkColor = useColorModeValue('moss.700', 'moss.200');
    const border = useColorModeValue('paper.200', 'ink.700');
    const panel = useColorModeValue('moss.100', 'moss.900');

    return (
        <Box w="100%">
            <Hero />
            <FeaturedWork />

            <Box
                as="section"
                id="fit"
                py={{ base: 14, md: 20 }}
                borderTop="1px solid"
                borderColor={border}
            >
                <Heading
                    as="h2"
                    fontSize={{ base: '36px', md: '48px' }}
                    fontWeight="500"
                    mb={{ base: 8, md: 10 }}
                >
                    How I work
                </Heading>
                <Box maxW="1000px">
                    {APPROACH.map((item) => (
                        <Grid
                            key={item.title}
                            templateColumns={{ base: '1fr', md: '0.7fr 1.3fr' }}
                            gap={{ base: 3, md: 12 }}
                            py={6}
                        >
                            <Heading as="h3" fontSize="2xl">
                                {item.title}
                            </Heading>
                            <Text color={muted} lineHeight="1.75">
                                {item.detail}
                            </Text>
                        </Grid>
                    ))}
                </Box>
            </Box>

            <Box
                as="section"
                id="offer"
                bg={panel}
                borderRadius="18px"
                px={{ base: 6, md: 12 }}
                py={{ base: 10, md: 14 }}
                mb={{ base: 16, md: 24 }}
            >
                <Box maxW="760px">
                    <Heading
                        as="h2"
                        fontSize={{ base: '32px', md: '40px' }}
                        fontWeight="500"
                    >
                        A little more about me
                    </Heading>
                    <Text mt={5} color={muted} lineHeight="1.8" fontSize="lg">
                        Six years in software so far. I studied software
                        engineering at UVic, with a focus on security and
                        privacy. Outside of work, I run, travel and go to
                        stand-up shows.
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
                        More about me{' '}
                        <FaArrowRight size="11px" aria-hidden="true" />
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
