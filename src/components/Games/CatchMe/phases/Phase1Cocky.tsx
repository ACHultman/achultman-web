import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { PhaseProps } from '../index';

const MotionBox = motion(Box);

const TAUNTS = [
  'Go ahead. Click me. I dare you.',
  'Waiting...',
  "You gonna click or just stare?",
  "I've got all day, champ.",
  'My grandmother clicks faster and she\'s a JPEG.',
  'You click like you code — hesitantly.',
  'Lucky shot.',
  'Okay that one doesn\'t count.',
  'Did your mouse just sneeze?',
  'I wasn\'t even trying yet.',
  'You call that a click? I\'ve seen faster 404s.',
  'Even my CSS transitions are faster than you.',
  'Ctrl+Z that attempt, please.',
  'I\'m literally a circle. How are you missing?',
  'Are you using a trackpad? Explains a lot.',
  'That click had the energy of a Monday standup.',
  'You must write a lot of TODO comments.',
  'I bet you console.log to debug.',
  'Impressive. For a human.',
  'Keep going. This is entertaining.',
];

const CIRCLE_SIZE = 50;

export default function Phase1Cocky({
  catches,
  onCatch,
  gameAreaWidth,
  gameAreaHeight,
}: PhaseProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentTaunt, setCurrentTaunt] = useState(0);
  const [showTaunt, setShowTaunt] = useState(true);

  const bubbleBg = useColorModeValue('gray.700', 'gray.200');
  const bubbleColor = useColorModeValue('white', 'gray.800');

  const maxX = Math.max(0, gameAreaWidth - CIRCLE_SIZE);
  const maxY = Math.max(0, gameAreaHeight - CIRCLE_SIZE);

  // Set initial centered position
  useEffect(() => {
    setPosition({
      x: Math.max(0, (gameAreaWidth - CIRCLE_SIZE) / 2),
      y: Math.max(0, (gameAreaHeight - CIRCLE_SIZE) / 2),
    });
  }, [gameAreaWidth, gameAreaHeight]);

  const moveCircle = useCallback(() => {
    // Movement range increases with catches
    const range = 30 + catches * 15;
    setPosition((prev) => ({
      x: Math.max(0, Math.min(maxX, prev.x + (Math.random() - 0.5) * range)),
      y: Math.max(0, Math.min(maxY, prev.y + (Math.random() - 0.5) * range)),
    }));
  }, [catches, maxX, maxY]);

  const handleClick = useCallback(() => {
    onCatch();
    const tauntIndex = Math.min(catches + 1, TAUNTS.length - 1);
    setCurrentTaunt(tauntIndex);
    setShowTaunt(true);
    moveCircle();
  }, [onCatch, catches, moveCircle]);

  // Idle movement — more frequent as catches increase
  useEffect(() => {
    const interval = setInterval(
      () => {
        if (catches > 3) moveCircle();
      },
      Math.max(800, 2000 - catches * 120)
    );
    return () => clearInterval(interval);
  }, [catches, moveCircle]);

  const tauntText = useMemo(() => {
    return TAUNTS[currentTaunt] ?? TAUNTS[0]!;
  }, [currentTaunt]);

  // Auto-hide taunt
  useEffect(() => {
    if (showTaunt) {
      const timeout = setTimeout(() => setShowTaunt(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, [showTaunt, currentTaunt]);

  return (
    <>
      {/* Speech bubble */}
      {showTaunt && (
        <MotionBox
          position="absolute"
          top={Math.max(10, position.y - 50)}
          left={Math.max(10, Math.min(gameAreaWidth - 220, position.x - 80))}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          bg={bubbleBg}
          color={bubbleColor}
          px={3}
          py={2}
          borderRadius="lg"
          fontSize="xs"
          fontWeight="bold"
          maxW="200px"
          textAlign="center"
          pointerEvents="none"
          zIndex={10}
        >
          {tauntText}
        </MotionBox>
      )}

      {/* The circle */}
      <MotionBox
        position="absolute"
        w={`${CIRCLE_SIZE}px`}
        h={`${CIRCLE_SIZE}px`}
        borderRadius="50%"
        bg="red.400"
        cursor="pointer"
        onClick={handleClick}
        animate={{
          left: position.x,
          top: position.y,
          scale: [1, 1.05, 1],
        }}
        transition={{
          left: { type: 'spring', stiffness: 300, damping: 25 },
          top: { type: 'spring', stiffness: 300, damping: 25 },
          scale: { duration: 1.5, repeat: Infinity },
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 0 15px rgba(245, 101, 101, 0.5)"
        _hover={{ boxShadow: '0 0 25px rgba(245, 101, 101, 0.8)' }}
      >
        <Text fontSize="lg" userSelect="none">
          😏
        </Text>
      </MotionBox>
    </>
  );
}
