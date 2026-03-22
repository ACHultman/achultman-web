import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import { BUG_WHACKER_CONFIG as CFG } from '../../data/gamesData';

const MotionBox = motion(Box);

type CellState = 'empty' | 'bug' | 'feature';

interface Cell {
  state: CellState;
  id: number;
}

export default function BugWhacker() {
  const [cells, setCells] = useState<Cell[]>(() =>
    Array.from({ length: CFG.gridSize * CFG.gridSize }, (_, i) => ({
      state: 'empty' as CellState,
      id: i,
    }))
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CFG.gameDuration);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cellIdRef = useRef(CFG.gridSize * CFG.gridSize);
  const spawnSpeedRef = useRef(CFG.spawnInterval.initial);

  const cellBg = useColorModeValue('gray.100', 'gray.600');
  const cellHoverBg = useColorModeValue('gray.200', 'gray.500');
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bugwhacker-highscore');
      if (stored) setHighScore(parseInt(stored, 10));
    } catch {
      /* ignore */
    }
  }, []);

  const cleanup = useCallback(() => {
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    spawnRef.current = null;
    timerRef.current = null;
  }, []);

  const endGame = useCallback(
    (finalScore: number) => {
      cleanup();
      setGameActive(false);
      setGameOver(true);
      if (finalScore > highScore) {
        setHighScore(finalScore);
        try {
          localStorage.setItem('bugwhacker-highscore', String(finalScore));
        } catch {
          /* ignore */
        }
      }
    },
    [cleanup, highScore]
  );

  const spawnBug = useCallback(() => {
    setCells((prev) => {
      const emptyIndices = prev
        .map((c, i) => (c.state === 'empty' ? i : -1))
        .filter((i) => i >= 0);
      if (emptyIndices.length === 0) return prev;

      const idx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      if (idx === undefined) return prev;
      const isFeature = Math.random() < CFG.featureChance;
      const newId = ++cellIdRef.current;

      const next = [...prev];
      next[idx] = { state: isFeature ? 'feature' : 'bug', id: newId };

      // Auto-despawn
      const despawnIdx = idx;
      setTimeout(() => {
        setCells((curr) => {
          if (curr[despawnIdx]?.id === newId) {
            const updated = [...curr];
            updated[despawnIdx] = { state: 'empty', id: ++cellIdRef.current };
            return updated;
          }
          return curr;
        });
      }, CFG.despawnTime);

      return next;
    });
  }, []);

  const startGame = useCallback(() => {
    cleanup();
    setScore(0);
    setTimeLeft(CFG.gameDuration);
    setGameActive(true);
    setGameOver(false);
    spawnSpeedRef.current = CFG.spawnInterval.initial;
    setCells(
      Array.from({ length: CFG.gridSize * CFG.gridSize }, (_, i) => ({
        state: 'empty' as CellState,
        id: i,
      }))
    );

    // Timer
    let tLeft = CFG.gameDuration;
    timerRef.current = setInterval(() => {
      tLeft -= 1;
      setTimeLeft(tLeft);
      if (tLeft <= 0) {
        setScore((s) => {
          endGame(s);
          return s;
        });
      }
      // Speed up every 10 seconds
      if (tLeft % 10 === 0 && tLeft < CFG.gameDuration) {
        spawnSpeedRef.current = Math.max(
          CFG.spawnInterval.min,
          spawnSpeedRef.current - 200
        );
        // Restart spawn interval with new speed
        if (spawnRef.current) clearInterval(spawnRef.current);
        spawnRef.current = setInterval(spawnBug, spawnSpeedRef.current);
      }
    }, 1000);

    // Spawn bugs
    spawnRef.current = setInterval(spawnBug, spawnSpeedRef.current);
  }, [cleanup, endGame, spawnBug]);

  useEffect(() => cleanup, [cleanup]);

  const whack = (index: number) => {
    if (!gameActive) return;
    const cell = cells[index];
    if (!cell || cell.state === 'empty') return;

    if (cell.state === 'bug') {
      setScore((s) => s + CFG.bugPoints);
    } else {
      setScore((s) => s - CFG.featurePenalty);
    }

    setCells((prev) => {
      const next = [...prev];
      next[index] = { state: 'empty', id: ++cellIdRef.current };
      return next;
    });
  };

  return (
    <VStack spacing={4} align="stretch">
      <Flex justify="space-between" align="center">
        <Text fontSize="sm" color={subtleText}>
          Score: <strong>{score}</strong>
        </Text>
        <Text fontSize="sm" color={subtleText}>
          High Score: <strong>{highScore}</strong>
        </Text>
        <Text
          fontSize="sm"
          color={timeLeft <= 5 ? 'red.400' : subtleText}
          fontWeight={timeLeft <= 5 ? 'bold' : 'normal'}
        >
          ⏱ {timeLeft}s
        </Text>
      </Flex>

      <SimpleGrid columns={CFG.gridSize} spacing={2}>
        {cells.map((cell, i) => (
          <MotionBox
            key={i}
            bg={cellBg}
            _hover={gameActive ? { bg: cellHoverBg } : {}}
            borderRadius="lg"
            h={{ base: '60px', md: '80px' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor={gameActive ? 'crosshair' : 'default'}
            onClick={() => whack(i)}
            whileTap={gameActive ? { scale: 0.9 } : {}}
            userSelect="none"
          >
            <AnimatePresence mode="wait">
              {cell.state !== 'empty' && (
                <motion.div
                  key={cell.id}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Text fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
                    {cell.state === 'bug' ? '🐛' : '🦋'}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </MotionBox>
        ))}
      </SimpleGrid>

      <Flex gap={2} fontSize="xs" color={subtleText} justify="center">
        <Text>🐛 Bug = +{CFG.bugPoints}pts</Text>
        <Text>🦋 Feature = -{CFG.featurePenalty}pts</Text>
      </Flex>

      {!gameActive && !gameOver && (
        <Button colorScheme="red" onClick={startGame} size="lg">
          🐛 Start Whacking!
        </Button>
      )}

      {gameOver && (
        <VStack spacing={3}>
          <Heading size="md">
            {score >= 100 ? '🏆' : score >= 50 ? '👏' : '💪'} Game Over!
          </Heading>
          <Text color={subtleText}>
            Final score: <strong>{score}</strong>
          </Text>
          <Button colorScheme="red" onClick={startGame} size="sm">
            Play Again
          </Button>
        </VStack>
      )}
    </VStack>
  );
}
