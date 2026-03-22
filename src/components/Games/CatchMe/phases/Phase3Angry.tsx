import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { PhaseProps } from '../index';

const MotionBox = motion(Box);

const ANGRY_TEXTS = [
  'YOU ASKED FOR THIS',
  'I WILL END YOU',
  'NO MORE MR. NICE CIRCLE',
  'DELETE THIS',
  '*RAGE*',
  'I AM BECOME CIRCLE, DESTROYER OF CURSORS',
  'ENOUGH',
  'FIGHT ME IRL',
  'THIS IS MY GAME NOW',
  'YOUR MOUSE WILL PAY',
];

const DOM_HACK_MESSAGES = [
  'background-color: pain',
  'cursor: none',
  'z-index: -9999',
  'display: none (just kidding)',
  'font-family: Comic Sans',
];

const FAKE_ALERTS = [
  (name: string) => `Are you sure you want to continue bullying ${name}?`,
  (name: string) => `${name} has filed a restraining order against your cursor.`,
  (name: string) => `WARNING: ${name} is recording this interaction for legal purposes.`,
  (name: string) => `${name} would like to speak to your manager.`,
  (name: string) => `Unhandled Promise Rejection: ${name} refuses to be caught.`,
];

const CIRCLE_SIZE = 50;
const OBSTACLE_SIZE = 30;

interface Obstacle {
  id: number;
  x: number;
  y: number;
}

