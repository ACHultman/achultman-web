import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  Code,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Paragraph from '@components/Paragraph';
import {
  SCENES,
  PIPELINE_STAGES,
  FB_DISPLAY_SIZE,
  STAGE_PSEUDOCODE,
  generatePipelineSteps,
  type PipelineStep,
  type PipelineStage,
  type Vertex,
  type Fragment as PipelineFragment,
} from '@data/gpuPipelineData';

const MotionBox = motion(Box);

// ── Stage indicator bar ────────────────────────────────────────────────────

function StageBar({
  currentStage,
  onSelect,
}: {
  currentStage: PipelineStage;
  onSelect: (idx: number) => void;
}) {
  const activeBg = useColorModeValue('green.500', 'green.400');
  const inactiveBg = useColorModeValue('gray.200', 'gray.600');
  const activeText = useColorModeValue('white', 'gray.900');
  const inactiveText = useColorModeValue('gray.600', 'gray.400');
  const connectorColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <Flex
      align="center"
      overflowX="auto"
      py={2}
      gap={0}
      css={{ '&::-webkit-scrollbar': { display: 'none' } }}
    >
      {PIPELINE_STAGES.map((ps, i) => {
        const isActive = ps.stage === currentStage;
        const currentIdx = PIPELINE_STAGES.findIndex(
          (s) => s.stage === currentStage,
        );
        const isPast = i < currentIdx;
        return (
          <Flex key={ps.stage} align="center">
            {i > 0 && (
              <Box
                w="16px"
                h="2px"
                bg={isPast ? activeBg : connectorColor}
                flexShrink={0}
              />
            )}
            <Box
              as="button"
              onClick={() => onSelect(i)}
              bg={isActive ? activeBg : isPast ? 'green.200' : inactiveBg}
              color={isActive ? activeText : inactiveText}
              px={3}
              py={1.5}
              borderRadius="full"
              fontSize="xs"
              fontWeight={isActive ? 'bold' : 'medium'}
              whiteSpace="nowrap"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ opacity: 0.8 }}
              flexShrink={0}
            >
              {ps.icon}
            </Box>
          </Flex>
        );
      })}
    </Flex>
  );
}

// ── SVG 3D View ────────────────────────────────────────────────────────────

