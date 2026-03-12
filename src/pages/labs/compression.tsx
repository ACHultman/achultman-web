import { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Divider,
  Flex,
  IconButton,
  Link,
  SimpleGrid,
  Input,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Paragraph from '@components/Paragraph';
import {
  EXAMPLES,
  generateHuffmanSteps,
  generateRLESteps,
  type CompressionStep,
  type RLEStep,
  type HuffmanNode,
} from '@data/compressionData';

const MotionBox = motion(Box);

// ---------------------------------------------------------------------------
// Huffman Tree SVG
// ---------------------------------------------------------------------------

interface TreePos {
  x: number;
  y: number;
  node: HuffmanNode;
  children: { child: TreePos; direction: 'left' | 'right' }[];
}

function layoutTree(node: HuffmanNode | null, x: number, y: number, spread: number): TreePos | null {
  if (!node) return null;
  const pos: TreePos = { x, y, node, children: [] };
  const leftPos = layoutTree(node.left, x - spread, y + 70, spread * 0.55);
  const rightPos = layoutTree(node.right, x + spread, y + 70, spread * 0.55);
  if (leftPos) pos.children.push({ child: leftPos, direction: 'left' });
  if (rightPos) pos.children.push({ child: rightPos, direction: 'right' });
  return pos;
}

function getTreeDepth(node: HuffmanNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

function collectPositions(pos: TreePos | null, arr: TreePos[]): void {
  if (!pos) return;
  arr.push(pos);
  for (const c of pos.children) {
    collectPositions(c.child, arr);
  }
}

function isOnHighlightPath(
  pos: TreePos,
  highlightPath: ('left' | 'right')[],
  root: TreePos,
): { onPath: boolean; edgeHighlighted: boolean; direction: 'left' | 'right' | null } {
  // Walk the highlight path from root to see if this node is on it
  let current: TreePos | null = root;
  const visited = new Set<TreePos>();
  visited.add(root);

  for (const dir of highlightPath) {
    if (!current) break;
    const next: { child: TreePos; direction: 'left' | 'right' } | undefined =
      current.children.find((c) => c.direction === dir);
    if (next) {
      visited.add(next.child);
      current = next.child;
    }
  }

  return { onPath: visited.has(pos), edgeHighlighted: false, direction: null };
}

function isEdgeHighlighted(
  parentPos: TreePos,
  childDir: 'left' | 'right',
  highlightPath: ('left' | 'right')[],
  root: TreePos,
): boolean {
  let current: TreePos | null = root;
  for (const dir of highlightPath) {
    if (!current) return false;
    if (current === parentPos && dir === childDir) return true;
    const next: { child: TreePos; direction: 'left' | 'right' } | undefined =
      current.children.find((c) => c.direction === dir);
    if (next) {
      current = next.child;
    } else {
      return false;
    }
  }
  return false;
}

function HuffmanTreeSVG({
  tree,
  highlightPath,
}: {
  tree: HuffmanNode | null;
  highlightPath: ('left' | 'right')[];
}) {
  const nodeColor = useColorModeValue('#4A5568', '#CBD5E0');
  const leafColor = useColorModeValue('#2B6CB0', '#63B3ED');
  const leafBg = useColorModeValue('#EBF8FF', '#2A4365');
  const internalBg = useColorModeValue('#F7FAFC', '#2D3748');
  const edgeColor = useColorModeValue('#A0AEC0', '#4A5568');
  const highlightColor = '#D69E2E';
  const labelColor = useColorModeValue('#718096', '#A0AEC0');

  if (!tree) {
    return (
      <Flex
        h="200px"
        align="center"
        justify="center"
        borderWidth="1px"
        borderRadius="md"
        borderStyle="dashed"
        borderColor={edgeColor}
      >
        <Text color={labelColor} fontSize="sm">
          Tree will appear during tree-building phase
        </Text>
      </Flex>
    );
  }

  const depth = getTreeDepth(tree);
  const initialSpread = Math.max(60, Math.pow(2, depth - 1) * 30);
  const rootPos = layoutTree(tree, 0, 30, initialSpread)!;

  const allPositions: TreePos[] = [];
  collectPositions(rootPos, allPositions);

  const minX = Math.min(...allPositions.map((p) => p.x));
  const maxX = Math.max(...allPositions.map((p) => p.x));
  const maxY = Math.max(...allPositions.map((p) => p.y));

  const padding = 40;
  const viewW = maxX - minX + padding * 2;
  const viewH = maxY + padding * 2;
  const offsetX = -minX + padding;

  // Collect edges
  const edges: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    direction: 'left' | 'right';
    highlighted: boolean;
  }[] = [];

  function collectEdges(pos: TreePos): void {
    for (const c of pos.children) {
      edges.push({
        x1: pos.x + offsetX,
        y1: pos.y,
        x2: c.child.x + offsetX,
        y2: c.child.y,
        direction: c.direction,
        highlighted: isEdgeHighlighted(pos, c.direction, highlightPath, rootPos),
      });
      collectEdges(c.child);
    }
  }
  collectEdges(rootPos);

  return (
    <Box overflowX="auto" w="100%">
      <svg
        width="100%"
        height={Math.min(viewH + 20, 400)}
        viewBox={`0 0 ${viewW} ${viewH + 20}`}
        style={{ minWidth: 300 }}
      >
        {/* Edges */}
        {edges.map((e, i) => (
          <g key={`edge-${i}`}>
            <line
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke={e.highlighted ? highlightColor : edgeColor}
              strokeWidth={e.highlighted ? 3 : 1.5}
              strokeOpacity={e.highlighted ? 1 : 0.6}
            />
            <text
              x={(e.x1 + e.x2) / 2 + (e.direction === 'left' ? -10 : 10)}
              y={(e.y1 + e.y2) / 2}
              textAnchor="middle"
              fontSize="11"
              fontWeight={e.highlighted ? 'bold' : 'normal'}
              fill={e.highlighted ? highlightColor : labelColor}
            >
              {e.direction === 'left' ? '0' : '1'}
            </text>
          </g>
        ))}

        {/* Nodes */}
        {allPositions.map((pos, i) => {
          const isLeaf = pos.node.char !== null;
          const { onPath } = isOnHighlightPath(pos, highlightPath, rootPos);
          const r = isLeaf ? 18 : 14;

          return (
            <g key={`node-${i}`} transform={`translate(${pos.x + offsetX}, ${pos.y})`}>
              <circle
                r={r}
                fill={isLeaf ? leafBg : internalBg}
                stroke={onPath && highlightPath.length > 0 ? highlightColor : isLeaf ? leafColor : nodeColor}
                strokeWidth={onPath && highlightPath.length > 0 ? 3 : 1.5}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isLeaf ? '12' : '10'}
                fontWeight="bold"
                fill={isLeaf ? leafColor : nodeColor}
              >
                {isLeaf ? (pos.node.char === ' ' ? 'SP' : pos.node.char) : pos.node.freq}
              </text>
              {isLeaf && pos.node.code && (
                <text
                  textAnchor="middle"
                  y={r + 12}
                  fontSize="9"
                  fill={labelColor}
                >
                  {pos.node.code}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Stats Panel
// ---------------------------------------------------------------------------

function StatsPanel({
  step,
  input,
}: {
  step: CompressionStep;
  input: string;
}) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const barBg = useColorModeValue('gray.100', 'gray.700');

  const originalBits = input.length * 8;
  const compressedBits = step.encodedBits.length;
  const ratio = originalBits > 0 ? ((1 - compressedBits / originalBits) * 100).toFixed(1) : '0';

  // Build frequency map from nodes
  const freqEntries = step.nodes
    .filter((n) => n.char !== null)
    .sort((a, b) => b.freq - a.freq);
  const maxFreq = freqEntries.length > 0 ? freqEntries[0]!.freq : 1;

  // Color palette for characters
  const CHAR_COLORS = [
    'blue.400', 'green.400', 'purple.400', 'orange.400', 'cyan.400',
    'pink.400', 'teal.400', 'red.400', 'yellow.400',
  ];

  return (
    <VStack
      spacing={4}
      align="stretch"
      bg={cardBg}
      borderWidth="1px"
      borderColor={cardBorder}
      borderRadius="lg"
      p={4}
    >
      <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
        Statistics
      </Text>

      <SimpleGrid columns={2} spacing={2}>
        <Box>
          <Text fontSize="xs" color={subtleText}>Original</Text>
          <Text fontWeight="bold" fontFamily="mono" fontSize="sm">
            {input.length} chars ({originalBits} bits)
          </Text>
        </Box>
        <Box>
          <Text fontSize="xs" color={subtleText}>Compressed</Text>
          <Text fontWeight="bold" fontFamily="mono" fontSize="sm">
            {compressedBits > 0 ? `${compressedBits} bits` : '--'}
          </Text>
        </Box>
        <Box>
          <Text fontSize="xs" color={subtleText}>Ratio</Text>
          <Text fontWeight="bold" fontFamily="mono" fontSize="sm" color={Number(ratio) > 0 ? 'green.400' : undefined}>
            {compressedBits > 0 ? `${ratio}% saved` : '--'}
          </Text>
        </Box>
        <Box>
          <Text fontSize="xs" color={subtleText}>Unique chars</Text>
          <Text fontWeight="bold" fontFamily="mono" fontSize="sm">
            {freqEntries.length}
          </Text>
        </Box>
      </SimpleGrid>

      <Divider />

      <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
        Frequencies
      </Text>

      <VStack spacing={1} align="stretch" maxH="200px" overflowY="auto">
        {freqEntries.map((entry, i) => {
          const color = CHAR_COLORS[i % CHAR_COLORS.length]!;
          const barWidth = `${(entry.freq / maxFreq) * 100}%`;
          return (
            <HStack key={`${entry.char}-${i}`} spacing={2} fontSize="sm">
              <Text fontFamily="mono" fontWeight="bold" w="24px" textAlign="center">
                {entry.char === ' ' ? 'SP' : entry.char}
              </Text>
              <Box flex={1} bg={barBg} borderRadius="sm" h="16px" position="relative">
                <Box
                  bg={color}
                  h="100%"
                  borderRadius="sm"
                  w={barWidth}
                  transition="width 0.3s"
                />
              </Box>
              <Text fontFamily="mono" fontSize="xs" w="24px" textAlign="right" color={subtleText}>
                {entry.freq}
              </Text>
              {entry.code && (
                <Text fontFamily="mono" fontSize="xs" color={subtleText} w="60px" textAlign="right">
                  {entry.code}
                </Text>
              )}
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// Encoded Bits Display
// ---------------------------------------------------------------------------

function EncodedBitsDisplay({
  step,
  input,
}: {
  step: CompressionStep;
  input: string;
}) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  const CHAR_COLORS = [
    'blue', 'green', 'purple', 'orange', 'cyan',
    'pink', 'teal', 'red', 'yellow',
  ];

  // Build a color map per character
  const charColorMap = useMemo(() => {
    const map = new Map<string, string>();
    const uniqueChars = [...new Set(input.split(''))];
    uniqueChars.forEach((ch, i) => {
      map.set(ch, CHAR_COLORS[i % CHAR_COLORS.length]!);
    });
    return map;
  }, [input, CHAR_COLORS]);

  // Build code map from nodes
  const codeMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const n of step.nodes) {
      if (n.char !== null && n.code) {
        map.set(n.char, n.code);
      }
    }
    return map;
  }, [step.nodes]);

  if (!step.encodedBits) return null;

  // Segment the encoded bits by character
  const segments: { char: string; bits: string; color: string }[] = [];
  let bitIdx = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    const code = codeMap.get(ch);
    if (!code) break;
    if (bitIdx + code.length > step.encodedBits.length) break;
    segments.push({
      char: ch,
      bits: step.encodedBits.slice(bitIdx, bitIdx + code.length),
      color: charColorMap.get(ch) ?? 'gray',
    });
    bitIdx += code.length;
  }

  return (
    <Box
      bg={cardBg}
      borderWidth="1px"
      borderColor={cardBorder}
      borderRadius="lg"
      p={4}
    >
      <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" mb={2}>
        Original Text
      </Text>
      <HStack spacing={0} mb={3} flexWrap="wrap">
        {input.split('').map((ch, i) => {
          const color = charColorMap.get(ch) ?? 'gray';
          const isCurrent = step.currentChar === ch && step.phase === 'encoding';
          return (
            <Box
              key={i}
              px={1}
              py={0.5}
              fontFamily="mono"
              fontSize="sm"
              bg={isCurrent ? `${color}.200` : 'transparent'}
              borderRadius="sm"
              fontWeight={isCurrent ? 'bold' : 'normal'}
            >
              {ch === ' ' ? '\u00B7' : ch}
            </Box>
          );
        })}
      </HStack>

      <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" mb={2}>
        Encoded Bits
      </Text>
      <HStack spacing={0} flexWrap="wrap">
        {segments.map((seg, i) => (
          <Box
            key={i}
            px={1}
            py={0.5}
            fontFamily="mono"
            fontSize="xs"
            color={`${seg.color}.400`}
            borderBottom="2px solid"
            borderColor={`${seg.color}.400`}
            title={`'${seg.char}' = ${seg.bits}`}
          >
            {seg.bits}
          </Box>
        ))}
      </HStack>

      {step.encodedBits && (
        <Text fontSize="xs" color={subtleText} mt={2}>
          {step.encodedBits.length} bits total
        </Text>
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// RLE Visualization
// ---------------------------------------------------------------------------

function RLEVisualization({ step }: { step: RLEStep }) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const highlightBg = useColorModeValue('orange.100', 'orange.800');
  const activeBg = useColorModeValue('orange.200', 'orange.700');
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  return (
    <VStack spacing={6} align="stretch">
      {/* Input string with position highlighted */}
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="lg"
        p={4}
      >
        <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" mb={3}>
          Input String
        </Text>
        <HStack spacing={0} flexWrap="wrap">
          {step.input.split('').map((ch, i) => {
            const inRun = i >= step.position && i < step.position + step.currentRun.count;
            const isStart = i === step.position;
            return (
              <Box
                key={i}
                px={2}
                py={1}
                fontFamily="mono"
                fontSize="md"
                fontWeight={inRun ? 'bold' : 'normal'}
                bg={isStart ? activeBg : inRun ? highlightBg : 'transparent'}
                borderRadius="sm"
                borderWidth={inRun ? '2px' : '1px'}
                borderColor={inRun ? 'orange.400' : 'transparent'}
                transition="all 0.2s"
              >
                {ch === ' ' ? '\u00B7' : ch}
              </Box>
            );
          })}
        </HStack>
        <Text fontSize="xs" color={subtleText} mt={2}>
          Current run: &apos;{step.currentRun.char === ' ' ? 'SPACE' : step.currentRun.char}&apos; x {step.currentRun.count}
        </Text>
      </Box>

      {/* Encoded output building up */}
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="lg"
        p={4}
      >
        <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" mb={3}>
          RLE Encoded Output
        </Text>
        <HStack spacing={0} flexWrap="wrap">
          {step.encoded.split('').map((ch, i) => {
            const isNew = i >= step.encoded.length - (step.currentRun.char.length + String(step.currentRun.count).length);
            return (
              <MotionBox
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                px={1}
                py={0.5}
                fontFamily="mono"
                fontSize="lg"
                fontWeight={isNew ? 'bold' : 'normal'}
                color={isNew ? 'orange.400' : undefined}
              >
                {ch}
              </MotionBox>
            );
          })}
        </HStack>
        <Text fontSize="xs" color={subtleText} mt={2}>
          {step.encoded.length} characters ({step.input.length} original)
        </Text>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={3} spacing={4}>
        <Box bg={cardBg} borderWidth="1px" borderColor={cardBorder} borderRadius="lg" p={4} textAlign="center">
          <Text fontSize="xs" color={subtleText}>Original</Text>
          <Text fontWeight="bold" fontFamily="mono" fontSize="lg">{step.input.length}</Text>
          <Text fontSize="xs" color={subtleText}>chars</Text>
        </Box>
        <Box bg={cardBg} borderWidth="1px" borderColor={cardBorder} borderRadius="lg" p={4} textAlign="center">
          <Text fontSize="xs" color={subtleText}>Encoded</Text>
          <Text fontWeight="bold" fontFamily="mono" fontSize="lg">{step.encoded.length}</Text>
          <Text fontSize="xs" color={subtleText}>chars</Text>
        </Box>
        <Box bg={cardBg} borderWidth="1px" borderColor={cardBorder} borderRadius="lg" p={4} textAlign="center">
          <Text fontSize="xs" color={subtleText}>Ratio</Text>
          <Text
            fontWeight="bold"
            fontFamily="mono"
            fontSize="lg"
            color={step.encoded.length < step.input.length ? 'green.400' : 'red.400'}
          >
            {((1 - step.encoded.length / step.input.length) * 100).toFixed(0)}%
          </Text>
          <Text fontSize="xs" color={subtleText}>saved</Text>
        </Box>
      </SimpleGrid>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CompressionPage() {
  const [tab, setTab] = useState<'huffman' | 'rle'>('huffman');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [customText, setCustomText] = useState('');
  const [stepIdx, setStepIdx] = useState(0);

  const example = EXAMPLES[exampleIdx]!;
  const inputText = example.name === 'Custom' ? customText : example.input;

  const huffmanSteps = useMemo(() => generateHuffmanSteps(inputText), [inputText]);
  const rleSteps = useMemo(() => generateRLESteps(inputText), [inputText]);

  const steps = tab === 'huffman' ? huffmanSteps : rleSteps;
  const currentStep = steps[stepIdx];
  const totalSteps = steps.length;

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const activeBorder = useColorModeValue('orange.500', 'orange.400');
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  const selectExample = useCallback((idx: number) => {
    setExampleIdx(idx);
    setStepIdx(0);
  }, []);

  const switchTab = useCallback((newTab: 'huffman' | 'rle') => {
    setTab(newTab);
    setStepIdx(0);
  }, []);

  const handleCustomTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomText(e.target.value);
    setStepIdx(0);
  }, []);

  const PHASE_COLORS: Record<string, string> = {
    frequency: 'blue',
    'tree-building': 'purple',
    encoding: 'orange',
    result: 'green',
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack mb={3}>
            <Link as={NextLink} href="/labs">
              <IconButton
                aria-label="Go back"
                icon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
              />
            </Link>
            <Badge colorScheme="orange" fontSize="sm">
              Algorithms
            </Badge>
          </HStack>
          <Heading size="xl" mb={2}>
            {'\uD83D\uDDDC\uFE0F Compression Visualizer'}
          </Heading>
          <Paragraph>
            Step through Huffman coding and Run-Length Encoding to see how text compression actually
            works. Watch trees build, codes assign, and bits encode in real time.
          </Paragraph>
        </Box>

        {/* Tab selector */}
        <HStack spacing={3}>
          <Badge
            as="button"
            colorScheme={tab === 'huffman' ? 'orange' : 'gray'}
            variant={tab === 'huffman' ? 'solid' : 'outline'}
            fontSize="sm"
            px={4}
            py={2}
            borderRadius="full"
            cursor="pointer"
            onClick={() => switchTab('huffman')}
          >
            Huffman Coding
          </Badge>
          <Badge
            as="button"
            colorScheme={tab === 'rle' ? 'orange' : 'gray'}
            variant={tab === 'rle' ? 'solid' : 'outline'}
            fontSize="sm"
            px={4}
            py={2}
            borderRadius="full"
            cursor="pointer"
            onClick={() => switchTab('rle')}
          >
            Run-Length Encoding
          </Badge>
        </HStack>

        {/* Example selector */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={3}>
          {EXAMPLES.map((ex, i: number) => (
            <Box
              key={ex.name}
              as="button"
              textAlign="left"
              bg={cardBg}
              p={3}
              borderRadius="lg"
              borderWidth="2px"
              borderColor={i === exampleIdx ? activeBorder : cardBorder}
              onClick={() => selectExample(i)}
              cursor="pointer"
              _hover={{ borderColor: activeBorder }}
              transition="border-color 0.2s"
            >
              <Text fontWeight="bold" fontSize="sm" mb={0.5}>
                {ex.name}
              </Text>
              <Text fontSize="xs" color={subtleText} noOfLines={1}>
                {ex.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Custom text input */}
        {example.name === 'Custom' && (
          <Input
            placeholder="Type your own text..."
            value={customText}
            onChange={handleCustomTextChange}
            fontFamily="mono"
            size="lg"
          />
        )}

        {totalSteps === 0 && (
          <Flex
            h="100px"
            align="center"
            justify="center"
            borderWidth="1px"
            borderRadius="lg"
            borderStyle="dashed"
            borderColor={cardBorder}
          >
            <Text color={subtleText}>Enter some text to begin</Text>
          </Flex>
        )}

        {totalSteps > 0 && (
          <>
            <Divider />

            {/* Step Controls */}
            <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
              <HStack>
                <IconButton
                  aria-label="Previous step"
                  icon={<ChevronLeftIcon boxSize={6} />}
                  onClick={() => setStepIdx((i: number) => Math.max(0, i - 1))}
                  isDisabled={stepIdx === 0}
                  variant="outline"
                  colorScheme="orange"
                />
                <Text fontFamily="mono" fontSize="sm" minW="100px" textAlign="center">
                  Step {stepIdx + 1} / {totalSteps}
                </Text>
                <IconButton
                  aria-label="Next step"
                  icon={<ChevronRightIcon boxSize={6} />}
                  onClick={() => setStepIdx((i: number) => Math.min(totalSteps - 1, i + 1))}
                  isDisabled={stepIdx === totalSteps - 1}
                  variant="outline"
                  colorScheme="orange"
                />
              </HStack>
              {tab === 'huffman' && currentStep && 'phase' in currentStep && (
                <HStack>
                  <Text fontSize="sm" color={subtleText}>
                    Phase:
                  </Text>
                  <Badge
                    colorScheme={PHASE_COLORS[(currentStep as CompressionStep).phase] ?? 'gray'}
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                    textTransform="capitalize"
                  >
                    {(currentStep as CompressionStep).phase.replace('-', ' ')}
                  </Badge>
                </HStack>
              )}
            </Flex>

            {/* Step Title & Description */}
            <AnimatePresence mode="wait">
              <MotionBox
                key={`${tab}-${exampleIdx}-${stepIdx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <Box bg={cardBg} p={5} borderRadius="lg" borderWidth="1px" borderColor={cardBorder}>
                  {tab === 'huffman' && currentStep && 'phase' in currentStep && (
                    <>
                      <Heading size="md" mb={2}>
                        {(currentStep as CompressionStep).title}
                      </Heading>
                      <Text color={subtleText} lineHeight="tall">
                        {(currentStep as CompressionStep).description}
                      </Text>
                    </>
                  )}
                  {tab === 'rle' && currentStep && 'currentRun' in currentStep && (
                    <>
                      <Heading size="md" mb={2}>
                        Step {(currentStep as RLEStep).stepNumber}: Run of &apos;{(currentStep as RLEStep).currentRun.char === ' ' ? 'SPACE' : (currentStep as RLEStep).currentRun.char}&apos;
                      </Heading>
                      <Text color={subtleText} lineHeight="tall">
                        Found {(currentStep as RLEStep).currentRun.count} consecutive &apos;{(currentStep as RLEStep).currentRun.char === ' ' ? 'SPACE' : (currentStep as RLEStep).currentRun.char}&apos; character{(currentStep as RLEStep).currentRun.count > 1 ? 's' : ''} starting at position {(currentStep as RLEStep).position}.
                      </Text>
                    </>
                  )}
                </Box>
              </MotionBox>
            </AnimatePresence>

            {/* Main Visualization */}
            {tab === 'huffman' && currentStep && 'phase' in currentStep && (
              <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
                {/* Left: Tree */}
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="bold" mb={3} textTransform="uppercase" letterSpacing="wide">
                    Huffman Tree
                  </Text>
                  <HuffmanTreeSVG
                    tree={(currentStep as CompressionStep).tree}
                    highlightPath={(currentStep as CompressionStep).highlightPath}
                  />
                </Box>

                {/* Right: Stats */}
                <Box w={{ base: '100%', lg: '320px' }} flexShrink={0}>
                  <StatsPanel step={currentStep as CompressionStep} input={inputText} />
                </Box>
              </Flex>
            )}

            {tab === 'huffman' && currentStep && 'phase' in currentStep && (currentStep as CompressionStep).encodedBits && (
              <EncodedBitsDisplay step={currentStep as CompressionStep} input={inputText} />
            )}

            {tab === 'rle' && currentStep && 'currentRun' in currentStep && (
              <RLEVisualization step={currentStep as RLEStep} />
            )}
          </>
        )}
      </VStack>
    </Container>
  );
}
