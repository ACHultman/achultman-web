import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { PhaseProps } from '../index';

const MotionBox = motion(Box);

const SCARED_TEXTS = [
  'WAIT NO',
  'PLEASE',
  'I HAVE A FAMILY',
  "I'M JUST A DIV",
  'NOT AGAIN',
  'HELP',
  "WHY WON'T YOU STOP",
  'I NEED AN ADULT',
  'THIS IS HARASSMENT',
  '*screaming*',
  'CALL HR',
  '*heavy breathing*',
  'LEAVE ME ALONE',
  'I SURRENDER',
  'uncle UNCLE',
];

const CIRCLE_SIZE = 45;
const DECOY_SIZE = 45;

interface CircleState {
  id: number;
  x: number;
  y: number;
  isReal: boolean;
}

export default function Phase2Scared({
  catches,
  onCatch,
  gameAreaWidth,
  gameAreaHeight,
  circleName,
}: PhaseProps) {
  const [circles, setCircles] = useState<CircleState[]>([]);
  const [scaredText, setScaredText] = useState('');
  const [showText, setShowText] = useState(false);
  const moveTimerRef = useRef<ReturnType<typeof setInterval>>();
  const nextIdRef = useRef(0);

  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const hidingLabelBg = useColorModeValue('gray.100', 'gray.700');

  const maxX = Math.max(0, gameAreaWidth - CIRCLE_SIZE);
  const maxY = Math.max(0, gameAreaHeight - CIRCLE_SIZE);

  const randomPos = useCallback(
    () => ({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    }),
    [maxX, maxY]
  );

  // Initialize circles
  useEffect(() => {
    const pos = randomPos();
    setCircles([{ id: nextIdRef.current++, ...pos, isReal: true }]);
  }, [randomPos]);

  // Add decoys as catches increase
  useEffect(() => {
    if (catches >= 15 && catches < 20) {
      // 2 decoys
      setCircles((prev) => {
        const real = prev.find((c) => c.isReal);
        if (!real) return prev;
        const decoys: CircleState[] = Array.from({ length: 2 }).map(() => ({
          id: nextIdRef.current++,
          ...randomPos(),
          isReal: false,
        }));
        return [real, ...decoys];
      });
    } else if (catches >= 20) {
      // 3 decoys
      setCircles((prev) => {
        const real = prev.find((c) => c.isReal);
        if (!real) return prev;
        const decoys: CircleState[] = Array.from({ length: 3 }).map(() => ({
          id: nextIdRef.current++,
          ...randomPos(),
          isReal: false,
        }));
        return [real, ...decoys];
      });
    }
  }, [catches, randomPos]);

  // Movement — gets faster
  useEffect(() => {
    const speed = Math.max(200, 800 - (catches - 10) * 40);
    moveTimerRef.current = setInterval(() => {
      setCircles((prev) =>
        prev.map((c) => {
          const range = c.isReal ? 120 + (catches - 10) * 8 : 80;
          return {
            ...c,
            x: Math.max(0, Math.min(maxX, c.x + (Math.random() - 0.5) * range)),
            y: Math.max(0, Math.min(maxY, c.y + (Math.random() - 0.5) * range)),
          };
        })
      );
    }, speed);

    return () => {
      if (moveTimerRef.current) clearInterval(moveTimerRef.current);
    };
  }, [catches, maxX, maxY]);

  // "Hiding" behind corners at higher catches
  useEffect(() => {
    if (catches >= 18) {
      const hideTimer = setInterval(() => {
        const corners = [
          { x: 0, y: 0 },
          { x: maxX, y: 0 },
          { x: 0, y: maxY },
          { x: maxX, y: maxY },
        ];
        const corner = corners[Math.floor(Math.random() * corners.length)]!;
        setCircles((prev) =>
          prev.map((c) => (c.isReal ? { ...c, x: corner.x, y: corner.y } : c))
        );
      }, 3000);
      return () => clearInterval(hideTimer);
    }
  }, [catches, maxX, maxY]);

  const handleCircleClick = useCallback(
    (circle: CircleState) => {
      if (circle.isReal) {
        onCatch();
        const text = SCARED_TEXTS[Math.floor(Math.random() * SCARED_TEXTS.length)]!;
        setScaredText(text);
        setShowText(true);
        setTimeout(() => setShowText(false), 1500);

        // Flee far away
        setCircles((prev) =>
          prev.map((c) =>
            c.isReal
              ? { ...c, ...randomPos() }
              : { ...c, id: nextIdRef.current++, ...randomPos() }
          )
        );
      } else {
        // Clicked a decoy — it vanishes briefly
        setCircles((prev) => prev.filter((c) => c.id !== circle.id));
        setTimeout(() => {
          setCircles((prev) => [
            ...prev,
            { id: nextIdRef.current++, ...randomPos(), isReal: false },
          ]);
        }, 800);
      }
    },
    [onCatch, randomPos]
  );

  return (
    <>
      {/* Name label hiding in corner */}
      {catches >= 16 && (
        <Box
          position="absolute"
          top={2}
          left={2}
          bg={hidingLabelBg}
          px={2}
          py={1}
          borderRadius="md"
          fontSize="xs"
          color={subtleText}
          zIndex={5}
          pointerEvents="none"
        >
          {circleName} is hiding...
        </Box>
      )}

      {/* Scared text popup */}
      {showText && (
        <MotionBox
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          initial={{ opacity: 0, scale: 2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          fontSize="xl"
          fontWeight="black"
          color="red.400"
          pointerEvents="none"
          zIndex={20}
          textAlign="center"
        >
          {scaredText}
        </MotionBox>
      )}

      {/* Circles */}
      {circles.map((circle) => (
        <MotionBox
          key={circle.id}
          position="absolute"
          w={`${circle.isReal ? CIRCLE_SIZE : DECOY_SIZE}px`}
          h={`${circle.isReal ? CIRCLE_SIZE : DECOY_SIZE}px`}
          borderRadius="50%"
          bg={circle.isReal ? 'red.400' : 'red.300'}
          cursor="pointer"
          onClick={() => handleCircleClick(circle)}
          animate={{
            left: circle.x,
            top: circle.y,
            // Real circle vibrates more visibly
            rotate: circle.isReal ? [0, 3, -3, 2, -2, 0] : [0, 1, -1, 0],
          }}
          transition={{
            left: { type: 'spring', stiffness: 200, damping: 20 },
            top: { type: 'spring', stiffness: 200, damping: 20 },
            rotate: {
              duration: circle.isReal ? 0.3 : 0.5,
              repeat: Infinity,
            },
          }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow={
            circle.isReal
              ? '0 0 20px rgba(245, 101, 101, 0.6)'
              : '0 0 10px rgba(245, 101, 101, 0.3)'
          }
          opacity={circle.isReal ? 1 : 0.85}
        >
          <Text fontSize="md" userSelect="none">
            😨
          </Text>
        </MotionBox>
      ))}
    </>
  );
}
