// ---------------------------------------------------------------------------
// Compression Visualizer — data & algorithms
// ---------------------------------------------------------------------------

export interface HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
  code?: string;
}

export interface CompressionStep {
  stepNumber: number;
  phase: 'frequency' | 'tree-building' | 'encoding' | 'result';
  title: string;
  description: string;
  nodes: { char: string | null; freq: number; isNew?: boolean; code?: string }[];
  tree: HuffmanNode | null;
  encodedBits: string;
  currentChar: string | null;
  highlightPath: ('left' | 'right')[];
}

export interface CompressionExample {
  name: string;
  input: string;
  description: string;
}

export const EXAMPLES: CompressionExample[] = [
  { name: 'Simple', input: 'ABRACADABRA', description: 'Classic example with repeated chars' },
  { name: 'Hello World', input: 'hello world', description: 'Common greeting' },
  { name: 'DNA Sequence', input: 'ATCGATCGATCG', description: '4-character alphabet' },
  { name: 'Binary', input: 'aaaaabbbbbccccddde', description: 'Skewed frequency distribution' },
  { name: 'Custom', input: '', description: 'Enter your own text' },
];

// ---- Huffman helpers -------------------------------------------------------

function countFrequencies(input: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of input) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }
  return freq;
}

function buildHuffmanTree(freq: Map<string, number>): HuffmanNode | null {
  const nodes: HuffmanNode[] = [...freq.entries()].map(([char, f]) => ({
    char,
    freq: f,
    left: null,
    right: null,
  }));
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0]!;

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    nodes.push({ char: null, freq: left.freq + right.freq, left, right });
  }
  return nodes[0]!;
}

function assignCodes(node: HuffmanNode | null, prefix: string, map: Map<string, string>): void {
  if (!node) return;
  if (node.char !== null) {
    node.code = prefix || '0'; // single-char edge case
    map.set(node.char, node.code);
    return;
  }
  assignCodes(node.left, prefix + '0', map);
  assignCodes(node.right, prefix + '1', map);
}

function cloneTree(node: HuffmanNode | null): HuffmanNode | null {
  if (!node) return null;
  return {
    char: node.char,
    freq: node.freq,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    code: node.code,
  };
}

function getPathForChar(
  node: HuffmanNode | null,
  target: string,
  path: ('left' | 'right')[],
): ('left' | 'right')[] | null {
  if (!node) return null;
  if (node.char === target) return path;
  const l = getPathForChar(node.left, target, [...path, 'left']);
  if (l) return l;
  return getPathForChar(node.right, target, [...path, 'right']);
}

// ---- Step generator --------------------------------------------------------

export function generateHuffmanSteps(input: string): CompressionStep[] {
  if (input.length === 0) return [];

  const steps: CompressionStep[] = [];
  let stepNum = 1;

  // Phase 1 — frequency counting
  const freq = countFrequencies(input);
  const sortedEntries = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  const accumulated: { char: string | null; freq: number; isNew?: boolean }[] = [];

  for (const [char, count] of sortedEntries) {
    accumulated.push({ char, freq: count, isNew: true });
    steps.push({
      stepNumber: stepNum++,
      phase: 'frequency',
      title: `Count '${char === ' ' ? 'SPACE' : char}'`,
      description: `Character '${char === ' ' ? 'SPACE' : char}' appears ${count} time${count > 1 ? 's' : ''} in the input.`,
      nodes: accumulated.map((n, i) => ({
        ...n,
        isNew: i === accumulated.length - 1,
      })),
      tree: null,
      encodedBits: '',
      currentChar: null,
      highlightPath: [],
    });
  }

  // Phase 2 — tree building (step-by-step merges)
  const queue: HuffmanNode[] = sortedEntries.map(([char, f]) => ({
    char,
    freq: f,
    left: null,
    right: null,
  }));

  while (queue.length > 1) {
    queue.sort((a, b) => a.freq - b.freq);
    const left = queue.shift()!;
    const right = queue.shift()!;
    const merged: HuffmanNode = {
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
    };
    queue.push(merged);

    const leftLabel = left.char !== null ? `'${left.char === ' ' ? 'SP' : left.char}'` : `(${left.freq})`;
    const rightLabel = right.char !== null ? `'${right.char === ' ' ? 'SP' : right.char}'` : `(${right.freq})`;

    steps.push({
      stepNumber: stepNum++,
      phase: 'tree-building',
      title: `Merge ${leftLabel} + ${rightLabel}`,
      description: `Combine the two lowest-frequency nodes (${left.freq} + ${right.freq} = ${merged.freq}) into a new internal node.`,
      nodes: queue.map((n) => ({
        char: n.char,
        freq: n.freq,
        isNew: n === merged,
      })),
      tree: cloneTree(merged),
      encodedBits: '',
      currentChar: null,
      highlightPath: [],
    });
  }

  // Finalize tree & codes
  const finalTree = queue[0]!;
  const codeMap = new Map<string, string>();
  assignCodes(finalTree, '', codeMap);

  // Phase 3 — encoding each character
  let encodedSoFar = '';
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    const code = codeMap.get(ch) ?? '';
    encodedSoFar += code;
    const path = getPathForChar(finalTree, ch, []) ?? [];

    steps.push({
      stepNumber: stepNum++,
      phase: 'encoding',
      title: `Encode '${ch === ' ' ? 'SPACE' : ch}' → ${code}`,
      description: `Character '${ch === ' ' ? 'SPACE' : ch}' maps to code "${code}". Follow the highlighted path in the tree.`,
      nodes: [...codeMap.entries()].map(([c, cd]) => ({
        char: c,
        freq: freq.get(c) ?? 0,
        code: cd,
      })),
      tree: cloneTree(finalTree),
      encodedBits: encodedSoFar,
      currentChar: ch,
      highlightPath: path,
    });
  }

  // Phase 4 — result
  const originalBits = input.length * 8;
  const compressedBits = encodedSoFar.length;
  const ratio = ((1 - compressedBits / originalBits) * 100).toFixed(1);

  steps.push({
    stepNumber: stepNum,
    phase: 'result',
    title: 'Compression Complete',
    description: `Original: ${originalBits} bits (${input.length} bytes). Compressed: ${compressedBits} bits (${Math.ceil(compressedBits / 8)} bytes). Saved ${ratio}%.`,
    nodes: [...codeMap.entries()].map(([c, cd]) => ({
      char: c,
      freq: freq.get(c) ?? 0,
      code: cd,
    })),
    tree: cloneTree(finalTree),
    encodedBits: encodedSoFar,
    currentChar: null,
    highlightPath: [],
  });

  return steps;
}

// ---------------------------------------------------------------------------
// Run-Length Encoding
// ---------------------------------------------------------------------------

export interface RLEStep {
  stepNumber: number;
  position: number;
  currentRun: { char: string; count: number };
  encoded: string;
  input: string;
}

export function generateRLESteps(input: string): RLEStep[] {
  if (input.length === 0) return [];

  const steps: RLEStep[] = [];
  let stepNum = 1;
  let encoded = '';
  let i = 0;

  while (i < input.length) {
    const ch = input[i]!;
    let count = 1;
    while (i + count < input.length && input[i + count] === ch) {
      count++;
    }

    encoded += `${ch}${count}`;

    steps.push({
      stepNumber: stepNum++,
      position: i,
      currentRun: { char: ch, count },
      encoded,
      input,
    });

    i += count;
  }

  return steps;
}
