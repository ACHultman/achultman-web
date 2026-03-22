import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import { useGameLoop, useKeyboard } from '../../../hooks/useGameLoop';
import { generateLevel } from './levels';
import { render } from './renderer';
import { MUTATIONS } from './types';
import type { GameState, Player, MutationType, Platform } from './types';

const W = 800;
const H = 500;
const GRAVITY = 800;
const MOVE_SPEED = 250;
const JUMP_VEL = 350;

function createPlayer(): Player {
  return {
    x: 40,
    y: H - 100,
    vx: 0,
    vy: 0,
    width: 16,
    height: 20,
    gravityDir: 1,
    onGround: false,
    dead: false,
  };
}

function createInitialState(): GameState {
  const level = generateLevel(1, false);
  return {
    player: createPlayer(),
    mirror: null,
    level: 1,
    coins: 0,
    totalCoins: 0,
    deaths: 0,
    activeMutations: [],
    cameraRotation: 0,
    wallOffset: 0,
    levelComplete: false,
    showingMutation: null,
    gameStarted: false,
    platforms: level.platforms,
  };
}

function collides(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function updatePlayer(
  player: Player,
  dt: number,
  platforms: Platform[],
  keys: Record<string, boolean>,
  mutations: MutationType[],
  invert: boolean
): { dead: boolean; coinsCollected: number; reachedExit: boolean } {
  let coinsCollected = 0;
  const hasLiar = mutations.includes('liar');

  // Horizontal movement
  const moveDir = invert ? -1 : 1;
  if (keys['ArrowLeft'] || keys['a']) {
    player.vx = -MOVE_SPEED * moveDir;
  } else if (keys['ArrowRight'] || keys['d']) {
    player.vx = MOVE_SPEED * moveDir;
  } else {
    player.vx = 0;
  }

  // Apply gravity
  player.vy += GRAVITY * player.gravityDir * dt;

  // Move X
  player.x += player.vx * dt;

  // Wall bounds
  const wallMin = mutations.includes('walls-closing') ? 0 : 0; // wallOffset handled in collision
  if (player.x < wallMin) player.x = wallMin;
  if (player.x + player.width > W) player.x = W - player.width;

  // Move Y
  player.y += player.vy * dt;
  player.onGround = false;

  // Platform collision
  for (const p of platforms) {
    if (p.type === 'coin') {
      if (!p.collected && collides(player.x, player.y, player.width, player.height, p.x, p.y, p.width, p.height)) {
        p.collected = true;
        coinsCollected++;
      }
      continue;
    }

    if (!collides(player.x, player.y, player.width, player.height, p.x, p.y, p.width, p.height)) {
      continue;
    }

    // Spike collision (kills unless fake-spike)
    if (p.type === 'spike') {
      return { dead: true, coinsCollected, reachedExit: false };
    }
    if (p.type === 'fake-spike') {
      // Safe! Just land on it
    }
    if (p.type === 'fake-safe' && hasLiar) {
      return { dead: true, coinsCollected, reachedExit: false };
    }

    // Landing on platform
    if (player.gravityDir === 1) {
      // Falling down
      if (player.vy > 0 && player.y + player.height > p.y && player.y < p.y) {
        player.y = p.y - player.height;
        player.vy = 0;
        player.onGround = true;
      }
    } else {
      // Falling up
      if (player.vy < 0 && player.y < p.y + p.height && player.y + player.height > p.y + p.height) {
        player.y = p.y + p.height;
        player.vy = 0;
        player.onGround = true;
      }
    }
  }

  // Check exit (top right area)
  if (player.x > W - 120 && player.y < 90) {
    return { dead: false, coinsCollected, reachedExit: true };
  }

  // Out of bounds = death
  if (player.y > H + 20 || player.y < -40) {
    return { dead: true, coinsCollected, reachedExit: false };
  }

  return { dead: false, coinsCollected, reachedExit: false };
}

export default function FloorIsLava() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<GameState>(createInitialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const keys = useKeyboard(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', ' ']);
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  // Flip gravity on space/up/down
  const lastFlipRef = useRef(0);
  useEffect(() => {
    const handleFlip = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') && stateRef.current.gameStarted && !stateRef.current.showingMutation) {
        const now = Date.now();
        if (now - lastFlipRef.current < 200) return;
        lastFlipRef.current = now;

        setState((prev) => {
          const newDir = prev.player.gravityDir === 1 ? -1 : 1;
          const newPlayer = { ...prev.player, gravityDir: newDir as 1 | -1 };
          const newMirror = prev.mirror
            ? { ...prev.mirror, gravityDir: (newDir * -1) as 1 | -1 }
            : null;
          return { ...prev, player: newPlayer, mirror: newMirror };
        });
      }
    };
    window.addEventListener('keydown', handleFlip);
    return () => window.removeEventListener('keydown', handleFlip);
  }, []);

  const loadLevel = useCallback((levelNum: number, prevState: GameState) => {
    const newMutations = [...prevState.activeMutations];
    let showMutation: GameState['showingMutation'] = null;

    const mutation = MUTATIONS.find((m) => m.level === levelNum);
    if (mutation) {
      newMutations.push(mutation.type);
      showMutation = mutation;
    }

    const hasLiar = newMutations.includes('liar');
    const level = generateLevel(levelNum, hasLiar);
    const player = createPlayer();

    const mirror = newMutations.includes('mirror-clone')
      ? { ...createPlayer(), x: W - 60, gravityDir: -1 as const }
      : null;

    return {
      ...prevState,
      player,
      mirror,
      level: levelNum,
      activeMutations: newMutations,
      platforms: level.platforms,
      levelComplete: false,
      showingMutation: showMutation,
      wallOffset: 0,
      cameraRotation: 0,
    };
  }, []);

  // Game loop
  useGameLoop(
    (dt) => {
      const s = stateRef.current;
      if (!s.gameStarted || s.showingMutation || s.levelComplete) return;

      // Update camera rotation
      let cameraRotation = s.cameraRotation;
      if (s.activeMutations.includes('camera-rotate')) {
        cameraRotation += dt * 0.15; // Slow rotation
      }

      // Update wall offset
      let wallOffset = s.wallOffset;
      if (s.activeMutations.includes('walls-closing')) {
        wallOffset = Math.min(wallOffset + dt * 15, 100);
      }

      // Update player
      const platformsCopy = s.platforms.map((p) => ({ ...p }));
      const playerCopy = { ...s.player };
      const result = updatePlayer(
        playerCopy,
        dt,
        platformsCopy,
        keys.current,
        s.activeMutations,
        false
      );

      // Update mirror
      const mirrorCopy = s.mirror ? { ...s.mirror } : null;
      if (mirrorCopy) {
        // Mirror moves inverted
        const mirrorKeys: Record<string, boolean> = {
          ArrowLeft: !!keys.current['ArrowRight'] || !!keys.current['d'],
          ArrowRight: !!keys.current['ArrowLeft'] || !!keys.current['a'],
        };
        const mirrorResult = updatePlayer(
          mirrorCopy,
          dt,
          platformsCopy,
          mirrorKeys,
          s.activeMutations,
          true
        );
        if (mirrorResult.dead) {
          // Mirror death = player death
          setState((prev) => ({
            ...prev,
            ...loadLevel(prev.level, prev),
            deaths: prev.deaths + 1,
          }));
          return;
        }
      }

      // Wall collision
      if (s.activeMutations.includes('walls-closing')) {
        if (playerCopy.x < wallOffset) playerCopy.x = wallOffset;
        if (playerCopy.x + playerCopy.width > W - wallOffset) {
          playerCopy.x = W - wallOffset - playerCopy.width;
        }
        if (wallOffset >= W / 2 - 20) {
          // Crushed
          setState((prev) => ({
            ...prev,
            ...loadLevel(prev.level, prev),
            deaths: prev.deaths + 1,
          }));
          return;
        }
      }

      if (result.dead) {
        setState((prev) => ({
          ...prev,
          ...loadLevel(prev.level, prev),
          deaths: prev.deaths + 1,
        }));
        return;
      }

      if (result.reachedExit) {
        setState((prev) => ({
          ...prev,
          levelComplete: true,
          coins: prev.coins + result.coinsCollected,
          totalCoins: prev.totalCoins + result.coinsCollected,
        }));
        // Auto-advance after brief delay
        setTimeout(() => {
          setState((prev) => loadLevel(prev.level + 1, prev));
        }, 800);
        return;
      }

      setState((prev) => ({
        ...prev,
        player: playerCopy,
        mirror: mirrorCopy,
        platforms: platformsCopy,
        coins: prev.coins + result.coinsCollected,
        totalCoins: prev.totalCoins + result.coinsCollected,
        cameraRotation,
        wallOffset,
      }));

      // Render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          render(ctx, stateRef.current, canvas.width, canvas.height);
        }
      }
    },
    state.gameStarted && !state.showingMutation
  );

  // Render when not in game loop (static screens)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !state.gameStarted) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FLOOR IS LAVA', W / 2, H / 2 - 30);
        ctx.font = '14px monospace';
        ctx.fillText('← → to move | Space to flip gravity', W / 2, H / 2 + 10);
        ctx.fillText('Reach the EXIT in the top-right corner', W / 2, H / 2 + 35);
      }
    }
  }, [state.gameStarted]);

  const startGame = () => {
    const initial = createInitialState();
    setState({ ...initial, gameStarted: true });
  };

  const dismissMutation = () => {
    setState((prev) => ({ ...prev, showingMutation: null }));
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box position="relative" borderRadius="lg" overflow="hidden">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            imageRendering: 'pixelated',
            transform: state.activeMutations.includes('camera-rotate')
              ? `rotate(${state.cameraRotation}rad)`
              : undefined,
            transition: 'transform 0.1s linear',
          }}
          tabIndex={0}
        />

        {/* Start overlay */}
        {!state.gameStarted && (
          <Flex
            position="absolute"
            inset={0}
            align="center"
            justify="center"
            bg="blackAlpha.600"
          >
            <Button colorScheme="orange" size="lg" onClick={startGame}>
              🌋 Start Game
            </Button>
          </Flex>
        )}

        {/* Mutation announcement overlay */}
        <AnimatePresence>
          {state.showingMutation && (
            <Flex
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              position="absolute"
              inset={0}
              align="center"
              justify="center"
              bg="blackAlpha.800"
              zIndex={2}
              onClick={dismissMutation}
              cursor="pointer"
            >
              <VStack spacing={3}>
                <Heading size="md" color="orange.300">
                  ⚠️ MUTATION
                </Heading>
                <Text color="white" fontSize="lg" fontWeight="bold" textAlign="center" px={4}>
                  {state.showingMutation.description}
                </Text>
                <Text color="whiteAlpha.600" fontSize="sm">
                  Click to continue
                </Text>
              </VStack>
            </Flex>
          )}
        </AnimatePresence>

        {/* Level complete overlay */}
        <AnimatePresence>
          {state.levelComplete && (
            <Flex
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              position="absolute"
              inset={0}
              align="center"
              justify="center"
              bg="blackAlpha.600"
            >
              <Heading size="lg" color="green.300">
                Level {state.level} Complete!
              </Heading>
            </Flex>
          )}
        </AnimatePresence>
      </Box>

      <Flex justify="space-between" fontSize="sm" color={subtleText}>
        <Text>
          Arrow keys / WASD to move. Space / Up / Down to flip gravity.
        </Text>
        <Text>
          {state.activeMutations.length > 0 && (
            <>Active mutations: {state.activeMutations.length}</>
          )}
        </Text>
      </Flex>

      {state.deaths > 0 && (
        <Text fontSize="sm" color={subtleText} textAlign="center">
          {state.deaths < 5
            ? 'The floor is lava. So is the ceiling. And sometimes the platforms.'
            : state.deaths < 20
              ? `${state.deaths} deaths and counting. The game respects your persistence.`
              : `${state.deaths} deaths. At this point, death respects YOUR persistence.`}
        </Text>
      )}
    </VStack>
  );
}
