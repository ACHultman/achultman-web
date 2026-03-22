import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Progress,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import { useGameLoop, useKeyboard } from '../../../hooks/useGameLoop';
import { BLOCKS } from './types';
import type { RainGameState, Raindrop, Hazard, PlayerState, BlockDef } from './types';

const W = 600;
const H = 500;
const PLAYER_SPEED = 150;
const BLOCK_DURATION = 8; // seconds per block
const RAIN_DAMAGE = 15; // per second without umbrella
const UMBRELLA_RAIN_REDUCTION = 0.85;
const UMBRELLA_DAMAGE_RATE = 5; // per second in rain

function createInitialState(): RainGameState {
  return {
    player: {
      x: W / 2 - 8,
      y: H - 60,
      width: 16,
      height: 24,
      dryness: 100,
      umbrellaIntegrity: 100,
      hasUmbrella: true,
      cups: 0,
      swimming: false,
    },
    currentBlock: 0,
    blockProgress: 0,
    rain: [],
    hazards: [],
    gameOver: false,
    gameWon: false,
    gameStarted: false,
    floodLevel: 0,
    elapsedTime: 0,
    rating: '',
  };
}

function spawnRain(block: BlockDef, existing: Raindrop[]): Raindrop[] {
  const newDrops: Raindrop[] = [];
  const count = block.stormLevel * 3;
  for (let i = 0; i < count; i++) {
    newDrops.push({
      x: Math.random() * W,
      y: -10 - Math.random() * 50,
      speed: 200 + Math.random() * 200 + block.stormLevel * 30,
      angle: block.windStrength * 0.3 * (Math.random() > 0.5 ? 1 : -1),
    });
  }
  return [...existing.filter((r) => r.y < H + 10), ...newDrops].slice(0, 500);
}

function spawnHazard(block: BlockDef, blockProgress: number): Hazard | null {
  if (Math.random() > 0.03 * block.stormLevel) return null;

  const types = block.hazardTypes;
  const type = types[Math.floor(Math.random() * types.length)]!;

  const base: Hazard = {
    x: Math.random() * (W - 40),
    y: -30,
    width: 24,
    height: 24,
    type,
    vx: 0,
    vy: 60 + Math.random() * 40,
    timer: 0,
  };

  switch (type) {
    case 'car-splash':
      return { ...base, x: Math.random() > 0.5 ? -30 : W + 10, y: H * 0.3 + Math.random() * H * 0.5, vx: base.x < 0 ? 200 : -200, vy: 0, width: 40, height: 20 };
    case 'seagull':
      return { ...base, y: Math.random() * H * 0.5, vx: 80 + Math.random() * 60, vy: Math.sin(Math.random() * Math.PI) * 30 };
    case 'construction-sign':
      return { ...base, vx: block.windStrength * 40, vy: 40 + Math.random() * 60 };
    case 'starbucks-cup':
      return { ...base, vx: block.windStrength * 80, vy: 30, width: 12, height: 16 };
    case 'manhole':
      return { ...base, x: 40 + Math.random() * (W - 80), y: H - 40, vx: 0, vy: -120, width: 20, height: 20, timer: 3 };
    case 'kayaker':
      return { ...base, x: -40, y: H * 0.4, vx: 60, vy: 0, width: 40, height: 16 };
    case 'whale':
      return { ...base, x: W + 50, y: H * 0.6, vx: -30, vy: -20, width: 80, height: 30, timer: 4 };
    case 'floating-car':
      return { ...base, x: Math.random() * (W - 50), y: -40, vy: 20, width: 50, height: 24 };
    case 'shopping-cart':
      return { ...base, vx: (Math.random() - 0.5) * 100, vy: 30 + Math.random() * 40 };
    case 'octopus':
      return { ...base, x: Math.random() * (W - 30), y: H + 20, vy: -40, width: 30, height: 30, timer: 5 };
    case 'puddle':
      return { ...base, y: H - 20, vy: 0, width: 40, height: 8, timer: 10 };
    case 'awning':
      return { ...base, y: 60 + Math.random() * 100, vy: 0, width: 60, height: 8, timer: 999 };
    case 'tim-hortons':
      return { ...base, width: 14, height: 14 };
    default:
      return base;
  }
}

