import { useState, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import { STANDUP_PARTS } from '../../data/gamesData';

const MotionBox = motion(Box);

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

type SlotColumn = 'yesterday' | 'today' | 'blockedBy';

const COLUMNS: { key: SlotColumn; label: string; emoji: string }[] = [
  { key: 'yesterday', label: 'Yesterday I...', emoji: '📅' },
  { key: 'today', label: 'Today I will...', emoji: '🎯' },
  { key: 'blockedBy', label: 'Blocked by...', emoji: '🚧' },
];

export default function StandupExcuseGenerator() {
  const [results, setResults] = useState<Record<SlotColumn, string>>({
    yesterday: '',
    today: '',
    blockedBy: '',
  });
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const spinCountRef = useRef(0);

  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('purple.600', 'purple.300');
  const toast = useToast();

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setHasSpun(true);
    spinCountRef.current += 1;
    const currentSpin = spinCountRef.current;

    // Cycle through random values rapidly, then slow down
    let cycles = 0;
    const maxCycles = 15;

    const interval = setInterval(() => {
      cycles++;
      setResults({
        yesterday: pickRandom(STANDUP_PARTS.yesterday),
        today: pickRandom(STANDUP_PARTS.today),
        blockedBy: pickRandom(STANDUP_PARTS.blockedBy),
      });

      if (cycles >= maxCycles) {
        clearInterval(interval);
        // Final selection
        if (spinCountRef.current === currentSpin) {
          setResults({
            yesterday: pickRandom(STANDUP_PARTS.yesterday),
            today: pickRandom(STANDUP_PARTS.today),
            blockedBy: pickRandom(STANDUP_PARTS.blockedBy),
          });
          setSpinning(false);
        }
      }
    }, 80 + cycles * 15);

    // Safety cleanup
    return () => clearInterval(interval);
  }, [spinning]);

  const copyToClipboard = async () => {
    const text = `🗣️ Standup Update:\n\n📅 Yesterday I ${results.yesterday}\n🎯 Today I will ${results.today}\n🚧 Blocked by ${results.blockedBy}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Paste it in Slack. Your team will love it.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Your clipboard is blocked by... something.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={5} align="stretch">
      <Text fontSize="sm" color={subtleText} textAlign="center">
        Generate the perfect standup excuse. Guaranteed to confuse your PM.
      </Text>

      <VStack spacing={3}>
        {COLUMNS.map(({ key, label, emoji }) => (
          <Box key={key} bg={cardBg} borderRadius="lg" p={4} w="100%">
            <Text fontSize="xs" fontWeight="bold" color={accentColor} mb={2}>
              {emoji} {label}
            </Text>
            <AnimatePresence mode="wait">
              <MotionBox
                key={results[key] || 'empty'}
                initial={{ opacity: 0, y: spinning ? -10 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: spinning ? 0.05 : 0.3 }}
              >
                <Text fontSize="sm" minH="20px">
                  {results[key] || '—'}
                </Text>
              </MotionBox>
            </AnimatePresence>
          </Box>
        ))}
      </VStack>

      <Flex gap={3} justify="center" wrap="wrap">
        <Button
          as={motion.button}
          whileTap={{ scale: 0.95 }}
          colorScheme="purple"
          size="lg"
          onClick={spin}
          isLoading={spinning}
          loadingText="Spinning..."
        >
          🎰 Spin the Wheel
        </Button>
        {hasSpun && !spinning && (
          <Button
            as={motion.button}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            variant="outline"
            size="lg"
            onClick={copyToClipboard}
          >
            📋 Copy to Clipboard
          </Button>
        )}
      </Flex>

      {hasSpun && !spinning && (
        <Box textAlign="center">
          <Heading size="xs" color={subtleText}>
            Spins today: {spinCountRef.current}
          </Heading>
        </Box>
      )}
    </VStack>
  );
}
