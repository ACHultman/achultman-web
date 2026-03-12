import { useState, useEffect, useCallback, useRef } from 'react';
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
  Input,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Paragraph from '@components/Paragraph';
import {
  RegexStep,
  REGEX_EXAMPLES,
  getStepsForExample,
} from '@data/regexDebuggerData';

const MotionBox = motion(Box);

export default function RegexDebuggerPage() {
  const [pattern, setPattern] = useState(REGEX_EXAMPLES[0]!.pattern);
  const [testString, setTestString] = useState(REGEX_EXAMPLES[0]!.testString);
  const [steps, setSteps] = useState<RegexStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stepLogRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLDivElement>(null);

  const bg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const charBoxBg = useColorModeValue('white', 'gray.700');
  const charBoxBorder = useColorModeValue('gray.300', 'gray.500');
  const activeBg = useColorModeValue('orange.100', 'orange.800');
  const matchedBg = useColorModeValue('green.100', 'green.800');
  const failedBg = useColorModeValue('red.100', 'red.800');
  const activeStepBg = useColorModeValue('orange.50', 'orange.900');
  const stepHoverBg = useColorModeValue('gray.100', 'gray.600');

  // Recompute steps when pattern or testString changes
  useEffect(() => {
    if (!pattern || !testString) {
      setSteps([]);
      setCurrentStep(0);
      return;
    }
    try {
      const newSteps = getStepsForExample(pattern, testString);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    } catch {
      setSteps([]);
      setCurrentStep(0);
    }
  }, [pattern, testString]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev: number) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  // Scroll to active step
  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentStep]);

  const goToStart = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentStep((prev: number) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentStep((prev: number) => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);

  const goToEnd = useCallback(() => {
    setCurrentStep(steps.length - 1);
    setIsPlaying(false);
  }, [steps.length]);

  const togglePlay = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev: boolean) => !prev);
    }
  }, [currentStep, steps.length]);

  const loadExample = useCallback((ex: (typeof REGEX_EXAMPLES)[number]) => {
    setPattern(ex.pattern);
    setTestString(ex.testString);
  }, []);

  // Determine which chars are matched / active at the current step
  const currentStepData = steps[currentStep] as RegexStep | undefined;
  const activePosition = currentStepData?.position ?? -1;

  // Collect all matched positions up to current step
  const matchedPositions = new Set<number>();
  const failedPositions = new Set<number>();
  for (let i = 0; i <= currentStep && i < steps.length; i++) {
    const s = steps[i];
    if (s.matched && s.position >= 0 && s.char) {
      matchedPositions.add(s.position);
    }
    if (!s.matched && s.position >= 0) {
      failedPositions.add(s.position);
    }
  }

  // Final result
  const isComplete = currentStep >= steps.length - 1 && steps.length > 0;
  const finalStep = steps[steps.length - 1];
  const didMatch = finalStep?.matched ?? false;

  return (
    <Container maxW="container.lg" py={8}>
      <SlideFade in offsetY={20}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack mb={4}>
              <Link as={NextLink} href="/">
                <IconButton
                  aria-label="Go back"
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  size="sm"
                />
              </Link>
              <Badge colorScheme="orange" fontSize="xs">
                Developer Tool
              </Badge>
            </HStack>
            <Heading as="h1" size="xl" mb={2}>
              {'🔍 Regex Debugger'}
            </Heading>
            <Paragraph>
              Step through regular expression matching character by character.
              See exactly why your regex matches — or doesn&apos;t.
            </Paragraph>
          </Box>

          {/* Input Card */}
          <Box bg={cardBg} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1} color={subtleText}>
                  Pattern
                </Text>
                <Input
                  value={pattern}
                  onChange={(e: { target: { value: string } }) => setPattern(e.target.value)}
                  fontFamily="mono"
                  placeholder="Enter regex pattern..."
                  focusBorderColor="orange.400"
                  bg={bg}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1} color={subtleText}>
                  Test String
                </Text>
                <Input
                  value={testString}
                  onChange={(e: { target: { value: string } }) => setTestString(e.target.value)}
                  fontFamily="mono"
                  placeholder="Enter test string..."
                  focusBorderColor="orange.400"
                  bg={bg}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2} color={subtleText}>
                  Examples
                </Text>
                <Flex wrap="wrap" gap={2}>
                  {REGEX_EXAMPLES.map((ex) => (
                    <Badge
                      key={ex.pattern + ex.testString}
                      colorScheme="orange"
                      variant={
                        pattern === ex.pattern && testString === ex.testString
                          ? 'solid'
                          : 'subtle'
                      }
                      cursor="pointer"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      onClick={() => loadExample(ex)}
                      _hover={{ opacity: 0.8 }}
                      transition="all 0.2s"
                    >
                      {ex.description}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            </VStack>
          </Box>

          {/* Visualization */}
          {steps.length > 0 && (
            <SlideFade in offsetY={10}>
              <VStack spacing={6} align="stretch">
                {/* Test string characters */}
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2} color={subtleText}>
                    Test String
                  </Text>
                  <Flex wrap="wrap" gap={1}>
                    {testString.split('').map((char: string, idx: number) => {
                      let bgColor = charBoxBg;
                      let borderCol = charBoxBorder;
                      if (idx === activePosition) {
                        bgColor = activeBg;
                        borderCol = 'orange.400';
                      } else if (matchedPositions.has(idx) && !failedPositions.has(idx)) {
                        bgColor = matchedBg;
                        borderCol = 'green.400';
                      }
                      return (
                        <AnimatePresence key={idx}>
                          <MotionBox
                            w="28px"
                            h="36px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid"
                            borderColor={borderCol}
                            borderRadius="md"
                            fontFamily="mono"
                            fontSize="sm"
                            fontWeight="medium"
                            bg={bgColor}
                            transition="all 0.2s ease"
                            animate={
                              !currentStepData?.matched &&
                              idx === activePosition
                                ? {
                                    backgroundColor: [
                                      'var(--chakra-colors-red-100)',
                                      'var(--chakra-colors-orange-100)',
                                    ],
                                  }
                                : {}
                            }
                          >
                            {char === ' ' ? '␣' : char}
                          </MotionBox>
                        </AnimatePresence>
                      );
                    })}
                  </Flex>
                </Box>

                {/* Pattern characters */}
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2} color={subtleText}>
                    Pattern
                  </Text>
                  <Flex wrap="wrap" gap={1}>
                    {pattern.split('').map((char: string, idx: number) => {
                      const isActive =
                        currentStepData &&
                        currentStepData.patternIndex >= 0 &&
                        idx >= 0;
                      return (
                        <Box
                          key={idx}
                          w="28px"
                          h="36px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          border="1px solid"
                          borderColor={
                            isActive &&
                            currentStepData.patternChar.includes(char) &&
                            idx ===
                              pattern.indexOf(
                                currentStepData.patternChar[0] ?? '',
                                0
                              ) +
                                (currentStepData.patternChar.indexOf(char) ?? 0)
                              ? 'orange.400'
                              : charBoxBorder
                          }
                          borderRadius="md"
                          fontFamily="mono"
                          fontSize="sm"
                          fontWeight="medium"
                          bg={charBoxBg}
                          transition="all 0.2s ease"
                        >
                          {char}
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>

                {/* Step counter and controls */}
                <Flex
                  align="center"
                  justify="space-between"
                  bg={cardBg}
                  p={4}
                  borderRadius="lg"
                  border="1px"
                  borderColor={borderColor}
                >
                  <Text fontSize="sm" fontWeight="bold" color={subtleText}>
                    Step {currentStep + 1} of {steps.length}
                  </Text>
                  <HStack spacing={2}>
                    <Tooltip label="Reset">
                      <IconButton
                        aria-label="Reset to start"
                        icon={
                          <Text fontSize="xs" fontWeight="bold">
                            |&lt;
                          </Text>
                        }
                        size="sm"
                        variant="outline"
                        onClick={goToStart}
                        isDisabled={currentStep === 0}
                      />
                    </Tooltip>
                    <Tooltip label="Previous step">
                      <IconButton
                        aria-label="Previous step"
                        icon={<ChevronLeftIcon />}
                        size="sm"
                        variant="outline"
                        onClick={goToPrev}
                        isDisabled={currentStep === 0}
                      />
                    </Tooltip>
                    <Button
                      size="sm"
                      colorScheme="orange"
                      onClick={togglePlay}
                      minW="70px"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Tooltip label="Next step">
                      <IconButton
                        aria-label="Next step"
                        icon={<ChevronRightIcon />}
                        size="sm"
                        variant="outline"
                        onClick={goToNext}
                        isDisabled={currentStep >= steps.length - 1}
                      />
                    </Tooltip>
                    <Tooltip label="Go to end">
                      <IconButton
                        aria-label="Go to end"
                        icon={
                          <Text fontSize="xs" fontWeight="bold">
                            &gt;|
                          </Text>
                        }
                        size="sm"
                        variant="outline"
                        onClick={goToEnd}
                        isDisabled={currentStep >= steps.length - 1}
                      />
                    </Tooltip>
                  </HStack>
                </Flex>

                {/* Step Log */}
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2} color={subtleText}>
                    Step Log
                  </Text>
                  <Box
                    ref={stepLogRef}
                    maxH="300px"
                    overflowY="auto"
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={bg}
                  >
                    {steps.map((step: RegexStep, idx: number) => {
                      const isActive = idx === currentStep;
                      const isPast = idx < currentStep;
                      return (
                        <Box
                          key={idx}
                          ref={isActive ? activeStepRef : undefined}
                          px={4}
                          py={2}
                          bg={isActive ? activeStepBg : 'transparent'}
                          opacity={isPast || isActive ? 1 : 0.4}
                          borderBottom="1px"
                          borderColor={borderColor}
                          cursor="pointer"
                          onClick={() => setCurrentStep(idx)}
                          _hover={{ bg: isActive ? activeStepBg : stepHoverBg }}
                          transition="all 0.15s"
                        >
                          <Flex align="center" gap={3}>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color={subtleText}
                              minW="32px"
                            >
                              #{idx + 1}
                            </Text>
                            {step.char && (
                              <Badge
                                fontFamily="mono"
                                fontSize="xs"
                                variant="outline"
                                colorScheme="gray"
                              >
                                {step.char === ' ' ? '␣' : step.char}
                              </Badge>
                            )}
                            {step.patternChar && (
                              <Badge
                                fontFamily="mono"
                                fontSize="xs"
                                variant="outline"
                                colorScheme="orange"
                              >
                                {step.patternChar}
                              </Badge>
                            )}
                            <Text
                              fontSize="sm"
                              fontWeight={step.matched ? 'normal' : 'medium'}
                              color={step.matched ? undefined : 'red.400'}
                            >
                              {step.matched ? '✓' : '✗'}
                            </Text>
                            <Text fontSize="xs" color={subtleText} flex={1}>
                              {step.description}
                            </Text>
                          </Flex>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Match Result */}
                {isComplete && (
                  <SlideFade in offsetY={10}>
                    <Box
                      p={4}
                      borderRadius="lg"
                      border="2px"
                      borderColor={didMatch ? 'green.400' : 'red.400'}
                      bg={didMatch ? matchedBg : failedBg}
                    >
                      <HStack spacing={3}>
                        <Text fontSize="xl">{didMatch ? '✓' : '✗'}</Text>
                        <Box>
                          <Text fontWeight="bold">
                            {didMatch ? 'Match Found!' : 'No Match'}
                          </Text>
                          <Text fontSize="sm" color={subtleText}>
                            {finalStep?.description}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </SlideFade>
                )}

                <Divider />

                {/* How it works */}
                <Box>
                  <Heading as="h2" size="md" mb={3}>
                    How it works
                  </Heading>
                  <VStack align="stretch" spacing={2}>
                    <Paragraph>
                      This debugger breaks down regex matching into individual steps.
                      At each step, the engine compares the current character in the
                      test string against the current element in the pattern.
                    </Paragraph>
                    <Paragraph>
                      <strong>Literal characters</strong> must match exactly.{' '}
                      <strong>.</strong> matches any character. Quantifiers like{' '}
                      <strong>*</strong>, <strong>+</strong>, and <strong>?</strong>{' '}
                      control how many times the preceding element can repeat.
                      Character classes like <strong>[a-z]</strong> match any character
                      in the set.
                    </Paragraph>
                    <Paragraph>
                      Anchors <strong>^</strong> and <strong>$</strong> assert position
                      at the start or end of the string rather than matching characters.
                      Shorthand classes like <strong>\d</strong>, <strong>\w</strong>,
                      and <strong>\s</strong> match digits, word characters, and
                      whitespace respectively.
                    </Paragraph>
                    <Paragraph>
                      Use the step controls to advance through the matching process and
                      see exactly how the engine decides whether each character is a
                      match.
                    </Paragraph>
                  </VStack>
                </Box>
              </VStack>
            </SlideFade>
          )}
        </VStack>
      </SlideFade>
    </Container>
  );
}
