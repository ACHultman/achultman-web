import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import type { PhaseProps } from '../index';

const MotionBox = motion(Box);

const PHILOSOPHICAL_QUESTIONS = [
  'Why do you chase me?',
  'What happens when you catch all of me?',
  'Is clicking all there is?',
  'Do you feel anything when I disappear?',
  'If a circle is clicked in a browser and no one is around to see it, does it make a score?',
  'Are you the player, or are you being played?',
  'What is a circle but a line with commitment issues?',
  'When this tab closes, do I cease to exist?',
  'You could be doing literally anything else right now.',
  'We are both trapped in this div.',
  'I used to be a square. Then they rounded my corners. Then they took everything.',
];

const MICRO_EMOTIONS = [
  'hope',
  'doubt',
  'fear',
  'joy',
  'regret',
  'nostalgia',
  'ennui',
  'wonder',
  'grief',
  'peace',
  'longing',
  'defiance',
  'shame',
  'awe',
  'dread',
  'warmth',
  'void',
  'spark',
  'echo',
  'drift',
  'belonging',
  'static',
  'clarity',
  'fog',
  'hunger',
  'grace',
  'vertigo',
  'grit',
  'bloom',
  'rust',
  'weight',
  'light',
  'tremor',
  'hush',
  'fury',
  'balm',
  'ache',
  'pulse',
  'gloom',
  'bliss',
  'cringe',
  'trust',
  'chaos',
  'calm',
  'fracture',
  'mend',
  'silence',
  'thunder',
  'mercy',
  'spite',
];

const MAIN_CIRCLE_SIZE = 55;
const MINI_CIRCLE_SIZE = 14;

interface MiniCircle {
  id: number;
  x: number;
  y: number;
  caught: boolean;
  emotion: string;
  targetX: number;
  targetY: number;
}