function SVG3DView({ step }: { step: PipelineStep }) {
  const bgColor = useColorModeValue('#f7fafc', '#1a202c');
  const wireColor = useColorModeValue('#2D3748', '#CBD5E0');
  const dotColor = useColorModeValue('#E53E3E', '#FC8181');
  const gridColor = useColorModeValue('#E2E8F0', '#2D3748');

  const size = 300;
  const pad = 20;

  const toSVG = (sx: number, sy: number): [number, number] => {
    const x = pad + (sx / (FB_DISPLAY_SIZE - 1)) * (size - 2 * pad);
    const y = pad + (sy / (FB_DISPLAY_SIZE - 1)) * (size - 2 * pad);
    return [x, y];
  };

  const showDots =
    step.stage === 'input-assembly' || step.stage === 'vertex-shader';
  const showWireframe =
    step.stage === 'primitive-assembly' ||
    step.stage === 'rasterization' ||
    step.stage === 'fragment-shader';
  const showFilled =
    step.stage === 'depth-test' || step.stage === 'framebuffer';

  return (
    <Box>
      <svg
        width="100%"
        viewBox={`0 0 ${size} ${size}`}
        style={{ maxWidth: size, background: bgColor, borderRadius: 8 }}
      >
        {/* Grid */}
        {Array.from({ length: 5 }, (_, i) => {
          const pos = pad + (i / 4) * (size - 2 * pad);
          return (
            <g key={i}>
              <line
                x1={pad}
                y1={pos}
                x2={size - pad}
                y2={pos}
                stroke={gridColor}
                strokeWidth={0.5}
              />
              <line
                x1={pos}
                y1={pad}
                x2={pos}
                y2={size - pad}
                stroke={gridColor}
                strokeWidth={0.5}
              />
            </g>
          );
        })}

        {/* Filled triangles */}
        {showFilled &&
          step.triangles.map((tri) => {
            const v0 = tri.vertices[0];
            const v1 = tri.vertices[1];
            const v2 = tri.vertices[2];
            if (!v0.screenPosition || !v1.screenPosition || !v2.screenPosition)
              return null;
            const [x0, y0] = toSVG(v0.screenPosition[0], v0.screenPosition[1]);
            const [x1, y1] = toSVG(v1.screenPosition[0], v1.screenPosition[1]);
            const [x2, y2] = toSVG(v2.screenPosition[0], v2.screenPosition[1]);
            const avgColor: [number, number, number] = [
              (v0.color[0] + v1.color[0] + v2.color[0]) / 3,
              (v0.color[1] + v1.color[1] + v2.color[1]) / 3,
              (v0.color[2] + v1.color[2] + v2.color[2]) / 3,
            ];
            const fill = `rgb(${Math.round(avgColor[0] * 255)},${Math.round(avgColor[1] * 255)},${Math.round(avgColor[2] * 255)})`;
            return (
              <polygon
                key={tri.id}
                points={`${x0},${y0} ${x1},${y1} ${x2},${y2}`}
                fill={fill}
                stroke={wireColor}
                strokeWidth={1}
                opacity={0.85}
              />
            );
          })}

        {/* Wireframe triangles */}
        {showWireframe &&
          step.triangles.map((tri) => {
            const v0 = tri.vertices[0];
            const v1 = tri.vertices[1];
            const v2 = tri.vertices[2];
            if (!v0.screenPosition || !v1.screenPosition || !v2.screenPosition)
              return null;
            const [x0, y0] = toSVG(v0.screenPosition[0], v0.screenPosition[1]);
            const [x1, y1] = toSVG(v1.screenPosition[0], v1.screenPosition[1]);
            const [x2, y2] = toSVG(v2.screenPosition[0], v2.screenPosition[1]);
            return (
              <polygon
                key={tri.id}
                points={`${x0},${y0} ${x1},${y1} ${x2},${y2}`}
                fill="none"
                stroke={wireColor}
                strokeWidth={1.5}
              />
            );
          })}

        {/* Scanline */}
        {step.scanline !== null && (
          <motion.line
            x1={pad}
            x2={size - pad}
            y1={toSVG(0, step.scanline)[1]}
            y2={toSVG(0, step.scanline)[1]}
            stroke="#E53E3E"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}

        {/* Vertex dots */}
        {showDots &&
          step.vertices.map((v, i) => {
            const sp = v.screenPosition;
            const pos = v.position;
            // For input assembly, place dots based on raw position mapped to SVG
            const [cx, cy] = sp
              ? toSVG(sp[0], sp[1])
              : [
                  pad + ((pos[0] * 0.5 + 0.5) * (size - 2 * pad)),
                  pad + ((-pos[1] * 0.5 + 0.5) * (size - 2 * pad)),
                ];
            const fill = `rgb(${Math.round(v.color[0] * 255)},${Math.round(v.color[1] * 255)},${Math.round(v.color[2] * 255)})`;
            const isActive = step.activeVertex === i;
            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 6 : 4}
                  fill={fill}
                  stroke={isActive ? dotColor : 'none'}
                  strokeWidth={isActive ? 2 : 0}
                />
                {isActive && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={10}
                    fill="none"
                    stroke={dotColor}
                    strokeWidth={1}
                    opacity={0.5}
                  />
                )}
              </g>
            );
          })}
      </svg>
    </Box>
  );
}

// ── Pixel Grid ─────────────────────────────────────────────────────────────

