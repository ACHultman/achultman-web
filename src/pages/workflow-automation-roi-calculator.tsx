import {
    Box,
    Button,
    Container,
    Grid,
    Heading,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import Contact from '@components/Contact';
import WorkflowCostCalculator from '@components/Home/WorkflowCostCalculator';

const SITE_URL = 'https://hultman.dev';

const calculatorSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Workflow Automation ROI Calculator',
    url: `${SITE_URL}/workflow-automation-roi-calculator`,
    description:
        'A free calculator for estimating monthly workflow cost, capacity returned and payback on a $5,000 automation pilot.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern web browser.',
    isAccessibleForFree: true,
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    creator: {
        '@type': 'Person',
        name: 'Adam Hultman',
        url: SITE_URL,
    },
};

const FORMULAS = [
    {
        title: 'Monthly labour',
        formula: 'people × weekly hours × loaded hourly cost × 4.33',
        detail: 'The estimate uses 4.33 weeks per month',
    },
    {
        title: 'Capacity returned',
        formula: 'monthly labour × expected time reduction',
        detail: 'This treats the time as usable capacity, not lower payroll',
    },
    {
        title: 'Pilot payback',
        formula: '$5,000 ÷ monthly capacity returned',
        detail: 'The $5,000 is my published starting price, not a quote',
    },
];

const ESTIMATE_CHECKS = [
    {
        title: 'Use a weekly task',
        detail: 'Pick something that happens often. One-off work makes the monthly number look tidier than it is',
    },
    {
        title: 'Know where the time goes',
        detail: 'If the team gets hours back, decide what they would do with them',
    },
    {
        title: 'Leave decisions with people',
        detail: 'Keep approvals and higher-risk calls with the team. Estimate the routine work around them',
    },
];

function WorkflowAutomationRoiCalculatorPage() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const border = useColorModeValue('paper.300', 'ink.700');
    const formulaBg = useColorModeValue('moss.100', 'ink.900');

    return (
        <>
            <NextSeo
                title="Workflow Automation ROI Calculator | Adam Hultman"
                titleTemplate="%s"
                description="A free, plain-English calculator for checking whether a manual workflow might justify a $5,000 automation project."
                canonical={`${SITE_URL}/workflow-automation-roi-calculator`}
                openGraph={{
                    title: 'Workflow Automation ROI Calculator | Adam Hultman',
                    description:
                        'Check the rough cost of a manual workflow and the payback on a $5,000 automation project.',
                    url: `${SITE_URL}/workflow-automation-roi-calculator`,
                }}
            />
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(calculatorSchema),
                    }}
                    key="workflow-calculator-jsonld"
                />
            </Head>

            <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
                <Box
                    as="section"
                    pt={{ base: 14, md: 20 }}
                    pb={{ base: 6, md: 10 }}
                >
                    <Text className="section-label">
                        Workflow automation ROI calculator
                    </Text>
                    <Heading
                        as="h1"
                        mt={4}
                        maxW="900px"
                        fontSize={{ base: '44px', sm: '60px', md: '72px' }}
                        lineHeight={{ base: 1, md: 0.98 }}
                        letterSpacing="-0.04em"
                    >
                        Is this workflow worth fixing?
                    </Heading>
                    <Text
                        mt={7}
                        maxW="640px"
                        color={muted}
                        fontSize={{ base: 'lg', md: 'xl' }}
                        lineHeight="1.75"
                    >
                        Add four rough numbers before you scope a project or
                        book a call.
                    </Text>
                    <Button
                        as={Link}
                        href="#calculator"
                        mt={8}
                        bg="ink.900"
                        color="paper.50"
                        _hover={{
                            bg: 'moss.700',
                            transform: 'translateY(-2px)',
                            textDecoration: 'none',
                        }}
                        _active={{ transform: 'translateY(0)' }}
                    >
                        Try the calculator
                    </Button>
                </Box>

                <WorkflowCostCalculator showMethodLink={false} />

                <Box
                    as="section"
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
                            >
                                How the estimate works
                            </Heading>
                            <Text
                                mt={6}
                                maxW="500px"
                                color={muted}
                                lineHeight="1.75"
                            >
                                This is a quick payback check, not a full ROI
                                forecast. Ongoing costs, adoption and errors
                                still matter.
                            </Text>
                        </Box>
                        <VStack align="stretch" spacing={0}>
                            {FORMULAS.map(({ title, formula, detail }) => (
                                <Box
                                    key={title}
                                    py={7}
                                    borderBottom="1px solid"
                                    borderColor={border}
                                >
                                    <Heading as="h3" fontSize="2xl">
                                        {title}
                                    </Heading>
                                    <Text
                                        mt={4}
                                        px={4}
                                        py={3}
                                        bg={formulaBg}
                                        borderRadius="6px"
                                        fontFamily="mono"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        overflowWrap="anywhere"
                                    >
                                        {formula}
                                    </Text>
                                    <Text mt={4} color={muted} lineHeight="1.7">
                                        {detail}
                                    </Text>
                                </Box>
                            ))}
                        </VStack>
                    </Grid>
                </Box>

                <Box
                    as="section"
                    py={{ base: 16, md: 24 }}
                    borderTop="1px solid"
                    borderColor={border}
                >
                    <Heading
                        as="h2"
                        maxW="760px"
                        fontSize={{ base: '42px', md: '58px' }}
                    >
                        Before you trust the answer
                    </Heading>
                    <Grid
                        mt={{ base: 10, md: 14 }}
                        templateColumns={{ base: '1fr', lg: '0.75fr 1.25fr' }}
                        columnGap={{ base: 0, lg: 20 }}
                    >
                        {ESTIMATE_CHECKS.map(({ title, detail }) => (
                            <Box
                                key={title}
                                display="grid"
                                gridColumn={{ base: '1', lg: '1 / -1' }}
                                gridTemplateColumns={{
                                    base: '1fr',
                                    lg: '0.75fr 1.25fr',
                                }}
                                columnGap={{ base: 0, lg: 20 }}
                                py={7}
                                borderBottom="1px solid"
                                borderColor={border}
                            >
                                <Heading as="h3" fontSize="2xl">
                                    {title}
                                </Heading>
                                <Text
                                    mt={{ base: 3, lg: 0 }}
                                    color={muted}
                                    lineHeight="1.75"
                                    maxW="680px"
                                >
                                    {detail}
                                </Text>
                            </Box>
                        ))}
                    </Grid>
                    <Text mt={8} maxW="760px" color={muted} lineHeight="1.75">
                        If the numbers only work with heroic assumptions, pick
                        another workflow.
                    </Text>
                </Box>

                <Box id="contact" scrollMarginTop="110px">
                    <Contact />
                </Box>
            </Container>
        </>
    );
}

export default WorkflowAutomationRoiCalculatorPage;