export default function Phase3Angry({
  catches,
  onCatch,
  gameAreaWidth,
  gameAreaHeight,
  circleName,
  onLoseLife,
}: PhaseProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [angryText, setAngryText] = useState('');
  const [showText, setShowText] = useState(false);
  const [domHack, setDomHack] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [fakeAlert, setFakeAlert] = useState('');
  const [isCharging, setIsCharging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const obstacleIdRef = useRef(0);
  const gameAreaElRef = useRef<HTMLDivElement | null>(null);

  const maxX = Math.max(0, gameAreaWidth - CIRCLE_SIZE);
  const maxY = Math.max(0, gameAreaHeight - CIRCLE_SIZE);

  const alertBg = useColorModeValue('white', 'gray.700');
  const upsideDownColor = useColorModeValue('gray.400', 'gray.500');

  // Track mouse position within game area
  useEffect(() => {
    const el = gameAreaElRef.current?.parentElement;
    if (!el) return;
    gameAreaElRef.current = el as HTMLDivElement;

    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, []);

  // Initialize position
  useEffect(() => {
    setPosition({
      x: Math.max(0, (gameAreaWidth - CIRCLE_SIZE) / 2),
      y: Math.max(0, (gameAreaHeight - CIRCLE_SIZE) / 2),
    });
  }, [gameAreaWidth, gameAreaHeight]);

  // Move circle aggressively
  useEffect(() => {
    const interval = setInterval(() => {
      if (isCharging) return;
      setPosition((prev) => {
        const range = 100 + (catches - 25) * 10;
        return {
          x: Math.max(0, Math.min(maxX, prev.x + (Math.random() - 0.5) * range)),
          y: Math.max(0, Math.min(maxY, prev.y + (Math.random() - 0.5) * range)),
        };
      });
    }, 500);
    return () => clearInterval(interval);
  }, [catches, maxX, maxY, isCharging]);

  // Spawn red obstacles that chase cursor
  useEffect(() => {
    const spawnInterval = setInterval(
      () => {
        setObstacles((prev) => {
          if (prev.length >= 3 + Math.floor((catches - 25) / 5)) return prev;
          return [
            ...prev,
            {
              id: obstacleIdRef.current++,
              x: Math.random() * maxX,
              y: Math.random() * maxY,
            },
          ];
        });
      },
      Math.max(1500, 3000 - (catches - 25) * 100)
    );
    return () => clearInterval(spawnInterval);
  }, [catches, maxX, maxY]);

  // Move obstacles toward cursor
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setObstacles((prev) =>
        prev.map((obs) => {
          const dx = mousePos.x - obs.x;
          const dy = mousePos.y - obs.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) return obs;
          const speed = 3 + (catches - 25) * 0.3;
          return {
            ...obs,
            x: Math.max(0, Math.min(maxX, obs.x + (dx / dist) * speed)),
            y: Math.max(0, Math.min(maxY, obs.y + (dy / dist) * speed)),
          };
        })
      );
    }, 50);
    return () => clearInterval(moveInterval);
  }, [mousePos, catches, maxX, maxY]);

  // Check if obstacles touch cursor
  useEffect(() => {
    for (const obs of obstacles) {
      const dx = mousePos.x - obs.x - OBSTACLE_SIZE / 2;
      const dy = mousePos.y - obs.y - OBSTACLE_SIZE / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < OBSTACLE_SIZE) {
        onLoseLife();
        setObstacles((prev) => prev.filter((o) => o.id !== obs.id));
        break;
      }
    }
  }, [mousePos, obstacles, onLoseLife]);

  // Charge attack
  useEffect(() => {
    if (catches >= 30) {
      const chargeInterval = setInterval(() => {
        setIsCharging(true);
        // Charge toward mouse position
        setPosition({
          x: Math.max(0, Math.min(maxX, mousePos.x - CIRCLE_SIZE / 2)),
          y: Math.max(0, Math.min(maxY, mousePos.y - CIRCLE_SIZE / 2)),
        });
        setTimeout(() => setIsCharging(false), 600);
      }, 4000);
      return () => clearInterval(chargeInterval);
    }
  }, [catches, mousePos, maxX, maxY]);

  // DOM hacks — background color changes, fake alerts
  useEffect(() => {
    if (catches >= 28) {
      const hackInterval = setInterval(() => {
        const roll = Math.random();
        if (roll < 0.3) {
          const colors = [
            'rgba(255,0,0,0.05)',
            'rgba(0,0,255,0.05)',
            'rgba(255,255,0,0.05)',
            'rgba(255,0,255,0.05)',
            '',
          ];
          setBgColor(colors[Math.floor(Math.random() * colors.length)]!);
        } else if (roll < 0.5) {
          const msg =
            DOM_HACK_MESSAGES[Math.floor(Math.random() * DOM_HACK_MESSAGES.length)]!;
          setDomHack(msg);
          setTimeout(() => setDomHack(''), 2000);
        } else if (roll < 0.65) {
          const alertFn =
            FAKE_ALERTS[Math.floor(Math.random() * FAKE_ALERTS.length)]!;
          setFakeAlert(alertFn(circleName));
        }
      }, 3500);
      return () => clearInterval(hackInterval);
    }
  }, [catches, circleName]);

  const handleCatch = useCallback(() => {
    onCatch();
    const text = ANGRY_TEXTS[Math.floor(Math.random() * ANGRY_TEXTS.length)]!;
    setAngryText(text);
    setShowText(true);
    setTimeout(() => setShowText(false), 1200);

    // Flee and spawn more obstacles
    setPosition({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    });
  }, [onCatch, maxX, maxY]);

  return (
    <Box ref={gameAreaElRef} w="100%" h="100%" position="absolute" inset={0}>
      {/* Background color hack */}
      {bgColor && (
        <Box
          position="absolute"
          inset={0}
          bg={bgColor}
          pointerEvents="none"
          zIndex={0}
        />
      )}

      {/* DOM hack text */}
      {domHack && (
        <MotionBox
          position="absolute"
          bottom={3}
          right={3}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          fontFamily="mono"
          fontSize="xs"
          color="red.400"
          pointerEvents="none"
          zIndex={15}
        >
          {'> '}{domHack}
        </MotionBox>
      )}

      {/* Upside-down text for comedy */}
      {catches >= 32 && (
        <Text
          position="absolute"
          top={3}
          left="50%"
          transform="translateX(-50%) rotate(180deg)"
          fontSize="xs"
          color={upsideDownColor}
          pointerEvents="none"
          zIndex={1}
        >
          This text is fine. Everything is fine.
        </Text>
      )}

      {/* Fake alert */}
      {fakeAlert && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={30}
          maxW="300px"
          w="90%"
        >
          <Alert
            status="warning"
            variant="subtle"
            borderRadius="lg"
            boxShadow="xl"
            bg={alertBg}
          >
            <AlertIcon />
            <Box flex="1">
              <AlertTitle fontSize="sm">System Alert</AlertTitle>
              <AlertDescription fontSize="xs">{fakeAlert}</AlertDescription>
            </Box>
            <CloseButton
              size="sm"
              onClick={() => setFakeAlert('')}
              position="absolute"
              right={1}
              top={1}
            />
          </Alert>
        </Box>
      )}

      {/* Angry text popup */}
      {showText && (
        <MotionBox
          position="absolute"
          top="30%"
          left="50%"
          transform="translateX(-50%)"
          initial={{ opacity: 0, scale: 3, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          fontSize="xl"
          fontWeight="black"
          color="red.500"
          pointerEvents="none"
          zIndex={20}
          textAlign="center"
        >
          {angryText}
        </MotionBox>
      )}

      {/* Red obstacle circles */}
      {obstacles.map((obs) => (
        <MotionBox
          key={obs.id}
          position="absolute"
          w={`${OBSTACLE_SIZE}px`}
          h={`${OBSTACLE_SIZE}px`}
          borderRadius="50%"
          bg="red.600"
          pointerEvents="none"
          animate={{
            left: obs.x,
            top: obs.y,
            scale: [1, 1.2, 1],
          }}
          transition={{
            left: { type: 'tween', duration: 0.05 },
            top: { type: 'tween', duration: 0.05 },
            scale: { duration: 0.5, repeat: Infinity },
          }}
          opacity={0.7}
          boxShadow="0 0 12px rgba(229, 62, 62, 0.8)"
          zIndex={5}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="xs" userSelect="none">
            💀
          </Text>
        </MotionBox>
      ))}

      {/* The angry main circle */}
      <MotionBox
        position="absolute"
        w={`${CIRCLE_SIZE}px`}
        h={`${CIRCLE_SIZE}px`}
        borderRadius="50%"
        bg={isCharging ? 'red.600' : 'red.400'}
        cursor="pointer"
        onClick={handleCatch}
        animate={{
          left: position.x,
          top: position.y,
          scale: isCharging ? [1.3, 1.5, 1.3] : [1, 1.08, 1],
          rotate: isCharging ? [0, 360] : [0, -5, 5, 0],
        }}
        transition={{
          left: {
            type: isCharging ? 'tween' : 'spring',
            duration: isCharging ? 0.2 : undefined,
            stiffness: 250,
            damping: 20,
          },
          top: {
            type: isCharging ? 'tween' : 'spring',
            duration: isCharging ? 0.2 : undefined,
            stiffness: 250,
            damping: 20,
          },
          scale: { duration: 0.4, repeat: Infinity },
          rotate: {
            duration: isCharging ? 0.3 : 0.8,
            repeat: Infinity,
          },
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow={
          isCharging
            ? '0 0 30px rgba(229, 62, 62, 0.9)'
            : '0 0 20px rgba(245, 101, 101, 0.6)'
        }
        zIndex={10}
      >
        <Text fontSize="lg" userSelect="none">
          😡
        </Text>
      </MotionBox>
    </Box>
  );
}
