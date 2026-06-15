import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import Phase1Cocky from './phases/Phase1Cocky';
import Phase2Scared from './phases/Phase2Scared';
import Phase3Angry from './phases/Phase3Angry';
import Phase4Existential from './phases/Phase4Existential';
import Phase5Final from './phases/Phase5Final';
import ScoreScreen from './ScoreScreen';

const MotionBox = motion(Box);

const CIRCLE_NAMES = [
  'Gerald',
  'Big Tony',
  'Princess Diane',
  'Bartholomew',
  'Karen from Accounting',
  'Sir Clicks-a-Lot',
  'Hank the Orb',
  'Margaret Thatcher II',
  'El Circulo',
  'Lord Roundington',
  'Jeff (not Bezos)',
  'The Honorable Dot',
  'Brenda',
  'Captain Radius',
  'Señor Sphere',
  'Chad the Circle',
  'Grandma Pixel',
  'Professor Roundsworth',
  'Reginald von Curve',
  'Orbothy',
  'Lil\' Circumference',
  'Count Clickula',
  'Archibald the Anxious',
  'Steve from QA',
] as const;

export type GamePhase = 'cocky' | 'scared' | 'angry' | 'existential' | 'final';
export type GameState = 'idle' | 'playing' | 'gameover' | 'victory';

export interface PhaseProps {
  catches: number;
  onCatch: () => void;
  gameAreaWidth: number;
  gameAreaHeight: number;
  circleName: string;
  onLoseLife: () => void;
}

const PHASE_CONFIG: Record<GamePhase, { label: string; color: string; emoji: string }> = {
  cocky: { label: 'Cocky', color: 'green', emoji: '😏' },
  scared: { label: 'Scared', color: 'yellow', emoji: '😨' },
  angry: { label: 'Angry', color: 'red', emoji: '😡' },
  existential: { label: 'Existential', color: 'purple', emoji: '🤔' },
  final: { label: 'Final Form', color: 'orange', emoji: '👑' },
};

function getPhase(catches: number): GamePhase {
  if (catches < 10) return 'cocky';
  if (catches < 25) return 'scared';
  if (catches < 40) return 'angry';
  if (catches < 50) return 'existential';
  return 'final';
}

function pickRandomName(): string {
  return CIRCLE_NAMES[Math.floor(Math.random() * CIRCLE_NAMES.length)]!;
}

