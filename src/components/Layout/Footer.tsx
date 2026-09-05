import {
    Box,
    Container,
    Flex,
    Link,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';

function Footer() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const border = useColorModeValue('paper.200', 'ink.700');

    return (
        <Box as="footer" w="100%" pt={{ base: 16, md: 24 }} pb={8}>
            <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    justify="space-between"
                    align={{ base: 'flex-start', sm: 'center' }}
                    gap={5}
                    pt={7}
                    borderTop="1px solid"
                    borderColor={border}
                >
                    <Text color={muted} fontSize="sm">
                        © {new Date().getFullYear()} Adam Hultman, Vancouver, BC
                    </Text>
                    <Flex gap={6} fontSize="sm" fontWeight="600">
                        <Link as={NextLink} href="/about">
                            About
                        </Link>
                        <Link as={NextLink} href="/blog">
                            Writing
                        </Link>
                        <Link as={NextLink} href="/privacy">
                            Privacy
                        </Link>
                        <Link href="https://github.com/ACHultman" isExternal>
                            GitHub
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/adam-hultman/"
                            isExternal
                        >
                            LinkedIn
                        </Link>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
}

export default Footer;