function PixelGrid({
  fragments,
  framebuffer,
  scanline,
  mode,
}: {
  fragments: PipelineFragment[];
  framebuffer: [number, number, number][][];
  scanline: number | null;
  mode: 'fragments' | 'depth' | 'color';
}) {
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const cellSize = 8;

  // Build lookup for fragments
  const fragMap = useMemo(() => {
    const map = new Map<string, PipelineFragment>();
    for (const f of fragments) {
      map.set(`${f.x},${f.y}`, f);
    }
    return map;
  }, [fragments]);

  // Find depth range for normalization
  const depthRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const f of fragments) {
      if (f.depth < min) min = f.depth;
      if (f.depth > max) max = f.depth;
    }
    if (!isFinite(min)) {
      min = 0;
      max = 1;
    }
    if (max === min) max = min + 1;
    return { min, max };
  }, [fragments]);

  return (
    <Box
      overflowX="auto"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={1}
      display="inline-block"
    >
      <svg
        width={cellSize * FB_DISPLAY_SIZE + 2}
        height={cellSize * FB_DISPLAY_SIZE + 2}
        viewBox={`0 0 ${cellSize * FB_DISPLAY_SIZE + 2} ${cellSize * FB_DISPLAY_SIZE + 2}`}
      >
        {Array.from({ length: FB_DISPLAY_SIZE }, (_, y) =>
          Array.from({ length: FB_DISPLAY_SIZE }, (_, x) => {
            const key = `${x},${y}`;
            const frag = fragMap.get(key);
            let fill = 'transparent';

            if (mode === 'color') {
              const pixel = framebuffer[y]?.[x];
              if (pixel && (pixel[0] > 0 || pixel[1] > 0 || pixel[2] > 0)) {
                fill = `rgb(${Math.round(pixel[0] * 255)},${Math.round(pixel[1] * 255)},${Math.round(pixel[2] * 255)})`;
              }
            } else if (mode === 'depth' && frag) {
              const norm =
                1 -
                (frag.depth - depthRange.min) /
                  (depthRange.max - depthRange.min);
              const g = Math.round(norm * 255);
              fill = `rgb(${g},${g},${g})`;
            } else if (mode === 'fragments' && frag) {
              fill = `rgb(${Math.round(frag.color[0] * 200)},${Math.round(frag.color[1] * 200)},${Math.round(frag.color[2] * 200)})`;
            }

            const isScanline = scanline !== null && y === scanline;

            return (
              <rect
                key={key}
                x={1 + x * cellSize}
                y={1 + y * cellSize}
                width={cellSize - 0.5}
                height={cellSize - 0.5}
                fill={fill}
                stroke={isScanline ? '#E53E3E' : 'none'}
                strokeWidth={isScanline ? 0.5 : 0}
                rx={0.5}
              />
            );
          }),
        )}
      </svg>
    </Box>
  );
}

// ── Vertex Table ───────────────────────────────────────────────────────────

