export interface Vec2 {
  x: number;
  y: number;
}

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  dryness: number; // 0-100
  umbrellaIntegrity: number; // 0-100
  hasUmbrella: boolean;
  cups: number;
  swimming: boolean;
}

export interface Raindrop {
  x: number;
  y: number;
  speed: number;
  angle: number; // wind effect
}

export interface Hazard {
  x: number;
  y: number;
  width: number;
  height: number;
  type: HazardType;
  vx: number;
  vy: number;
  timer: number;
}

export type HazardType =
  | 'puddle'
  | 'car-splash'
  | 'seagull'
  | 'construction-sign'
  | 'starbucks-cup'
  | 'manhole'
  | 'kayaker'
  | 'shopping-cart'
  | 'octopus'
  | 'whale'
  | 'awning'
  | 'tim-hortons'
  | 'floating-car';

export interface BlockDef {
  stormLevel: number; // 0-10, affects rain density and wind
  windStrength: number;
  hazardTypes: HazardType[];
  description: string;
  bgColor: string;
  underwater?: boolean;
}

export const BLOCKS: BlockDef[] = [
  { stormLevel: 1, windStrength: 0, hazardTypes: ['puddle', 'awning'], description: 'Light drizzle. How bad can it be?', bgColor: '#4a5568' },
  { stormLevel: 2, windStrength: 0.5, hazardTypes: ['puddle', 'awning'], description: 'Ok, actual rain now.', bgColor: '#3d4a5c' },
  { stormLevel: 3, windStrength: 1, hazardTypes: ['puddle', 'car-splash', 'seagull', 'awning'], description: 'Cars are actively trying to splash you.', bgColor: '#2d3748' },
  { stormLevel: 4, windStrength: 1.5, hazardTypes: ['puddle', 'car-splash', 'seagull', 'tim-hortons'], description: 'Seagulls. Why are there always seagulls.', bgColor: '#283141' },
  { stormLevel: 5, windStrength: 2, hazardTypes: ['car-splash', 'construction-sign', 'starbucks-cup', 'awning'], description: 'Storm. Things are airborne now.', bgColor: '#1a2332' },
  { stormLevel: 6, windStrength: 2.5, hazardTypes: ['construction-sign', 'starbucks-cup', 'tim-hortons'], description: 'A Starbucks cup just broke the sound barrier.', bgColor: '#15202e' },
  { stormLevel: 7, windStrength: 3, hazardTypes: ['car-splash', 'manhole', 'construction-sign'], description: 'Your umbrella just inverted. Classic.', bgColor: '#111b27' },
  { stormLevel: 8, windStrength: 3.5, hazardTypes: ['manhole', 'kayaker', 'starbucks-cup', 'tim-hortons'], description: 'A kayaker waves at you from the street.', bgColor: '#0d1620' },
  { stormLevel: 9, windStrength: 2, hazardTypes: ['floating-car', 'shopping-cart', 'whale'], description: 'The ocean has risen. Cars are boats now.', bgColor: '#0a2540' },
  { stormLevel: 10, windStrength: 1, hazardTypes: ['shopping-cart', 'octopus', 'tim-hortons'], description: 'Your apartment is underwater. Of course it is.', bgColor: '#062033' },
];

export interface RainGameState {
  player: PlayerState;
  currentBlock: number;
  blockProgress: number; // 0-1 within current block
  rain: Raindrop[];
  hazards: Hazard[];
  gameOver: boolean;
  gameWon: boolean;
  gameStarted: boolean;
  floodLevel: number; // rises over time, creates urgency
  elapsedTime: number;
  rating: string;
}
