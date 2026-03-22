import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';

import { useGameLoop } from '../../../hooks/useGameLoop';

interface PhysObj {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  mass: number;
  emoji: string;
  label: string;
  broken: boolean;
  rotation: number;
  angularVel: number;
  fixed: boolean; // floor, walls
  breakable: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  check: (objects: PhysObj[], stats: GameStats) => boolean;
  unlocked: boolean;
}

interface GameStats {
  objectsBroken: number;
  objectsThrown: number;
  totalVelocity: number;
  chairsOnDesk: number;
}

const W = 700;
const H = 450;
const GRAVITY = 400;
const FRICTION = 0.97;
const BOUNCE = 0.5;
const BREAK_VELOCITY = 200;

function createOfficeObjects(): PhysObj[] {
  const objects: PhysObj[] = [
    // Floor
    { id: 'floor', x: 0, y: H - 10, vx: 0, vy: 0, width: W, height: 10, mass: Infinity, emoji: '', label: '', broken: false, rotation: 0, angularVel: 0, fixed: true, breakable: false },
    // Left wall
    { id: 'wall-l', x: 0, y: 0, vx: 0, vy: 0, width: 8, height: H, mass: Infinity, emoji: '', label: '', broken: false, rotation: 0, angularVel: 0, fixed: true, breakable: false },
    // Right wall
    { id: 'wall-r', x: W - 8, y: 0, vx: 0, vy: 0, width: 8, height: H, mass: Infinity, emoji: '', label: '', broken: false, rotation: 0, angularVel: 0, fixed: true, breakable: false },

    // Desks
    { id: 'desk1', x: 50, y: H - 80, vx: 0, vy: 0, width: 120, height: 10, mass: 20, emoji: '', label: '', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: false },
    { id: 'desk2', x: 350, y: H - 80, vx: 0, vy: 0, width: 120, height: 10, mass: 20, emoji: '', label: '', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: false },

    // Monitors
    { id: 'monitor1', x: 70, y: H - 115, vx: 0, vy: 0, width: 35, height: 30, mass: 3, emoji: '🖥️', label: 'Monitor', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },
    { id: 'monitor2', x: 120, y: H - 115, vx: 0, vy: 0, width: 35, height: 30, mass: 3, emoji: '🖥️', label: 'Monitor', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },
    { id: 'monitor3', x: 370, y: H - 115, vx: 0, vy: 0, width: 35, height: 30, mass: 3, emoji: '🖥️', label: 'Monitor', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },

    // Chairs
    { id: 'chair1', x: 80, y: H - 50, vx: 0, vy: 0, width: 25, height: 35, mass: 5, emoji: '🪑', label: 'Chair', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: false },
    { id: 'chair2', x: 380, y: H - 50, vx: 0, vy: 0, width: 25, height: 35, mass: 5, emoji: '🪑', label: 'Chair', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: false },
    { id: 'chair3', x: 550, y: H - 50, vx: 0, vy: 0, width: 25, height: 35, mass: 5, emoji: '🪑', label: 'Chair', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: false },

    // Water cooler
    { id: 'cooler', x: 250, y: H - 70, vx: 0, vy: 0, width: 25, height: 55, mass: 15, emoji: '🚰', label: 'Water Cooler', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },

    // Coffee mugs
    { id: 'mug1', x: 100, y: H - 95, vx: 0, vy: 0, width: 12, height: 12, mass: 0.5, emoji: '☕', label: 'Mug', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },
    { id: 'mug2', x: 400, y: H - 95, vx: 0, vy: 0, width: 12, height: 12, mass: 0.5, emoji: '☕', label: 'Mug', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },

    // Plants
    { id: 'plant1', x: 200, y: H - 40, vx: 0, vy: 0, width: 20, height: 30, mass: 3, emoji: '🪴', label: 'Plant', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },
    { id: 'plant2', x: 500, y: H - 40, vx: 0, vy: 0, width: 20, height: 30, mass: 3, emoji: '🪴', label: 'Plant', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },

    // Keyboard
    { id: 'keyboard', x: 360, y: H - 92, vx: 0, vy: 0, width: 30, height: 8, mass: 0.8, emoji: '⌨️', label: 'Keyboard', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },

    // Whiteboard
    { id: 'whiteboard', x: 520, y: H - 200, vx: 0, vy: 0, width: 100, height: 70, mass: 10, emoji: '📋', label: 'Whiteboard', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },

    // Printer
    { id: 'printer', x: 600, y: H - 55, vx: 0, vy: 0, width: 40, height: 30, mass: 12, emoji: '🖨️', label: 'Printer', broken: false, rotation: 0, angularVel: 0, fixed: false, breakable: true },
  ];
  return objects;
}