function VertexTable({
  vertices,
  activeVertex,
  showTransformed,
}: {
  vertices: Vertex[];
  activeVertex: number | null;
  showTransformed: boolean;
}) {
  const activeBg = useColorModeValue('green.50', 'green.900');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box overflowX="auto" maxH="300px" overflowY="auto">
      <Table size="sm" variant="simple">
        <Thead position="sticky" top={0} bg={headerBg} zIndex={1}>
          <Tr>
            <Th fontSize="xs">#</Th>
            <Th fontSize="xs">Position</Th>
            <Th fontSize="xs">Color</Th>
            {showTransformed && <Th fontSize="xs">Screen</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {vertices.map((v, i) => (
            <Tr key={i} bg={activeVertex === i ? activeBg : undefined}>
              <Td fontFamily="mono" fontSize="xs">
                {i}
              </Td>
              <Td fontFamily="mono" fontSize="xs">
                ({v.position[0].toFixed(2)}, {v.position[1].toFixed(2)},{' '}
                {v.position[2].toFixed(2)})
              </Td>
              <Td>
                <HStack spacing={1}>
                  <Box
                    w={3}
                    h={3}
                    borderRadius="sm"
                    bg={`rgb(${Math.round(v.color[0] * 255)},${Math.round(v.color[1] * 255)},${Math.round(v.color[2] * 255)})`}
                  />
                  <Text fontFamily="mono" fontSize="xs">
                    ({v.color[0].toFixed(1)},{v.color[1].toFixed(1)},
                    {v.color[2].toFixed(1)})
                  </Text>
                </HStack>
              </Td>
              {showTransformed && v.screenPosition && (
                <Td fontFamily="mono" fontSize="xs">
                  ({v.screenPosition[0]}, {v.screenPosition[1]})
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

// ── Technical view (right panel) ───────────────────────────────────────────

function TechnicalView({ step }: { step: PipelineStep }) {
  const codeBg = useColorModeValue('gray.900', 'gray.900');
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  switch (step.stage) {
    case 'input-assembly':
      return (
        <VStack align="stretch" spacing={3}>
          <Text fontSize="sm" fontWeight="bold">
            Vertex Buffer
          </Text>
          <VertexTable
            vertices={step.vertices}
            activeVertex={step.activeVertex}
            showTransformed={false}
          />
        </VStack>
      );

    case 'vertex-shader':
      return (
        <VStack align="stretch" spacing={3}>
          <Text fontSize="sm" fontWeight="bold">
            Transformed Vertices
          </Text>
          <VertexTable
            vertices={step.vertices}
            activeVertex={step.activeVertex}
            showTransformed={true}
          />
          <Text fontSize="xs" color={labelColor}>
            Each vertex multiplied by MVP matrix
          </Text>
        </VStack>
      );

    case 'primitive-assembly':
      return (
        <VStack align="stretch" spacing={3}>
          <Text fontSize="sm" fontWeight="bold">
            Triangles ({step.triangles.length})
          </Text>
          {step.triangles.map((tri) => (
            <Box
              key={tri.id}
              p={2}
              borderRadius="md"
              borderWidth="1px"
              borderColor={
                step.activeTriangle === tri.id ? 'green.400' : 'transparent'
              }
            >
              <Text fontFamily="mono" fontSize="xs">
                Triangle {tri.id}: v{tri.id * 3}, v{tri.id * 3 + 1}, v
                {tri.id * 3 + 2}
              </Text>
            </Box>
          ))}
        </VStack>
      );

    case 'rasterization':
      return (
        <VStack align="stretch" spacing={3}>
          <Text fontSize="sm" fontWeight="bold">
            Fragment Coverage ({step.fragments.length} fragments)
          </Text>
          <PixelGrid
            fragments={step.fragments}
            framebuffer={step.framebuffer}
            scanline={step.scanline}
            mode="fragments"
          />
          <Text fontSize="xs" color={labelColor}>
            Gray = fragment generated inside triangle
          </Text>
        </VStack>
      );

    case 'fragment-shader':
      return (
        <VStack align="stretch" spacing={3}>
          <Text fontSize="sm" fontWeight="bold">
            Colored Fragments ({step.fragments.length})
          </Text>
          <PixelGrid
            fragments={step.fragments}
            framebuffer={step.framebuffer}
            scanline={null}
            mode="fragments"
          />
          <Text fontSize="xs" color={labelColor}>
            Colors interpolated via barycentric coordinates
          </Text>
        </VStack>
      );

    case 'depth-test':
      return (
        <VStack align="stretch" spacing={3}>
          <Text fontSize="sm" fontWeight="bold">
            Depth Buffer
          </Text>
          <PixelGrid
            fragments={step.fragments}
            framebuffer={step.framebuffer}
            scanline={null}
            mode="depth"
          />
          <Text fontSize="xs" color={labelColor}>
            White = near, Black = far. Closer fragments win.
          </Text>
        </VStack>
      );

    case 'framebuffer':
      return (
        <VStack align="stretch" spacing={3}>
          <Text fontSize="sm" fontWeight="bold">
            Final Render
          </Text>
          <PixelGrid
            fragments={step.fragments}
            framebuffer={step.framebuffer}
            scanline={null}
            mode="color"
          />
          <Text fontSize="xs" color={labelColor}>
            {FB_DISPLAY_SIZE}x{FB_DISPLAY_SIZE} framebuffer output
          </Text>
        </VStack>
      );

    default:
      return null;
  }
}

// ── Main page component ────────────────────────────────────────────────────

export default function GpuPipelinePage() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [rotation, setRotation] = useState(0.4);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scene = SCENES[sceneIdx]!;
  const steps = useMemo(
    () => generatePipelineSteps(scene, rotation),
    [scene, rotation],
  );
  const step = steps[stepIdx]!;

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const activeBorder = useColorModeValue('green.500', 'green.400');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const codeBg = useColorModeValue('gray.900', 'gray.900');

  const selectScene = (idx: number) => {
    setSceneIdx(idx);
    setStepIdx(0);
    setIsPlaying(false);
  };

  const goToStep = useCallback(
    (idx: number) => {
      setStepIdx(Math.max(0, Math.min(steps.length - 1, idx)));
    },
    [steps.length],
  );

  const jumpToStage = (stageIdx: number) => {
    goToStep(stageIdx);
    setIsPlaying(false);
  };

  // Play/pause
  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => {
        setStepIdx((prev: number) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    } else if (playRef.current) {
      clearInterval(playRef.current);
      playRef.current = null;
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [isPlaying, steps.length]);

  // Rotation slider for cube scene
  const handleRotation = (val: number) => {
    setRotation(val);
    // Re-generate steps via useMemo dependency
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
            <Badge colorScheme="purple" fontSize="sm">
              Graphics
            </Badge>
          </HStack>
          <Heading size="xl" mb={2}>
            {'🎮 GPU Pipeline Visualizer'}
          </Heading>
          <Paragraph>
            Step through the classic GPU rendering pipeline stage by stage. See
            how vertices become pixels — from input assembly through
            rasterization to the final framebuffer.
          </Paragraph>
        </Box>

        {/* Pipeline stage bar */}
        <Box>
          <Text fontSize="xs" fontWeight="bold" mb={1} textTransform="uppercase" letterSpacing="wide" color={subtleText}>
            Pipeline Stage
          </Text>
          <StageBar currentStage={step.stage} onSelect={jumpToStage} />
          <Text fontSize="sm" fontWeight="bold" mt={1}>
            {PIPELINE_STAGES.find((s) => s.stage === step.stage)?.label}
          </Text>
        </Box>

        {/* Scene selector */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {SCENES.map((s, i: number) => (
            <Box
              key={s.name}
              as="button"
              textAlign="left"
              bg={cardBg}
              p={4}
              borderRadius="lg"
              borderWidth="2px"
              borderColor={i === sceneIdx ? activeBorder : cardBorder}
              onClick={() => selectScene(i)}
              cursor="pointer"
              _hover={{ borderColor: activeBorder }}
              transition="border-color 0.2s"
            >
              <Text fontWeight="bold" fontSize="md" mb={1}>
                {s.name}
              </Text>
              <Text fontSize="sm" color={subtleText} noOfLines={2}>
                {s.description}
              </Text>
              <Text fontSize="xs" color={subtleText} mt={1}>
                {s.triangles.length} triangle{s.triangles.length !== 1 ? 's' : ''}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Rotation control for cube */}
        {sceneIdx === 2 && (
          <HStack spacing={4}>
            <Text fontSize="sm" fontWeight="bold">
              Rotation:
            </Text>
            <input
              type="range"
              min={0}
              max={6.28}
              step={0.05}
              value={rotation}
              onChange={(e) => handleRotation(parseFloat(e.target.value))}
              style={{ flex: 1, maxWidth: 300 }}
            />
            <Text fontSize="xs" fontFamily="mono" color={subtleText}>
              {rotation.toFixed(2)} rad
            </Text>
          </HStack>
        )}

        <Divider />

        {/* Step controls */}
        <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
          <HStack>
            <IconButton
              aria-label="Previous step"
              icon={<ChevronLeftIcon boxSize={6} />}
              onClick={() => goToStep(stepIdx - 1)}
              isDisabled={stepIdx === 0}
              variant="outline"
              colorScheme="green"
            />
            <Text
              fontFamily="mono"
              fontSize="sm"
              minW="100px"
              textAlign="center"
            >
              Step {step.stepNumber} / {steps.length}
            </Text>
            <IconButton
              aria-label="Next step"
              icon={<ChevronRightIcon boxSize={6} />}
              onClick={() => goToStep(stepIdx + 1)}
              isDisabled={stepIdx === steps.length - 1}
              variant="outline"
              colorScheme="green"
            />
          </HStack>
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme="green"
              variant={isPlaying ? 'solid' : 'outline'}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setStepIdx(0);
                setIsPlaying(false);
              }}
            >
              Reset
            </Button>
          </HStack>
        </Flex>

        {/* Step title & description */}
        <AnimatePresence mode="wait">
          <MotionBox
            key={`${sceneIdx}-${stepIdx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Box
              bg={cardBg}
              p={5}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={cardBorder}
            >
              <Heading size="md" mb={2}>
                {step.title}
              </Heading>
              <Text color={subtleText} lineHeight="tall">
                {step.description}
              </Text>
            </Box>
          </MotionBox>
        </AnimatePresence>

        {/* Main visualization: side by side */}
        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          {/* Left: 3D SVG view */}
          <Box flex={1}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              mb={2}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              3D View
            </Text>
            <SVG3DView step={step} />
          </Box>

          {/* Right: Technical view */}
          <Box flex={1}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              mb={2}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Technical View
            </Text>
            <Box
              bg={cardBg}
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={cardBorder}
              minH="300px"
            >
              <TechnicalView step={step} />
            </Box>
          </Box>
        </Flex>

        <Divider />

        {/* Pseudocode */}
        <Box>
          <Text
            fontSize="sm"
            fontWeight="bold"
            mb={2}
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Stage Pseudocode
          </Text>
          <Box
            bg={codeBg}
            borderRadius="md"
            p={4}
            overflowX="auto"
            border="1px solid"
            borderColor="gray.700"
          >
            <Code
              display="block"
              whiteSpace="pre"
              fontFamily="mono"
              fontSize="sm"
              bg="transparent"
              color="green.300"
              lineHeight="tall"
            >
              {STAGE_PSEUDOCODE[step.stage]}
            </Code>
          </Box>
        </Box>

        {/* How it works */}
        <Box>
          <Heading size="sm" mb={3}>
            How It Works
          </Heading>
          <VStack align="stretch" spacing={3}>
            <Paragraph>
              This visualizer simulates the classic fixed-function GPU rendering
              pipeline in JavaScript. Real GPUs execute these stages in parallel
              across thousands of cores, but the logical flow is the same.
            </Paragraph>
            <Paragraph>
              Vertices are transformed by the Model-View-Projection matrix in
              the vertex shader, assembled into triangles, then rasterized into
              fragments using edge functions. Each fragment gets a color via
              barycentric interpolation of the vertex colors, passes a depth
              test, and is written to the framebuffer.
            </Paragraph>
            <Paragraph>
              The {FB_DISPLAY_SIZE}x{FB_DISPLAY_SIZE} pixel grid is
              intentionally small so you can see individual pixels being
              generated. Production GPUs render millions of pixels per frame
              using this same pipeline.
            </Paragraph>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
