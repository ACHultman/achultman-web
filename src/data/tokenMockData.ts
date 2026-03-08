export interface TokenProbability {
  token: string;
  probability: number;
}

export interface TokenPosition {
  position: number;
  selectedToken: string;
  topTokens: TokenProbability[];
}

export interface MockCompletion {
  prompt: string;
  tokens: TokenPosition[];
}

export const MOCK_COMPLETIONS: MockCompletion[] = [
  {
    prompt: 'The capital of France is',
    tokens: [
      {
        position: 0,
        selectedToken: ' Paris',
        topTokens: [
          { token: ' Paris', probability: 0.92 },
          { token: ' a', probability: 0.03 },
          { token: ' the', probability: 0.02 },
          { token: ' located', probability: 0.015 },
          { token: ' known', probability: 0.008 },
        ],
      },
      {
        position: 1,
        selectedToken: ',',
        topTokens: [
          { token: ',', probability: 0.65 },
          { token: '.', probability: 0.28 },
          { token: ' —', probability: 0.03 },
          { token: '!', probability: 0.02 },
          { token: ' and', probability: 0.01 },
        ],
      },
      {
        position: 2,
        selectedToken: ' which',
        topTokens: [
          { token: ' which', probability: 0.28 },
          { token: ' a', probability: 0.24 },
          { token: ' known', probability: 0.18 },
          { token: ' often', probability: 0.12 },
          { token: ' one', probability: 0.08 },
        ],
      },
      {
        position: 3,
        selectedToken: ' is',
        topTokens: [
          { token: ' is', probability: 0.72 },
          { token: ' has', probability: 0.10 },
          { token: ' sits', probability: 0.06 },
          { token: ' lies', probability: 0.04 },
          { token: ' was', probability: 0.03 },
        ],
      },
      {
        position: 4,
        selectedToken: ' known',
        topTokens: [
          { token: ' known', probability: 0.30 },
          { token: ' often', probability: 0.22 },
          { token: ' also', probability: 0.18 },
          { token: ' famous', probability: 0.12 },
          { token: ' home', probability: 0.08 },
        ],
      },
    ],
  },
  {
    prompt: 'Machine learning is a subset of',
    tokens: [
      {
        position: 0,
        selectedToken: ' artificial',
        topTokens: [
          { token: ' artificial', probability: 0.88 },
          { token: ' computer', probability: 0.05 },
          { token: ' AI', probability: 0.03 },
          { token: ' data', probability: 0.02 },
          { token: ' the', probability: 0.01 },
        ],
      },
      {
        position: 1,
        selectedToken: ' intelligence',
        topTokens: [
          { token: ' intelligence', probability: 0.97 },
          { token: ' Intelligence', probability: 0.015 },
          { token: '-intelligence', probability: 0.005 },
          { token: 'ly', probability: 0.003 },
          { token: ' intel', probability: 0.002 },
        ],
      },
      {
        position: 2,
        selectedToken: ' that',
        topTokens: [
          { token: ' that', probability: 0.42 },
          { token: ' (', probability: 0.18 },
          { token: '.', probability: 0.14 },
          { token: ',', probability: 0.12 },
          { token: ' which', probability: 0.08 },
        ],
      },
      {
        position: 3,
        selectedToken: ' focuses',
        topTokens: [
          { token: ' focuses', probability: 0.38 },
          { token: ' enables', probability: 0.18 },
          { token: ' allows', probability: 0.16 },
          { token: ' uses', probability: 0.12 },
          { token: ' involves', probability: 0.08 },
        ],
      },
      {
        position: 4,
        selectedToken: ' on',
        topTokens: [
          { token: ' on', probability: 0.92 },
          { token: ' primarily', probability: 0.03 },
          { token: ' specifically', probability: 0.02 },
          { token: ' mainly', probability: 0.015 },
          { token: ' heavily', probability: 0.008 },
        ],
      },
    ],
  },
  {
    prompt: 'To be or not to be',
    tokens: [
      {
        position: 0,
        selectedToken: ',',
        topTokens: [
          { token: ',', probability: 0.72 },
          { token: '—', probability: 0.12 },
          { token: ':', probability: 0.06 },
          { token: '.', probability: 0.05 },
          { token: '?', probability: 0.03 },
        ],
      },
      {
        position: 1,
        selectedToken: ' that',
        topTokens: [
          { token: ' that', probability: 0.88 },
          { token: ' this', probability: 0.04 },
          { token: ' as', probability: 0.03 },
          { token: ' the', probability: 0.02 },
          { token: ' which', probability: 0.01 },
        ],
      },
      {
        position: 2,
        selectedToken: ' is',
        topTokens: [
          { token: ' is', probability: 0.94 },
          { token: ' was', probability: 0.02 },
          { token: ' remains', probability: 0.015 },
          { token: "'s", probability: 0.01 },
          { token: ' has', probability: 0.008 },
        ],
      },
      {
        position: 3,
        selectedToken: ' the',
        topTokens: [
          { token: ' the', probability: 0.82 },
          { token: ' a', probability: 0.06 },
          { token: ' perhaps', probability: 0.04 },
          { token: ' one', probability: 0.03 },
          { token: ' arguably', probability: 0.02 },
        ],
      },
      {
        position: 4,
        selectedToken: ' question',
        topTokens: [
          { token: ' question', probability: 0.90 },
          { token: ' famous', probability: 0.04 },
          { token: ' most', probability: 0.02 },
          { token: ' central', probability: 0.015 },
          { token: ' ultimate', probability: 0.01 },
        ],
      },
    ],
  },
  {
    prompt: 'In the beginning, there was',
    tokens: [
      {
        position: 0,
        selectedToken: ' nothing',
        topTokens: [
          { token: ' nothing', probability: 0.28 },
          { token: ' only', probability: 0.22 },
          { token: ' the', probability: 0.18 },
          { token: ' darkness', probability: 0.14 },
          { token: ' light', probability: 0.08 },
        ],
      },
      {
        position: 1,
        selectedToken: '.',
        topTokens: [
          { token: '.', probability: 0.32 },
          { token: ' but', probability: 0.24 },
          { token: ' —', probability: 0.16 },
          { token: ',', probability: 0.14 },
          { token: '...', probability: 0.06 },
        ],
      },
      {
        position: 2,
        selectedToken: ' And',
        topTokens: [
          { token: ' And', probability: 0.28 },
          { token: ' Then', probability: 0.24 },
          { token: ' From', probability: 0.16 },
          { token: ' But', probability: 0.14 },
          { token: ' Out', probability: 0.08 },
        ],
      },
      {
        position: 3,
        selectedToken: ' then',
        topTokens: [
          { token: ' then', probability: 0.38 },
          { token: ' from', probability: 0.22 },
          { token: ',', probability: 0.16 },
          { token: ' out', probability: 0.10 },
          { token: ' in', probability: 0.06 },
        ],
      },
      {
        position: 4,
        selectedToken: ',',
        topTokens: [
          { token: ',', probability: 0.48 },
          { token: ' there', probability: 0.18 },
          { token: ' came', probability: 0.14 },
          { token: ' something', probability: 0.10 },
          { token: ' everything', probability: 0.04 },
        ],
      },
    ],
  },
  {
    prompt: 'The best way to predict the future is to',
    tokens: [
      {
        position: 0,
        selectedToken: ' create',
        topTokens: [
          { token: ' create', probability: 0.52 },
          { token: ' invent', probability: 0.22 },
          { token: ' build', probability: 0.10 },
          { token: ' make', probability: 0.06 },
          { token: ' shape', probability: 0.04 },
        ],
      },
      {
        position: 1,
        selectedToken: ' it',
        topTokens: [
          { token: ' it', probability: 0.88 },
          { token: ' the', probability: 0.04 },
          { token: ' your', probability: 0.03 },
          { token: ' a', probability: 0.02 },
          { token: ' one', probability: 0.01 },
        ],
      },
      {
        position: 2,
        selectedToken: '.',
        topTokens: [
          { token: '.', probability: 0.62 },
          { token: ',', probability: 0.14 },
          { token: ' —', probability: 0.10 },
          { token: ' yourself', probability: 0.06 },
          { token: '!', probability: 0.04 },
        ],
      },
      {
        position: 3,
        selectedToken: ' This',
        topTokens: [
          { token: ' This', probability: 0.28 },
          { token: ' —', probability: 0.22 },
          { token: '\n', probability: 0.18 },
          { token: ' A', probability: 0.12 },
          { token: ' That', probability: 0.08 },
        ],
      },
      {
        position: 4,
        selectedToken: ' quote',
        topTokens: [
          { token: ' quote', probability: 0.32 },
          { token: ' famous', probability: 0.22 },
          { token: ' timeless', probability: 0.14 },
          { token: ' idea', probability: 0.12 },
          { token: ' principle', probability: 0.08 },
        ],
      },
    ],
  },
];

