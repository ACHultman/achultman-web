import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import type { PhaseProps } from '../index';

const MotionBox = motion(Box);

const FINAL_TAUNTS = [
  'I am everywhere.',
  'Find the gap.',
  'You made me this way.',
  'This is what you wanted.',
  'I AM the game now.',
  'There is no circle. Only void.',
  'Click the absence of me.',
  'Embrace the negative space.',
];

export default function Phase5Final({
  catches: _catches,
  onCatch,
  gameAreaWidth,
  gameAreaHeight,
  circleName,
}: PhaseProps) {
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });
  const [taunt, setTaunt] = useState('');
  const [showTaunt, setShowTaunt] = useState(true);
  const [clickFeedback, setClickFeedback] = useState<{
    x: number;
    y: number;
    hit: boolean;
  } | null>(null);

  const textColor = useColorModeValue('gray.600', 'gray.400');

  // The circle is 80% of the smaller dimension
  const circleSize = Math.min(gameAreaWidth, gameAreaHeight) * 0.8;
  const circleRadius = circleSize / 2;

  // Center the circle and slowly drift
  useEffect(() => {
    setCirclePos({
      x: (gameAreaWidth - circleSize) / 2,
      y: (gameAreaHeight - circleSize) / 2,
    });
  }, [gameAreaWidth, gameAreaHeight, circleSize]);

  // Slow drift
  useEffect(() => {
    const interval = setInterval(() => {
      setCirclePos((prev) => {
        const maxDrift = 20;
        const newX = prev.x + (Math.random() - 0.5) * maxDrift;
        const newY = prev.y + (Math.random() - 0.5) * maxDrift;
        return {
          x: Math.max(
            -(circleSize * 0.1),
            Math.min(gameAreaWidth - circleSize * 0.9, newX)
          ),
          y: Math.max(
            -(circleSize * 0.1),
            Math.min(gameAreaHeight - circleSize * 0.9, newY)
          ),
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [circleSize, gameAreaWidth, gameAreaHeight]);

  // Cycle taunts
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTaunt(FINAL_TAUNTS[i % FINAL_TAUNTS.length]!);
      setShowTaunt(true);
      setTimeout(() => setShowTaunt(false), 2500);
      i++;
    }, 4000);
    setTaunt(FINAL_TAUNTS[0]!);
    return () => clearInterval(interval);
  }, []);

  // Click handler — check if click is OUTSIDE the circle (the tiny sliver)
  const handleAreaClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const circleCenterX = circlePos.x + circleRadius;
      const circleCenterY = circlePos.y + circleRadius;
      const dx = clickX - circleCenterX;
      const dy = clickY - circleCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > circleRadius) {
        // Clicked outside the circle — success!
        onCatch();
        setClickFeedback({ x: clickX, y: clickY, hit: true });
      } else {
        setClickFeedback({ x: clickX, y: clickY, hit: false });
      }

      setTimeout(() => setClickFeedback(null), 600);
    },
    [circlePos, circleRadius, onCatch]
  );

  return (
    <Box
      position="absolute"
      inset={0}
      onClick={handleAreaClick}
      cursor="crosshair"
    >
      {/* The MASSIVE circle */}
      <MotionBox
        position="absolute"
        w={`${circleSize}px`}
        h={`${circleSize}px`}
        borderRadius="50%"
        bg="red.400"
        pointerEvents="none"
        animate={{
          left: circlePos.x,
          top: circlePos.y,
          scale: [1, 1.02, 1],
        }}
        transition={{
          left: { type: 'tween', duration: 2, ease: 'easeInOut' },
          top: { type: 'tween', duration: 2, ease: 'easeInOut' },
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 0 60px rgba(245, 101, 101, 0.4)"
        zIndex={5}
      >
        <Text fontSize="4xl" userSelect="none">
          👑
        </Text>
      </MotionBox>

      {/* Taunt text */}
      {showTaunt && (
        <MotionBox
          position="absolute"
          top={4}
          left="50%"
          transform="translateX(-50%)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          fontSize="sm"
          color={textColor}
          fontStyle="italic"
          textAlign="center"
          pointerEvents="none"
          zIndex={20}
          maxW="250px"
        >
          {taunt}
        </MotionBox>
      )}

      {/* Instruction */}
      <Text
        position="absolute"
        bottom={3}
        left="50%"
        transform="translateX(-50%)"
        fontSize="xs"
        color={textColor}
        opacity={0.6}
        pointerEvents="none"
        zIndex={20}
        textAlign="center"
      >
        Click what ISN&apos;T {circleName}
      </Text>

      {/* Click feedback */}
      {clickFeedback && (
        <MotionBox
          position="absolute"
          left={clickFeedback.x - 15}
          top={clickFeedback.y - 15}
          w="30px"
          h="30px"
          borderRadius="50%"
          border="2px solid"
          borderColor={clickFeedback.hit ? 'green.400' : 'red.300'}
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          pointerEvents="none"
          zIndex={30}
        />
      )}
    </Box>
  );
}
