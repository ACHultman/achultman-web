import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Button,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import type { PersonalityProfile, Archetype } from './scenarios';

const MotionBox = motion(Box);

interface EndScreenProps {
  profile: PersonalityProfile;
  archetype: Archetype;
  headline: string;
  roundResults: string[];
  onRestart: () => void;
}

const AXIS_LABELS: { key: keyof PersonalityProfile; label: string; color: string; emoji: string }[] = [
  { key: 'chaos', label: 'Chaos', color: 'red', emoji: '🔥' },
  { key: 'charm', label: 'Charm', color: 'pink', emoji: '✨' },
  { key: 'cowardice', label: 'Cowardice', color: 'blue', emoji: '🏃' },
  { key: 'pettiness', label: 'Pettiness', color: 'purple', emoji: '😤' },
];

const ARCHETYPE_EMOJI: Record<Archetype, string> = {
  'Agent of Chaos': '🌪️',
  'Corporate Charmer': '😎',
  'Professional Coward': '🐔',
  'Petty Tyrant': '👑',
  'Chaotic Good': '😇',
  'Unhinged Diplomat': '🤝',
  'Lawful Disaster': '📋',
  'Perfectly Average': '😐',
};

export default function EndScreen({
  profile,
  archetype,
  headline,
  roundResults,
  onRestart,
}: EndScreenProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const headlineBg = useColorModeValue('yellow.50', 'gray.900');
  const headlineBorder = useColorModeValue('gray.800', 'yellow.400');
  const maxAxis = Math.max(profile.chaos, profile.charm, profile.cowardice, profile.pettiness, 1);

  return (
    <VStack spacing={6} w="100%">
      {/* Newspaper headline */}
      <MotionBox
        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        w="100%"
        bg={headlineBg}
        border="3px solid"
        borderColor={headlineBorder}
        p={6}
        textAlign="center"
      >
        <Text
          fontSize="xs"
          fontFamily="serif"
          textTransform="uppercase"
          letterSpacing="widest"
          mb={2}
          color={subtleText}
        >
          The Daily Escalation — Breaking News
        </Text>
        <Heading
          as="h2"
          size="md"
          fontFamily="serif"
          fontWeight="900"
          textTransform="uppercase"
          lineHeight="1.3"
        >
          {headline}
        </Heading>
        <Text fontSize="xs" mt={2} color={subtleText} fontFamily="serif">
          Sources confirm the individual showed &quot;no signs of stopping.&quot;
        </Text>
      </MotionBox>

      {/* Archetype */}
      <MotionBox
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        textAlign="center"
      >
        <Text fontSize="4xl">{ARCHETYPE_EMOJI[archetype]}</Text>
        <Heading as="h3" size="lg" mt={1}>
          {archetype}
        </Heading>
        <Text fontSize="sm" color={subtleText} mt={1}>
          Your official personality classification
        </Text>
      </MotionBox>

      {/* Personality axes */}
      <MotionBox
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        w="100%"
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        p={5}
      >
        <Text fontWeight="bold" mb={4}>
          Personality Breakdown
        </Text>
        <VStack spacing={3} align="stretch">
          {AXIS_LABELS.map(({ key, label, color, emoji }) => (
            <Box key={key}>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm">
                  {emoji} {label}
                </Text>
                <Badge colorScheme={color} variant="subtle">
                  {profile[key]}
                </Badge>
              </HStack>
              <Progress
                value={(profile[key] / Math.max(maxAxis, 5)) * 100}
                colorScheme={color}
                size="sm"
                borderRadius="full"
              />
            </Box>
          ))}
        </VStack>
      </MotionBox>

      {/* Round recap */}
      <MotionBox
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        w="100%"
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        p={5}
      >
        <Text fontWeight="bold" mb={3}>
          Your Escalation Timeline
        </Text>
        <VStack spacing={2} align="stretch">
          {roundResults.map((result, i) => (
            <HStack key={i} align="start" spacing={3}>
              <Badge
                colorScheme="purple"
                variant="solid"
                fontSize="xs"
                minW="24px"
                textAlign="center"
              >
                {i + 1}
              </Badge>
              <Text fontSize="sm" color={subtleText}>
                {result}
              </Text>
            </HStack>
          ))}
        </VStack>
      </MotionBox>

      <Button colorScheme="purple" size="lg" onClick={onRestart}>
        Escalate Again
      </Button>
    </VStack>
  );
}
