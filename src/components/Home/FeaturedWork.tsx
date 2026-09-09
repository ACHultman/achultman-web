import {
    Box,
    Grid,
    Heading,
    Link,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

const EXPERIENCE = [
    {
        company: 'Kopperfield',
        context: 'Current role',
        description:
            'I work on software for electricians, including load calculations, single-line diagrams and permit paperwork.',
        detail: 'My work spans product development, engineering quality and reliability.',
    },
    {
        company: 'Assembly Digital',
        context: 'Previously',
        description: 'I worked on media products and the systems behind them.',
        detail: 'One early AI experiment was Geny, a small internal tool I built for drafting in WordPress.',
    },
];

function FeaturedWork() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const border = useColorModeValue('paper.200', 'ink.700');
    const surface = useColorModeValue('paper.100', 'ink.900');
    const linkColor = useColorModeValue('moss.700', 'moss.200');

    return (
        <Box
            as="section"
            id="work"
            py={{ base: 14, md: 20 }}
            borderTop="1px solid"
            borderColor={border}
        >
            <Heading
                as="h2"
                mb={{ base: 10, md: 12 }}
                maxW="760px"
                fontSize={{ base: '36px', md: '48px' }}
                fontWeight="500"
            >
                A few things I&apos;ve worked on
            </Heading>

            <Grid
                templateColumns={{ base: '1fr', lg: '1.15fr 0.85fr' }}
                gap={{ base: 12, lg: 20 }}
                alignItems="start"
            >
                <Box>
                    {EXPERIENCE.map((experience, index) => (
                        <Box
                            as="article"
                            key={experience.company}
                            pt={index === 0 ? 0 : 8}
                            pb={8}
                            borderBottom={index === 0 ? '1px solid' : undefined}
                            borderColor={border}
                        >
                            <Text fontSize="sm" color={muted}>
                                {experience.context}
                            </Text>
                            <Heading as="h3" mt={2} fontSize="3xl">
                                {experience.company}
                            </Heading>
                            <Text mt={4} color={muted} lineHeight="1.75">
                                {experience.description}
                            </Text>
                            <Text mt={3} color={muted} lineHeight="1.75">
                                {experience.detail}
                            </Text>
                        </Box>
                    ))}
                </Box>

                <Box as="article">
                    <Link
                        href="https://pr-qa-copilot.vercel.app"
                        isExternal
                        display="block"
                        bg={surface}
                        borderRadius="18px"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={border}
                        _hover={{ borderColor: linkColor }}
                        transition="border-color 180ms ease"
                    >
                        <Box position="relative" aspectRatio="16 / 10">
                            <NextImage
                                src="/images/pr-qa-copilot.webp"
                                alt="PR QA Copilot project page showing an automated browser test report"
                                fill
                                sizes="(max-width: 992px) 100vw, 460px"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                }}
                            />
                        </Box>
                    </Link>
                    <Text mt={6} fontSize="sm" color={muted}>
                        Open-source project
                    </Text>
                    <Heading as="h3" mt={2} fontSize="3xl">
                        <Link
                            href="https://pr-qa-copilot.vercel.app"
                            isExternal
                            _hover={{ color: linkColor }}
                        >
                            PR QA Copilot{' '}
                            <FaArrowUpRightFromSquare
                                aria-hidden="true"
                                size="13px"
                                style={{ display: 'inline' }}
                            />
                        </Link>
                    </Heading>
                    <Text mt={4} color={muted} lineHeight="1.75">
                        A GitHub Action that runs browser checks against a
                        preview and adds results and screenshots to the pull
                        request.
                    </Text>
                    <Text mt={4} fontSize="sm" color={muted}>
                        Playwright, GitHub Actions, Next.js
                    </Text>
                </Box>
            </Grid>
        </Box>
    );
}

export default FeaturedWork;
