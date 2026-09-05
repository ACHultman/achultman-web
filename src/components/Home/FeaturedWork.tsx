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
        title: 'Editorial AI deployed inside WordPress',
        context: 'Geny, Assembly Digital',
        description:
            'An LLM-powered content system deployed at the edge inside WordPress, designed around the way editorial teams already worked.',
        evidence: 'Used in production by Canadian media teams.',
        disciplines: 'Product engineering, AI integration, AWS',
    },
    {
        title: 'Critical flows checked on every pull request',
        context: 'PR QA Copilot, open source',
        description:
            'A GitHub Action that runs repository-defined browser journeys against preview deployments and returns the verdict, runtime failures and screenshots on the pull request.',
        evidence:
            'Released as a versioned action with its own hosted journey test.',
        disciplines: 'Playwright, GitHub Actions, Next.js',
        href: 'https://pr-qa-copilot.vercel.app',
    },
    {
        title: 'An open-source Assistants API reference',
        context: 'Wanderlust, open source',
        description:
            "A Next.js recreation of OpenAI's DevDay Wanderlust demo, built as a readable reference for the Assistants API.",
        evidence: '60 GitHub stars and 20 public forks as of September 2026.',
        disciplines: 'Next.js, TypeScript, applied AI',
        href: 'https://github.com/ACHultman/wanderlust',
    },
    {
        title: 'Complex field rules made usable',
        context: 'Kopperfield, current role',
        description:
            'Permit-ready product workflows for electricians, including load calculations, single-line diagrams and the paperwork that delays jobs.',
        evidence: 'Built around the rules electricians deal with on every job.',
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
                    AI and product work in production.
                </Heading>
                <Text mt={5} maxW="520px" color={muted} lineHeight="1.75">
                    Each project had to fit the existing workflow and survive
                    outside a demo.
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
