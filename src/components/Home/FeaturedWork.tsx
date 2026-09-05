import {
    Box,
    Flex,
    Heading,
    Link,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

interface CaseNote {
    number: string;
    title: string;
    context: string;
    description: string;
    evidence: string;
    disciplines: string;
    href?: string;
}

const CASE_NOTES: CaseNote[] = [
    {
        number: '01',
        title: 'Production AI inside an editorial workflow',
        context: 'Geny · Assembly Digital',
        description:
            'An LLM-powered content system deployed at the edge inside WordPress, designed around the way editorial teams already worked.',
        evidence: 'Used by major Canadian media clients in production.',
        disciplines: 'Product engineering · AI integration · AWS',
    },
    {
        number: '02',
        title: 'A reusable foundation for assistant products',
        context: 'Wanderlust · Open source',
        description:
            'A Next.js implementation of the OpenAI Assistants API that became the base for further internal and independent tools.',
        evidence: '59 GitHub stars and the foundation for 10+ projects.',
        disciplines: 'Next.js · TypeScript · Applied AI',
        href: 'https://github.com/ACHultman/wanderlust',
    },
    {
        number: '03',
        title: 'Complex field rules made usable',
        context: 'Kopperfield · Current role',
        description:
            'Permit-ready product workflows for electricians, including load calculations, single-line diagrams and the paperwork that delays jobs.',
        evidence: 'Built around the rules electricians deal with on every job.',
        disciplines: 'React · Node.js · PostgreSQL',
    },
];

const MotionBox = motion.create(Box);

function CaseRow({ caseNote }: { caseNote: CaseNote }) {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const border = useColorModeValue('paper.200', 'ink.700');

    return (
        <MotionBox
            py={{ base: 8, md: 10 }}
            borderTop="1px solid"
            borderColor={border}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
        >
            <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={{ base: 5, md: 10 }}
                align="flex-start"
            >
                <Text
                    w={{ md: '54px' }}
                    fontSize="sm"
                    fontWeight="700"
                    color="moss.600"
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                >
                    {caseNote.number}
                </Text>
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
        </MotionBox>
    );
}

function FeaturedWork() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const border = useColorModeValue('paper.200', 'ink.700');

    return (
        <Box as="section" id="work" py={{ base: 16, md: 24 }}>
            <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                gap={6}
                mb={{ base: 10, md: 16 }}
            >
                <Box>
                    <Text className="section-label">Selected case notes</Text>
                    <Heading
                        as="h2"
                        mt={4}
                        fontSize={{ base: '42px', md: '58px' }}
                        maxW="620px"
                    >
                        A few things I have shipped.
                    </Heading>
                </Box>
                <Text
                    maxW="390px"
                    alignSelf={{ md: 'flex-end' }}
                    color={muted}
                    lineHeight="1.75"
                >
                    Each one had to fit the job and hold up outside a demo.
                </Text>
            </Flex>

            <Box borderBottom="1px solid" borderColor={border}>
                {CASE_NOTES.map((caseNote) => (
                    <CaseRow key={caseNote.number} caseNote={caseNote} />
                ))}
            </Box>
        </Box>
    );
}

export default FeaturedWork;