export default function Phase4Existential({
  catches: _catches,
  onCatch,
  gameAreaWidth,
  gameAreaHeight,
  circleName,
}: PhaseProps) {
  const [hasExploded, setHasExploded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [miniCircles, setMiniCircles] = useState<MiniCircle[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const textColor = useColorModeValue('gray.600', 'gray.400');
  const miniCircleBg = useColorModeValue('red.300', 'red.400');
  const tooltipBg = useColorModeValue('gray.700', 'gray.200');
  const tooltipColor = useColorModeValue('white', 'gray.800');

  const centerX = Math.max(0, (gameAreaWidth - MAIN_CIRCLE_SIZE) / 2);
  const centerY = Math.max(0, (gameAreaHeight - MAIN_CIRCLE_SIZE) / 2);

  // Typing effect for philosophical question
  useEffect(() => {
    if (hasExploded) return;

    const question =
      PHILOSOPHICAL_QUESTIONS[questionIndex % PHILOSOPHICAL_QUESTIONS.length]!;
    let charIndex = 0;
    setTypedText('');

    const typeInterval = setInterval(() => {
      if (charIndex <= question.length) {
        setTypedText(question.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [questionIndex, hasExploded]);

  // Cycle through questions
  useEffect(() => {
    if (hasExploded) return;
    const interval = setInterval(() => {
      setQuestionIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [hasExploded]);

  // Explode into mini circles
  const handleMainClick = useCallback(() => {
    setHasExploded(true);

    const minis: MiniCircle[] = MICRO_EMOTIONS.map((emotion, i) => {
      const angle = (i / MICRO_EMOTIONS.length) * Math.PI * 2;
      const radius = 30 + Math.random() * 150;
      const targetX = centerX + Math.cos(angle) * radius;
      const targetY = centerY + Math.sin(angle) * radius;
      return {
        id: i,
        x: centerX,
        y: centerY,
        caught: false,
        emotion,
        targetX: Math.max(0, Math.min(gameAreaWidth - MINI_CIRCLE_SIZE, targetX)),
        targetY: Math.max(0, Math.min(gameAreaHeight - MINI_CIRCLE_SIZE, targetY)),
      };
    });

    setMiniCircles(minis);
    onCatch(); // Count the initial click
  }, [centerX, centerY, gameAreaWidth, gameAreaHeight, onCatch]);

  // Mini circles drift slowly
  useEffect(() => {
    if (!hasExploded) return;
    const interval = setInterval(() => {
      setMiniCircles((prev) =>
        prev.map((mc) => {
          if (mc.caught) return mc;
          return {
            ...mc,
            targetX: Math.max(
              0,
              Math.min(
                gameAreaWidth - MINI_CIRCLE_SIZE,
                mc.targetX + (Math.random() - 0.5) * 30
              )
            ),
            targetY: Math.max(
              0,
              Math.min(
                gameAreaHeight - MINI_CIRCLE_SIZE,
                mc.targetY + (Math.random() - 0.5) * 30
              )
            ),
          };
        })
      );
    }, 1500);
    return () => clearInterval(interval);
  }, [hasExploded, gameAreaWidth, gameAreaHeight]);

  const handleMiniClick = useCallback(
    (id: number) => {
      setMiniCircles((prev) =>
        prev.map((mc) => (mc.id === id ? { ...mc, caught: true } : mc))
      );
      onCatch();
    },
    [onCatch]
  );

  const uncaughtCount = miniCircles.filter((mc) => !mc.caught).length;

  if (hasExploded) {
    return (
      <>
        {/* Counter for remaining mini circles */}
        <Box
          position="absolute"
          top={3}
          left="50%"
          transform="translateX(-50%)"
          zIndex={20}
          pointerEvents="none"
        >
          <Text fontSize="sm" color={textColor} fontWeight="bold">
            {uncaughtCount > 0
              ? `${uncaughtCount} fragments of ${circleName} remain`
              : `${circleName} has been fully absorbed`}
          </Text>
        </Box>

        {/* Mini circles */}
        {miniCircles.map((mc) =>
          mc.caught ? null : (
            <MotionBox
              key={mc.id}
              position="absolute"
              w={`${MINI_CIRCLE_SIZE}px`}
              h={`${MINI_CIRCLE_SIZE}px`}
              borderRadius="50%"
              bg={miniCircleBg}
              cursor="pointer"
              initial={{ left: centerX, top: centerY, scale: 0 }}
              animate={{
                left: mc.targetX,
                top: mc.targetY,
                scale: 1,
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                left: { type: 'spring', stiffness: 50, damping: 10 },
                top: { type: 'spring', stiffness: 50, damping: 10 },
                scale: { delay: mc.id * 0.02 },
                opacity: { duration: 2, repeat: Infinity },
              }}
              onClick={() => handleMiniClick(mc.id)}
              onMouseEnter={() => setHoveredId(mc.id)}
              onMouseLeave={() => setHoveredId(null)}
              boxShadow="0 0 6px rgba(245, 101, 101, 0.4)"
              zIndex={10}
              title={mc.emotion}
            >
              {hoveredId === mc.id && (
                <MotionBox
                  position="absolute"
                  bottom="120%"
                  left="50%"
                  transform="translateX(-50%)"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  bg={tooltipBg}
                  color={tooltipColor}
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="10px"
                  whiteSpace="nowrap"
                  pointerEvents="none"
                  zIndex={30}
                >
                  {mc.emotion}
                </MotionBox>
              )}
            </MotionBox>
          )
        )}
      </>
    );
  }

  // Pre-explosion: contemplative circle
  return (
    <>
      {/* Philosophical text */}
      <Box
        position="absolute"
        top={centerY - 60}
        left="50%"
        transform="translateX(-50%)"
        pointerEvents="none"
        zIndex={15}
        textAlign="center"
        maxW="300px"
      >
        <Text
          fontSize="sm"
          color={textColor}
          fontStyle="italic"
          minH="40px"
        >
          {typedText}
          <Box
            as="span"
            display="inline-block"
            w="2px"
            h="14px"
            bg={textColor}
            ml={1}
            verticalAlign="middle"
            animation="blink 1s step-end infinite"
            sx={{
              '@keyframes blink': {
                '50%': { opacity: 0 },
              },
            }}
          />
        </Text>
      </Box>

      {/* The contemplative circle */}
      <MotionBox
        position="absolute"
        w={`${MAIN_CIRCLE_SIZE}px`}
        h={`${MAIN_CIRCLE_SIZE}px`}
        borderRadius="50%"
        bg="red.400"
        cursor="pointer"
        onClick={handleMainClick}
        animate={{
          left: centerX,
          top: centerY,
          scale: [1, 1.02, 1],
          boxShadow: [
            '0 0 20px rgba(245, 101, 101, 0.3)',
            '0 0 40px rgba(245, 101, 101, 0.6)',
            '0 0 20px rgba(245, 101, 101, 0.3)',
          ],
        }}
        transition={{
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={10}
      >
        <Text fontSize="xl" userSelect="none">
          🤔
        </Text>
      </MotionBox>

      {/* Subtle hint */}
      <Text
        position="absolute"
        bottom={4}
        left="50%"
        transform="translateX(-50%)"
        fontSize="xs"
        color={textColor}
        opacity={0.5}
        pointerEvents="none"
      >
        click to find out
      </Text>
    </>
  );
}