/**
 * Given a prompt string, find the best matching mock completion
 * or generate a synthetic one based on the input.
 */
export function getMockCompletion(prompt: string): MockCompletion {
  const normalized = prompt.trim().toLowerCase();

  // Try exact or partial match
  const match = MOCK_COMPLETIONS.find(
    (mc) => normalized === mc.prompt.toLowerCase() ||
      mc.prompt.toLowerCase().startsWith(normalized) ||
      normalized.startsWith(mc.prompt.toLowerCase())
  );

  if (match) return match;

  // Generate a synthetic completion for unmatched prompts
  return generateSyntheticCompletion(prompt);
}

function generateSyntheticCompletion(prompt: string): MockCompletion {
  // Use a seeded pseudo-random based on the prompt for consistent results
  const seed = hashString(prompt);
  const rng = seededRandom(seed);

  const commonTokens = [
    ' the', ' a', ' is', ' of', ' and', ' to', ' in', ' that', ' it',
    ' for', ' was', ' on', ' are', ' with', ' as', ' this', ' be',
    ' have', ' from', ' or', ' an', ' will', ' can', ' has', ' but',
    ' not', ' you', ' all', ' they', ' we', ' when', ' there',
  ];

  const tokens: TokenPosition[] = [];
  for (let i = 0; i < 5; i++) {
    const shuffled = [...commonTokens].sort(() => rng() - 0.5);
    const selected = shuffled.slice(0, 5) as [string, string, string, string, string];
    const probs = generateProbabilities(5, rng);

    tokens.push({
      position: i,
      selectedToken: selected[0],
      topTokens: selected.map((t, j) => ({
        token: t,
        probability: probs[j] ?? 0,
      })),
    });
  }

  return { prompt, tokens };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateProbabilities(count: number, rng: () => number): number[] {
  // Generate a dominant first probability, then distribute the rest
  const first = 0.3 + rng() * 0.5; // 0.3 to 0.8
  const remaining = 1 - first;
  const rest: number[] = [];

  for (let i = 1; i < count; i++) {
    const share = remaining * (rng() * 0.5 + 0.1) / (count - 1);
    rest.push(share);
  }

  // Normalize rest to sum to `remaining`
  const restSum = rest.reduce((a, b) => a + b, 0);
  const normalized = rest.map((r) => (r / restSum) * remaining);

  return [first, ...normalized.sort((a, b) => b - a)];
}
