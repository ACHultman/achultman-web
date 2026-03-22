export interface GameMeta {
  id: string;
  title: string;
  emoji: string;
  description: string;
  colorScheme: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Chaotic';
}

export const GAME_METADATA: GameMeta[] = [
  {
    id: 'catch-me',
    title: 'Catch Me If You Can',
    emoji: '🔴',
    description:
      'Hunt a circle with feelings. It taunts, hides, fights back, questions existence, and eventually becomes the entire screen. Good luck with Gerald.',
    colorScheme: 'red',
    difficulty: 'Medium',
  },
  {
    id: 'escalator',
    title: 'The Escalator',
    emoji: '🎭',
    description:
      'A mundane scenario. Three choices. Hidden personality axes. Five rounds of escalating absurdity ending in a fake newspaper headline about you.',
    colorScheme: 'purple',
    difficulty: 'Easy',
  },
  {
    id: 'floor-is-lava',
    title: 'Floor is Lava (Literally)',
    emoji: '🌋',
    description:
      'Flip gravity. Collect coins. Dodge spikes. Every 5 levels the rules mutate — mirrored clones, rotating cameras, lying platforms. It stacks.',
    colorScheme: 'orange',
    difficulty: 'Hard',
  },
  {
    id: 'vancouver-rain',
    title: 'Vancouver Rain Death Run',
    emoji: '🌧️',
    description:
      'Walk 10 blocks home in Vancouver weather. It starts as drizzle. By block 9 you\'re platforming on floating cars while a whale breaches behind you.',
    colorScheme: 'blue',
    difficulty: 'Hard',
  },
  {
    id: 'how-much-is-a-billion',
    title: 'How Much Is A Billion?',
    emoji: '💰',
    description:
      'Scroll from $1 to $1 trillion. Watch scale break your brain. Try to buy a house in Vancouver at the $1M mark. Spoiler: you can\'t.',
    colorScheme: 'green',
    difficulty: 'Easy',
  },
  {
    id: 'what-could-go-wrong',
    title: 'What Could Go Wrong',
    emoji: '🏢',
    description:
      'A pristine office. Everything is a physics object. There is no objective. The whiteboard is already disappointed in you.',
    colorScheme: 'cyan',
    difficulty: 'Chaotic',
  },
];
