import { useState, useCallback, useMemo, useRef } from 'react';
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
  IconButton,
  Link,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Paragraph from '@components/Paragraph';
import {
  PRESET_NETWORKS,
  DATASETS,
  forwardPass,
  generateDecisionBoundary,
  computeAccuracy,
  countParams,
  randomizeWeights,
  type NetworkConfig,
  type BoundaryCell,
} from '@data/neuralNetData';

const MotionBox = motion(Box);

export default function NeuralNetPlayground() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [config, setConfig] = useState<NetworkConfig>(
    PRESET_NETWORKS[0]!.config
  );
  const [datasetKey, setDatasetKey] = useState(PRESET_NETWORKS[0]!.datasetKey);
  const [activations, setActivations] = useState<number[][] | null>(null);
  const [animatingLayer, setAnimatingLayer] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dataset = DATASETS[datasetKey];

  const boundary = useMemo(
    () => generateDecisionBoundary(config, 30),
    [config]
  );

  const accuracy = useMemo(
    () => computeAccuracy(config, dataset!),
    [config, dataset]
  );

  const totalParams = useMemo(() => countParams(config), [config]);

  // Colors
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dimText = useColorModeValue('gray.600', 'gray.400');
  const svgBg = useColorModeValue('#fafafa', '#1a1a2e');

  const selectPreset = useCallback((idx: number) => {
    setPresetIdx(idx);
    setConfig(PRESET_NETWORKS[idx]!.config);
    setDatasetKey(PRESET_NETWORKS[idx]!.datasetKey);
    setActivations(null);
    setAnimatingLayer(null);
    setIsAnimating(false);
    if (animationRef.current) clearTimeout(animationRef.current);
  }, []);

  const handleRandomize = useCallback(() => {
    const { weights, biases } = randomizeWeights(config.layers);
    setConfig((prev: NetworkConfig) => ({ ...prev, weights, biases }));
    setActivations(null);
    setAnimatingLayer(null);
  }, [config.layers]);

  const handleForwardPass = useCallback(() => {
    if (isAnimating) return;
    // Pick a random data point
    const point = dataset!.points[Math.floor(Math.random() * dataset!.points.length)]!;
    const result = forwardPass([point.x, point.y], config);
    setIsAnimating(true);

    // Animate layer by layer
    let layer = 0;
    const animateNext = () => {
      if (layer > config.layers.length - 1) {
        setIsAnimating(false);
        setAnimatingLayer(null);
        return;
      }
      setActivations(result);
      setAnimatingLayer(layer);
      layer++;
      animationRef.current = setTimeout(animateNext, 400);
    };
    animateNext();
  }, [isAnimating, dataset, config]);

  // --- SVG Network Diagram ---
  const svgWidth = 360;
  const svgHeight = 280;
  const layerCount = config.layers.length;
  const layerSpacing = svgWidth / (layerCount + 1);

  const nodePositions: { x: number; y: number }[][] = config.layers.map(
    (size: number, li: number) => {
      const x = layerSpacing * (li + 1);
      return Array.from({ length: size }, (_, ni) => {
        const totalHeight = (size - 1) * 48;
        const y = svgHeight / 2 - totalHeight / 2 + ni * 48;
        return { x, y };
      });
    }
  );

  // Build connections
  const connections: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    weight: number;
    layerIdx: number;
  }[] = [];
  for (let l = 0; l < config.weights.length; l++) {
    const layerW = config.weights[l]!;
    for (let j = 0; j < layerW.length; j++) {
      const neuronW = layerW[j]!;
      for (let i = 0; i < neuronW.length; i++) {
        const from = nodePositions[l]![i]!;
        const to = nodePositions[l + 1]![j]!;
        connections.push({
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          weight: neuronW[i]!,
          layerIdx: l,
        });
      }
    }
  }

  const getNodeColor = (layerIdx: number, neuronIdx: number): string => {
    if (!activations || activations.length <= layerIdx) return '#888';
    const val = activations[layerIdx][neuronIdx];
    if (val === undefined) return '#888';
    // Blue (0) to red (1)
    const r = Math.round(val * 220 + 35);
    const b = Math.round((1 - val) * 220 + 35);
    const g = 60;
    return `rgb(${r},${g},${b})`;
  };

  const isLayerActive = (li: number) =>
    animatingLayer !== null && li <= animatingLayer;

  // --- Decision boundary color ---
  const cellColor = (value: number): string => {
    if (value < 0.5) {
      const t = value / 0.5;
      const r = Math.round(30 + t * 80);
      const g = Math.round(80 + t * 60);
      const b = Math.round(220 - t * 60);
      return `rgb(${r},${g},${b})`;
    } else {
      const t = (value - 0.5) / 0.5;
      const r = Math.round(180 + t * 60);
      const g = Math.round(80 - t * 40);
      const b = Math.round(80 - t * 40);
      return `rgb(${r},${g},${b})`;
    }
  };

  return (
    <Container maxW="container.lg" py={10}>
      <SlideFade in offsetY={20}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack spacing={4}>
            <Link as={NextLink} href="/labs">
              <IconButton
                aria-label="Back to labs"
                icon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
              />
            </Link>
            <Badge colorScheme="cyan" fontSize="xs">
              ML Experiment
            </Badge>
          </HStack>

          <Heading as="h1" size="xl">
            {'🧠 Neural Network Playground'}
          </Heading>

          <Paragraph>
            Explore how neural networks classify data by visualizing forward
            passes, decision boundaries, and network architecture. Select a
            preset to see pre-trained weights in action, or randomize them to
            see how untrained networks behave.
          </Paragraph>

          {/* Preset Selector */}
          <HStack spacing={3} flexWrap="wrap">
            {PRESET_NETWORKS.map((preset, idx) => (
              <Badge
                key={preset.config.name}
                colorScheme={presetIdx === idx ? 'cyan' : 'gray'}
                variant={presetIdx === idx ? 'solid' : 'subtle'}
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
                cursor="pointer"
                onClick={() => selectPreset(idx)}
                _hover={{ opacity: 0.8 }}
              >
                {preset.config.name} ({preset.config.layers.join('-')})
              </Badge>
            ))}
          </HStack>

          <Divider />

          {/* Main Visualization */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* LEFT: Network Diagram */}
            <Box
              bg={cardBg}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              p={4}
              overflow="hidden"
            >
              <Text fontWeight="bold" mb={2} fontSize="sm" color={dimText}>
                Network Architecture
              </Text>
              <Box overflow="auto">
                <svg
                  width={svgWidth}
                  height={svgHeight}
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  style={{ background: svgBg, borderRadius: 8, display: 'block', margin: '0 auto' }}
                >
                  {/* Connections */}
                  {connections.map((c, idx) => {
                    const absW = Math.abs(c.weight);
                    const active =
                      animatingLayer !== null && c.layerIdx < animatingLayer;
                    return (
                      <line
                        key={idx}
                        x1={c.x1}
                        y1={c.y1}
                        x2={c.x2}
                        y2={c.y2}
                        stroke={c.weight > 0 ? '#38A169' : '#E53E3E'}
                        strokeWidth={Math.min(absW * 2.5, 6)}
                        opacity={active ? 0.9 : 0.25}
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Nodes */}
                  {nodePositions.map((layer, li) =>
                    layer.map((pos, ni) => {
                      const active = isLayerActive(li);
                      const fill = active
                        ? getNodeColor(li, ni)
                        : '#888';
                      return (
                        <g key={`${li}-${ni}`}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={16}
                            fill={fill}
                            stroke={
                              animatingLayer === li ? '#FFD700' : '#555'
                            }
                            strokeWidth={animatingLayer === li ? 3 : 1.5}
                            opacity={active ? 1 : 0.5}
                          />
                          {active && activations && activations[li] && (
                            <text
                              x={pos.x}
                              y={pos.y + 4}
                              textAnchor="middle"
                              fontSize="9"
                              fill="white"
                              fontWeight="bold"
                            >
                              {activations[li][ni]?.toFixed(1)}
                            </text>
                          )}
                        </g>
                      );
                    })
                  )}

                  {/* Layer labels */}
                  {config.layers.map((size: number, li: number) => {
                    const x = layerSpacing * (li + 1);
                    const label =
                      li === 0
                        ? 'Input'
                        : li === layerCount - 1
                        ? 'Output'
                        : `Hidden ${li}`;
                    return (
                      <text
                        key={li}
                        x={x}
                        y={svgHeight - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#999"
                      >
                        {label}
                      </text>
                    );
                  })}
                </svg>
              </Box>
            </Box>

            {/* RIGHT: Decision Boundary */}
            <Box
              bg={cardBg}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              p={4}
            >
              <Text fontWeight="bold" mb={2} fontSize="sm" color={dimText}>
                Decision Boundary
              </Text>
              <Box position="relative" mx="auto" w="270px" h="270px">
                <svg
                  width={270}
                  height={270}
                  viewBox="0 0 270 270"
                  style={{ borderRadius: 8, display: 'block' }}
                >
                  {/* Grid cells */}
                  {boundary.map((cell: BoundaryCell, idx: number) => {
                    const col = idx % 30;
                    const row = Math.floor(idx / 30);
                    return (
                      <rect
                        key={idx}
                        x={col * 9}
                        y={(29 - row) * 9}
                        width={9}
                        height={9}
                        fill={cellColor(cell.value)}
                        opacity={0.85}
                      />
                    );
                  })}

                  {/* Data points */}
                  {dataset!.points.map((pt, idx) => {
                    const px = ((pt.x + 1) / 2) * 270;
                    const py = ((1 - (pt.y + 1) / 2)) * 270;
                    return (
                      <circle
                        key={idx}
                        cx={px}
                        cy={py}
                        r={3.5}
                        fill={pt.label === 0 ? '#3182CE' : '#E53E3E'}
                        stroke="white"
                        strokeWidth={1}
                      />
                    );
                  })}
                </svg>
              </Box>
            </Box>
          </SimpleGrid>

          {/* Controls */}
          <HStack spacing={4} justify="center">
            <Button
              colorScheme="cyan"
              onClick={handleForwardPass}
              isLoading={isAnimating}
              loadingText="Animating..."
              size="md"
            >
              Forward Pass
            </Button>
            <Button
              variant="outline"
              onClick={handleRandomize}
              isDisabled={isAnimating}
              size="md"
            >
              Randomize Weights
            </Button>
          </HStack>

          {/* Stats Panel */}
          <AnimatePresence>
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SimpleGrid
                columns={{ base: 2, md: 4 }}
                spacing={4}
                bg={cardBg}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                p={5}
              >
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {totalParams}
                  </Text>
                  <Text fontSize="xs" color={dimText}>
                    Total Parameters
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {config.layers.length}
                  </Text>
                  <Text fontSize="xs" color={dimText}>
                    Layers
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold">
                    Sigmoid
                  </Text>
                  <Text fontSize="xs" color={dimText}>
                    Activation Function
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {(accuracy * 100).toFixed(0)}%
                  </Text>
                  <Text fontSize="xs" color={dimText}>
                    Accuracy on {dataset!.name}
                  </Text>
                </VStack>
              </SimpleGrid>
            </MotionBox>
          </AnimatePresence>

          <Divider />

          {/* How it works */}
          <Box>
            <Heading as="h2" size="md" mb={4}>
              How it works
            </Heading>
            <VStack spacing={3} align="stretch">
              <Paragraph>
                A neural network is a series of layers of interconnected
                neurons. Each connection has a <strong>weight</strong> that
                determines how strongly one neuron influences another. During a{' '}
                <strong>forward pass</strong>, input values are multiplied by
                weights, summed with a bias, and passed through a sigmoid
                activation function to produce outputs between 0 and 1.
              </Paragraph>
              <Paragraph>
                The <strong>decision boundary</strong> visualization shows how
                the network partitions the 2D input space. Blue regions indicate
                the network outputs values below 0.5 (class 0), while red
                regions indicate outputs above 0.5 (class 1). The sharper the
                boundary, the more confident the network is in its
                classification.
              </Paragraph>
              <Paragraph>
                In the network diagram, <strong>green connections</strong>{' '}
                represent positive weights (excitatory) and{' '}
                <strong>red connections</strong> represent negative weights
                (inhibitory). Thicker lines indicate larger weight magnitudes.
                During animation, nodes light up from blue (low activation) to
                red (high activation) as signals propagate through the network.
              </Paragraph>
            </VStack>
          </Box>
        </VStack>
      </SlideFade>
    </Container>
  );
}
