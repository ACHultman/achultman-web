import type { GameState, Platform, Player, MutationType } from './types';

const COLORS = {
  bg: '#1a1a2e',
  player: '#00ff88',
  mirror: '#ff00ff44',
  platform: '#4a5568',
  spike: '#e53e3e',
  fakeSpike: '#e53e3e', // looks same as spike
  fakeSafe: '#4a5568', // looks same as platform
  coin: '#ecc94b',
  coinCollected: '#ecc94b22',
  exit: '#48bb78',
  text: '#ffffff',
  wallClosing: '#e53e3e33',
  lava: '#ff4500',
};

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  canvasWidth: number,
  canvasHeight: number
) {
  const { activeMutations } = state;

  ctx.save();

  // Handle split-screen mutation
  if (activeMutations.includes('split-screen')) {
    renderSplitScreen(ctx, state, canvasWidth, canvasHeight);
    ctx.restore();
    return;
  }

  // Handle camera rotation
  if (activeMutations.includes('camera-rotate')) {
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(state.cameraRotation);
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
  }

  renderScene(ctx, state, 0, 0, canvasWidth, canvasHeight);
  ctx.restore();

  // HUD (always unrotated)
  renderHUD(ctx, state, canvasWidth);
}

function renderSplitScreen(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  cw: number,
  ch: number
) {
  const hw = cw / 2;
  const hh = ch / 2;
  const quads = [
    { x: 0, y: 0 },
    { x: hw, y: 0 },
    { x: 0, y: hh },
    { x: hw, y: hh },
  ];

  for (const quad of quads) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(quad.x, quad.y, hw, hh);
    ctx.clip();
    ctx.translate(quad.x, quad.y);
    ctx.scale(0.5, 0.5);
    renderScene(ctx, state, 0, 0, cw, ch);
    ctx.restore();
  }

  // Draw dividing lines
  ctx.strokeStyle = '#ffffff44';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hw, 0);
  ctx.lineTo(hw, ch);
  ctx.moveTo(0, hh);
  ctx.lineTo(cw, hh);
  ctx.stroke();

  renderHUD(ctx, state, cw);
}

function renderScene(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  _ox: number,
  _oy: number,
  cw: number,
  ch: number
) {
  // Background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, cw, ch);

  // Lava at bottom
  const lavaY = ch - 4;
  const grad = ctx.createLinearGradient(0, lavaY - 20, 0, ch);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(1, COLORS.lava + '66');
  ctx.fillStyle = grad;
  ctx.fillRect(0, lavaY - 20, cw, 24);

  // Wall closing overlay
  if (state.activeMutations.includes('walls-closing') && state.wallOffset > 0) {
    ctx.fillStyle = COLORS.wallClosing;
    ctx.fillRect(0, 0, state.wallOffset, ch);
    ctx.fillRect(cw - state.wallOffset, 0, state.wallOffset, ch);

    // Solid walls
    ctx.fillStyle = '#e53e3e88';
    ctx.fillRect(0, 0, Math.max(0, state.wallOffset - 10), ch);
    ctx.fillRect(cw - Math.max(0, state.wallOffset - 10), 0, Math.max(0, state.wallOffset - 10), ch);
  }

  // Platforms
  for (const p of state.platforms) {
    renderPlatform(ctx, p, state.activeMutations);
  }

  // Exit zone indicator
  const exitPlatform = state.platforms.find(
    (p) => p.type === 'normal' && p.x > cw - 150 && p.y < 100
  );
  if (exitPlatform) {
    ctx.fillStyle = COLORS.exit + '44';
    ctx.fillRect(exitPlatform.x, exitPlatform.y - 30, exitPlatform.width, 30);
    ctx.fillStyle = COLORS.exit;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', exitPlatform.x + exitPlatform.width / 2, exitPlatform.y - 10);
  }

  // Mirror player
  if (state.mirror) {
    renderPlayer(ctx, state.mirror, COLORS.mirror);
  }

  // Player
  if (!state.player.dead) {
    renderPlayer(ctx, state.player, COLORS.player);
  }
}

function renderPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  mutations: MutationType[]
) {
  switch (p.type) {
    case 'normal':
      ctx.fillStyle = COLORS.platform;
      ctx.fillRect(p.x, p.y, p.width, p.height);
      break;
    case 'spike':
      ctx.fillStyle = COLORS.spike;
      // Draw triangles
      for (let i = 0; i < p.width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(p.x + i, p.y + p.height);
        ctx.lineTo(p.x + i + 5, p.y);
        ctx.lineTo(p.x + i + 10, p.y + p.height);
        ctx.fill();
      }
      break;
    case 'fake-spike':
      // Looks exactly like spike but is safe
      ctx.fillStyle = COLORS.fakeSpike;
      for (let i = 0; i < p.width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(p.x + i, p.y + p.height);
        ctx.lineTo(p.x + i + 5, p.y);
        ctx.lineTo(p.x + i + 10, p.y + p.height);
        ctx.fill();
      }
      // Subtle shimmer when liar mutation active to hint
      if (mutations.includes('liar')) {
        ctx.fillStyle = '#ffffff08';
        ctx.fillRect(p.x, p.y, p.width, p.height);
      }
      break;
    case 'fake-safe':
      // Looks like normal platform but kills
      ctx.fillStyle = COLORS.fakeSafe;
      ctx.fillRect(p.x, p.y, p.width, p.height);
      if (mutations.includes('liar')) {
        ctx.fillStyle = '#ff000008';
        ctx.fillRect(p.x, p.y, p.width, p.height);
      }
      break;
    case 'coin':
      if (!p.collected) {
        ctx.fillStyle = COLORS.coin;
        ctx.beginPath();
        ctx.arc(p.x + 8, p.y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = COLORS.bg;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('$', p.x + 8, p.y + 12);
      }
      break;
  }
}

function renderPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Eyes
  const eyeY = player.gravityDir === 1 ? player.y + 4 : player.y + player.height - 8;
  ctx.fillStyle = '#000';
  ctx.fillRect(player.x + 3, eyeY, 3, 3);
  ctx.fillRect(player.x + player.width - 6, eyeY, 3, 3);
}

function renderHUD(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  canvasWidth: number
) {
  ctx.fillStyle = '#00000088';
  ctx.fillRect(0, 0, canvasWidth, 28);

  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Level ${state.level}`, 10, 18);

  ctx.textAlign = 'center';
  ctx.fillText(`💀 ${state.deaths}`, canvasWidth / 2, 18);

  ctx.textAlign = 'right';
  ctx.fillText(`🪙 ${state.coins}`, canvasWidth - 10, 18);
}
