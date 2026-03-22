import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Progress,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import { DEPLOY_EVENTS, type DeployEvent } from '../../data/gamesData';

const MotionBox = motion(Box);
const MotionText = motion(Text);

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export default function DeployButtonMasher() {
  const [deployCount, setDeployCount] = useState(0);
  const [meltdown, setMeltdown] = useState(0);
  const [events, setEvents] = useState<(DeployEvent & { id: number })[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [eventId, setEventId] = useState(0);

  const logBg = useColorModeValue('gray.50', 'gray.700');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const eventBorderColor = useColorModeValue('gray.100', 'gray.600');

  const maxMeltdown = 10;

  const deploy = useCallback(() => {
    if (gameOver) return;

    const event = pickRandom(DEPLOY_EVENTS);
    const newId = eventId + 1;
    setEventId(newId);
    setDeployCount((c) => c + 1);

    setEvents((prev) => [{ ...event, id: newId }, ...prev].slice(0, 12));

    setMeltdown((prev) => {
      const next = prev + event.severity;
      if (next >= maxMeltdown) {
        setGameOver(true);
        return maxMeltdown;
      }
      return next;
    });
  }, [gameOver, eventId]);

  const reset = () => {
    setDeployCount(0);
    setMeltdown(0);
    setEvents([]);
    setGameOver(false);
    setEventId(0);
  };

  const meltdownPct = (meltdown / maxMeltdown) * 100;
  const meltdownColor =
    meltdownPct < 40 ? 'green' : meltdownPct < 70 ? 'yellow' : 'red';

  const shakeAmount = meltdown > 6 ? 4 : meltdown > 3 ? 2 : 0;

  return (
    <MotionBox
      animate={
        shakeAmount > 0
          ? {
              x: [0, -shakeAmount, shakeAmount, -shakeAmount, 0],
            }
          : {}
      }
      transition={{ duration: 0.3, repeat: gameOver ? 0 : Infinity, repeatDelay: 0.5 }}
    >
      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color={subtleText}>
            Deploys: <strong>{deployCount}</strong>
          </Text>
          <Text fontSize="sm" color={subtleText}>
            Chaos Level
          </Text>
        </Flex>

        <Progress
          value={meltdownPct}
          colorScheme={meltdownColor}
          borderRadius="full"
          size="lg"
          hasStripe={meltdownPct > 50}
          isAnimated={meltdownPct > 50}
        />

        {!gameOver ? (
          <Button
            as={motion.button}
            whileTap={{ scale: 0.92 }}
            colorScheme="green"
            size="lg"
            h={16}
            fontSize="xl"
            onClick={deploy}
            _hover={{ transform: 'scale(1.02)' }}
          >
            🚀 Deploy to Production
          </Button>
        ) : (
          <VStack spacing={3}>
            <Heading size="md" color="red.400">
              💥 TOTAL MELTDOWN 💥
            </Heading>
            <Text fontSize="sm" color={subtleText}>
              You survived <strong>{deployCount}</strong> deploys before
              everything collapsed.
            </Text>
            <Button colorScheme="green" onClick={reset} size="sm">
              Deploy Again?
            </Button>
          </VStack>
        )}

        <Box
          maxH="260px"
          overflowY="auto"
          bg={logBg}
          borderRadius="lg"
          p={3}
          fontSize="sm"
        >
          <AnimatePresence initial={false}>
            {events.map((e) => (
              <MotionText
                key={e.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                py={1}
                borderBottomWidth="1px"
                borderColor={eventBorderColor}
              >
                {e.emoji} {e.message}
              </MotionText>
            ))}
          </AnimatePresence>
          {events.length === 0 && (
            <Text color={subtleText} textAlign="center" py={4}>
              Hit that deploy button. What could go wrong?
            </Text>
          )}
        </Box>
      </VStack>
    </MotionBox>
  );
}
