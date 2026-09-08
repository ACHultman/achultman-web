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
import { FaArrowRight } from 'react-icons/fa';
import { captureLeadIntent } from '../../lib/analytics';

function Hero() {
    const muted = useColorModeValue('ink.600', 'paper.300');
    const portraitBg = useColorModeValue('moss.100', 'moss.900');
    const portraitBorder = useColorModeValue('ink.900', 'paper.100');

    return (
        <Box
            as="section"
            minH={{ base: 'auto', lg: 'calc(100dvh - 76px)' }}
            display="flex"
            alignItems="center"
            py={{ base: 12, md: 16, lg: 20 }}
        >
            <Flex
                direction={{ base: 'column', lg: 'row' }}
                gap={{ base: 14, lg: 24 }}
                align="center"
                w="100%"
            >
                <Box flex="1.15">
                    <Heading
                        as="h1"
                        maxW="760px"
                        fontSize={{ base: '54px', sm: '66px', md: '82px' }}
                        lineHeight={{ base: 0.96, md: 0.92 }}
                        letterSpacing="-0.055em"
                        fontWeight="500"
                        sx={{ textWrap: 'balance' }}
                    >
                        Software for the awkward bits
                    </Heading>

                    <Text
                        mt={{ base: 7, md: 9 }}
                        maxW="630px"
                        fontSize={{ base: 'lg', md: 'xl' }}
                        lineHeight="1.75"
                        color={muted}
                        sx={{ textWrap: 'pretty' }}
                    >
                        I&apos;m Adam. I build internal tools, AI features and
                        web products that fit the way a team already works.
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
                            Start a project
                        </Button>
                        <Button
                            as={Link}
                            href="#work"
                            size="lg"
                            variant="ghost"
                            rightIcon={<FaArrowRight size="12px" />}
                            color={muted}
                            _hover={{
                                bg: 'transparent',
                                color: 'moss.600',
                            }}
                        >
                            See my work
                        </Button>
                    </Flex>
                </Box>

                <Box
                    flex="0.85"
                    w={{ base: '92%', sm: '72%', lg: 'auto' }}
                    maxW={{ base: '460px', lg: '410px' }}
                    alignSelf={{ base: 'center', lg: 'flex-end' }}
                    position="relative"
                >
                    <Box
                        position="absolute"
                        inset="18px 18px -18px -18px"
                        borderRadius="18px 18px 92px 18px"
                        bg={portraitBg}
                    />
                    <Box
                        position="relative"
                        aspectRatio="4 / 5"
                        overflow="hidden"
                        borderRadius="18px 18px 92px 18px"
                        border="1px solid"
                        borderColor={portraitBorder}
                        filter="saturate(0.76) contrast(1.04)"
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
                </Box>
            </Flex>
        </Box>
    );
}

export default Hero;
