import { useState, useRef, useEffect, useCallback } from 'react';
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
  Button,
  SimpleGrid,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import Paragraph from '@components/Paragraph';
import {
  ALGORITHMS,
  ARRAY_PRESETS,
  generateRandomArray,
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
  SortStep,
} from '@data/sortingData';

const MotionBox = motion(Box);

const STEP_GENERATORS: Record<string, (arr: number[]) => SortStep[]> = {
  bubbleSort: generateBubbleSortSteps,
  selectionSort: generateSelectionSortSteps,
  insertionSort: generateInsertionSortSteps,
  mergeSort: generateMergeSortSteps,
  quickSort: generateQuickSortSteps,
  heapSort: generateHeapSortSteps,
};

const SPEED_OPTIONS = [
  { label: '1x', value: 200 },
  { label: '5x', value: 40 },
  { label: '10x', value: 10 },
];

interface RaceResult {
  algorithm: string;
  totalSteps: number;
  comparisons: number;
  swaps: number;
}

export default function SortArenaPage() {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['bubbleSort']);
  const [array, setArray] = useState<number[]>(ARRAY_PRESETS[0]!.array);
  const [speed, setSpeed] = useState(200);
  const [isRacing, setIsRacing] = useState(false);
  const [raceComplete, setRaceComplete] = useState(false);
  const [raceResults, setRaceResults] = useState<RaceResult[]>([]);

  const [stepsMap, setStepsMap] = useState<Record<string, SortStep[]>>({});
  const [stepIndices, setStepIndices] = useState<Record<string, number>>({});

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const barDefaultColor = useColorModeValue('gray.300', 'gray.500');

  const stopRace = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRacing(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const toggleAlgorithm = (key: string) => {
    if (isRacing) return;
    setSelectedAlgorithms((prev: string[]) => {
      if (prev.includes(key)) {
        return prev.length === 1 ? prev : prev.filter((a: string) => a !== key);
      }
      if (prev.length >= 2) {
        return [prev[1]!, key];
      }
      return [...prev, key];
    });
    setRaceComplete(false);
    setRaceResults([]);
  };

  const setPreset = (arr: number[]) => {
    if (isRacing) return;
    setArray([...arr]);
    setStepsMap({});
    setStepIndices({});
    setRaceComplete(false);
    setRaceResults([]);
  };

  const newRandom = () => {
    if (isRacing) return;
    const arr = generateRandomArray(20);
    setArray(arr);
    setStepsMap({});
    setStepIndices({});
    setRaceComplete(false);
    setRaceResults([]);
  };

  const startRace = () => {
    if (selectedAlgorithms.length === 0) return;

    setRaceComplete(false);
    setRaceResults([]);

    const newStepsMap: Record<string, SortStep[]> = {};
    selectedAlgorithms.forEach((alg: string) => {
      newStepsMap[alg] = STEP_GENERATORS[alg]!([...array]);
    });

    setStepsMap(newStepsMap);
    const initialIndices: Record<string, number> = {};
    selectedAlgorithms.forEach((alg: string) => {
      initialIndices[alg] = 0;
    });
    setStepIndices(initialIndices);
    setIsRacing(true);

    const finished: Record<string, boolean> = {};
    selectedAlgorithms.forEach((alg: string) => {
      finished[alg] = false;
    });

    const currentIndices = { ...initialIndices };

    intervalRef.current = setInterval(() => {
      let allDone = true;

      selectedAlgorithms.forEach((alg: string) => {
        if (!finished[alg]) {
          const maxStep = newStepsMap[alg]!.length - 1;
          if (currentIndices[alg]! < maxStep) {
            currentIndices[alg]!++;
            allDone = false;
          } else {
            finished[alg] = true;
          }
        }
      });

      setStepIndices({ ...currentIndices });

      if (Object.values(finished).every(Boolean) || allDone) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRacing(false);
        setRaceComplete(true);

        const results: RaceResult[] = selectedAlgorithms.map((alg: string) => {
          const steps = newStepsMap[alg]!;
          let comparisons = 0;
          let swaps = 0;
          steps.forEach((s: SortStep) => {
            if (s.comparing) comparisons++;
            if (s.swapping) swaps++;
          });
          return {
            algorithm: alg,
            totalSteps: steps.length,
            comparisons,
            swaps,
          };
        });
        setRaceResults(results);
      }
    }, speed);
  };

  const getBarColor = (step: SortStep | undefined, index: number): string => {
    if (!step) return barDefaultColor;
    if (step.sorted.includes(index)) return 'green.400';
    if (step.swapping && (step.swapping[0] === index || step.swapping[1] === index))
      return 'red.400';
    if (step.comparing && (step.comparing[0] === index || step.comparing[1] === index))
      return 'yellow.400';
    if (step.pivot === index) return 'blue.400';
    return barDefaultColor;
  };

  const getBarBorder = (step: SortStep | undefined, index: number): string | undefined => {
    if (!step) return undefined;
    if (step.pivot === index) return '2px solid';
    return undefined;
  };

  const getBarBorderColor = (step: SortStep | undefined, index: number): string | undefined => {
    if (!step) return undefined;
    if (step.pivot === index) return 'blue.300';
    return undefined;
  };

  const renderVisualization = (algKey: string) => {
    const steps = stepsMap[algKey];
    const stepIdx = stepIndices[algKey] ?? 0;
    const currentStep = steps?.[stepIdx];
    const displayArray = currentStep?.array ?? array;
    const maxVal = Math.max(...displayArray, 1);
    const algo = ALGORITHMS[algKey]!;

    return (
      <Box
        key={algKey}
        bg={cardBg}
        borderRadius="xl"
        p={4}
        border="1px solid"
        borderColor={borderColor}
      >
        <HStack justify="space-between" mb={2}>
          <HStack>
            <Badge colorScheme={algo.color} fontSize="sm">
              {algo.name}
            </Badge>
            {raceComplete && raceResults.length > 1 && (
              <>
                {raceResults[0]!.algorithm === algKey &&
                  raceResults[0]!.totalSteps <= raceResults[1]!.totalSteps && (
                    <Badge colorScheme="green" variant="solid" fontSize="xs">
                      Winner!
                    </Badge>
                  )}
                {raceResults.length > 1 &&
                  raceResults[1]!.algorithm === algKey &&
                  raceResults[1]!.totalSteps < raceResults[0]!.totalSteps && (
                    <Badge colorScheme="green" variant="solid" fontSize="xs">
                      Winner!
                    </Badge>
                  )}
              </>
            )}
          </HStack>
          <Text fontSize="sm" color={subtleText}>
            Step {stepIdx} / {steps?.length ? steps.length - 1 : 0}
          </Text>
        </HStack>

        <Box
          position="relative"
          h="250px"
          display="flex"
          alignItems="flex-end"
          gap="1px"
          px={1}
        >
          {displayArray.map((value: number, idx: number) => (
            <MotionBox
              key={idx}
              flex={1}
              bg={getBarColor(currentStep, idx)}
              border={getBarBorder(currentStep, idx)}
              borderColor={getBarBorderColor(currentStep, idx)}
              borderRadius="sm"
              initial={false}
              animate={{
                height: `${(value / maxVal) * 100}%`,
                backgroundColor: undefined,
              }}
              transition={{ duration: 0.1 }}
              minW="2px"
            />
          ))}
        </Box>

        <Text fontSize="xs" color={subtleText} mt={2} noOfLines={1}>
          {currentStep?.description ?? 'Ready to race'}
        </Text>
      </Box>
    );
  };

  const winnerIdx =
    raceResults.length === 2
      ? raceResults[0]!.totalSteps <= raceResults[1]!.totalSteps
        ? 0
        : 1
      : null;

  return (
    <Container maxW="container.xl" py={8}>
      <SlideFade in offsetY={20}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack spacing={4}>
            <Link as={NextLink} href="/">
              <IconButton
                aria-label="Go back"
                icon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
              />
            </Link>
            <Badge colorScheme="pink" fontSize="sm" px={2} py={1} borderRadius="md">
              CS Fundamentals
            </Badge>
          </HStack>

          <Box>
            <Heading size="xl" mb={2}>
              {'🏎️ Sorting Algorithm Arena'}
            </Heading>
            <Paragraph>
              Race sorting algorithms head-to-head. Watch every comparison and swap in real time.
            </Paragraph>
          </Box>

          <Divider />

          {/* Controls */}
          <Box bg={cardBg} p={5} borderRadius="xl" border="1px solid" borderColor={borderColor}>
            <VStack spacing={4} align="stretch">
              {/* Array presets */}
              <Box>
                <Text fontWeight="bold" mb={2} fontSize="sm">
                  Array Preset
                </Text>
                <Flex wrap="wrap" gap={2}>
                  {ARRAY_PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      size="sm"
                      variant="outline"
                      onClick={() => setPreset(preset.array)}
                      isDisabled={isRacing}
                    >
                      {preset.name}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="solid"
                    colorScheme="teal"
                    onClick={newRandom}
                    isDisabled={isRacing}
                  >
                    New Random
                  </Button>
                </Flex>
              </Box>

              {/* Speed */}
              <Box>
                <Text fontWeight="bold" mb={2} fontSize="sm">
                  Speed
                </Text>
                <HStack spacing={2}>
                  {SPEED_OPTIONS.map((opt) => (
                    <Button
                      key={opt.label}
                      size="sm"
                      variant={speed === opt.value ? 'solid' : 'outline'}
                      colorScheme={speed === opt.value ? 'blue' : 'gray'}
                      onClick={() => setSpeed(opt.value)}
                      isDisabled={isRacing}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </HStack>
              </Box>

              {/* Algorithm selector */}
              <Box>
                <Text fontWeight="bold" mb={2} fontSize="sm">
                  Algorithms (select 1 or 2)
                </Text>
                <Flex wrap="wrap" gap={2}>
                  {Object.entries(ALGORITHMS).map(([key, algo]) => (
                    <Tooltip key={key} label={algo.description} placement="top" hasArrow>
                      <Button
                        size="sm"
                        variant={selectedAlgorithms.includes(key) ? 'solid' : 'outline'}
                        colorScheme={selectedAlgorithms.includes(key) ? algo.color : 'gray'}
                        onClick={() => toggleAlgorithm(key)}
                        isDisabled={isRacing}
                      >
                        {algo.name}
                      </Button>
                    </Tooltip>
                  ))}
                </Flex>
              </Box>

              {/* Race button */}
              <HStack>
                <Button
                  colorScheme="green"
                  size="lg"
                  onClick={startRace}
                  isDisabled={isRacing || selectedAlgorithms.length === 0}
                  px={10}
                  fontWeight="bold"
                  _hover={{ transform: 'scale(1.05)' }}
                  transition="transform 0.2s"
                >
                  {'🏁 Race!'}
                </Button>
                {isRacing && (
                  <Button size="lg" variant="outline" colorScheme="red" onClick={stopRace}>
                    Stop
                  </Button>
                )}
              </HStack>
            </VStack>
          </Box>

          {/* Visualization */}
          {selectedAlgorithms.length === 1 ? (
            renderVisualization(selectedAlgorithms[0]!)
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {selectedAlgorithms.map((alg: string) => renderVisualization(alg))}
            </SimpleGrid>
          )}

          {/* Stats table */}
          {raceComplete && raceResults.length > 0 && (
            <SlideFade in offsetY={10}>
              <Box
                bg={cardBg}
                p={5}
                borderRadius="xl"
                border="1px solid"
                borderColor={borderColor}
              >
                <Heading size="md" mb={4}>
                  {'🏆 Race Results'}
                </Heading>
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Algorithm</Th>
                        <Th isNumeric>Comparisons</Th>
                        <Th isNumeric>Swaps</Th>
                        <Th isNumeric>Total Steps</Th>
                        <Th>Best</Th>
                        <Th>Average</Th>
                        <Th>Worst</Th>
                        <Th>Space</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {raceResults.map((result: RaceResult, idx: number) => {
                        const algo = ALGORITHMS[result.algorithm]!;
                        const isWinner = raceResults.length === 2 && winnerIdx === idx;
                        return (
                          <Tr key={result.algorithm} fontWeight={isWinner ? 'bold' : 'normal'}>
                            <Td>
                              <HStack>
                                <Badge colorScheme={algo.color}>{algo.name}</Badge>
                                {isWinner && (
                                  <Badge colorScheme="green" variant="solid">
                                    {'🏆 Winner'}
                                  </Badge>
                                )}
                              </HStack>
                            </Td>
                            <Td isNumeric>{result.comparisons}</Td>
                            <Td isNumeric>{result.swaps}</Td>
                            <Td isNumeric>{result.totalSteps}</Td>
                            <Td>{algo.complexity.best}</Td>
                            <Td>{algo.complexity.average}</Td>
                            <Td>{algo.complexity.worst}</Td>
                            <Td>{algo.complexity.space}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            </SlideFade>
          )}

          <Divider />

          {/* How it works */}
          <Box>
            <Heading size="md" mb={4}>
              How It Works
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {Object.entries(ALGORITHMS).map(([key, algo]) => (
                <Box
                  key={key}
                  bg={cardBg}
                  p={4}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Badge colorScheme={algo.color} mb={2}>
                    {algo.name}
                  </Badge>
                  <Text fontSize="sm" color={subtleText}>
                    {algo.description}
                  </Text>
                  <HStack mt={2} spacing={2} flexWrap="wrap">
                    <Badge variant="subtle" fontSize="xs">
                      Best: {algo.complexity.best}
                    </Badge>
                    <Badge variant="subtle" fontSize="xs">
                      Avg: {algo.complexity.average}
                    </Badge>
                    <Badge variant="subtle" fontSize="xs">
                      Space: {algo.complexity.space}
                    </Badge>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Legend */}
          <HStack spacing={4} flexWrap="wrap" justify="center" py={4}>
            <HStack spacing={1}>
              <Box w={3} h={3} bg="gray.400" borderRadius="sm" />
              <Text fontSize="xs" color={subtleText}>
                Unsorted
              </Text>
            </HStack>
            <HStack spacing={1}>
              <Box w={3} h={3} bg="yellow.400" borderRadius="sm" />
              <Text fontSize="xs" color={subtleText}>
                Comparing
              </Text>
            </HStack>
            <HStack spacing={1}>
              <Box w={3} h={3} bg="red.400" borderRadius="sm" />
              <Text fontSize="xs" color={subtleText}>
                Swapping
              </Text>
            </HStack>
            <HStack spacing={1}>
              <Box w={3} h={3} bg="green.400" borderRadius="sm" />
              <Text fontSize="xs" color={subtleText}>
                Sorted
              </Text>
            </HStack>
            <HStack spacing={1}>
              <Box w={3} h={3} bg="blue.400" borderRadius="sm" border="2px solid" borderColor="blue.300" />
              <Text fontSize="xs" color={subtleText}>
                Pivot
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </SlideFade>
    </Container>
  );
}
