import type { Platform, Level } from './types';

const W = 800;
const H = 500;
const PLAT_H = 12;

function plat(x: number, y: number, w: number, type: Platform['type'] = 'normal'): Platform {
  return { x, y, width: w, height: PLAT_H, type };
}

function coin(x: number, y: number): Platform {
  return { x, y, width: 16, height: 16, type: 'coin' };
}

function spike(x: number, y: number, w: number): Platform {
  return { x, y, width: w, height: PLAT_H, type: 'spike' };
}

export function generateLevel(levelNum: number, hasLiar: boolean): Level {
  const platforms: Platform[] = [];
  const rng = seedRng(levelNum);

  // Floor and ceiling
  platforms.push(plat(0, H - PLAT_H, W));
  platforms.push(plat(0, 0, W));

  // Start platform (safe landing)
  platforms.push(plat(20, H - 80, 80));

  // Generate random platforms with increasing difficulty
  const numPlatforms = 5 + Math.min(levelNum, 15);
  const numSpikes = Math.floor(levelNum / 2);
  const numCoins = 3 + Math.min(Math.floor(levelNum / 3), 5);

  for (let i = 0; i < numPlatforms; i++) {
    const x = 80 + rng() * (W - 200);
    const y = 60 + rng() * (H - 140);
    const w = 50 + rng() * 80;
    platforms.push(plat(x, y, w));
  }

  // Add spikes
  for (let i = 0; i < numSpikes; i++) {
    const x = 60 + rng() * (W - 160);
    const y = 60 + rng() * (H - 140);
    const w = 30 + rng() * 40;

    if (hasLiar && rng() < 0.4) {
      // Fake spike (safe) — looks dangerous but isn't
      platforms.push({ x, y, width: w, height: PLAT_H, type: 'fake-spike' });
    } else {
      platforms.push(spike(x, y, w));
    }
  }

  // Add fake-safe platforms when liar mutation is active
  if (hasLiar) {
    for (let i = 0; i < 3; i++) {
      const x = 60 + rng() * (W - 160);
      const y = 60 + rng() * (H - 140);
      platforms.push({ x, y, width: 60, height: PLAT_H, type: 'fake-safe' });
    }
  }

  // Add coins
  for (let i = 0; i < numCoins; i++) {
    const x = 40 + rng() * (W - 80);
    const y = 40 + rng() * (H - 100);
    platforms.push(coin(x, y));
  }

  // Exit platform (top right area)
  platforms.push(plat(W - 100, 60, 80));

  return { platforms, width: W, height: H };
}

function seedRng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
