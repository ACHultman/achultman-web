import {
    Box,
    Flex,
    Heading,
    Link,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

interface CaseNote {
    title: string;
    context: string;
    description: string;
    evidence: string;
    disciplines: string;
    href?: string;
}

const CASE_NOTES: CaseNote[] = [
    {
        title: 'Geny in WordPress',
        context: 'Geny, Assembly Digital',
        description:
            'An AI content tool built into WordPress, where the editors were already working',
        evidence: 'Used by Canadian media teams',
        disciplines: 'Product engineering, AI integration, AWS',
    },
    {
        title: 'PR checks in a browser',
        context: 'PR QA Copilot, open source',
        description:
            'A GitHub Action that runs browser journeys against a preview and puts the result and screenshots on the pull request',
        evidence: 'Published as a versioned action with a live test',
        disciplines: 'Playwright, GitHub Actions, Next.js',
        href: 'https://pr-qa-copilot.vercel.app',
    },
    {
        title: 'Wanderlust',
        context: 'Wanderlust, open source',
        description:
            "A readable Next.js recreation of OpenAI's DevDay Assistants API demo",
        evidence: '60 stars and 20 forks on GitHub as of September 2026',
        disciplines: 'Next.js, TypeScript, applied AI',
        href: 'https://github.com/ACHultman/wanderlust',
    },
    {
        title: 'Permit tools for electricians',
        context: 'Kopperfield, current role',
        description:
            'Load calculations, single-line diagrams and permit paperwork for electricians',
        evidence: 'Current product work at Kopperfield',
        disciplines: 'React, Node.js, PostgreSQL',
    },
];

function CaseRow({ caseNote }: { caseNote: CaseNote }) {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const border = useColorModeValue('paper.200', 'ink.700');

    return (
        <Box
            py={{ base: 8, md: 10 }}
            borderTop="1px solid"
            borderColor={border}
        >
            <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={{ base: 5, md: 14 }}
                align="flex-start"
            >
                <Box flex="1" maxW="470px">
                    <Text mb={2} fontSize="sm" fontWeight="600" color={muted}>
                        {caseNote.context}
                    </Text>
                    <Heading as="h3" fontSize={{ base: '2xl', md: '3xl' }}>
                        {caseNote.href ? (
                            <Link
                                href={caseNote.href}
                                isExternal
                                textDecoration="none"
                                _hover={{ color: 'moss.600' }}
                            >
                                {caseNote.title}{' '}
                                <FaArrowUpRightFromSquare
                                    aria-hidden="true"
                                    size="12px"
                                    style={{ display: 'inline' }}
                                />
                            </Link>
                        ) : (
                            caseNote.title
                        )}
                    </Heading>
                </Box>
                <Box flex="1" maxW="470px">
                    <Text lineHeight="1.75" color={muted}>
                        {caseNote.description}
                    </Text>
                    <Text mt={4} fontWeight="700">
                        {caseNote.evidence}
                    </Text>
                    <Text mt={4} fontSize="sm" color={muted}>
                        {caseNote.disciplines}
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
}

function FeaturedWork() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const border = useColorModeValue('paper.200', 'ink.700');

    return (
        <Box as="section" id="work" py={{ base: 16, md: 24 }}>
            <Box mb={{ base: 10, md: 16 }}>
                <Heading
                    as="h2"
                    fontSize={{ base: '42px', md: '58px' }}
                    maxW="720px"
                >
                    A few things I&apos;ve built
                </Heading>
                <Text mt={5} maxW="520px" color={muted} lineHeight="1.75">
                    Some at work, some open source
                </Text>
            </Box>

            <Box borderBottom="1px solid" borderColor={border}>
                {CASE_NOTES.map((caseNote) => (
                    <CaseRow key={caseNote.title} caseNote={caseNote} />
                ))}
            </Box>
        </Box>
    );
}

export default FeaturedWork;
