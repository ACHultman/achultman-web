import { useState, useCallback, useMemo } from 'react';
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
  Button,
  Wrap,
  WrapItem,
  Progress,
  SimpleGrid,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import Paragraph from '@components/Paragraph';
import { PROMPT_DUELS, CATEGORIES, type PromptDuel } from '@data/promptDuelData';

const MotionBox = motion(Box);

function ResponseCard({
  label,
  text,
  thinkingTime,
  votes,
  totalVotes,
  hasVoted,
  isWinner,
  onVote,
  colorScheme,
  index,
}: {
  label: string;
  text: string;
  thinkingTime: string;
  votes: number;
  totalVotes: number;
  hasVoted: boolean;
  isWinner: boolean;
  onVote: () => void;
  colorScheme: string;
  index: number;
}) {
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dimText = useColorModeValue('gray.500', 'gray.400');
  const codeBg = useColorModeValue('gray.100', 'gray.900');
  const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 50;

  // Simple markdown-like rendering for code blocks
  const renderText = (t: string) => {
    const parts = t.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
        return (
          <Box
            key={i}
            bg={codeBg}
            p={3}
            borderRadius="md"
            fontFamily="mono"
            fontSize="xs"
            whiteSpace="pre-wrap"
            overflowX="auto"
            my={2}
          >
            {code.trim()}
          </Box>
        );
      }
      return (
        <Text key={i} fontSize="sm" whiteSpace="pre-wrap" lineHeight="tall">
          {part}
        </Text>
      );
    });
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
    >
      <Box
        bg={cardBg}
        borderWidth="2px"
        borderColor={isWinner && hasVoted ? `${colorScheme}.400` : borderColor}
        borderRadius="xl"
        p={{ base: 4, md: 6 }}
        h="100%"
        display="flex"
        flexDirection="column"
        position="relative"
        overflow="hidden"
      >
        {isWinner && hasVoted && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="3px"
            bgGradient={`linear(to-r, ${colorScheme}.400, ${colorScheme}.200)`}
          />
        )}

        <Flex justify="space-between" align="center" mb={4}>
          <Badge colorScheme={colorScheme} variant="subtle" fontSize="sm" px={3} py={1}>
            {label}
          </Badge>
          <Text fontSize="xs" color={dimText}>
            ⏱ {thinkingTime}
          </Text>
        </Flex>

        <Box flex={1} mb={4} overflowY="auto" maxH="400px">
          {renderText(text)}
        </Box>

        <Divider mb={4} />

        {!hasVoted ? (
          <Button
            colorScheme={colorScheme}
            variant="outline"
            size="md"
            onClick={onVote}
            w="100%"
            _hover={{
              bg: `${colorScheme}.50`,
              transform: 'translateY(-1px)',
            }}
          >
            ⬆ Vote for {label}
          </Button>
        ) : (
          <Box>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm" fontWeight="bold" color={isWinner ? `${colorScheme}.400` : dimText}>
                {pct}%
              </Text>
              <Text fontSize="xs" color={dimText}>
                {votes} votes
              </Text>
            </Flex>
            <Progress
              value={pct}
              colorScheme={isWinner ? colorScheme : 'gray'}
              borderRadius="full"
              size="sm"
              sx={{
                '& > div': {
                  transition: 'width 0.8s ease-out',
                },
              }}
            />
          </Box>
        )}
      </Box>
    </MotionBox>
  );
}

function PromptDuelPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDuel, setActiveDuel] = useState<PromptDuel | null>(null);
  const [votes, setVotes] = useState<Record<string, 'A' | 'B'>>({});
  const [localVoteCounts, setLocalVoteCounts] = useState<
    Record<string, { a: number; b: number }>
  >({});

  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dimText = useColorModeValue('gray.500', 'gray.400');
  const chipBg = useColorModeValue('gray.100', 'gray.700');
  const activeChipBg = useColorModeValue('green.100', 'green.800');
  const progressBg = useColorModeValue('gray.200', 'gray.600');

  const filteredDuels = useMemo(() => {
    return PROMPT_DUELS.filter((d) => {
      const matchesCategory = !activeCategory || d.category === activeCategory;
      const matchesSearch =
        !searchTerm ||
        d.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const handleVote = useCallback(
    (duelId: string, choice: 'A' | 'B') => {
      if (votes[duelId]) return;
      setVotes((prev) => ({ ...prev, [duelId]: choice }));
      setLocalVoteCounts((prev) => {
        const duel = PROMPT_DUELS.find((d) => d.id === duelId);
        if (!duel) return prev;
        const existing = prev[duelId] || { a: duel.votesA, b: duel.votesB };
        return {
          ...prev,
          [duelId]: {
            a: existing.a + (choice === 'A' ? 1 : 0),
            b: existing.b + (choice === 'B' ? 1 : 0),
          },
        };
      });
    },
    [votes],
  );

  const getVoteCounts = (duel: PromptDuel) => {
    const local = localVoteCounts[duel.id];
    return local || { a: duel.votesA, b: duel.votesB };
  };

  // Overall stats
  const totalVotes = PROMPT_DUELS.reduce((sum, d) => sum + d.votesA + d.votesB, 0);
  const totalDuels = PROMPT_DUELS.length;

  return (
    <>
      <NextSeo
        title="AI Prompt Duel | Labs | Adam Hultman"
        description="Compare AI model responses side-by-side and vote for the best one. Explore how different models handle code, creative writing, reasoning, and health advice."
        canonical="https://hultman.dev/labs/prompt-duel"
      />
      <Container maxW="container.lg">
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
              <Badge colorScheme="red" variant="subtle" fontSize="xs">
                AI Experiment
              </Badge>
            </HStack>

            <Heading
              as="h1"
              fontSize={{ base: '24px', md: '32px', lg: '36px' }}
              mb={3}
            >
              ⚔️ AI Prompt Duel
            </Heading>
            <Paragraph fontSize="lg" mb={4}>
              Two AI models. One prompt. You decide which response is better.
            </Paragraph>
            <HStack spacing={4} fontSize="sm" color={dimText} mb={8}>
              <Text>{totalDuels} duels</Text>
              <Text>·</Text>
              <Text>{totalVotes.toLocaleString()} community votes</Text>
            </HStack>

            {/* Search and filters */}
            <Box mb={6}>
              <Input
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="lg"
                fontSize="md"
                mb={3}
                _focus={{
                  borderColor: 'red.400',
                  boxShadow: '0 0 0 1px var(--chakra-colors-red-400)',
                }}
              />
              <Wrap spacing={2}>
                <WrapItem>
                  <Badge
                    as="button"
                    variant={!activeCategory ? 'solid' : 'outline'}
                    colorScheme="red"
                    cursor="pointer"
                    fontSize="xs"
                    px={3}
                    py={1}
                    borderRadius="full"
                    onClick={() => setActiveCategory(null)}
                    bg={!activeCategory ? activeChipBg : undefined}
                  >
                    All
                  </Badge>
                </WrapItem>
                {CATEGORIES.map((cat) => (
                  <WrapItem key={cat}>
                    <Badge
                      as="button"
                      variant={activeCategory === cat ? 'solid' : 'outline'}
                      colorScheme="red"
                      cursor="pointer"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      onClick={() =>
                        setActiveCategory(activeCategory === cat ? null : cat)
                      }
                      _hover={{ bg: chipBg }}
                    >
                      {cat}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>

            <AnimatePresence mode="wait">
              {activeDuel ? (
                <MotionBox
                  key={activeDuel.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Active duel view */}
                  <Button
                    variant="ghost"
                    size="sm"
                    mb={4}
                    onClick={() => setActiveDuel(null)}
                    leftIcon={<ArrowBackIcon />}
                  >
                    Back to all duels
                  </Button>

                  <Box
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="xl"
                    p={{ base: 4, md: 6 }}
                    mb={6}
                  >
                    <Badge colorScheme="gray" mb={2} fontSize="xs">
                      {activeDuel.category}
                    </Badge>
                    <Heading as="h2" size="md" mb={2}>
                      &ldquo;{activeDuel.prompt}&rdquo;
                    </Heading>
                    <Text fontSize="sm" color={dimText}>
                      Read both responses, then vote for the one you think is better.
                      Model identities are hidden to reduce bias.
                    </Text>
                  </Box>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
                    {(() => {
                      const vc = getVoteCounts(activeDuel);
                      const total = vc.a + vc.b;
                      const hasVoted = !!votes[activeDuel.id];
                      const winnerIsA = vc.a >= vc.b;
                      return (
                        <>
                          <ResponseCard
                            label="Model A"
                            text={activeDuel.responses[0].text}
                            thinkingTime={activeDuel.responses[0].thinkingTime}
                            votes={vc.a}
                            totalVotes={total}
                            hasVoted={hasVoted}
                            isWinner={hasVoted && winnerIsA}
                            onVote={() => handleVote(activeDuel.id, 'A')}
                            colorScheme="blue"
                            index={0}
                          />
                          <ResponseCard
                            label="Model B"
                            text={activeDuel.responses[1].text}
                            thinkingTime={activeDuel.responses[1].thinkingTime}
                            votes={vc.b}
                            totalVotes={total}
                            hasVoted={hasVoted}
                            isWinner={hasVoted && !winnerIsA}
                            onVote={() => handleVote(activeDuel.id, 'B')}
                            colorScheme="purple"
                            index={1}
                          />
                        </>
                      );
                    })()}
                  </SimpleGrid>
                </MotionBox>
              ) : (
                <MotionBox
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Duel list */}
                  <VStack spacing={3} align="stretch" mb={8}>
                    {filteredDuels.map((duel, i) => {
                      const vc = getVoteCounts(duel);
                      const total = vc.a + vc.b;
                      const hasVoted = !!votes[duel.id];
                      const pctA = total > 0 ? Math.round((vc.a / total) * 100) : 50;

                      return (
                        <MotionBox
                          key={duel.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                        >
                          <Box
                            as="button"
                            w="100%"
                            textAlign="left"
                            bg={cardBg}
                            borderWidth="1px"
                            borderColor={borderColor}
                            borderRadius="xl"
                            p={{ base: 4, md: 5 }}
                            cursor="pointer"
                            _hover={{
                              transform: 'translateY(-2px)',
                              shadow: 'md',
                              borderColor: 'red.400',
                            }}
                            transition="all 0.2s"
                            onClick={() => setActiveDuel(duel)}
                          >
                            <Flex
                              justify="space-between"
                              align={{ base: 'start', md: 'center' }}
                              direction={{ base: 'column', md: 'row' }}
                              gap={2}
                            >
                              <Box flex={1}>
                                <HStack spacing={2} mb={1}>
                                  <Badge
                                    colorScheme="gray"
                                    fontSize="xs"
                                    borderRadius="full"
                                  >
                                    {duel.category}
                                  </Badge>
                                  {hasVoted && (
                                    <Badge
                                      colorScheme="green"
                                      fontSize="xs"
                                      borderRadius="full"
                                    >
                                      Voted
                                    </Badge>
                                  )}
                                </HStack>
                                <Text fontWeight="medium" fontSize="md">
                                  &ldquo;{duel.prompt}&rdquo;
                                </Text>
                              </Box>
                              <HStack spacing={3} flexShrink={0}>
                                <Box w="120px">
                                  <Flex justify="space-between" mb={1}>
                                    <Text fontSize="xs" color="blue.400">
                                      A: {pctA}%
                                    </Text>
                                    <Text fontSize="xs" color="purple.400">
                                      B: {100 - pctA}%
                                    </Text>
                                  </Flex>
                                  <Box
                                    h="6px"
                                    borderRadius="full"
                                    overflow="hidden"
                                    bg={progressBg}
                                  >
                                    <Box
                                      h="100%"
                                      w={`${pctA}%`}
                                      bg="blue.400"
                                      borderRadius="full"
                                      transition="width 0.5s ease"
                                    />
                                  </Box>
                                </Box>
                                <Text fontSize="xs" color={dimText}>
                                  {total} votes
                                </Text>
                              </HStack>
                            </Flex>
                          </Box>
                        </MotionBox>
                      );
                    })}
                  </VStack>
                </MotionBox>
              )}
            </AnimatePresence>

            <Divider my={8} />

            <Box mb={8}>
              <Heading as="h2" size="sm" mb={3}>
                How it works
              </Heading>
              <Text fontSize="sm" color={dimText} mb={3}>
                This experiment demonstrates <strong>blind evaluation</strong> of AI model outputs —
                the same methodology used in RLHF (Reinforcement Learning from Human Feedback) to
                align language models with human preferences. Model identities are hidden to reduce
                bias, and responses are shown side-by-side for fair comparison.
              </Text>
              <Text fontSize="sm" color={dimText} mb={3}>
                The prompt/response pairs are pre-computed to illustrate how different models
                approach the same task with varying styles, depth, and accuracy. In production
                systems like{' '}
                <Link href="https://chat.lmsys.org" isExternal color="red.400">
                  Chatbot Arena
                </Link>
                , this approach generates preference data used to train reward models.
              </Text>
              <Text fontSize="sm" color={dimText} mb={3}>
                <strong>Built with:</strong> Next.js · Chakra UI · Framer Motion ·
                Pre-computed response pairs · Client-side voting with running tallies
              </Text>
              <HStack spacing={4} fontSize="xs" color={dimText}>
                <Link
                  href="https://github.com/ACHultman/achultman-web"
                  isExternal
                  color="red.400"
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

export default PromptDuelPage;
