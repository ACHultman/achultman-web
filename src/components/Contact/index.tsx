import {
    Box,
    Flex,
    Grid,
    Heading,
    Link,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { FaArrowRight, FaLinkedinIn } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

import { captureLeadIntent } from '../../lib/analytics';
import ContactForm from './ContactForm';

function Contact() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const panel = useColorModeValue('paper.100', 'ink.900');
    const border = useColorModeValue('paper.300', 'ink.700');
    const formBg = useColorModeValue('paper.50', 'ink.950');
    const email = process.env.NEXT_PUBLIC_EMAIL || 'adam@hultman.dev';

    return (
        <Box
            bg={panel}
            borderRadius={{
                base: '32px 4px 32px 4px',
                md: '56px 4px 56px 4px',
            }}
            px={{ base: 6, md: 12, lg: 16 }}
            py={{ base: 14, md: 20 }}
        >
            <Grid
                templateColumns={{ base: '1fr', lg: '0.9fr 1.1fr' }}
                gap={{ base: 12, lg: 20 }}
                alignItems="start"
            >
                <Box>
                    <Heading
                        as="h2"
                        fontSize={{ base: '44px', md: '60px' }}
                        lineHeight="0.98"
                    >
                        Send me one workflow that wastes time every week.
                    </Heading>
                    <Text mt={7} maxW="520px" color={muted} lineHeight="1.75">
                        A rough description is enough. I&apos;ll reply within
                        one business day and tell you whether I think a 30-day
                        pilot makes sense.
                    </Text>

                    <VStack
                        align="stretch"
                        spacing={0}
                        mt={10}
                        maxW="520px"
                        borderTop="1px solid"
                        borderColor={border}
                    >
                        <Flex
                            as={Link}
                            href={`mailto:${email}`}
                            py={4}
                            gap={4}
                            align="center"
                            borderBottom="1px solid"
                            borderColor={border}
                            onClick={() =>
                                captureLeadIntent('contact_email', 'email')
                            }
                            _hover={{ color: 'moss.700' }}
                        >
                            <MdEmail aria-hidden="true" />
                            <Text flex="1">{email}</Text>
                            <FaArrowRight size="11px" aria-hidden="true" />
                        </Flex>
                        <Flex
                            as={Link}
                            href="https://www.linkedin.com/in/adam-hultman/"
                            isExternal
                            py={4}
                            gap={4}
                            align="center"
                            borderBottom="1px solid"
                            borderColor={border}
                            onClick={() =>
                                captureLeadIntent(
                                    'contact_linkedin',
                                    'linkedin'
                                )
                            }
                            _hover={{ color: 'moss.700' }}
                        >
                            <FaLinkedinIn aria-hidden="true" />
                            <Text flex="1">LinkedIn</Text>
                            <FaArrowRight size="11px" aria-hidden="true" />
                        </Flex>
                    </VStack>

                    <Text mt={6} color={muted} fontSize="sm">
                        Typical reply: one business day.
                    </Text>
                </Box>

                <Box
                    bg={formBg}
                    border="1px solid"
                    borderColor={border}
                    borderRadius="4px 24px 24px 24px"
                    p={{ base: 5, md: 8 }}
                >
                    <ContactForm />
                </Box>
            </Grid>
        </Box>
    );
}

export default Contact;
