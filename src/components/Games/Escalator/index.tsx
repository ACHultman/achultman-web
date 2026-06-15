import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  SCENARIOS,
  getArchetype,
  getHeadline,
  type PersonalityProfile,
  type Choice,
  type Scenario,
} from './scenarios';
import EndScreen from './EndScreen';

const MotionBox = motion(Box);

type GameState = 'idle' | 'playing' | 'result' | 'end';

/** Pick one random scenario per round at game start */
function pickScenarios(): Scenario[] {
  return SCENARIOS.map(
    (roundScenarios) =>
      roundScenarios[Math.floor(Math.random() * roundScenarios.length)]
  ) as Scenario[];
}

export default function EscalatorGame() {
  const [state, setState] = useState<GameState>('idle');
  const [scenarios, setScenarios] = useState<Scenario[]>(() => pickScenarios());
  const [round, setRound] = useState(0);
  const [profile, setProfile] = useState<PersonalityProfile>({
    chaos: 0,
    charm: 0,
    cowardice: 0,
    pettiness: 0,
  });
  const [roundResults, setRoundResults] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState('');
  const [chosenIndex, setChosenIndex] = useState(-1);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('purple.50', 'whiteAlpha.100');

  const currentScenario = scenarios[round] as Scenario | undefined;

  const archetype = useMemo(() => getArchetype(profile), [profile]);
  const headline = useMemo(
    () => (state === 'end' ? getHeadline(archetype) : ''),
    [state, archetype]
  );

  const handleStart = useCallback(() => {
    const newScenarios = pickScenarios();
    setScenarios(newScenarios);
    setRound(0);
    setProfile({ chaos: 0, charm: 0, cowardice: 0, pettiness: 0 });
    setRoundResults([]);
    setLastResult('');
    setChosenIndex(-1);
    setState('playing');
  }, []);

  const handleChoice = useCallback(
    (choice: Choice, index: number) => {
      setProfile((prev) => ({
        chaos: prev.chaos + choice.axes.chaos,
        charm: prev.charm + choice.axes.charm,
        cowardice: prev.cowardice + choice.axes.cowardice,
        pettiness: prev.pettiness + choice.axes.pettiness,
      }));
      setLastResult(choice.result);
      setChosenIndex(index);
      setRoundResults((prev) => [...prev, choice.result]);
      setState('result');
    },
    []
  );

  const handleNext = useCallback(() => {
    if (round >= 4) {
      setState('end');
    } else {
      setRound((r) => r + 1);
      setLastResult('');
      setChosenIndex(-1);
      setState('playing');
    }
  }, [round]);

  // ── Idle screen ──
  if (state === 'idle') {
    return (
      <VStack spacing={6} textAlign="center" py={8}>
        <MotionBox
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Text fontSize="6xl">🎭</Text>
        </MotionBox>
        <Heading size="lg">The Escalator</Heading>
        <Text color={subtleText} maxW="400px">
          A mundane scenario. Three choices. Five rounds of escalating absurdity.
          Hidden personality axes tracking your every decision.
        </Text>
        <Text fontSize="sm" color={subtleText}>
          Ends with a newspaper headline about you.
        </Text>
        <Button colorScheme="purple" size="lg" onClick={handleStart}>
          Begin the Escalation
        </Button>
      </VStack>
    );
  }

  // ── End screen ──
  if (state === 'end') {
    return (
      <EndScreen
        profile={profile}
        archetype={archetype}
        headline={headline}
        roundResults={roundResults}
        onRestart={handleStart}
      />
    );
  }

  // ── Playing / Result ──
  if (!currentScenario) return null;

  return (
    <VStack spacing={5} w="100%">
      {/* Round indicator */}
      <HStack spacing={2}>
        {Array.from({ length: 5 }, (_, i) => (
          <Badge
            key={i}
            colorScheme={i < round ? 'green' : i === round ? 'purple' : 'gray'}
            variant={i === round ? 'solid' : 'subtle'}
            fontSize="xs"
            px={3}
            py={1}
          >
            {i + 1}
          </Badge>
        ))}
      </HStack>

      <AnimatePresence mode="wait">
        <MotionBox
          key={currentScenario.id + state}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          w="100%"
        >
          {/* Scenario setup */}
          <Box
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            p={5}
            mb={4}
          >
            <Badge colorScheme="purple" mb={2}>
              Round {round + 1} of 5
            </Badge>
            <Text fontSize="lg" fontWeight="medium">
              {currentScenario.setup}
            </Text>
          </Box>

          {state === 'playing' && (
            <VStack spacing={3} w="100%">
              {currentScenario.choices.map((choice, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  w="100%"
                >
                  <Box
                    as="button"
                    w="100%"
                    textAlign="left"
                    bg={cardBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="lg"
                    p={4}
                    cursor="pointer"
                    _hover={{ bg: hoverBg, borderColor: 'purple.400' }}
                    transition="all 0.15s"
                    onClick={() => handleChoice(choice, i)}
                  >
                    <HStack spacing={3} align="start">
                      <Badge
                        colorScheme="purple"
                        variant="outline"
                        fontSize="sm"
                        mt={0.5}
                      >
                        {String.fromCharCode(65 + i)}
                      </Badge>
                      <Text>{choice.text}</Text>
                    </HStack>
                  </Box>
                </MotionBox>
              ))}
            </VStack>
          )}

          {state === 'result' && (
            <MotionBox
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                bg={cardBg}
                border="2px solid"
                borderColor="purple.400"
                borderRadius="lg"
                p={5}
                mb={4}
              >
                <Badge colorScheme="green" mb={2}>
                  You chose: {currentScenario.choices[chosenIndex]?.text}
                </Badge>
                <Text mt={2}>{lastResult}</Text>
              </Box>
              <Button
                colorScheme="purple"
                size="lg"
                w="100%"
                onClick={handleNext}
              >
                {round >= 4 ? 'See Your Headline' : 'Next Round →'}
              </Button>
            </MotionBox>
          )}
        </MotionBox>
      </AnimatePresence>
    </VStack>
  );
}
