import {
    Box,
    Button,
    Flex,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import Link from 'next/link';
import { FaArrowDown, FaArrowRight } from 'react-icons/fa';
import { captureLeadIntent } from '../../lib/analytics';

function Hero() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const portraitBg = useColorModeValue('moss.100', 'moss.900');
    const noteBg = useColorModeValue('paper.50', 'ink.900');
    const noteBorder = useColorModeValue('ink.900', 'paper.100');

    return (
        <Box
            as="section"
            minH={{ base: 'auto', lg: 'calc(100dvh - 88px)' }}
            display="flex"
            alignItems="center"
            py={{ base: 14, md: 20, lg: 24 }}
        >
            <Flex
                direction={{ base: 'column', lg: 'row' }}
                gap={{ base: 14, lg: 20 }}
                align="center"
                w="100%"
            >
                <Box flex="1.2">
                    <Heading
                        as="h1"
                        maxW="780px"
                        fontSize={{ base: '48px', sm: '60px', md: '76px' }}
                        lineHeight={{ base: 0.98, md: 0.94 }}
                        letterSpacing="-0.045em"
                        fontWeight="400"
                        sx={{ textWrap: 'balance' }}
                    >
                        I build small tools for costly workflows.
                    </Heading>

                    <Text
                        mt={{ base: 7, md: 9 }}
                        maxW="630px"
                        fontSize={{ base: 'lg', md: 'xl' }}
                        lineHeight="1.75"
                        color={muted}
                        sx={{ textWrap: 'pretty' }}
                    >
                        In 30 days, I put one useful AI tool into your
                        team&apos;s hands, built around the systems they already
                        use.
                    </Text>

                    <Flex mt={9} gap={4} wrap="wrap" align="center">
                        <Button
                            as={Link}
                            href="#contact"
                            onClick={() => captureLeadIntent('hero')}
                            size="lg"
                            rightIcon={<FaArrowRight size="13px" />}
                            bg="ink.900"
                            color="paper.50"
                            px={7}
                            _hover={{
                                bg: 'moss.700',
                                transform: 'translateY(-2px)',
                                textDecoration: 'none',
                            }}
                            _active={{ transform: 'translateY(0)' }}
                        >
                            Send the workflow
                        </Button>
                        <Button
                            as={Link}
                            href="#work"
                            size="lg"
                            variant="ghost"
                            rightIcon={<FaArrowDown size="12px" />}
                            color={muted}
                            _hover={{
                                bg: 'transparent',
                                color: 'moss.600',
                            }}
                        >
                            See the work
                        </Button>
                    </Flex>
                </Box>

                <Box
                    flex="0.8"
                    w={{ base: '100%', sm: '76%', lg: 'auto' }}
                    maxW={{ base: '460px', lg: '390px' }}
                    alignSelf={{ base: 'center', lg: 'flex-end' }}
                    position="relative"
                >
                    <Box
                        position="absolute"
                        inset="-18px 24px 24px -18px"
                        borderRadius="48% 52% 44% 56% / 55% 42% 58% 45%"
                        bg={portraitBg}
                        transform="rotate(-3deg)"
                    />
                    <Box
                        position="relative"
                        aspectRatio="4 / 5"
                        overflow="hidden"
                        borderRadius="46% 54% 43% 57% / 39% 42% 58% 61%"
                        filter="saturate(0.72) contrast(1.04)"
                    >
                        <NextImage
                            src="/images/adam.jpg"
                            alt="Portrait of Adam Hultman"
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                            sizes="(max-width: 992px) 76vw, 390px"
                        />
                    </Box>
                    <Box
                        position="absolute"
                        right={{ base: '-8px', md: '-28px' }}
                        bottom={{ base: '-24px', md: '22px' }}
                        bg={noteBg}
                        border="1px solid"
                        borderColor={noteBorder}
                        borderRadius="2px 14px 14px 14px"
                        px={5}
                        py={4}
                        maxW="220px"
                        boxShadow="12px 14px 0 rgba(63, 74, 53, 0.12)"
                        transform="rotate(1.5deg)"
                    >
                        <Text
                            fontFamily="heading"
                            fontSize="xl"
                            lineHeight="1.1"
                        >
                            Adam Hultman
                        </Text>
                        <Text mt={1} fontSize="xs" color={muted}>
                            6 years shipping software across media, energy and
                            field operations
                        </Text>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
}

export default Hero;