function getRating(dryness: number, cups: number): string {
  if (dryness >= 95 && cups >= 10)
    return 'Bone Dry Legend. You were dry the whole time and just being dramatic.';
  if (dryness >= 80) return 'Impressively Dry. You should work in weather avoidance.';
  if (dryness >= 60) return 'Mostly Dry. Your socks are only slightly squelchy.';
  if (dryness >= 40) return 'Damp. Like a towel left on a bathroom floor.';
  if (dryness >= 20) return 'Soaked. You are now part of the water cycle.';
  return 'Drowned Rat. Vancouver has claimed another soul.';
}

const EMOJI_MAP: Record<string, string> = {
  puddle: '💧',
  'car-splash': '🚗',
  seagull: '🦅',
  'construction-sign': '🚧',
  'starbucks-cup': '☕',
  manhole: '🕳️',
  kayaker: '🛶',
  'shopping-cart': '🛒',
  octopus: '🐙',
  whale: '🐋',
  awning: '🏠',
  'tim-hortons': '🍩',
  'floating-car': '🚙',
};

function renderGame(
  ctx: CanvasRenderingContext2D,
  state: RainGameState
) {
  const block = BLOCKS[state.currentBlock] ?? BLOCKS[0]!;
  const underwater = block.underwater || state.currentBlock >= 9;

  // Background
  ctx.fillStyle = block.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Underwater effect
  if (underwater) {
    ctx.fillStyle = '#0066cc22';
    ctx.fillRect(0, 0, W, H);
    // Bubbles
    for (let i = 0; i < 10; i++) {
      const bx = (state.elapsedTime * 20 + i * 67) % W;
      const by = H - ((state.elapsedTime * 30 + i * 43) % H);
      ctx.fillStyle = '#ffffff22';
      ctx.beginPath();
      ctx.arc(bx, by, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ground
  if (!underwater) {
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, H - 15, W, 15);
    // Sidewalk lines
    ctx.strokeStyle = '#4a5568';
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, H - 15);
    ctx.lineTo(W, H - 15);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Flood level
  if (state.floodLevel > 0) {
    ctx.fillStyle = '#2b6cb033';
    ctx.fillRect(0, H - state.floodLevel, W, state.floodLevel);
  }

  // Rain
  ctx.strokeStyle = underwater ? '#ffffff11' : '#63b3ed66';
  ctx.lineWidth = 1;
  for (const drop of state.rain) {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + drop.angle * 5, drop.y + 8);
    ctx.stroke();
  }

  // Hazards
  for (const h of state.hazards) {
    const emoji = EMOJI_MAP[h.type] ?? '❓';
    ctx.font = `${Math.max(h.width, h.height) - 4}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(emoji, h.x + h.width / 2, h.y + h.height - 2);
  }

  // Player
  const p = state.player;
  // Body
  ctx.fillStyle = '#ecc94b';
  ctx.fillRect(p.x, p.y, p.width, p.height);
  // Head
  ctx.fillStyle = '#fbd38d';
  ctx.beginPath();
  ctx.arc(p.x + p.width / 2, p.y - 4, 6, 0, Math.PI * 2);
  ctx.fill();

  // Umbrella
  if (p.hasUmbrella && p.umbrellaIntegrity > 0) {
    const integ = p.umbrellaIntegrity / 100;
    ctx.fillStyle = `rgba(66, 153, 225, ${0.3 + integ * 0.7})`;
    ctx.beginPath();
    ctx.arc(p.x + p.width / 2, p.y - 14, 18 * integ, Math.PI, 0);
    ctx.fill();
    // Umbrella stick
    ctx.strokeStyle = '#718096';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x + p.width / 2, p.y - 14);
    ctx.lineTo(p.x + p.width / 2, p.y);
    ctx.stroke();
  }

  // HUD
  ctx.fillStyle = '#00000088';
  ctx.fillRect(0, 0, W, 32);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Block ${state.currentBlock + 1}/10`, 8, 14);
  ctx.fillText(`💧 ${Math.round(p.dryness)}%`, 8, 28);

  ctx.textAlign = 'center';
  if (p.hasUmbrella) {
    ctx.fillText(`☂️ ${Math.round(p.umbrellaIntegrity)}%`, W / 2, 14);
  } else {
    ctx.fillStyle = '#e53e3e';
    ctx.fillText('☂️ BROKEN', W / 2, 14);
  }

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'right';
  ctx.fillText(`🍩 ${p.cups}/10`, W - 8, 14);

  // Block progress bar
  ctx.fillStyle = '#ffffff33';
  ctx.fillRect(0, 32, W, 3);
  ctx.fillStyle = '#48bb78';
  ctx.fillRect(0, 32, W * state.blockProgress, 3);
}

export default function VancouverRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<RainGameState>(createInitialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const keys = useKeyboard(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's']);
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  useGameLoop(
    (dt) => {
      const s = stateRef.current;
      if (!s.gameStarted || s.gameOver || s.gameWon) return;

      const block = BLOCKS[s.currentBlock] ?? BLOCKS[0]!;
      const k = keys.current;
      const player = { ...s.player };

      // Move player
      let dx = 0;
      let dy = 0;
      if (k['ArrowLeft'] || k['a']) dx -= PLAYER_SPEED;
      if (k['ArrowRight'] || k['d']) dx += PLAYER_SPEED;
      if (k['ArrowUp'] || k['w']) dy -= PLAYER_SPEED;
      if (k['ArrowDown'] || k['s']) dy += PLAYER_SPEED;

      // Wind push
      dx += block.windStrength * 20;

      player.x += dx * dt;
      player.y += dy * dt;

      // Bounds
      player.x = Math.max(0, Math.min(W - player.width, player.x));
      player.y = Math.max(30, Math.min(H - player.height - 15, player.y));

      // Rain damage
      let isUnderAwning = false;
      for (const h of s.hazards) {
        if (h.type === 'awning' && Math.abs(player.x + player.width / 2 - (h.x + h.width / 2)) < h.width / 2 && player.y > h.y && player.y < h.y + 80) {
          isUnderAwning = true;
        }
      }

      if (!isUnderAwning) {
        const rainIntensity = block.stormLevel / 10;
        if (player.hasUmbrella && player.umbrellaIntegrity > 0) {
          player.dryness -= RAIN_DAMAGE * rainIntensity * (1 - UMBRELLA_RAIN_REDUCTION) * dt;
          player.umbrellaIntegrity -= UMBRELLA_DAMAGE_RATE * rainIntensity * dt;
          if (player.umbrellaIntegrity <= 0) {
            player.umbrellaIntegrity = 0;
            player.hasUmbrella = false;
          }
        } else {
          player.dryness -= RAIN_DAMAGE * rainIntensity * dt;
        }
      }

      // Update rain
      let rain = s.rain.map((r) => ({
        ...r,
        x: r.x + r.angle * r.speed * dt,
        y: r.y + r.speed * dt,
      }));
      rain = spawnRain(block, rain);

      // Update hazards
      const hazards = s.hazards
        .map((h) => ({
          ...h,
          x: h.x + h.vx * dt,
          y: h.y + h.vy * dt,
          timer: h.timer - dt,
        }))
        .filter((h) => h.timer > 0 && h.x > -100 && h.x < W + 100 && h.y > -100 && h.y < H + 100);

      // Spawn new hazards
      const newHazard = spawnHazard(block, s.blockProgress);
      if (newHazard) hazards.push(newHazard);

      // Hazard collisions
      for (const h of hazards) {
        const hit =
          player.x < h.x + h.width &&
          player.x + player.width > h.x &&
          player.y < h.y + h.height &&
          player.y + player.height > h.y;

        if (!hit) continue;

        switch (h.type) {
          case 'puddle':
          case 'car-splash':
            player.dryness -= 8;
            break;
          case 'construction-sign':
          case 'shopping-cart':
            player.dryness -= 15;
            player.umbrellaIntegrity -= 20;
            break;
          case 'starbucks-cup':
            player.dryness -= 5;
            break;
          case 'manhole':
            player.dryness -= 25;
            break;
          case 'octopus':
            player.dryness -= 20;
            break;
          case 'tim-hortons':
            player.cups = Math.min(10, player.cups + 1);
            h.timer = 0; // remove on collect
            break;
          case 'awning':
            // Safe zone, handled above
            break;
          default:
            player.dryness -= 5;
        }
      }

      // Block progress
      let blockProgress = s.blockProgress + dt / BLOCK_DURATION;
      let currentBlock = s.currentBlock;

      if (blockProgress >= 1) {
        blockProgress = 0;
        currentBlock++;
        if (currentBlock >= 10) {
          // Win!
          const rating = getRating(player.dryness, player.cups);
          setState((prev) => ({
            ...prev,
            player,
            gameWon: true,
            rating,
          }));
          return;
        }
      }

      // Clamp dryness
      player.dryness = Math.max(0, Math.min(100, player.dryness));

      // Game over if completely soaked
      if (player.dryness <= 0) {
        setState((prev) => ({
          ...prev,
          player,
          gameOver: true,
          rating: getRating(0, player.cups),
        }));
        return;
      }

      // Flood level (slowly rises)
      const floodLevel = Math.max(0, (s.elapsedTime - 40) * 1.5);

      const newState: RainGameState = {
        ...s,
        player,
        rain,
        hazards,
        blockProgress,
        currentBlock,
        floodLevel,
        elapsedTime: s.elapsedTime + dt,
      };

      setState(newState);
      stateRef.current = newState;

      // Render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) renderGame(ctx, newState);
      }
    },
    state.gameStarted && !state.gameOver && !state.gameWon
  );

  // Initial render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !state.gameStarted) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#63b3ed';
        // Rain animation on title
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * W;
          const y = Math.random() * H;
          ctx.fillRect(x, y, 1, 6);
        }
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VANCOUVER RAIN DEATH RUN', W / 2, H / 2 - 30);
        ctx.font = '13px monospace';
        ctx.fillText('WASD / Arrow keys to move', W / 2, H / 2 + 10);
        ctx.fillText('Stay dry. Collect Tim Hortons cups. Survive.', W / 2, H / 2 + 30);
      }
    }
  }, [state.gameStarted]);

  const startGame = () => setState({ ...createInitialState(), gameStarted: true });

  const block = BLOCKS[state.currentBlock];

  return (
    <VStack spacing={4} align="stretch">
      <Box position="relative" borderRadius="lg" overflow="hidden">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          tabIndex={0}
        />

        {!state.gameStarted && (
          <Flex position="absolute" inset={0} align="center" justify="center" bg="blackAlpha.600">
            <Button colorScheme="blue" size="lg" onClick={startGame}>
              🌧️ Leave the Coffee Shop
            </Button>
          </Flex>
        )}

        <AnimatePresence>
          {(state.gameOver || state.gameWon) && (
            <Flex
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              position="absolute"
              inset={0}
              align="center"
              justify="center"
              bg="blackAlpha.800"
            >
              <VStack spacing={3} p={6}>
                <Heading size="md" color={state.gameWon ? 'green.300' : 'red.300'}>
                  {state.gameWon ? '🏠 You Made It Home!' : '💀 Soaked to the Bone'}
                </Heading>
                <Text color="white" textAlign="center" fontSize="sm">
                  {state.gameWon
                    ? `You arrived home ${Math.round(state.player.dryness)}% dry.`
                    : `You dissolved on block ${state.currentBlock + 1}.`}
                </Text>
                <Text color="whiteAlpha.800" textAlign="center" fontSize="sm" maxW="350px">
                  {state.rating}
                </Text>
                {state.player.cups > 0 && (
                  <Text color="orange.300" fontSize="sm">
                    🍩 Tim Hortons cups: {state.player.cups}/10
                  </Text>
                )}
                <Button colorScheme="blue" size="sm" onClick={startGame}>
                  Try Again
                </Button>
              </VStack>
            </Flex>
          )}
        </AnimatePresence>
      </Box>

      {state.gameStarted && block && !state.gameOver && !state.gameWon && (
        <Text fontSize="sm" color={subtleText} textAlign="center">
          {block.description}
        </Text>
      )}

      <Text fontSize="xs" color={subtleText} textAlign="center">
        WASD / Arrow keys to move. Avoid hazards. Duck under awnings to stay dry.
      </Text>
    </VStack>
  );
}