export default function CatchMeGame() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [catches, setCatches] = useState(0);
  const [lives, setLives] = useState(3);
  const [circleName, setCircleName] = useState(() => pickRandomName());
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [gameAreaSize, setGameAreaSize] = useState({ width: 600, height: 450 });
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const phase = getPhase(catches);
  const phaseInfo = PHASE_CONFIG[phase];

  useEffect(() => {
    function updateSize() {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        setGameAreaSize({ width: rect.width, height: rect.height });
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [gameState]);

  const handleCatch = useCallback(() => {
    setCatches((prev) => {
      const next = prev + 1;
      if (next >= 55) {
        setEndTime(Date.now());
        setGameState('victory');
      }
      return next;
    });
  }, []);

  const handleLoseLife = useCallback(() => {
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setEndTime(Date.now());
        setGameState('gameover');
      }
      return next;
    });
  }, []);

  const startGame = useCallback(() => {
    setCatches(0);
    setLives(3);
    setCircleName(pickRandomName());
    setStartTime(Date.now());
    setEndTime(0);
    setGameState('playing');
  }, []);

  const areaBg = useColorModeValue('white', 'gray.900');
  const areaBorder = useColorModeValue('gray.200', 'gray.600');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const hudBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.700');

  if (gameState === 'victory' || gameState === 'gameover') {
    return (
      <ScoreScreen
        circleName={circleName}
        catches={catches}
        timePlayed={Math.round((endTime - startTime) / 1000)}
        won={gameState === 'victory'}
        lives={lives}
        onPlayAgain={startGame}
      />
    );
  }

  if (gameState === 'idle') {
    return (
      <VStack spacing={6} py={8}>
        <MotionBox
          w="80px"
          h="80px"
          borderRadius="50%"
          bg="red.400"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <VStack spacing={2}>
          <Heading size="lg">Catch Me If You Can</Heading>
          <Text color={subtleText} textAlign="center" maxW="400px">
            Hunt a circle with feelings. It will taunt you, hide from you, fight
            you, question your existence, and eventually become the entire
            screen.
          </Text>
        </VStack>
        <VStack spacing={1}>
          <Text fontSize="sm" color={subtleText}>
            5 phases of emotional escalation
          </Text>
          <HStack spacing={2}>
            {Object.values(PHASE_CONFIG).map((p) => (
              <Text key={p.label} fontSize="lg" title={p.label}>
                {p.emoji}
              </Text>
            ))}
          </HStack>
        </VStack>
        <Button colorScheme="red" size="lg" onClick={startGame}>
          Start Hunting
        </Button>
      </VStack>
    );
  }

  return (
    <Box>
      {/* HUD */}
      <Flex
        justify="space-between"
        align="center"
        mb={3}
        p={3}
        bg={hudBg}
        borderRadius="lg"
        flexWrap="wrap"
        gap={2}
      >
        <HStack spacing={3}>
          <Badge colorScheme={phaseInfo.color} fontSize="sm" px={2} py={1}>
            {phaseInfo.emoji} {phaseInfo.label}
          </Badge>
          <Text fontWeight="bold" fontSize="sm">
            Catches: {catches}
          </Text>
        </HStack>
        <HStack spacing={3}>
          <Text fontWeight="bold" fontSize="sm" color={subtleText}>
            Target: {circleName}
          </Text>
          <HStack spacing={1}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Text key={i} fontSize="lg" opacity={i < lives ? 1 : 0.2}>
                ❤️
              </Text>
            ))}
          </HStack>
        </HStack>
      </Flex>

      {/* Game Area */}
      <Box
        ref={gameAreaRef}
        position="relative"
        overflow="hidden"
        h={{ base: '400px', md: '450px' }}
        w="100%"
        bg={areaBg}
        borderWidth="2px"
        borderColor={areaBorder}
        borderRadius="xl"
        cursor="crosshair"
        userSelect="none"
      >
        <AnimatePresence mode="wait">
          {phase === 'cocky' && (
            <Phase1Cocky
              key="phase1"
              catches={catches}
              onCatch={handleCatch}
              gameAreaWidth={gameAreaSize.width}
              gameAreaHeight={gameAreaSize.height}
              circleName={circleName}
              onLoseLife={handleLoseLife}
            />
          )}
          {phase === 'scared' && (
            <Phase2Scared
              key="phase2"
              catches={catches}
              onCatch={handleCatch}
              gameAreaWidth={gameAreaSize.width}
              gameAreaHeight={gameAreaSize.height}
              circleName={circleName}
              onLoseLife={handleLoseLife}
            />
          )}
          {phase === 'angry' && (
            <Phase3Angry
              key="phase3"
              catches={catches}
              onCatch={handleCatch}
              gameAreaWidth={gameAreaSize.width}
              gameAreaHeight={gameAreaSize.height}
              circleName={circleName}
              onLoseLife={handleLoseLife}
            />
          )}
          {phase === 'existential' && (
            <Phase4Existential
              key="phase4"
              catches={catches}
              onCatch={handleCatch}
              gameAreaWidth={gameAreaSize.width}
              gameAreaHeight={gameAreaSize.height}
              circleName={circleName}
              onLoseLife={handleLoseLife}
            />
          )}
          {phase === 'final' && (
            <Phase5Final
              key="phase5"
              catches={catches}
              onCatch={handleCatch}
              gameAreaWidth={gameAreaSize.width}
              gameAreaHeight={gameAreaSize.height}
              circleName={circleName}
              onLoseLife={handleLoseLife}
            />
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
