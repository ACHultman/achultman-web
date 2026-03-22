import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import { CODE_SNIPPETS } from '../../data/gamesData';

const MotionBox = motion(Box);

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = temp;
  }
  return copy;
}

const ROUNDS = 10;
const TIME_PER_ROUND = 15;

export default function CodeReviewRoulette() {
  const [snippets, setSnippets] = useState(() =>
    shuffleArray(CODE_SNIPPETS).slice(0, ROUNDS)
  );
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_ROUND);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [answered, setAnswered] = useState<null | 'correct' | 'wrong' | 'timeout'>(null);
  const [showSource, setShowSource] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const codeBg = useColorModeValue('gray.900', 'gray.900');
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startTimer = useCallback(() => {
    cleanup();
    setTimeLeft(TIME_PER_ROUND);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          cleanup();
          setAnswered('timeout');
          setShowSource(true);
          setStreak(0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [cleanup]);

  const startGame = () => {
    const shuffled = shuffleArray(CODE_SNIPPETS).slice(0, ROUNDS);
    setSnippets(shuffled);
    setRound(0);
    setScore(0);
    setStreak(0);
    setGameActive(true);
    setGameOver(false);
    setAnswered(null);
    setShowSource(false);
    startTimer();
  };

  const answer = (guessReal: boolean) => {
    if (answered || !gameActive) return;
    cleanup();

    const current = snippets[round];
    if (!current) return;
    const correct = current.isReal === guessReal;

    if (correct) {
      const bonus = streak >= 3 ? 5 : 0;
      setScore((s) => s + 10 + bonus);
      setStreak((s) => s + 1);
      setAnswered('correct');
    } else {
      setScore((s) => Math.max(0, s - 5));
      setStreak(0);
      setAnswered('wrong');
    }
    setShowSource(true);
  };

  const nextRound = () => {
    if (round + 1 >= ROUNDS) {
      setGameActive(false);
      setGameOver(true);
      return;
    }
    setRound((r) => r + 1);
    setAnswered(null);
    setShowSource(false);
    startTimer();
  };

  const current = snippets[round] ?? snippets[0]!;

  return (
    <VStack spacing={4} align="stretch">
      {!gameActive && !gameOver && (
        <VStack spacing={3}>
          <Text fontSize="sm" color={subtleText} textAlign="center">
            10 code snippets. Real production code or AI-generated nonsense?
            <br />
            You have 15 seconds per snippet. Streaks give bonus points.
          </Text>
          <Button colorScheme="orange" size="lg" onClick={startGame}>
            🔍 Start Review
          </Button>
        </VStack>
      )}

      {gameActive && current && (
        <>
          <Flex justify="space-between" align="center" fontSize="sm">
            <HStack spacing={3}>
              <Text color={subtleText}>
                Round <strong>{round + 1}/{ROUNDS}</strong>
              </Text>
              <Text color={subtleText}>
                Score: <strong>{score}</strong>
              </Text>
            </HStack>
            <HStack spacing={3}>
              {streak >= 3 && (
                <Badge colorScheme="orange" variant="subtle">
                  🔥 {streak} streak!
                </Badge>
              )}
              <Text
                color={timeLeft <= 5 ? 'red.400' : subtleText}
                fontWeight={timeLeft <= 5 ? 'bold' : 'normal'}
              >
                ⏱ {timeLeft}s
              </Text>
            </HStack>
          </Flex>

          <Box
            bg={codeBg}
            color="green.300"
            borderRadius="lg"
            p={4}
            fontFamily="mono"
            fontSize="xs"
            whiteSpace="pre-wrap"
            overflowX="auto"
            lineHeight="1.6"
            position="relative"
          >
            <Badge
              position="absolute"
              top={2}
              right={2}
              colorScheme="gray"
              variant="subtle"
              fontSize="xs"
            >
              {current.language}
            </Badge>
            {current.code}
          </Box>

          <AnimatePresence mode="wait">
            {!answered ? (
              <MotionBox
                key="buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Flex gap={3} justify="center">
                  <Button
                    as={motion.button}
                    whileTap={{ scale: 0.95 }}
                    colorScheme="green"
                    size="lg"
                    flex={1}
                    onClick={() => answer(true)}
                  >
                    ✅ Real Code
                  </Button>
                  <Button
                    as={motion.button}
                    whileTap={{ scale: 0.95 }}
                    colorScheme="red"
                    size="lg"
                    flex={1}
                    onClick={() => answer(false)}
                  >
                    🤖 AI Nonsense
                  </Button>
                </Flex>
              </MotionBox>
            ) : (
              <MotionBox
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VStack spacing={2}>
                  <Text
                    fontWeight="bold"
                    color={
                      answered === 'correct'
                        ? 'green.400'
                        : answered === 'wrong'
                          ? 'red.400'
                          : 'yellow.400'
                    }
                    fontSize="lg"
                  >
                    {answered === 'correct'
                      ? '✅ Correct!'
                      : answered === 'wrong'
                        ? '❌ Wrong!'
                        : '⏰ Time\'s up!'}
                  </Text>
                  {showSource && (
                    <Text fontSize="sm" color={subtleText} textAlign="center">
                      {current.isReal ? '👨‍💻 Real code.' : '🤖 AI-generated.'}{' '}
                      {current.source}
                    </Text>
                  )}
                  <Button
                    colorScheme="orange"
                    size="sm"
                    onClick={nextRound}
                  >
                    {round + 1 < ROUNDS ? 'Next Snippet →' : 'See Results'}
                  </Button>
                </VStack>
              </MotionBox>
            )}
          </AnimatePresence>
        </>
      )}

      {gameOver && (
        <VStack spacing={3}>
          <Heading size="md">
            {score >= 80 ? '🏆 Code Wizard!' : score >= 50 ? '👀 Decent Eye!' : '🤔 Keep Practicing!'}
          </Heading>
          <Text color={subtleText}>
            Final score: <strong>{score}</strong> / {ROUNDS * 10}
          </Text>
          <Button colorScheme="orange" onClick={startGame} size="sm">
            Play Again
          </Button>
        </VStack>
      )}
    </VStack>
  );
}
