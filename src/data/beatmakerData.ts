/**
 * BeatMaker — rule-based text-to-beat mapping data
 */

export interface InstrumentConfig {
  name: string;
  emoji: string;
  color: string;
  colorDark: string;
}

export const INSTRUMENTS: InstrumentConfig[] = [
  { name: 'Kick', emoji: '🥁', color: 'red.400', colorDark: 'red.300' },
  { name: 'Snare', emoji: '🪘', color: 'orange.400', colorDark: 'orange.300' },
  { name: 'Hi-Hat', emoji: '🔔', color: 'yellow.400', colorDark: 'yellow.300' },
  { name: 'Bass', emoji: '🎸', color: 'blue.400', colorDark: 'blue.300' },
  { name: 'Synth', emoji: '🎹', color: 'purple.400', colorDark: 'purple.300' },
];

export const STEPS = 16;

export type Pattern = boolean[][];

// Genre presets: each is a 5×16 grid (instruments × steps)
export const GENRE_PATTERNS: Record<string, { bpm: number; pattern: Pattern }> = {
  'boom-bap': {
    bpm: 90,
    pattern: [
      // Kick
      [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      // Snare
      [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      // Hi-Hat
      [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      // Bass
      [true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false],
      // Synth
      [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    ],
  },
  'trap': {
    bpm: 140,
    pattern: [
      [true, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false],
      [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      [true, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    ],
  },
  'house': {
    bpm: 125,
    pattern: [
      [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
      [false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false],
    ],
  },
  'lofi': {
    bpm: 75,
    pattern: [
      [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
      [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, true],
      [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
      [true, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false],
      [false, false, true, false, false, false, false, false, false, false, true, false, false, false, true, false],
    ],
  },
  'dnb': {
    bpm: 174,
    pattern: [
      [true, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
      [false, false, false, false, true, false, false, false, false, false, false, false, false, true, false, false],
      [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    ],
  },
  'reggaeton': {
    bpm: 95,
    pattern: [
      [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
      [false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true],
      [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    ],
  },
  'techno': {
    bpm: 135,
    pattern: [
      [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
    ],
  },
  'jazz': {
    bpm: 110,
    pattern: [
      [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
      [false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false],
      [false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true],
      [true, false, false, false, false, true, false, false, true, false, false, false, false, true, false, false],
      [false, true, false, false, false, false, false, true, false, false, false, true, false, false, false, false],
    ],
  },
};

// Keyword-to-genre mapping
const GENRE_KEYWORDS: Record<string, string[]> = {
  'boom-bap': ['boom bap', 'boom-bap', 'boombap', '90s hip hop', 'old school hip hop', 'classic hip hop'],
  'trap': ['trap', 'atlanta', 'hi-hats', 'triplet', '808'],
  'house': ['house', 'deep house', 'club', 'dance', 'four on the floor', 'edm'],
  'lofi': ['lofi', 'lo-fi', 'chill', 'study', 'relaxing', 'mellow', 'calm', 'cozy'],
  'dnb': ['dnb', 'drum and bass', 'drum & bass', 'jungle', 'breakbeat'],
  'reggaeton': ['reggaeton', 'latin', 'dembow', 'perreo'],
  'techno': ['techno', 'industrial', 'warehouse', 'rave', 'minimal'],
  'jazz': ['jazz', 'jazzy', 'swing', 'blues', 'smooth'],
};

// BPM modifiers
const BPM_KEYWORDS: Record<string, number> = {
  'slow': -20,
  'slower': -30,
  'fast': 20,
  'faster': 30,
  'uptempo': 25,
  'downtempo': -25,
  'double time': 40,
  'half time': -40,
};

// Instrument emphasis keywords
const INSTRUMENT_KEYWORDS: Record<string, number[]> = {
  'piano': [4],
  'synth': [4],
  'keys': [4],
  'bass heavy': [3],
  'bassline': [3],
  'bass': [3],
  'kick': [0],
  'snare': [1],
  'hi-hat': [2],
  'hihat': [2],
  'hats': [2],
  'percussion': [0, 1, 2],
  'drums': [0, 1, 2],
};

export interface ParsedBeat {
  genre: string;
  bpm: number;
  pattern: Pattern;
  description: string;
}

/**
 * Parse user text into a beat configuration
 */
export function parseTextToBeat(text: string): ParsedBeat {
  const lower = text.toLowerCase().trim();

  // Find genre
  let matchedGenre = 'boom-bap';
  let bestScore = 0;
  for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword) && keyword.length > bestScore) {
        matchedGenre = genre;
        bestScore = keyword.length;
      }
    }
  }

  const preset = GENRE_PATTERNS[matchedGenre] ?? GENRE_PATTERNS['boom-bap'];
  let bpm = preset.bpm;

  // Apply BPM modifiers
  for (const [keyword, modifier] of Object.entries(BPM_KEYWORDS)) {
    if (lower.includes(keyword)) {
      bpm = Math.max(60, Math.min(200, bpm + modifier));
    }
  }

  // Clone pattern
  const pattern: Pattern = preset.pattern.map((row) => [...row]);

  // Add emphasis for mentioned instruments
  for (const [keyword, indices] of Object.entries(INSTRUMENT_KEYWORDS)) {
    if (lower.includes(keyword)) {
      for (const idx of indices) {
        // Add a few more hits to emphasized instruments
        const emptySteps = pattern[idx]
          .map((v, i) => (!v ? i : -1))
          .filter((i) => i >= 0);
        const toAdd = Math.min(3, emptySteps.length);
        for (let i = 0; i < toAdd; i++) {
          const randomIdx = emptySteps[Math.floor(Math.random() * emptySteps.length)];
          pattern[idx][randomIdx] = true;
          emptySteps.splice(emptySteps.indexOf(randomIdx), 1);
        }
      }
    }
  }

  const genreLabel = matchedGenre.charAt(0).toUpperCase() + matchedGenre.slice(1).replace('-', ' ');

  return {
    genre: matchedGenre,
    bpm,
    pattern,
    description: `${genreLabel} beat at ${bpm} BPM`,
  };
}

export const EXAMPLE_PROMPTS = [
  'chill lofi hip hop with jazzy piano and a slow boom-bap beat',
  'fast trap beat with heavy 808 bass and rapid hi-hats',
  'deep house groove for a late-night club set',
  'drum and bass with rolling breakbeats',
  'reggaeton dembow rhythm with bass',
  'minimal techno warehouse rave beat',
  'jazzy swing beat with piano and brushed snare',
  'slow mellow lofi study beats',
];
