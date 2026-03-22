export interface Vec2 {
  x: number;
  y: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  gravityDir: 1 | -1; // 1 = down, -1 = up
  onGround: boolean;
  dead: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'normal' | 'spike' | 'coin' | 'fake-spike' | 'fake-safe';
  collected?: boolean;
}

export interface Level {
  platforms: Platform[];
  width: number;
  height: number;
}

export type MutationType =
  | 'walls-closing'
  | 'mirror-clone'
  | 'camera-rotate'
  | 'split-screen'
  | 'liar';

export interface Mutation {
  type: MutationType;
  level: number;
  description: string;
}

export const MUTATIONS: Mutation[] = [
  { type: 'walls-closing', level: 6, description: 'The walls are closing in...' },
  { type: 'mirror-clone', level: 10, description: 'A shadow appears. It moves when you move.' },
  { type: 'camera-rotate', level: 15, description: 'Reality tilts. Your controls don\'t.' },
  { type: 'split-screen', level: 20, description: 'Four worlds. One you.' },
  { type: 'liar', level: 25, description: 'Trust nothing.' },
];

export interface GameState {
  player: Player;
  mirror: Player | null;
  level: number;
  coins: number;
  totalCoins: number;
  deaths: number;
  activeMutations: MutationType[];
  cameraRotation: number;
  wallOffset: number;
  levelComplete: boolean;
  showingMutation: Mutation | null;
  gameStarted: boolean;
  platforms: Platform[];
}
