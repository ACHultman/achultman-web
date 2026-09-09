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
    const buttonBg = useColorModeValue('ink.900', 'paper.50');
    const buttonColor = useColorModeValue('paper.50', 'ink.900');
    const linkHover = useColorModeValue('moss.700', 'moss.200');

    return (
        <Box
            as="section"
            display="flex"
            alignItems="center"
            pt={{ base: 12, md: 16 }}
            pb={{ base: 16, md: 20 }}
        >
            <Flex
                direction={{ base: 'column', lg: 'row' }}
                gap={{ base: 12, lg: 16 }}
                align="center"
                w="100%"
            >
                <Box flex="1.15">
                    <Text mb={5} fontSize="lg" color={muted}>
                        Hi, I&apos;m Adam
                    </Text>
                    <Heading
                        as="h1"
                        maxW="640px"
                        fontSize={{ base: '44px', sm: '56px', md: '64px' }}
                        lineHeight="1.06"
                        letterSpacing="-0.045em"
                        fontWeight="500"
                        sx={{ textWrap: 'balance' }}
                    >
                        Software engineer building with AI
                    </Heading>

                    <Text
                        mt={6}
                        maxW="510px"
                        fontSize={{ base: 'lg', md: 'xl' }}
                        lineHeight="1.75"
                        color={muted}
                        sx={{ textWrap: 'pretty' }}
                    >
                        I build web products, internal tools and AI features.
                        Based in Vancouver.
                    </Text>

                    <Flex mt={9} gap={4} wrap="wrap" align="center">
                        <Button
                            as={Link}
                            href="#contact"
                            onClick={() => captureLeadIntent('hero')}
                            size="lg"
                            rightIcon={<FaArrowRight size="13px" />}
                            bg={buttonBg}
                            color={buttonColor}
                            px={7}
                            _hover={{
                                bg: 'moss.700',
                                color: 'paper.50',
                                transform: 'translateY(-2px)',
                                textDecoration: 'none',
                            }}
                            _active={{ transform: 'translateY(0)' }}
                        >
                            Get in touch
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
                                color: linkHover,
                            }}
                        >
                            See my work
                        </Button>
                    </Flex>
                </Box>

                <Box
                    flex="0.75"
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
