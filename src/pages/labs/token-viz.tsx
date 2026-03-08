import { useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  SlideFade,
  Divider,
  Flex,
  IconButton,
  Link,
  Tooltip,
  Button,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import Paragraph from '@components/Paragraph';
import { getMockCompletion, MOCK_COMPLETIONS, type TokenPosition } from '@data/tokenMockData';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function probabilityToColor(p: number, isLight: boolean): string {
  if (p >= 0.7) return isLight ? 'green.100' : 'green.800';
  if (p >= 0.4) return isLight ? 'yellow.100' : 'yellow.800';
  if (p >= 0.2) return isLight ? 'orange.100' : 'orange.800';
  return isLight ? 'red.100' : 'red.800';
}

function probabilityToBarColor(p: number): string {
  if (p >= 0.7) return 'green.400';
  if (p >= 0.4) return 'yellow.400';
  if (p >= 0.2) return 'orange.400';
  return 'red.400';
}

function TokenBar({
  token,
  probability,
  isSelected,
  maxWidth,
}: {
  token: string;
  probability: number;
  isSelected: boolean;
  maxWidth: number;
}) {
  const barBg = probabilityToBarColor(probability);
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const selectedBg = useColorModeValue('green.50', 'green.900');

  return (
    <MotionFlex
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: '100%', opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      align="center"
      bg={isSelected ? selectedBg : 'transparent'}
      borderRadius="md"
      px={2}
      py={1}
    >
      <Text
        fontSize="xs"
        fontFamily="mono"
        w="80px"
        flexShrink={0}
        color={textColor}
        fontWeight={isSelected ? 'bold' : 'normal'}
        isTruncated
      >
        &ldquo;{token.replace(' ', '␣')}&rdquo;
      </Text>
      <Box flex={1} mx={2}>
        <MotionBox
          initial={{ width: 0 }}
          animate={{ width: `${(probability / maxWidth) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          h="16px"
          bg={barBg}
          borderRadius="sm"
          minW="2px"
        />
      </Box>
      <Text fontSize="xs" fontFamily="mono" w="50px" textAlign="right" color={textColor}>
        {(probability * 100).toFixed(1)}%
      </Text>
    </MotionFlex>
  );
}

function TokenChip({
  position,
  isActive,
  onClick,
  isLight,
}: {
  position: TokenPosition;
  isActive: boolean;
  onClick: () => void;
  isLight: boolean;
}) {
  const p = position.topTokens[0]?.probability ?? 0;
  const bg = probabilityToColor(p, isLight);
  const activeBorder = useColorModeValue('green.500', 'green.300');
  const inactiveBorder = useColorModeValue('gray.200', 'gray.600');

  return (
    <Tooltip
      label={`P = ${(p * 100).toFixed(1)}% — click to see alternatives`}
      placement="top"
      hasArrow
    >
      <Box
        as="button"
        onClick={onClick}
        bg={bg}
        px={2}
        py={1}
        borderRadius="md"
        borderWidth="2px"
        borderColor={isActive ? activeBorder : inactiveBorder}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          transform: 'translateY(-2px)',
          shadow: 'md',
        }}
        fontFamily="mono"
        fontSize="sm"
      >
        {position.selectedToken}
      </Box>
    </Tooltip>
  );
}

function TokenViz() {
  const [prompt, setPrompt] = useState('');
  const [activeCompletion, setActiveCompletion] = useState<ReturnType<typeof getMockCompletion> | null>(null);
  const [activePosition, setActivePosition] = useState<number>(0);
  const [hasGenerated, setHasGenerated] = useState(false);

  const isLight = useColorModeValue(true, false);
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dimText = useColorModeValue('gray.500', 'gray.400');
  const chipBg = useColorModeValue('gray.100', 'gray.700');

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;
    const completion = getMockCompletion(prompt);
    setActiveCompletion(completion);
    setActivePosition(0);
    setHasGenerated(true);
  }, [prompt]);

  const activeTokens = activeCompletion?.tokens[activePosition];
  const maxProb = activeTokens
    ? Math.max(...activeTokens.topTokens.map((t) => t.probability))
    : 1;

  return (
    <>
      <NextSeo
        title="Token Probability Visualizer | Labs | Adam Hultman"
        description="Visualize how large language models choose tokens. See probability distributions for each generated word."
        canonical="https://hultman.dev/labs/token-viz"
      />
      <Container maxW="container.md">
        <SlideFade in={true} offsetY={80}>
          <Box>
            <HStack mb={6}>
              <IconButton
                as={NextLink}
                href="/labs"
                aria-label="Back to Labs"
                icon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
              />
              <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                AI Experiment
              </Badge>
            </HStack>

            <Heading
              as="h1"
              fontSize={{ base: '24px', md: '32px', lg: '36px' }}
              mb={3}
            >
              🎰 Token Probability Visualizer
            </Heading>
            <Paragraph fontSize="lg" mb={8}>
              See how a language model &ldquo;thinks&rdquo; — one token at a time.
              Type a prompt and visualize the probability distribution for each generated token.
            </Paragraph>

            {/* Input */}
            <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              p={{ base: 4, md: 6 }}
              mb={6}
            >
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={dimText}
                textTransform="uppercase"
                letterSpacing="wider"
                mb={2}
              >
                Enter a prompt
              </Text>
              <HStack>
                <Input
                  placeholder="The capital of France is..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  size="lg"
                  fontSize="md"
                  _focus={{
                    borderColor: 'purple.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
                  }}
                />
                <Button
                  colorScheme="purple"
                  size="lg"
                  onClick={handleGenerate}
                  isDisabled={!prompt.trim()}
                  px={8}
                >
                  Generate
                </Button>
              </HStack>

              {/* Quick examples */}
              <Wrap mt={3} spacing={2}>
                <WrapItem>
                  <Text fontSize="xs" color={dimText} pt={1}>Try:</Text>
                </WrapItem>
                {MOCK_COMPLETIONS.slice(0, 4).map((mc) => (
                  <WrapItem key={mc.prompt}>
                    <Badge
                      as="button"
                      variant="outline"
                      colorScheme="purple"
                      cursor="pointer"
                      fontSize="xs"
                      onClick={() => {
                        setPrompt(mc.prompt);
                        setActiveCompletion(mc);
                        setActivePosition(0);
                        setHasGenerated(true);
                      }}
                      _hover={{ bg: chipBg }}
                    >
                      {mc.prompt}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>

            {/* Results */}
            <AnimatePresence mode="wait">
              {hasGenerated && activeCompletion && (
                <MotionBox
                  key={activeCompletion.prompt}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Token sequence */}
                  <Box
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="xl"
                    p={{ base: 4, md: 6 }}
                    mb={6}
                  >
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color={dimText}
                      textTransform="uppercase"
                      letterSpacing="wider"
                      mb={3}
                    >
                      Generated tokens — click to inspect
                    </Text>
                    <Flex wrap="wrap" gap={1} align="center">
                      <Text fontFamily="mono" fontSize="sm" color={dimText} mr={1}>
                        {activeCompletion.prompt}
                      </Text>
                      {activeCompletion.tokens.map((tp, i) => (
                        <TokenChip
                          key={i}
                          position={tp}
                          isActive={activePosition === i}
                          onClick={() => setActivePosition(i)}
                          isLight={isLight}
                        />
                      ))}
                    </Flex>
                    <Text fontSize="xs" color={dimText} mt={3}>
                      Color = model confidence: 🟢 high → 🟡 medium → 🔴 low
                    </Text>
                  </Box>

                  {/* Probability distribution */}
                  {activeTokens && (
                    <MotionBox
                      key={activePosition}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box
                        bg={cardBg}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="xl"
                        p={{ base: 4, md: 6 }}
                        mb={6}
                      >
                        <Text
                          fontSize="xs"
                          fontWeight="bold"
                          color={dimText}
                          textTransform="uppercase"
                          letterSpacing="wider"
                          mb={1}
                        >
                          Top-5 candidates at position {activePosition + 1}
                        </Text>
                        <Text fontSize="xs" color={dimText} mb={4}>
                          The model chose &ldquo;{activeTokens.selectedToken}&rdquo; with{' '}
                          {((activeTokens.topTokens[0]?.probability ?? 0) * 100).toFixed(1)}% probability
                        </Text>
                        <VStack spacing={2} align="stretch">
                          {activeTokens.topTokens.map((t, i) => (
                            <TokenBar
                              key={`${activePosition}-${i}`}
                              token={t.token}
                              probability={t.probability}
                              isSelected={i === 0}
                              maxWidth={maxProb}
                            />
                          ))}
                        </VStack>
                      </Box>
                    </MotionBox>
                  )}
                </MotionBox>
              )}
            </AnimatePresence>

            <Divider my={8} />

            <Box mb={8}>
              <Heading as="h2" size="sm" mb={3}>
                How it works
              </Heading>
              <Text fontSize="sm" color={dimText} mb={3}>
                Large language models generate text one token at a time. At each step,
                the model computes a probability distribution over its entire vocabulary
                (~50,000+ tokens for GPT-style models). The token with the highest
                probability is typically selected, but sampling strategies like
                temperature and top-p allow for more creative outputs.
              </Text>
              <Text fontSize="sm" color={dimText} mb={3}>
                This demo uses pre-computed probability distributions to illustrate the concept.
                In production, OpenAI&apos;s <code>logprobs</code> parameter returns real
                token probabilities for each completion.
              </Text>
              <HStack spacing={4} fontSize="xs" color={dimText}>
                <Text>Built with: Next.js · Chakra UI · Framer Motion</Text>
                <Link
                  href="https://github.com/ACHultman/achultman-web"
                  isExternal
                  color="purple.400"
                >
                  View Source →
                </Link>
              </HStack>
            </Box>
          </Box>
        </SlideFade>
      </Container>
    </>
  );
}

export default TokenViz;