const SLACK_MESSAGES = [
  '@channel who keeps breaking things',
  '@here the kitchen is on fire again',
  'Has anyone seen the printer? It was here a minute ago',
  'IT: Please stop throwing monitors',
  'Facilities wants a word with whoever did this',
  'The plant did nothing wrong',
  'We just got that water cooler last week',
  'Legal is drafting a memo',
  'Insurance called. They\'re not happy.',
  'The whiteboard has been through enough',
  'HR has entered the chat',
  'This is why we can\'t have nice things',
];

const WHITEBOARD_MESSAGES = [
  'Please be nice to the office',
  'Days since last incident: 0',
  'This is a PROFESSIONAL workplace',
  'Seriously?',
  'I give up',
  'I didn\'t sign up for this',
  '← This person is the problem',
];

function createAchievements(): Achievement[] {
  return [
    { id: 'first-blood', name: 'First Blood', description: 'Break your first object', check: (_, s) => s.objectsBroken >= 1, unlocked: false },
    { id: 'hydration', name: 'Hydration Station', description: 'Knock over the water cooler', check: (objs) => objs.some((o) => o.id === 'cooler' && (Math.abs(o.vy) > 50 || o.broken)), unlocked: false },
    { id: 'feng-shui', name: 'Feng Shui', description: 'Get 3+ chairs airborne at once', check: (objs) => objs.filter((o) => o.label === 'Chair' && o.y < H - 100).length >= 3, unlocked: false },
    { id: 'barista', name: 'Barista Nightmare', description: 'Break both coffee mugs', check: (objs) => objs.filter((o) => o.label === 'Mug' && o.broken).length >= 2, unlocked: false },
    { id: 'nature', name: 'Against Nature', description: 'Destroy both plants', check: (objs) => objs.filter((o) => o.label === 'Plant' && o.broken).length >= 2, unlocked: false },
    { id: 'total', name: 'Total Annihilation', description: '100% destruction', check: (objs) => { const breakable = objs.filter((o) => o.breakable); return breakable.length > 0 && breakable.every((o) => o.broken); }, unlocked: false },
    { id: 'velocity', name: 'Speed Demon', description: 'Launch an object at extreme speed', check: (objs) => objs.some((o) => Math.sqrt(o.vx * o.vx + o.vy * o.vy) > 500), unlocked: false },
    { id: 'hr-word', name: 'HR Would Like a Word', description: 'Break 5+ objects', check: (_, s) => s.objectsBroken >= 5, unlocked: false },
  ];
}

