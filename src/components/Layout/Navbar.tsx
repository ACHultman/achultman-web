import {
    Box,
    Button,
    Container,
    Flex,
    HStack,
    IconButton,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

import { captureLeadIntent } from '../../lib/analytics';

const NAV_LINKS = [
    { name: 'Work', route: '/#work' },
    { name: 'Approach', route: '/#fit' },
    { name: 'Writing', route: '/blog' },
    { name: 'Lab', route: '/labs' },
];

function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const headerBg = useColorModeValue(
        'rgba(247, 244, 236, 0.88)',
        'rgba(17, 20, 15, 0.88)'
    );
    const border = useColorModeValue('paper.200', 'ink.700');
    const muted = useColorModeValue('ink.600', 'paper.300');
    const brandBg = useColorModeValue('ink.900', 'paper.50');
    const brandColor = useColorModeValue('paper.50', 'ink.900');
    const navHover = useColorModeValue('paper.100', 'ink.800');
    const navHoverColor = useColorModeValue('ink.900', 'paper.50');

    return (
        <Box
            as="header"
            position="sticky"
            top="0"
            zIndex="sticky"
            w="100%"
            bg={headerBg}
            backdropFilter="blur(18px)"
            borderBottom="1px solid"
            borderColor={border}
        >
            <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
                <Flex
                    h={{ base: '70px', md: '76px' }}
                    align="center"
                    justify="space-between"
                >
                    <NextLink href="/">
                        <HStack spacing={3} _hover={{ color: 'moss.700' }}>
                            <Box
                                w="28px"
                                h="28px"
                                display="grid"
                                placeItems="center"
                                bg={brandBg}
                                color={brandColor}
                                borderRadius="50% 50% 44% 56%"
                                fontFamily="heading"
                                fontSize="sm"
                            >
                                A
                            </Box>
                            <Box>
                                <Text
                                    fontFamily="heading"
                                    fontSize="lg"
                                    lineHeight="1"
                                >
                                    Adam Hultman
                                </Text>
                                <Text
                                    mt="3px"
                                    fontSize="10px"
                                    color={muted}
                                    letterSpacing="0.08em"
                                >
                                    Software engineer
                                </Text>
                            </Box>
                        </HStack>
                    </NextLink>

                    <HStack
                        as="nav"
                        spacing={1}
                        display={{ base: 'none', md: 'flex' }}
                    >
                        {NAV_LINKS.map((link) => (
                            <Button
                                key={link.name}
                                as={NextLink}
                                href={link.route}
                                variant="ghost"
                                size="sm"
                                color={muted}
                                fontWeight="600"
                                _hover={{ color: navHoverColor, bg: navHover }}
                            >
                                {link.name}
                            </Button>
                        ))}
                        <Button
                            as={NextLink}
                            href="/#contact"
                            ml={3}
                            size="sm"
                            bg={brandBg}
                            color={brandColor}
                            onClick={() => captureLeadIntent('navbar_desktop')}
                            _hover={{ bg: 'moss.700', color: 'paper.50' }}
                        >
                            Get in touch
                        </Button>
                    </HStack>

                    <IconButton
                        display={{ base: 'inline-flex', md: 'none' }}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                        aria-controls="mobile-navigation"
                        icon={isOpen ? <FaTimes /> : <FaBars />}
                        variant="ghost"
                        onClick={isOpen ? onClose : onOpen}
                    />
                </Flex>

                {isOpen ? (
                    <Stack
                        as="nav"
                        id="mobile-navigation"
                        pb={5}
                        spacing={1}
                        display={{ md: 'none' }}
                    >
                        {NAV_LINKS.map((link) => (
                            <Button
                                key={link.name}
                                as={NextLink}
                                href={link.route}
                                variant="ghost"
                                justifyContent="flex-start"
                                onClick={onClose}
                            >
                                {link.name}
                            </Button>
                        ))}
                        <Button
                            as={NextLink}
                            href="/#contact"
                            bg={brandBg}
                            color={brandColor}
                            onClick={() => {
                                captureLeadIntent('navbar_mobile');
                                onClose();
                            }}
                            _hover={{ bg: 'moss.700', color: 'paper.50' }}
                        >
                            Get in touch
                        </Button>
                    </Stack>
                ) : null}
            </Container>
        </Box>
    );
}

export default Navbar;
