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

interface CaseNote {
    title: string;
    context: string;
    description: string;
    evidence: string;
    disciplines: string;
    href?: string;
}

const FEATURED_CASE: CaseNote & { href: string } = {
    title: 'PR checks in a browser',
    context: 'PR QA Copilot, open source',
    description:
        'A GitHub Action that runs browser journeys against a preview and puts the result and screenshots on the pull request',
    evidence: 'Published as a versioned action with a live test',
    disciplines: 'Playwright, GitHub Actions, Next.js',
    href: 'https://pr-qa-copilot.vercel.app',
};

const OTHER_CASES: CaseNote[] = [
    {
        title: 'Geny inside WordPress',
        context: 'Geny, Assembly Digital',
        description:
            'An AI content tool placed where editors were already drafting and publishing',
        evidence: 'Used by Canadian media teams',
        disciplines: 'Product engineering, AI integration, AWS',
    },
    {
        title: 'Permit tools for electricians',
        context: 'Kopperfield, current role',
        description:
            'Load calculations, single-line diagrams and permit paperwork for electricians',
        evidence: 'Current product work at Kopperfield',
        disciplines: 'React, Node.js, PostgreSQL',
    },
    {
        title: 'Wanderlust',
        context: 'Open source',
        description:
            "A readable Next.js recreation of OpenAI's DevDay Assistants API demo",
        evidence: '60 stars and 20 forks on GitHub as of September 2026',
        disciplines: 'Next.js, TypeScript, applied AI',
        href: 'https://github.com/ACHultman/wanderlust',
    },
];

function CaseTitle({ caseNote }: { caseNote: CaseNote }) {
    if (!caseNote.href) return <>{caseNote.title}</>;

    return (
        <Link
            href={caseNote.href}
            isExternal
            textDecoration="none"
            _hover={{ color: 'moss.600' }}
        >
            {caseNote.title}{' '}
            <FaArrowUpRightFromSquare
                aria-hidden="true"
                size="11px"
                style={{ display: 'inline' }}
            />
        </Link>
    );
}

function FeaturedWork() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const border = useColorModeValue('paper.200', 'ink.700');
    const surface = useColorModeValue('paper.100', 'ink.900');

    return (
        <Box
            as="section"
            id="work"
            py={{ base: 16, md: 24 }}
            borderTop="1px solid"
            borderColor={border}
        >
            <Box mb={{ base: 10, md: 14 }} maxW="680px">
                <Heading
                    as="h2"
                    fontSize={{ base: '42px', md: '58px' }}
                    fontWeight="500"
                >
                    Work that left the prototype stage
                </Heading>
                <Text mt={5} maxW="520px" color={muted} lineHeight="1.75">
                    Product work, infrastructure and a couple of open-source
                    experiments
                </Text>
            </Box>

            <Grid
                templateColumns={{ base: '1fr', lg: '1.15fr 0.85fr' }}
                gap={{ base: 12, lg: 16 }}
                alignItems="start"
            >
                <Box>
                    <Link
                        href={FEATURED_CASE.href}
                        isExternal
                        display="block"
                        bg={surface}
                        borderRadius="18px"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={border}
                        _hover={{
                            transform: 'translateY(-3px)',
                            boxShadow: '0 18px 50px rgba(63, 74, 53, 0.13)',
                        }}
                        transition="transform 220ms ease, box-shadow 220ms ease"
                    >
                        <Box position="relative" aspectRatio="16 / 10">
                            <NextImage
                                src="/images/pr-qa-copilot.webp"
                                alt="PR QA Copilot product page showing an automated browser test report"
                                fill
                                sizes="(max-width: 992px) 100vw, 58vw"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                }}
                            />
                        </Box>
                    </Link>
                    <Text mt={6} fontSize="sm" fontWeight="600" color={muted}>
                        {FEATURED_CASE.context}
                    </Text>
                    <Heading
                        as="h3"
                        mt={2}
                        fontSize={{ base: '3xl', md: '4xl' }}
                    >
                        <CaseTitle caseNote={FEATURED_CASE} />
                    </Heading>
                    <Text mt={4} maxW="620px" color={muted} lineHeight="1.7">
                        {FEATURED_CASE.description}
                    </Text>
                    <Text mt={4} fontWeight="700">
                        {FEATURED_CASE.evidence}
                    </Text>
                    <Text mt={3} fontSize="sm" color={muted}>
                        {FEATURED_CASE.disciplines}
                    </Text>
                </Box>

                <Box borderTop="1px solid" borderColor={border}>
                    {OTHER_CASES.map((caseNote) => (
                        <Box
                            key={caseNote.title}
                            py={{ base: 7, md: 8 }}
                            borderBottom="1px solid"
                            borderColor={border}
                        >
                            <Text fontSize="sm" fontWeight="600" color={muted}>
                                {caseNote.context}
                            </Text>
                            <Heading as="h3" mt={2} fontSize="2xl">
                                <CaseTitle caseNote={caseNote} />
                            </Heading>
                            <Text mt={3} color={muted} lineHeight="1.65">
                                {caseNote.description}
                            </Text>
                            <Text mt={4} fontSize="sm" fontWeight="700">
                                {caseNote.evidence}
                            </Text>
                            <Text mt={2} fontSize="sm" color={muted}>
                                {caseNote.disciplines}
                            </Text>
                        </Box>
                    ))}
                </Box>
            </Grid>
        </Box>
    );
}

export default FeaturedWork;