export default function WhatCouldGoWrong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objects, setObjects] = useState<PhysObj[]>(createOfficeObjects);
  const [achievements, setAchievements] = useState<Achievement[]>(createAchievements);
  const [stats, setStats] = useState<GameStats>({ objectsBroken: 0, objectsThrown: 0, totalVelocity: 0, chairsOnDesk: 0 });
  const [slackMessage, setSlackMessage] = useState('');
  const slackMsgRef = useRef('');
  const [whiteboardMsg, setWhiteboardMsg] = useState('Days since last incident: ∞');
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const objectsRef = useRef(objects);
  objectsRef.current = objects;
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const draggingRef = useRef(dragging);
  draggingRef.current = dragging;
  const mousePosRef = useRef(mousePos);
  mousePosRef.current = mousePos;

  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const achievementBg = useColorModeValue('green.50', 'green.900');
  const toast = useToast();

  const slackMsgIdx = useRef(0);

  const showSlack = useCallback(() => {
    const msg = SLACK_MESSAGES[slackMsgIdx.current % SLACK_MESSAGES.length]!;
    slackMsgIdx.current++;
    slackMsgRef.current = msg;
    setSlackMessage(msg);
    setTimeout(() => { slackMsgRef.current = ''; setSlackMessage(''); }, 3000);
  }, []);

  // Physics update
  useGameLoop(
    (dt) => {
      const objs = objectsRef.current.map((o) => ({ ...o }));
      const s = { ...statsRef.current };

      for (const obj of objs) {
        if (obj.fixed) continue;

        // If being dragged, move toward mouse
        if (draggingRef.current === obj.id) {
          const dx = mousePosRef.current.x - (obj.x + obj.width / 2);
          const dy = mousePosRef.current.y - (obj.y + obj.height / 2);
          obj.vx = dx * 10;
          obj.vy = dy * 10;
          obj.x += obj.vx * dt;
          obj.y += obj.vy * dt;
          continue;
        }

        // Gravity
        obj.vy += GRAVITY * dt;

        // Friction
        obj.vx *= FRICTION;

        // Move
        obj.x += obj.vx * dt;
        obj.y += obj.vy * dt;

        // Angular
        obj.rotation += obj.angularVel * dt;
        obj.angularVel *= 0.98;

        // Collision with fixed objects (floor, walls)
        for (const other of objs) {
          if (other.id === obj.id) continue;
          if (!collides(obj, other)) continue;

          if (other.fixed) {
            // Bounce off walls/floor
            if (other.id === 'floor') {
              obj.y = other.y - obj.height;
              if (Math.abs(obj.vy) > BREAK_VELOCITY && obj.breakable && !obj.broken) {
                obj.broken = true;
                s.objectsBroken++;
                showSlack();
              }
              obj.vy = -obj.vy * BOUNCE;
              obj.angularVel += obj.vx * 0.01;
              if (Math.abs(obj.vy) < 10) obj.vy = 0;
            } else if (other.id === 'wall-l') {
              obj.x = other.x + other.width;
              obj.vx = -obj.vx * BOUNCE;
            } else if (other.id === 'wall-r') {
              obj.x = other.x - obj.width;
              obj.vx = -obj.vx * BOUNCE;
            }
          } else {
            // Object-object collision
            const speed = Math.sqrt(
              (obj.vx - other.vx) ** 2 + (obj.vy - other.vy) ** 2
            );

            if (speed > BREAK_VELOCITY) {
              if (obj.breakable && !obj.broken) {
                obj.broken = true;
                s.objectsBroken++;
              }
              if (other.breakable && !other.broken) {
                other.broken = true;
                s.objectsBroken++;
                showSlack();
              }
            }

            // Simple push apart
            const overlapX = Math.min(
              obj.x + obj.width - other.x,
              other.x + other.width - obj.x
            );
            const overlapY = Math.min(
              obj.y + obj.height - other.y,
              other.y + other.height - obj.y
            );

            if (overlapX < overlapY) {
              if (obj.x < other.x) {
                obj.x -= overlapX / 2;
                other.x += overlapX / 2;
              } else {
                obj.x += overlapX / 2;
                other.x -= overlapX / 2;
              }
              const tempVx = obj.vx;
              obj.vx = other.vx * BOUNCE;
              other.vx = tempVx * BOUNCE;
            } else {
              if (obj.y < other.y) {
                obj.y -= overlapY / 2;
                other.y += overlapY / 2;
              } else {
                obj.y += overlapY / 2;
                other.y -= overlapY / 2;
              }
              const tempVy = obj.vy;
              obj.vy = other.vy * BOUNCE;
              other.vy = tempVy * BOUNCE;
            }
          }
        }

        // Keep in bounds
        if (obj.y > H - 10 - obj.height) {
          obj.y = H - 10 - obj.height;
          if (Math.abs(obj.vy) < 10) obj.vy = 0;
          else obj.vy = -obj.vy * BOUNCE;
        }
        if (obj.x < 8) { obj.x = 8; obj.vx = Math.abs(obj.vx) * BOUNCE; }
        if (obj.x + obj.width > W - 8) { obj.x = W - 8 - obj.width; obj.vx = -Math.abs(obj.vx) * BOUNCE; }
      }

      // Update whiteboard based on destruction
      const broken = objs.filter((o) => o.breakable && o.broken).length;
      const total = objs.filter((o) => o.breakable).length;
      if (broken > 0) {
        const idx = Math.min(broken - 1, WHITEBOARD_MESSAGES.length - 1);
        setWhiteboardMsg(WHITEBOARD_MESSAGES[idx]!);
      }

      setStats(s);
      setObjects(objs);

      // Render
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = '#f7fafc';
      ctx.fillRect(0, 0, W, H);

      // Floor
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, H - 10, W, 10);

      // Walls
      ctx.fillStyle = '#edf2f7';
      ctx.fillRect(0, 0, 8, H);
      ctx.fillRect(W - 8, 0, 8, H);

      // Destruction percentage
      const destructPct = total > 0 ? Math.round((broken / total) * 100) : 0;

      // Draw objects
      for (const obj of objs) {
        if (obj.fixed) continue;

        ctx.save();
        const cx = obj.x + obj.width / 2;
        const cy = obj.y + obj.height / 2;
        ctx.translate(cx, cy);
        ctx.rotate(obj.rotation);

        if (obj.emoji) {
          ctx.font = `${Math.min(obj.width, obj.height)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (obj.broken) {
            ctx.globalAlpha = 0.4;
            ctx.fillText('💥', 0, 0);
            ctx.globalAlpha = 1;
          } else {
            ctx.fillText(obj.emoji, 0, 0);
          }
        } else {
          // Desks etc - draw as rectangles
          ctx.fillStyle = obj.broken ? '#e5383566' : '#a0aec0';
          ctx.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
        }

        ctx.restore();
      }

      // HUD
      ctx.fillStyle = '#1a202c';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Destruction: ${destructPct}%`, 15, 20);

      ctx.textAlign = 'right';
      ctx.fillText(`Objects broken: ${broken}/${total}`, W - 15, 20);

      // Slack message
      if (slackMsgRef.current) {
        ctx.fillStyle = '#1a202cdd';
        ctx.fillRect(W - 280, H - 40, 270, 30);
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`#general: ${slackMsgRef.current}`, W - 275, H - 22);
      }
    },
    true
  );

  // Check achievements
  useEffect(() => {
    const newAchievements = achievements.map((a) => {
      if (a.unlocked) return a;
      if (a.check(objects, stats)) {
        toast({
          title: `🏆 ${a.name}`,
          description: a.description,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        return { ...a, unlocked: true };
      }
      return a;
    });
    if (newAchievements.some((a, i) => a.unlocked !== achievements[i]?.unlocked)) {
      setAchievements(newAchievements);
    }
  }, [stats.objectsBroken, objects, stats, achievements, toast]);

  // Mouse handlers
  const getCanvasPos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * W,
        y: ((e.clientY - rect.top) / rect.height) * H,
      };
    },
    []
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getCanvasPos(e);
      // Find clicked object
      for (let i = objectsRef.current.length - 1; i >= 0; i--) {
        const obj = objectsRef.current[i]!;
        if (obj.fixed) continue;
        if (
          pos.x >= obj.x &&
          pos.x <= obj.x + obj.width &&
          pos.y >= obj.y &&
          pos.y <= obj.y + obj.height
        ) {
          setDragging(obj.id);
          setDragStart(pos);
          setMousePos(pos);
          return;
        }
      }
    },
    [getCanvasPos]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getCanvasPos(e);
      setMousePos(pos);
    },
    [getCanvasPos]
  );

  const onMouseUp = useCallback(() => {
    if (dragging) {
      setStats((s) => ({ ...s, objectsThrown: s.objectsThrown + 1 }));
    }
    setDragging(null);
  }, [dragging]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <VStack spacing={4} align="stretch">
      <Box position="relative" borderRadius="lg" overflow="hidden" cursor={dragging ? 'grabbing' : 'grab'}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
      </Box>

      <Flex justify="space-between" fontSize="xs" color={subtleText}>
        <Text>Click and drag to grab objects. There is no objective.</Text>
        <Text>🏆 {unlockedCount}/{achievements.length}</Text>
      </Flex>

      {unlockedCount > 0 && (
        <Flex gap={2} flexWrap="wrap">
          {achievements.filter((a) => a.unlocked).map((a) => (
            <Box key={a.id} bg={achievementBg} px={2} py={1} borderRadius="md" fontSize="xs">
              🏆 {a.name}
            </Box>
          ))}
        </Flex>
      )}
    </VStack>
  );
}

function collides(a: PhysObj, b: PhysObj): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
