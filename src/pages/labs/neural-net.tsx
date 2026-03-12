import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Select,
  Flex,
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
  trainStep,
  type NetworkConfig,
  type BoundaryCell,
  type Dataset,
  type DataPoint,
  type ActivationFn,
} from '@data/neuralNetData';

const MotionBox = motion(Box);
const MotionText = motion(Text);

const LEARNING_RATES = [0.01, 0.1, 0.5, 1.0];
const BOUNDARY_UPDATE_INTERVAL = 5;

export default function NeuralNetPlayground() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [config, setConfig] = useState<NetworkConfig>(
    PRESET_NETWORKS[0]!.config
  );
  const [datasetKey, setDatasetKey] = useState(PRESET_NETWORKS[0]!.datasetKey);
  const [customPoints, setCustomPoints] = useState<DataPoint[]>([]);
  const [activations, setActivations] = useState<number[][] | null>(null);
  const [animatingLayer, setAnimatingLayer] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [stepsPerFrame, setStepsPerFrame] = useState(10);
  const [learningRate, setLearningRate] = useState(0.5);
  const [epoch, setEpoch] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [prevAccuracy, setPrevAccuracy] = useState<number | null>(null);
  const [accuracyPulse, setAccuracyPulse] = useState(false);

  // Activation function state
  const [activationFn, setActivationFn] = useState<ActivationFn>('sigmoid');

  // Gradient flow heatmap state
  const [showGradients, setShowGradients] = useState(false);
  const [gradientMagnitudes, setGradientMagnitudes] = useState<
    number[][][] | null
  >(null);

  // Paint mode state
  const [drawMode, setDrawMode] = useState(false);
  const [paintClass, setPaintClass] = useState<0 | 1>(1);
  const isDrawingRef = useRef(false);
  const lastPaintPosRef = useRef<{ x: number; y: number } | null>(null);

  // Refs for training loop to avoid stale closures
  const trainingRef = useRef(false);
  const configRef = useRef(config);
  const epochRef = useRef(0);
  const lossHistoryRef = useRef<number[]>([]);
  const stepsPerFrameRef = useRef(stepsPerFrame);
  const learningRateRef = useRef(learningRate);
  const activationFnRef = useRef<ActivationFn>(activationFn);
  const rafRef = useRef<number | null>(null);
  const stepsSinceBoundaryUpdate = useRef(0);

  // Keep refs in sync
  useEffect(() => {
    configRef.current = config;
  }, [config]);
  useEffect(() => {
    stepsPerFrameRef.current = stepsPerFrame;
  }, [stepsPerFrame]);
  useEffect(() => {
    learningRateRef.current = learningRate;
  }, [learningRate]);
  useEffect(() => {
    activationFnRef.current = activationFn;
  }, [activationFn]);

  // Combine base dataset with custom points
  const dataset: Dataset = useMemo(() => {
    const base = DATASETS[datasetKey]!;
    if (customPoints.length === 0) return base;
    return {
      name: base.name,
      points: [...base.points, ...customPoints],
    };
  }, [datasetKey, customPoints]);

  const boundary = useMemo(
    () => generateDecisionBoundary(config, 30, activationFn),
    [config, activationFn]
  );

  const accuracy = useMemo(
    () => computeAccuracy(config, dataset, activationFn),
    [config, dataset, activationFn]
  );

  const totalParams = useMemo(() => countParams(config), [config]);

  // Track accuracy changes for pulse animation
  useEffect(() => {
    if (prevAccuracy !== null && accuracy > prevAccuracy) {
      setAccuracyPulse(true);
      const timer = setTimeout(() => setAccuracyPulse(false), 400);
      return () => clearTimeout(timer);
    }
    setPrevAccuracy(accuracy);
  }, [accuracy, prevAccuracy]);

  // Colors
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dimText = useColorModeValue('gray.600', 'gray.400');
  const svgBg = useColorModeValue('#fafafa', '#1a1a2e');
  const controlBg = useColorModeValue('white', 'gray.700');
  const lossBg = useColorModeValue('gray.100', 'gray.900');
  const accentGreen = useColorModeValue('green.600', 'green.300');
  const pulseColor = useColorModeValue('green.500', 'green.300');

  // --- Training loop using requestAnimationFrame ---
  const trainingLoop = useCallback(() => {
    if (!trainingRef.current) return;

    const ds = DATASETS[datasetKey]!;
    const fullDs: Dataset =
      customPoints.length > 0
        ? { name: ds.name, points: [...ds.points, ...customPoints] }
        : ds;

    let currentConfig = configRef.current;
    let totalLoss = 0;
    let latestGradients: number[][][] | null = null;
    const steps = stepsPerFrameRef.current;

    for (let s = 0; s < steps; s++) {
      const result = trainStep(
        currentConfig,
        fullDs,
        learningRateRef.current,
        Math.min(8, fullDs.points.length),
        activationFnRef.current
      );
      currentConfig = result.config;
      totalLoss += result.loss;
      latestGradients = result.gradients;
    }

    const avgLoss = totalLoss / steps;
    epochRef.current += steps;
    configRef.current = currentConfig;

    const newHistory = [...lossHistoryRef.current, avgLoss].slice(-100);
    lossHistoryRef.current = newHistory;

    stepsSinceBoundaryUpdate.current += steps;
    const shouldUpdateBoundary =
      stepsSinceBoundaryUpdate.current >= BOUNDARY_UPDATE_INTERVAL;

    if (shouldUpdateBoundary) {
      stepsSinceBoundaryUpdate.current = 0;
    }

    // Batch state updates
    setConfig(currentConfig);
    setEpoch(epochRef.current);
    setLossHistory(newHistory);
    if (latestGradients) {
      setGradientMagnitudes(latestGradients);
    }

    if (trainingRef.current) {
      rafRef.current = requestAnimationFrame(trainingLoop);
    }
  }, [datasetKey, customPoints]);

  const startTraining = useCallback(() => {
    trainingRef.current = true;
    setIsTraining(true);
    rafRef.current = requestAnimationFrame(trainingLoop);
  }, [trainingLoop]);

  const stopTraining = useCallback(() => {
    trainingRef.current = false;
    setIsTraining(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const selectPreset = useCallback(
    (idx: number) => {
      stopTraining();
      setPresetIdx(idx);
      const newConfig = PRESET_NETWORKS[idx]!.config;
      setConfig(newConfig);
      configRef.current = newConfig;
      setDatasetKey(PRESET_NETWORKS[idx]!.datasetKey);
      setCustomPoints([]);
      setActivations(null);
      setAnimatingLayer(null);
      setIsAnimating(false);
      setEpoch(0);
      epochRef.current = 0;
      setLossHistory([]);
      lossHistoryRef.current = [];
      setPrevAccuracy(null);
      setGradientMagnitudes(null);
      setActivationFn('sigmoid');
      activationFnRef.current = 'sigmoid';
      if (animationRef.current) clearTimeout(animationRef.current);
    },
    [stopTraining]
  );

  const handleResetAndLearn = useCallback(() => {
    stopTraining();
    const { weights, biases } = randomizeWeights(config.layers);
    const newConfig: NetworkConfig = { ...config, weights, biases };
    setConfig(newConfig);
    configRef.current = newConfig;
    setActivations(null);
    setAnimatingLayer(null);
    setEpoch(0);
    epochRef.current = 0;
    setLossHistory([]);
    lossHistoryRef.current = [];
    stepsSinceBoundaryUpdate.current = 0;
    setPrevAccuracy(null);
    setGradientMagnitudes(null);

    // Auto-start training after a brief moment
    setTimeout(() => {
      trainingRef.current = true;
      setIsTraining(true);
      rafRef.current = requestAnimationFrame(trainingLoop);
    }, 100);
  }, [config.layers, config, stopTraining, trainingLoop]);

  const handleRandomize = useCallback(() => {
    stopTraining();
    const { weights, biases } = randomizeWeights(config.layers);
    const newConfig: NetworkConfig = { ...config, weights, biases };
    setConfig(newConfig);
    configRef.current = newConfig;
    setActivations(null);
    setAnimatingLayer(null);
    setEpoch(0);
    epochRef.current = 0;
    setLossHistory([]);
    lossHistoryRef.current = [];
    setPrevAccuracy(null);
    setGradientMagnitudes(null);
  }, [config, stopTraining]);

  const handleForwardPass = useCallback(() => {
    if (isAnimating || isTraining) return;
    const point =
      dataset.points[Math.floor(Math.random() * dataset.points.length)]!;
    const result = forwardPass([point.x, point.y], config, activationFn);
    setIsAnimating(true);

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
  }, [isAnimating, isTraining, dataset, config]);

  // Utility to get data coords from SVG mouse event
  const getDataCoordsFromEvent = useCallback(
    (e: React.MouseEvent<SVGSVGElement>): { cx: number; cy: number } => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const svgSize = 270;
      const x = (px / svgSize) * 2 - 1;
      const y = 1 - (py / svgSize) * 2;
      return {
        cx: Math.max(-1, Math.min(1, x)),
        cy: Math.max(-1, Math.min(1, y)),
      };
    },
    []
  );

  // Click on decision boundary to add a custom point
  const handleBoundaryClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      // In draw mode, mousedown/mousemove handles it
      if (drawMode) return;
      const { cx, cy } = getDataCoordsFromEvent(e);
      // Shift-click for class 0, regular click for class 1
      const label = e.shiftKey ? 0 : 1;
      setCustomPoints((prev: DataPoint[]) => [
        ...prev,
        { x: cx, y: cy, label },
      ]);
    },
    [drawMode, getDataCoordsFromEvent]
  );

  // Paint mode: mouse down
  const handleBoundaryMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!drawMode) return;
      e.preventDefault();
      isDrawingRef.current = true;
      const { cx, cy } = getDataCoordsFromEvent(e);
      lastPaintPosRef.current = { x: cx, y: cy };
      setCustomPoints((prev: DataPoint[]) => [
        ...prev,
        { x: cx, y: cy, label: paintClass },
      ]);
    },
    [drawMode, paintClass, getDataCoordsFromEvent]
  );

  // Paint mode: mouse move (throttled by distance)
  const handleBoundaryMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!drawMode || !isDrawingRef.current) return;
      const { cx, cy } = getDataCoordsFromEvent(e);
      const last = lastPaintPosRef.current;
      if (last) {
        // Distance in data coords; 15px ~ 15/270*2 ≈ 0.111 in data space
        const dx = cx - last.x;
        const dy = cy - last.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.11) return; // throttle: ~15px minimum distance
      }
      lastPaintPosRef.current = { x: cx, y: cy };
      setCustomPoints((prev: DataPoint[]) => [
        ...prev,
        { x: cx, y: cy, label: paintClass },
      ]);
    },
    [drawMode, paintClass, getDataCoordsFromEvent]
  );

  // Paint mode: mouse up
  const handleBoundaryMouseUp = useCallback(() => {
    isDrawingRef.current = false;
    lastPaintPosRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      trainingRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

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
    const val = activations[layerIdx]![neuronIdx];
    if (val === undefined) return '#888';
    const r = Math.round(val * 220 + 35);
    const b = Math.round((1 - val) * 220 + 35);
    const g = 60;
    return `rgb(${r},${g},${b})`;
  };

  const isLayerActive = (li: number) =>
    animatingLayer !== null && li <= animatingLayer;

  // Decision boundary cell color
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

  // Loss sparkline
  const lossSparkline = useMemo(() => {
    if (lossHistory.length < 2) return null;
    const maxLoss = Math.max(...lossHistory, 0.01);
    const w = 400;
    const h = 60;
    const points = lossHistory
      .map((loss: number, i: number) => {
        const x = (i / (lossHistory.length - 1)) * w;
        const y = h - (Math.min(loss, maxLoss) / maxLoss) * (h - 4);
        return `${x},${y}`;
      })
      .join(' ');
    // Gradient fill area
    const areaPoints = `0,${h} ${points} ${w},${h}`;
    return { points, areaPoints, w, h, maxLoss };
  }, [lossHistory]);

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

          <Box>
            <Heading as="h1" size="xl" mb={2}>
              {'🧠 Neural Network Playground'}
            </Heading>
            <Text fontSize="lg" color={dimText}>
              Watch a neural network learn in real time
            </Text>
          </Box>

          <Paragraph>
            Explore how neural networks classify data. Select a preset, then hit{' '}
            <strong>Reset &amp; Watch it Learn</strong> to see the network train
            from random weights using backpropagation. Click on the decision
            boundary to add your own data points (shift-click for class 0).
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

          {/* Hero Action */}
          <Flex justify="center" gap={3} flexWrap="wrap">
            <Button
              colorScheme="green"
              size="lg"
              onClick={handleResetAndLearn}
              px={8}
              fontWeight="bold"
              shadow="md"
              _hover={{ shadow: 'lg', transform: 'translateY(-1px)' }}
              transition="all 0.2s"
            >
              Reset &amp; Watch it Learn
            </Button>
          </Flex>

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
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold" fontSize="sm" color={dimText}>
                  Network Architecture
                </Text>
                {isTraining && (
                  <Badge colorScheme="green" variant="subtle" fontSize="xs">
                    Training...
                  </Badge>
                )}
              </HStack>
              <Box overflow="auto">
                <svg
                  width={svgWidth}
                  height={svgHeight}
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  style={{
                    background: svgBg,
                    borderRadius: 8,
                    display: 'block',
                    margin: '0 auto',
                  }}
                >
                  {/* Glow filter for training */}
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur
                        stdDeviation="3"
                        result="coloredBlur"
                      />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Connections */}
                  {connections.map((c, idx) => {
                    const absW = Math.abs(c.weight);
                    const active =
                      animatingLayer !== null && c.layerIdx < animatingLayer;
                    const trainingGlow = isTraining && absW > 2;
                    return (
                      <line
                        key={idx}
                        x1={c.x1}
                        y1={c.y1}
                        x2={c.x2}
                        y2={c.y2}
                        stroke={c.weight > 0 ? '#38A169' : '#E53E3E'}
                        strokeWidth={Math.min(absW * 2.5, 6)}
                        opacity={
                          isTraining
                            ? Math.min(0.3 + absW * 0.15, 0.95)
                            : active
                              ? 0.9
                              : 0.25
                        }
                        strokeLinecap="round"
                        filter={trainingGlow ? 'url(#glow)' : undefined}
                      />
                    );
                  })}

                  {/* Nodes */}
                  {nodePositions.map((layer, li) =>
                    layer.map((pos, ni) => {
                      const active = isLayerActive(li);
                      const fill = active ? getNodeColor(li, ni) : '#888';
                      return (
                        <g key={`${li}-${ni}`}>
                          {isTraining && (
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r={20}
                              fill="none"
                              stroke="#38A169"
                              strokeWidth={1}
                              opacity={0.3}
                            />
                          )}
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={16}
                            fill={fill}
                            stroke={
                              animatingLayer === li
                                ? '#FFD700'
                                : isTraining
                                  ? '#38A169'
                                  : '#555'
                            }
                            strokeWidth={
                              animatingLayer === li ? 3 : isTraining ? 2 : 1.5
                            }
                            opacity={isTraining || active ? 1 : 0.5}
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
                              {activations[li]![ni]?.toFixed(1)}
                            </text>
                          )}
                        </g>
                      );
                    })
                  )}

                  {/* Layer labels */}
                  {config.layers.map((_size: number, li: number) => {
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
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold" fontSize="sm" color={dimText}>
                  Decision Boundary
                </Text>
                <Tooltip
                  label="Click to add class 1 points. Shift-click for class 0."
                  fontSize="xs"
                >
                  <Badge
                    colorScheme="purple"
                    variant="subtle"
                    fontSize="xs"
                    cursor="help"
                  >
                    Click to add points
                  </Badge>
                </Tooltip>
              </HStack>
              <Box
                position="relative"
                mx="auto"
                w="270px"
                h="270px"
                cursor="crosshair"
              >
                <svg
                  width={270}
                  height={270}
                  viewBox="0 0 270 270"
                  style={{ borderRadius: 8, display: 'block' }}
                  onClick={handleBoundaryClick}
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

                  {/* Data points from dataset */}
                  {dataset.points.map((pt, idx) => {
                    const px = ((pt.x + 1) / 2) * 270;
                    const py = (1 - (pt.y + 1) / 2) * 270;
                    const isCustom = idx >= (DATASETS[datasetKey]?.points.length ?? 0);
                    return (
                      <circle
                        key={idx}
                        cx={px}
                        cy={py}
                        r={isCustom ? 4.5 : 3.5}
                        fill={pt.label === 0 ? '#3182CE' : '#E53E3E'}
                        stroke={isCustom ? '#FFD700' : 'white'}
                        strokeWidth={isCustom ? 1.5 : 1}
                      />
                    );
                  })}
                </svg>
              </Box>
              {customPoints.length > 0 && (
                <HStack justify="center" mt={2}>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => setCustomPoints([])}
                  >
                    Clear custom points ({customPoints.length})
                  </Button>
                </HStack>
              )}
            </Box>
          </SimpleGrid>

          {/* Training Controls Bar */}
          <Box
            bg={controlBg}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            p={4}
          >
            <Flex
              gap={4}
              align="center"
              flexWrap="wrap"
              justify="space-between"
            >
              {/* Play/Pause and Forward Pass */}
              <HStack spacing={3}>
                <Button
                  colorScheme={isTraining ? 'orange' : 'green'}
                  size="sm"
                  onClick={isTraining ? stopTraining : startTraining}
                  minW="90px"
                  isDisabled={isAnimating}
                >
                  {isTraining ? 'Pause' : 'Train'}
                </Button>
                <Button
                  colorScheme="cyan"
                  variant="outline"
                  size="sm"
                  onClick={handleForwardPass}
                  isDisabled={isAnimating || isTraining}
                >
                  Forward Pass
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomize}
                  isDisabled={isAnimating || isTraining}
                >
                  Randomize
                </Button>
              </HStack>

              {/* Speed Control */}
              <HStack spacing={2} minW="180px">
                <Text fontSize="xs" color={dimText} whiteSpace="nowrap">
                  Speed
                </Text>
                <Slider
                  min={1}
                  max={50}
                  value={stepsPerFrame}
                  onChange={(val) => setStepsPerFrame(val)}
                  size="sm"
                  w="120px"
                >
                  <SliderTrack>
                    <SliderFilledTrack bg="cyan.400" />
                  </SliderTrack>
                  <SliderThumb boxSize={3} />
                </Slider>
                <Text fontSize="xs" color={dimText} w="30px">
                  {stepsPerFrame}
                </Text>
              </HStack>

              {/* Learning Rate */}
              <HStack spacing={2}>
                <Text fontSize="xs" color={dimText} whiteSpace="nowrap">
                  LR
                </Text>
                <Select
                  size="xs"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  w="80px"
                >
                  {LEARNING_RATES.map((lr) => (
                    <option key={lr} value={lr}>
                      {lr}
                    </option>
                  ))}
                </Select>
              </HStack>

              {/* Epoch counter */}
              <HStack spacing={2}>
                <Text fontSize="xs" color={dimText}>
                  Steps:
                </Text>
                <Text fontSize="sm" fontWeight="bold" fontFamily="mono">
                  {epoch.toLocaleString()}
                </Text>
              </HStack>

              {/* Current loss */}
              {lossHistory.length > 0 && (
                <HStack spacing={2}>
                  <Text fontSize="xs" color={dimText}>
                    Loss:
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" fontFamily="mono">
                    {lossHistory[lossHistory.length - 1]!.toFixed(4)}
                  </Text>
                </HStack>
              )}
            </Flex>
          </Box>

          {/* Loss Sparkline */}
          {lossSparkline && (
            <Box
              bg={lossBg}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              p={4}
            >
              <Text fontWeight="bold" fontSize="sm" color={dimText} mb={2}>
                Loss Over Time (last {lossHistory.length} steps)
              </Text>
              <svg
                width="100%"
                height={lossSparkline.h + 16}
                viewBox={`0 0 ${lossSparkline.w} ${lossSparkline.h + 16}`}
                preserveAspectRatio="none"
                style={{ display: 'block' }}
              >
                {/* Gradient fill */}
                <defs>
                  <linearGradient
                    id="lossGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#E53E3E" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#E53E3E" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <polygon
                  points={lossSparkline.areaPoints}
                  fill="url(#lossGrad)"
                />
                <polyline
                  points={lossSparkline.points}
                  fill="none"
                  stroke="#E53E3E"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* Axis labels */}
                <text x="0" y={lossSparkline.h + 12} fontSize="8" fill="#999">
                  0
                </text>
                <text
                  x={lossSparkline.w}
                  y={lossSparkline.h + 12}
                  fontSize="8"
                  fill="#999"
                  textAnchor="end"
                >
                  {lossHistory.length}
                </text>
                <text x="0" y="8" fontSize="8" fill="#999">
                  {lossSparkline.maxLoss.toFixed(2)}
                </text>
              </svg>
            </Box>
          )}

          {/* Stats Panel */}
          <AnimatePresence>
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SimpleGrid
                columns={{ base: 2, md: 5 }}
                spacing={4}
                bg={cardBg}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                p={5}
              >
                <VStack spacing={1}>
                  <MotionText
                    fontSize="2xl"
                    fontWeight="bold"
                    color={accuracyPulse ? pulseColor : undefined}
                    animate={
                      accuracyPulse
                        ? { scale: [1, 1.2, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    {(accuracy * 100).toFixed(0)}%
                  </MotionText>
                  <Text fontSize="xs" color={dimText}>
                    Accuracy on {dataset.name}
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {totalParams}
                  </Text>
                  <Text fontSize="xs" color={dimText}>
                    Parameters
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
                  <Text fontSize="2xl" fontWeight="bold" fontFamily="mono">
                    {epoch.toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color={dimText}>
                    Training Steps
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color={accentGreen}>
                    {isTraining ? 'Learning' : 'Idle'}
                  </Text>
                  <Text fontSize="xs" color={dimText}>
                    Status
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
                During <strong>training</strong>, the network learns by
                adjusting its weights through{' '}
                <strong>backpropagation</strong>. For each data point, the
                network computes its prediction (forward pass), then calculates
                how wrong it was using <strong>binary cross-entropy loss</strong>
                . The error signal propagates backward through the network,
                computing gradients — how much each weight contributed to the
                error. Weights are then nudged in the direction that reduces
                the loss using <strong>stochastic gradient descent</strong>.
              </Paragraph>
              <Paragraph>
                The <strong>decision boundary</strong> visualization shows how
                the network partitions the 2D input space. Blue regions indicate
                outputs below 0.5 (class 0), while red regions indicate outputs
                above 0.5 (class 1). Watch how the boundary evolves from random
                noise into clean separation as the network trains. The{' '}
                <strong>learning rate</strong> controls how big each weight
                update is — too high and the network overshoots, too low and
                it learns slowly.
              </Paragraph>
              <Paragraph>
                In the network diagram, <strong>green connections</strong>{' '}
                represent positive weights (excitatory) and{' '}
                <strong>red connections</strong> represent negative weights
                (inhibitory). Thicker lines indicate larger weight magnitudes.
                During training, connections glow to show the network is
                actively learning. Try adding your own data points by clicking
                on the decision boundary and watch the network adapt.
              </Paragraph>
            </VStack>
          </Box>
        </VStack>
      </SlideFade>
    </Container>
  );
}
