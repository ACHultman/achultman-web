import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  SlideFade,
  Divider,
  Flex,
  IconButton,
  Link,
  Textarea,
  Collapse,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import Paragraph from '@components/Paragraph';
import {
  ASTNode,
  ParseResult,
  EXAMPLES,
  parse,
  countNodes,
  treeDepth,
  findNodeAtOffset,
  nodeColorScheme,
} from '@data/astData';

const MotionBox = motion(Box);

// ── Tree Node Component ──────────────────────────────────────────────────────

function TreeNode({
  node,
  depth,
  selectedNode,
  hoveredNode,
  onSelect,
  onHover,
  subtleText,
  borderColor,
  treeBg,
  hoverBg,
  selectedBg,
}: {
  node: ASTNode;
  depth: number;
  selectedNode: ASTNode | null;
  hoveredNode: ASTNode | null;
  onSelect: (n: ASTNode | null) => void;
  onHover: (n: ASTNode | null) => void;
  subtleText: string;
  borderColor: string;
  treeBg: string;
  hoverBg: string;
  selectedBg: string;
}) {
  const [expanded, setExpanded] = useState(depth < 3);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedNode === node;
  const isHovered = hoveredNode === node;
  const colorScheme = nodeColorScheme(node.type);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasChildren) setExpanded((p) => !p);
      onSelect(isSelected ? null : node);
    },
    [hasChildren, isSelected, node, onSelect],
  );

  const handleMouseEnter = useCallback(() => {
    onHover(node);
  }, [node, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  // Label text
  let label = '';
  if (node.name) label += ` ${node.name}`;
  if (node.operator) label += ` ${node.operator}`;
  if (node.value !== undefined) label += ` ${JSON.stringify(node.value)}`;
  if (node.kind) label += ` (${node.kind})`;

  return (
    <Box>
      <Flex
        align="center"
        pl={`${depth * 20}px`}
        py={1}
        px={2}
        cursor="pointer"
        borderRadius="md"
        bg={isSelected ? selectedBg : isHovered ? hoverBg : 'transparent'}
        _hover={{ bg: isSelected ? selectedBg : hoverBg }}
        transition="background 0.15s"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="treeitem"
        aria-expanded={hasChildren ? expanded : undefined}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDownIcon boxSize={4} color={subtleText} mr={1} />
          ) : (
            <ChevronRightIcon boxSize={4} color={subtleText} mr={1} />
          )
        ) : (
          <Box w={4} mr={1} />
        )}
        <Badge
          colorScheme={colorScheme}
          fontSize="xs"
          variant="subtle"
          mr={2}
          fontFamily="mono"
        >
          {node.type}
        </Badge>
        {label && (
          <Text fontSize="xs" fontFamily="mono" color={subtleText} noOfLines={1}>
            {label}
          </Text>
        )}
        <Text fontSize="xs" color={subtleText} ml="auto" flexShrink={0} opacity={0.6}>
          [{node.start}:{node.end}]
        </Text>
      </Flex>
      {hasChildren && (
        <Collapse in={expanded} animateOpacity>
          {node.children.map((child, i) => (
            <TreeNode
              key={`${child.type}-${child.start}-${i}`}
              node={child}
              depth={depth + 1}
              selectedNode={selectedNode}
              hoveredNode={hoveredNode}
              onSelect={onSelect}
              onHover={onHover}
              subtleText={subtleText}
              borderColor={borderColor}
              treeBg={treeBg}
              hoverBg={hoverBg}
              selectedBg={selectedBg}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
}

// ── Line Numbers Component ───────────────────────────────────────────────────

function LineNumbers({ count, color }: { count: number; color: string }) {
  return (
    <Box
      as="pre"
      textAlign="right"
      pr={3}
      py={4}
      userSelect="none"
      color={color}
      fontSize="sm"
      lineHeight="1.5em"
      fontFamily="mono"
      minW="40px"
    >
      {Array.from({ length: count }, (_, i) => (
        <Box key={i}>{i + 1}</Box>
      ))}
    </Box>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function ASTExplorerPage() {
  const [code, setCode] = useState(EXAMPLES[0]!.code);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [parseTime, setParseTime] = useState(0);
  const [selectedNode, setSelectedNode] = useState<ASTNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ASTNode | null>(null);
  const [hoveredCharOffset, setHoveredCharOffset] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const editorBg = useColorModeValue('gray.900', 'gray.900');
  const editorText = useColorModeValue('gray.50', 'gray.50');
  const lineNumColor = useColorModeValue('gray.500', 'gray.500');
  const treeBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const highlightBg = useColorModeValue('yellow.200', 'yellow.700');
  const errorBg = useColorModeValue('red.50', 'red.900');
  const statBg = useColorModeValue('gray.100', 'gray.600');

  // Parse on code change
  useEffect(() => {
    const t0 = performance.now();
    const r = parse(code);
    const t1 = performance.now();
    setParseTime(t1 - t0);
    setResult(r);
    setSelectedNode(null);
    setHoveredNode(null);
  }, [code]);

  // Determine highlighted source range
  const highlightRange = useMemo(() => {
    const node = selectedNode ?? hoveredNode;
    if (!node) return null;
    return { start: node.start, end: node.end };
  }, [selectedNode, hoveredNode]);

  // Find node at hovered character offset
  const nodeAtHoveredChar = useMemo(() => {
    if (hoveredCharOffset === null || !result) return null;
    return findNodeAtOffset(result.ast, hoveredCharOffset);
  }, [hoveredCharOffset, result]);

  const activeHoveredNode = hoveredNode ?? nodeAtHoveredChar;

  const lineCount = code.split('\n').length;
  const totalNodes = result ? countNodes(result.ast) : 0;
  const depth = result ? treeDepth(result.ast) : 0;

  const loadExample = useCallback((ex: (typeof EXAMPLES)[number]) => {
    setCode(ex.code);
  }, []);

  // Render source code with highlights
  const renderHighlightedSource = useCallback(() => {
    if (!highlightRange) return null;

    const before = code.slice(0, highlightRange.start);
    const highlighted = code.slice(highlightRange.start, highlightRange.end);
    const after = code.slice(highlightRange.end);

    return (
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        py={4}
        px={0}
        fontFamily="mono"
        fontSize="sm"
        lineHeight="1.5em"
        whiteSpace="pre-wrap"
        wordBreak="break-all"
        pointerEvents="none"
        color="transparent"
      >
        {before}
        <Box as="span" bg={highlightBg} color="transparent" borderRadius="sm">
          {highlighted}
        </Box>
        {after}
      </Box>
    );
  }, [code, highlightRange, highlightBg]);

  return (
    <Container maxW="container.xl" py={8}>
      <SlideFade in offsetY={20}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack mb={4}>
              <Link as={NextLink} href="/labs">
                <IconButton
                  aria-label="Go back"
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  size="sm"
                />
              </Link>
              <Badge colorScheme="blue" fontSize="xs">
                Languages
              </Badge>
            </HStack>
            <Heading as="h1" size="xl" mb={2}>
              {'\uD83C\uDF33 AST Explorer'}
            </Heading>
            <Paragraph>
              Write JavaScript and watch a recursive-descent parser tokenize and build an
              abstract syntax tree in real time. Click tree nodes to highlight their source
              range, or hover over code to find the corresponding AST node. No external
              parsing libraries are used &mdash; the parser is built from scratch.
            </Paragraph>
          </Box>

          {/* Examples */}
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2} color={subtleText}>
              Examples
            </Text>
            <Flex wrap="wrap" gap={2}>
              {EXAMPLES.map((ex) => (
                <Badge
                  key={ex.name}
                  colorScheme="blue"
                  variant={code === ex.code ? 'solid' : 'subtle'}
                  cursor="pointer"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  onClick={() => loadExample(ex)}
                  _hover={{ opacity: 0.8 }}
                  transition="all 0.2s"
                >
                  {ex.name}
                </Badge>
              ))}
            </Flex>
          </Box>

          {/* Main panels */}
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={6}
            align="stretch"
          >
            {/* Left: Code Editor */}
            <Box flex={1} minW={0}>
              <Text fontSize="sm" fontWeight="bold" mb={2} color={subtleText}>
                Source Code
              </Text>
              <Box
                bg={editorBg}
                borderRadius="lg"
                border="1px"
                borderColor={borderColor}
                overflow="hidden"
                position="relative"
              >
                <Flex>
                  <LineNumbers count={lineCount} color={lineNumColor} />
                  <Box position="relative" flex={1} overflow="auto">
                    {renderHighlightedSource()}
                    <Textarea
                      ref={textareaRef}
                      value={code}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setCode(e.target.value)
                      }
                      onMouseMove={(e: React.MouseEvent<HTMLTextAreaElement>) => {
                        const ta = e.currentTarget;
                        // Approximate character offset from mouse position
                        const rect = ta.getBoundingClientRect();
                        const lineH = 21; // ~1.5em at 14px
                        const charW = 8.4; // approx monospace char width
                        const scrollTop = ta.scrollTop;
                        const y = e.clientY - rect.top + scrollTop;
                        const x = e.clientX - rect.left + ta.scrollLeft;
                        const line = Math.floor(y / lineH);
                        const col = Math.floor(x / charW);
                        const lines = code.split('\n');
                        let offset = 0;
                        for (let i = 0; i < line && i < lines.length; i++) {
                          offset += lines[i]!.length + 1;
                        }
                        offset += Math.min(col, (lines[line]?.length ?? 0));
                        if (offset >= 0 && offset < code.length) {
                          setHoveredCharOffset(offset);
                        }
                      }}
                      onMouseLeave={() => setHoveredCharOffset(null)}
                      fontFamily="mono"
                      fontSize="sm"
                      lineHeight="1.5em"
                      color={editorText}
                      bg="transparent"
                      border="none"
                      resize="vertical"
                      minH="300px"
                      py={4}
                      px={0}
                      _focus={{ boxShadow: 'none', border: 'none' }}
                      _hover={{ border: 'none' }}
                      spellCheck={false}
                      position="relative"
                      zIndex={1}
                    />
                  </Box>
                </Flex>
              </Box>

              {/* Parse errors */}
              {result && result.errors.length > 0 && (
                <MotionBox
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  mt={3}
                >
                  <VStack spacing={1} align="stretch">
                    {result.errors.map((err, i) => (
                      <Box
                        key={`${err.position}-${i}`}
                        bg={errorBg}
                        px={3}
                        py={2}
                        borderRadius="md"
                        border="1px"
                        borderColor="red.400"
                      >
                        <Text fontSize="xs" fontFamily="mono" color="red.400">
                          Error at position {err.position}: {err.message}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </MotionBox>
              )}
            </Box>

            {/* Right: AST Tree */}
            <Box flex={1} minW={0}>
              <Text fontSize="sm" fontWeight="bold" mb={2} color={subtleText}>
                AST Tree
              </Text>
              <Box
                bg={treeBg}
                borderRadius="lg"
                border="1px"
                borderColor={borderColor}
                maxH="500px"
                overflowY="auto"
                minH="300px"
                py={2}
                role="tree"
              >
                {result && (
                  <TreeNode
                    node={result.ast}
                    depth={0}
                    selectedNode={selectedNode}
                    hoveredNode={activeHoveredNode}
                    onSelect={setSelectedNode}
                    onHover={setHoveredNode}
                    subtleText={subtleText}
                    borderColor={borderColor}
                    treeBg={treeBg}
                    hoverBg={hoverBg}
                    selectedBg={selectedBg}
                  />
                )}
              </Box>

              {/* Legend */}
              <Flex wrap="wrap" gap={2} mt={3}>
                {[
                  { label: 'Declarations', color: 'blue' },
                  { label: 'Expressions', color: 'green' },
                  { label: 'Literals', color: 'orange' },
                  { label: 'Statements', color: 'purple' },
                  { label: 'Identifiers', color: 'cyan' },
                ].map((item) => (
                  <Badge
                    key={item.label}
                    colorScheme={item.color}
                    variant="subtle"
                    fontSize="xs"
                  >
                    {item.label}
                  </Badge>
                ))}
              </Flex>
            </Box>
          </Flex>

          {/* Stats */}
          <Flex
            wrap="wrap"
            gap={4}
            bg={cardBg}
            p={4}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
          >
            <HStack>
              <Text fontSize="sm" color={subtleText}>
                Total Nodes:
              </Text>
              <Badge bg={statBg} fontSize="sm" fontFamily="mono">
                {totalNodes}
              </Badge>
            </HStack>
            <HStack>
              <Text fontSize="sm" color={subtleText}>
                Tree Depth:
              </Text>
              <Badge bg={statBg} fontSize="sm" fontFamily="mono">
                {depth}
              </Badge>
            </HStack>
            <HStack>
              <Text fontSize="sm" color={subtleText}>
                Parse Time:
              </Text>
              <Badge bg={statBg} fontSize="sm" fontFamily="mono">
                {parseTime.toFixed(2)} ms
              </Badge>
            </HStack>
            {result && (
              <HStack>
                <Text fontSize="sm" color={subtleText}>
                  Errors:
                </Text>
                <Badge
                  colorScheme={result.errors.length > 0 ? 'red' : 'green'}
                  fontSize="sm"
                  fontFamily="mono"
                >
                  {result.errors.length}
                </Badge>
              </HStack>
            )}
          </Flex>

          <Divider />

          {/* How it works */}
          <Box>
            <Heading as="h2" size="md" mb={3}>
              How it works
            </Heading>
            <VStack align="stretch" spacing={2}>
              <Paragraph>
                This explorer uses a hand-built recursive-descent parser with two phases:
                first a <strong>tokenizer</strong> scans the source into tokens (keywords,
                identifiers, numbers, strings, operators, punctuation), then a{' '}
                <strong>parser</strong> consumes tokens and builds a tree following JavaScript
                grammar rules.
              </Paragraph>
              <Paragraph>
                Operator precedence is handled by layering parse functions &mdash;
                multiplicative operators bind tighter than additive, which bind tighter than
                comparison, and so on. The parser gracefully recovers from errors: when it
                encounters an unexpected token it records an error and skips ahead, producing
                a partial AST rather than crashing.
              </Paragraph>
              <Paragraph>
                Each node stores its <strong>character offsets</strong> in the original
                source, enabling the bidirectional highlighting: click a tree node to see its
                source range, or hover over source characters to find the deepest AST node
                that covers them.
              </Paragraph>
            </VStack>
          </Box>
        </VStack>
      </SlideFade>
    </Container>
  );
}
