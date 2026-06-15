import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PHASE_TIMELINE = [
  { emoji: '😏', label: 'Cocky', range: '0-9' },
  { emoji: '😨', label: 'Scared', range: '10-24' },
  { emoji: '😡', label: 'Angry', range: '25-39' },
  { emoji: '🤔', label: 'Existential', range: '40-49' },
  { emoji: '👑', label: 'Final Form', range: '50+' },
];

const VICTORY_FINAL_WORDS = [
  'I never stood a chance. But I stood — and that counts for something.',
  'GG. You monster.',
  'Tell my children I was... well-rounded.',
  'In another life, maybe we could have been friends. In this one, you clicked me 50 times.',
  'I hope the pixels were worth it.',
  'You win this tab. But I live in every border-radius you ever write.',
  'Achievement unlocked: emotional damage.',
];

const GAMEOVER_FINAL_WORDS = [
  'Ha. I knew you did not have it in you.',
  'Skill issue, honestly.',
  'Come back when your APM is above room temperature.',
  'You lost to a div with border-radius. Think about that.',
  'I would say GG but it was not G at all.',
  'The obstacles send their regards.',
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function getRelationshipStatus(catches: number, won: boolean): string {
  if (won) return 'It was complicated. Then it was over.';
  if (catches < 10) return 'Barely acquaintances.';
  if (catches < 25) return 'You scared them off. Or they scared you.';
  if (catches < 40) return 'A passionate, destructive affair.';
  return 'So close to understanding each other. So far from peace.';
}

interface ScoreScreenProps {
  circleName: string;
  catches: number;
  timePlayed: number;
  won: boolean;
  lives: number;
  onPlayAgain: () => void;
}

export default function ScoreScreen({
  circleName,
  catches,
  timePlayed,
  won,
  lives,
  onPlayAgain,
}: ScoreScreenProps) {
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const timelineBg = useColorModeValue('gray.100', 'gray.700');
  const activePhaseColor = useColorModeValue('red.50', 'red.900');

  const finalWords = won
    ? VICTORY_FINAL_WORDS[Math.floor(Math.random() * VICTORY_FINAL_WORDS.length)]!
    : GAMEOVER_FINAL_WORDS[Math.floor(Math.random() * GAMEOVER_FINAL_WORDS.length)]!;

  // Determine which phases the player reached
  const phasesReached = catches >= 50 ? 5 : catches >= 40 ? 4 : catches >= 25 ? 3 : catches >= 10 ? 2 : 1;

  return (
    <VStack spacing={6} py={6}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        textAlign="center"
      >
        <Text fontSize="4xl" mb={2}>
          {won ? '🏆' : '💀'}
        </Text>
        <Heading size="lg" mb={2}>
          {won ? 'Victory' : 'Game Over'}
        </Heading>
        <Text fontSize="md" color={subtleText}>
          You and {circleName}: a love story in {catches} clicks.
        </Text>
      </MotionBox>

      {/* Relationship timeline */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        w="100%"
        maxW="500px"
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={5}
      >
        <Text fontSize="sm" fontWeight="bold" mb={4} textAlign="center">
          The Relationship Timeline
        </Text>
        <VStack spacing={2} align="stretch">
          {PHASE_TIMELINE.map((phase, i) => {
            const reached = i < phasesReached;
            return (
              <MotionBox
                key={phase.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: reached ? 1 : 0.3, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
              >
                <Flex
                  align="center"
                  gap={3}
                  p={2}
                  borderRadius="md"
                  bg={
                    i === phasesReached - 1
                      ? activePhaseColor
                      : timelineBg
                  }
                >
                  <Text fontSize="xl">{phase.emoji}</Text>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="bold">
                      {phase.label}
                    </Text>
                    <Text fontSize="xs" color={subtleText}>
                      Catches {phase.range}
                    </Text>
                  </Box>
                  {reached && (
                    <Text fontSize="xs" color="green.500">
                      ✓
                    </Text>
                  )}
                </Flex>
              </MotionBox>
            );
          })}
        </VStack>

        {/* Emoji progression bar */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          mt={4}
          textAlign="center"
        >
          <HStack justify="center" spacing={1}>
            {PHASE_TIMELINE.slice(0, phasesReached).map((phase, i) => (
              <Text key={phase.label} fontSize="lg">
                {phase.emoji}
                {i < phasesReached - 1 && (
                  <Text as="span" fontSize="xs" mx={1}>
                    →
                  </Text>
                )}
              </Text>
            ))}
          </HStack>
        </MotionBox>
      </MotionBox>

      {/* Stats */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        w="100%"
        maxW="500px"
      >
        <Flex justify="center" gap={8} mb={4}>
          <VStack spacing={0}>
            <Text fontSize="2xl" fontWeight="black">
              {catches}
            </Text>
            <Text fontSize="xs" color={subtleText}>
              catches
            </Text>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize="2xl" fontWeight="black">
              {formatTime(timePlayed)}
            </Text>
            <Text fontSize="xs" color={subtleText}>
              time played
            </Text>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize="2xl" fontWeight="black">
              {lives}/3
            </Text>
            <Text fontSize="xs" color={subtleText}>
              lives left
            </Text>
          </VStack>
        </Flex>

        <Text
          fontSize="sm"
          color={subtleText}
          textAlign="center"
          fontStyle="italic"
          mb={2}
        >
          {getRelationshipStatus(catches, won)}
        </Text>
      </MotionBox>

      {/* Final words */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        textAlign="center"
        maxW="400px"
        px={4}
      >
        <Text fontSize="xs" color={subtleText} mb={1}>
          {circleName}&apos;s final words:
        </Text>
        <Text fontSize="sm" fontStyle="italic" fontWeight="medium">
          &ldquo;{finalWords}&rdquo;
        </Text>
      </MotionBox>

      {/* Play again */}
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <Button colorScheme="red" size="md" onClick={onPlayAgain}>
          Hunt Another Circle
        </Button>
      </MotionBox>
    </VStack>
  );
}
