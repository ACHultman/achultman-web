import {
    Box,
    Container,
    Heading,
    Link,
    Text,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

function Privacy() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const border = useColorModeValue('paper.200', 'ink.700');
    const email = process.env.NEXT_PUBLIC_EMAIL || 'adam@hultman.dev';

    return (
        <>
            <NextSeo
                title="Privacy"
                description="How hultman.dev handles contact form and analytics data."
                canonical="https://hultman.dev/privacy"
                noindex
            />
            <Container maxW="760px" px={{ base: 4, md: 8 }} py={{ base: 14, md: 20 }}>
                <Text className="section-label">The plain-language version</Text>
                <Heading as="h1" mt={4} fontSize={{ base: '48px', md: '64px' }}>
                    Privacy
                </Heading>
                <Text mt={5} color={muted}>
                    Last updated September 4, 2026
                </Text>

                <VStack
                    align="stretch"
                    spacing={9}
                    mt={12}
                    pt={10}
                    borderTop="1px solid"
                    borderColor={border}
                >
                    <Box>
                        <Heading as="h2" fontSize="2xl">
                            What this site collects
                        </Heading>
                        <Text mt={3} color={muted} lineHeight="1.8">
                            If you use the contact form, the site collects the
                            name, email, company, budget range and workflow
                            details you submit. Basic product analytics may also
                            record page visits and interactions so I can
                            understand whether the site works.
                        </Text>
                    </Box>
                    <Box>
                        <Heading as="h2" fontSize="2xl">
                            How it is used
                        </Heading>
                        <Text mt={3} color={muted} lineHeight="1.8">
                            I use submitted details to respond to your inquiry,
                            assess project fit and keep a record of the
                            conversation. I do not sell personal information.
                        </Text>
                    </Box>
                    <Box>
                        <Heading as="h2" fontSize="2xl">
                            Service providers
                        </Heading>
                        <Text mt={3} color={muted} lineHeight="1.8">
                            This site uses Vercel for hosting and analytics,
                            PostHog for product analytics and an email provider
                            to deliver contact-form messages. Those providers
                            process limited data on my behalf under their own
                            privacy terms.
                        </Text>
                    </Box>
                    <Box>
                        <Heading as="h2" fontSize="2xl">
                            Your choices
                        </Heading>
                        <Text mt={3} color={muted} lineHeight="1.8">
                            To ask what information I have about you, correct it
                            or request deletion, email{' '}
                            <Link href={`mailto:${email}`} color="moss.700" fontWeight="700">
                                {email}
                            </Link>
                            .
                        </Text>
                    </Box>
                </VStack>
            </Container>
        </>
    );
}

export default Privacy;
