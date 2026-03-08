import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { NextSeo } from 'next-seo';
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
  Wrap,
  WrapItem,
  CloseButton,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import Paragraph from '@components/Paragraph';
import {
  SUPPLEMENTS,
  CATEGORIES,
  GRADE_INFO,
  GRADE_COLORS,
  GRADE_COLORS_DARK,
  type SupplementEvidence,
  type EvidenceGrade,
} from '@data/evidenceVizData';

const MotionBox = motion(Box);

function BubbleChart({
  supplements,
  onSelect,
  selectedId,
}: {
  supplements: SupplementEvidence[];
  onSelect: (s: SupplementEvidence | null) => void;
  selectedId: string | null;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  const isLight = useColorModeValue(true, false);
  const axisColor = useColorModeValue('gray.400', 'gray.500');
  const chartBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.min(rect.width * 0.65, 500) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const padding = { top: 30, right: 30, bottom: 50, left: 55 };
  const chartW = dimensions.width - padding.left - padding.right;
  const chartH = dimensions.height - padding.top - padding.bottom;

  const maxStudies = Math.max(...supplements.map((s) => s.studyCount));
  const maxQuality = 10;

  const gradeColorMap: Record<EvidenceGrade, string> = {
    A: '#48BB78',
    B: '#4299E1',
    C: '#ED8936',
    D: '#A0AEC0',
  };

  const bubbles = useMemo(() => {
    return supplements.map((s) => {
      const x = padding.left + (s.studyCount / maxStudies) * chartW;
      const y = padding.top + (1 - s.avgQuality / maxQuality) * chartH;
      const r = Math.max(8, Math.min(35, s.popularity * 0.35));
      return { ...s, x, y, r };
    });
  }, [supplements, chartW, chartH, maxStudies, padding.left, padding.top]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found: string | null = null;
      for (const b of bubbles) {
        const dx = mx - b.x;
        const dy = my - b.y;
        if (dx * dx + dy * dy <= b.r * b.r) {
          found = b.name;
          break;
        }
      }
      setHoveredId(found);
      if (found) {
        setTooltipPos({ x: mx, y: my });
      }
    },
    [bubbles],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (const b of bubbles) {
        const dx = mx - b.x;
        const dy = my - b.y;
        if (dx * dx + dy * dy <= b.r * b.r) {
          onSelect(selectedId === b.name ? null : b);
          return;
        }
      }
      onSelect(null);
    },
    [bubbles, onSelect, selectedId],
  );

  const hoveredSupplement = hoveredId
    ? supplements.find((s) => s.name === hoveredId)
    : null;

  // Grid lines
  const xTicks = [0, 100, 200, 300];
  const yTicks = [2, 4, 6, 8, 10];

  return (
    <Box
      ref={canvasRef}
      position="relative"
      w="100%"
      h={`${dimensions.height}px`}
      bg={chartBg}
      borderRadius="xl"
      overflow="hidden"
      cursor="pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoveredId(null);
        setTooltipPos(null);
      }}
      onClick={handleClick}
    >
      {/* Grid lines */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        {/* Horizontal grid */}
        {yTicks.map((tick) => {
          const y = padding.top + (1 - tick / maxQuality) * chartH;
          return (
            <g key={`y-${tick}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={dimensions.width - padding.right}
                y2={y}
                stroke={isLight ? '#E2E8F0' : '#2D3748'}
                strokeDasharray="4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fill={isLight ? '#A0AEC0' : '#718096'}
                fontSize="11"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Vertical grid */}
        {xTicks.map((tick) => {
          const x = padding.left + (tick / maxStudies) * chartW;
          return (
            <g key={`x-${tick}`}>
              <line
                x1={x}
                y1={padding.top}
                x2={x}
                y2={dimensions.height - padding.bottom}
                stroke={isLight ? '#E2E8F0' : '#2D3748'}
                strokeDasharray="4"
              />
              <text
                x={x}
                y={dimensions.height - padding.bottom + 18}
                textAnchor="middle"
                fill={isLight ? '#A0AEC0' : '#718096'}
                fontSize="11"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text
          x={dimensions.width / 2}
          y={dimensions.height - 5}
          textAnchor="middle"
          fill={isLight ? '#718096' : '#A0AEC0'}
          fontSize="12"
          fontWeight="bold"
        >
          Number of Studies
        </text>
        <text
          x={15}
          y={dimensions.height / 2}
          textAnchor="middle"
          fill={isLight ? '#718096' : '#A0AEC0'}
          fontSize="12"
          fontWeight="bold"
          transform={`rotate(-90, 15, ${dimensions.height / 2})`}
        >
          Avg Study Quality
        </text>
      </svg>

      {/* Bubbles */}
      {bubbles.map((b) => {
        const isHovered = hoveredId === b.name;
        const isSelected = selectedId === b.name;
        const opacity = selectedId && !isSelected ? 0.3 : isHovered ? 1 : 0.75;

        return (
          <MotionBox
            key={b.name}
            position="absolute"
            left={`${b.x - b.r}px`}
            top={`${b.y - b.r}px`}
            w={`${b.r * 2}px`}
            h={`${b.r * 2}px`}
            borderRadius="full"
            bg={gradeColorMap[b.grade]}
            opacity={opacity}
            borderWidth={isSelected ? '3px' : '1px'}
            borderColor={isSelected ? 'white' : 'transparent'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isHovered ? 1.15 : 1,
              opacity,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ pointerEvents: 'none' }}
          >
            {b.r > 14 && (
              <Text
                fontSize={b.r > 22 ? '9px' : '7px'}
                fontWeight="bold"
                color="white"
                textAlign="center"
                lineHeight="1.1"
                px={1}
                textShadow="0 1px 2px rgba(0,0,0,0.5)"
                userSelect="none"
              >
                {b.name.length > 10 ? b.name.split(/[\s/]/)[0] : b.name}
              </Text>
            )}
          </MotionBox>
        );
      })}

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredSupplement && tooltipPos && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            position="absolute"
            left={`${Math.min(tooltipPos.x + 15, dimensions.width - 200)}px`}
            top={`${Math.max(tooltipPos.y - 60, 10)}px`}
            bg={isLight ? 'white' : 'gray.700'}
            borderWidth="1px"
            borderColor={isLight ? 'gray.200' : 'gray.600'}
            borderRadius="lg"
            p={3}
            shadow="lg"
            zIndex={10}
            pointerEvents="none"
            minW="160px"
          >
            <Text fontWeight="bold" fontSize="sm" mb={1}>
              {hoveredSupplement.name}
            </Text>
            <HStack spacing={2} mb={1}>
              <Badge
                bg={gradeColorMap[hoveredSupplement.grade]}
                color="white"
                fontSize="xs"
              >
                Grade {hoveredSupplement.grade}
              </Badge>
              <Text fontSize="xs" color={axisColor}>
                {GRADE_INFO[hoveredSupplement.grade].label}
              </Text>
            </HStack>
            <VStack spacing={0} align="start" fontSize="xs" color={axisColor}>
              <Text>{hoveredSupplement.studyCount} studies</Text>
              <Text>Quality: {hoveredSupplement.avgQuality}/10</Text>
              <Text>Popularity: {hoveredSupplement.popularity}/100</Text>
            </VStack>
            <Text fontSize="xs" color={isLight ? 'gray.500' : 'gray.400'} mt={1}>
              Click for details
            </Text>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}

function SupplementDetail({
  supplement,
  onClose,
}: {
  supplement: SupplementEvidence;
  onClose: () => void;
}) {
  const isLight = useColorModeValue(true, false);
  const colors = isLight
    ? GRADE_COLORS[supplement.grade]
    : GRADE_COLORS_DARK[supplement.grade];
  const dimText = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const claimBg = useColorModeValue('red.50', 'red.900');
  const claimBorder = useColorModeValue('red.200', 'red.700');

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        bg={cardBg}
        borderWidth="2px"
        borderColor={colors.border}
        borderRadius="xl"
        p={{ base: 4, md: 6 }}
        position="relative"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="3px"
          bg={colors.border}
        />

        <Flex justify="space-between" align="start" mb={4} mt={1}>
          <Box>
            <HStack spacing={2} mb={2}>
              <Heading as="h3" size="md">
                {supplement.name}
              </Heading>
              <Badge bg={colors.bg} color={colors.text} fontSize="sm" px={2}>
                Grade {supplement.grade}
              </Badge>
            </HStack>
            <HStack spacing={4} fontSize="xs" color={dimText}>
              <Text>{supplement.studyCount} studies</Text>
              <Text>Quality: {supplement.avgQuality}/10</Text>
              <Text>Category: {supplement.category}</Text>
            </HStack>
          </Box>
          <CloseButton onClick={onClose} />
        </Flex>

        <Divider mb={4} />

        {/* Common claims */}
        <Box mb={4}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={dimText}
            textTransform="uppercase"
            letterSpacing="wider"
            mb={2}
          >
            Common Claims
          </Text>
          <Wrap spacing={2}>
            {supplement.claims.map((claim) => (
              <WrapItem key={claim}>
                <Badge
                  bg={claimBg}
                  borderWidth="1px"
                  borderColor={claimBorder}
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  ❌ {claim}
                </Badge>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        {/* Actual evidence */}
        <Box mb={4}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={dimText}
            textTransform="uppercase"
            letterSpacing="wider"
            mb={2}
          >
            What the Evidence Actually Says
          </Text>
          <Box
            bg={colors.bg}
            borderWidth="1px"
            borderColor={colors.border}
            borderRadius="lg"
            p={4}
          >
            <Text fontSize="sm" lineHeight="tall">
              {supplement.actualEvidence}
            </Text>
          </Box>
        </Box>

        {/* Key studies */}
        <Box>
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={dimText}
            textTransform="uppercase"
            letterSpacing="wider"
            mb={2}
          >
            Key Studies
          </Text>
          <VStack spacing={2} align="stretch">
            {supplement.keyStudies.map((study, i) => (
              <HStack key={i} spacing={2} align="start">
                <Text fontSize="sm" color={colors.text} flexShrink={0}>
                  📄
                </Text>
                <Text fontSize="sm" color={dimText}>
                  {study}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Box>
    </MotionBox>
  );
}

function EvidenceViz() {
  const [selectedSupplement, setSelectedSupplement] =
    useState<SupplementEvidence | null>(null);
  const [activeGrade, setActiveGrade] = useState<EvidenceGrade | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dimText = useColorModeValue('gray.500', 'gray.400');
  const chipBg = useColorModeValue('gray.100', 'gray.700');

  const gradeColorMap: Record<EvidenceGrade, string> = {
    A: 'green',
    B: 'blue',
    C: 'orange',
    D: 'gray',
  };

  const filteredSupplements = useMemo(() => {
    return SUPPLEMENTS.filter((s) => {
      const matchesGrade = !activeGrade || s.grade === activeGrade;
      const matchesCategory = !activeCategory || s.category === activeCategory;
      return matchesGrade && matchesCategory;
    });
  }, [activeGrade, activeCategory]);

  const handleSelect = useCallback((s: SupplementEvidence | null) => {
    setSelectedSupplement(s);
  }, []);

  return (
    <>
      <NextSeo
        title="Evidence Strength Visualizer | Labs | Adam Hultman"
        description="Interactive visualization of scientific evidence quality for popular supplements. Explore study counts, quality ratings, and evidence grades."
        canonical="https://hultman.dev/labs/evidence-viz"
      />
      <Container maxW="container.lg">
        <SlideFade in={true} offsetY={80}>
          <Box>
            <HStack mb={6}>
              <IconButton
                as={NextLink}
                href="/labs"
                aria-label="Back to Labs"
                icon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
              />
              <Badge colorScheme="teal" variant="subtle" fontSize="xs">
                Data Visualization
              </Badge>
            </HStack>

            <Heading
              as="h1"
              fontSize={{ base: '24px', md: '32px', lg: '36px' }}
              mb={3}
            >
              📊 Evidence Strength Visualizer
            </Heading>
            <Paragraph fontSize="lg" mb={4}>
              How strong is the science behind your supplements? Explore the evidence
              landscape — from well-studied compounds to marketing hype.
            </Paragraph>
            <Text fontSize="sm" color={dimText} mb={8}>
              Bubble size = popularity · X axis = number of studies · Y axis = average study quality ·
              Color = evidence grade
            </Text>

            {/* Grade legend */}
            <Wrap spacing={3} mb={4}>
              {(Object.entries(GRADE_INFO) as [EvidenceGrade, typeof GRADE_INFO.A][]).map(
                ([grade, info]) => (
                  <WrapItem key={grade}>
                    <Badge
                      as="button"
                      colorScheme={gradeColorMap[grade]}
                      variant={activeGrade === grade ? 'solid' : 'outline'}
                      cursor="pointer"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      onClick={() =>
                        setActiveGrade(activeGrade === grade ? null : grade)
                      }
                    >
                      {grade}: {info.label}
                    </Badge>
                  </WrapItem>
                ),
              )}
              {activeGrade && (
                <WrapItem>
                  <Badge
                    as="button"
                    variant="ghost"
                    cursor="pointer"
                    fontSize="xs"
                    px={2}
                    py={1}
                    onClick={() => setActiveGrade(null)}
                    color={dimText}
                  >
                    ✕ Clear
                  </Badge>
                </WrapItem>
              )}
            </Wrap>

            {/* Category filters */}
            <Wrap spacing={2} mb={6}>
              <WrapItem>
                <Text fontSize="xs" color={dimText} pt={1}>
                  Category:
                </Text>
              </WrapItem>
              {CATEGORIES.map((cat) => (
                <WrapItem key={cat}>
                  <Badge
                    as="button"
                    variant={activeCategory === cat ? 'solid' : 'outline'}
                    colorScheme="teal"
                    cursor="pointer"
                    fontSize="xs"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    onClick={() =>
                      setActiveCategory(activeCategory === cat ? null : cat)
                    }
                    _hover={{ bg: chipBg }}
                  >
                    {cat}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>

            {/* Chart */}
            <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              p={{ base: 2, md: 4 }}
              mb={6}
            >
              <BubbleChart
                supplements={filteredSupplements}
                onSelect={handleSelect}
                selectedId={selectedSupplement?.name ?? null}
              />
            </Box>

            {/* Selected supplement detail */}
            <AnimatePresence mode="wait">
              {selectedSupplement && (
                <Box mb={6}>
                  <SupplementDetail
                    key={selectedSupplement.name}
                    supplement={selectedSupplement}
                    onClose={() => setSelectedSupplement(null)}
                  />
                </Box>
              )}
            </AnimatePresence>

            {/* Summary stats */}
            <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              p={{ base: 4, md: 6 }}
              mb={6}
            >
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={dimText}
                textTransform="uppercase"
                letterSpacing="wider"
                mb={3}
              >
                Evidence Overview
              </Text>
              <Flex
                wrap="wrap"
                gap={6}
                justify="center"
              >
                {(Object.entries(GRADE_INFO) as [EvidenceGrade, typeof GRADE_INFO.A][]).map(
                  ([grade, info]) => {
                    const count = SUPPLEMENTS.filter((s) => s.grade === grade).length;
                    return (
                      <VStack key={grade} spacing={1}>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color={`${gradeColorMap[grade]}.400`}
                        >
                          {count}
                        </Text>
                        <Badge colorScheme={gradeColorMap[grade]} fontSize="xs">
                          Grade {grade}
                        </Badge>
                        <Text fontSize="xs" color={dimText}>
                          {info.label}
                        </Text>
                      </VStack>
                    );
                  },
                )}
              </Flex>
            </Box>

            <Divider my={8} />

            <Box mb={8}>
              <Heading as="h2" size="sm" mb={3}>
                How it works
              </Heading>
              <Text fontSize="sm" color={dimText} mb={3}>
                This visualization maps {SUPPLEMENTS.length} popular supplements across
                two key dimensions: <strong>quantity of research</strong> (number of studies)
                and <strong>quality of research</strong> (average methodological rigor).
                Bubble size represents consumer popularity, and color indicates the overall
                evidence grade.
              </Text>
              <Text fontSize="sm" color={dimText} mb={3}>
                Evidence grades follow a systematic framework: Grade A requires multiple
                large randomized controlled trials with consistent results. Grade D indicates
                insufficient evidence or research that contradicts popular claims. Data is
                sourced from systematic reviews and meta-analyses.
              </Text>
              <Text fontSize="sm" color={dimText} mb={3}>
                <strong>Key insight:</strong> The supplements with the highest popularity
                don&apos;t always have the strongest evidence. Some of the most marketed
                supplements (like apple cider vinegar and biotin for hair) have the weakest
                scientific support.
              </Text>
              <HStack spacing={4} fontSize="xs" color={dimText}>
                <Text>Built with: Next.js · Chakra UI · Framer Motion · Custom SVG chart</Text>
                <Link
                  href="https://github.com/ACHultman/achultman-web"
                  isExternal
                  color="teal.400"
                >
                  View Source →
                </Link>
              </HStack>
            </Box>
          </Box>
        </SlideFade>
      </Container>
    </>
  );
}

export default EvidenceViz;
