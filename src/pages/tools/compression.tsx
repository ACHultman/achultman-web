import {
    ArrowBackIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';
import {
    Badge,
    Box,
    Container,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    SimpleGrid,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { PageSeo } from '@components/Editorial';
import StatsPanel from '@components/tools/compression/CompressionStats';
import EncodedBitsDisplay from '@components/tools/compression/EncodedBits';
import HuffmanTreeSVG from '@components/tools/compression/HuffmanTree';
import RLEVisualization from '@components/tools/compression/RunLength';
import Paragraph from '@components/Paragraph';
import {
    EXAMPLES,
    generateHuffmanSteps,
    generateRLESteps,
    type CompressionStep,
    type RLEStep,
} from '@data/compressionData';
import { AnimatePresence, motion } from 'framer-motion';
import NextLink from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { toolPages } from '../../data/toolPages';

const MotionBox = motion(Box);
export default function CompressionPage() {
    const [tab, setTab] = useState<'huffman' | 'rle'>('huffman');
    const [exampleIdx, setExampleIdx] = useState(0);
    const [customText, setCustomText] = useState('');
    const [stepIdx, setStepIdx] = useState(0);

    const example = EXAMPLES[exampleIdx]!;
    const inputText = example.name === 'Custom' ? customText : example.input;

    const huffmanSteps = useMemo(
        () => generateHuffmanSteps(inputText),
        [inputText]
    );
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

    const handleCustomTextChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCustomText(e.target.value);
            setStepIdx(0);
        },
        []
    );

    const PHASE_COLORS: Record<string, string> = {
        frequency: 'blue',
        'tree-building': 'purple',
        encoding: 'orange',
        result: 'green',
    };

    return (
        <Container maxW="container.xl" py={8}>
            <PageSeo {...toolPages['compression']} />
            <VStack spacing={8} align="stretch">
                {/* Header */}
                <Box>
                    <HStack mb={3}>
                        <IconButton
                            as={NextLink}
                            href="/tools"
                            minH="44px"
                            minW="44px"
                            aria-label="Go back"
                            icon={<ArrowBackIcon />}
                            variant="ghost"
                            size="sm"
                        />
                        <Badge colorScheme="orange" fontSize="sm">
                            Algorithms
                        </Badge>
                    </HStack>
                    <Heading as="h1" size="xl" mb={2}>
                        {'\uD83D\uDDDC\uFE0F Compression Visualizer'}
                    </Heading>
                    <Paragraph>
                        Step through Huffman coding and Run-Length Encoding to
                        see how text compression actually works. Watch trees
                        build, codes assign, and bits encode in real time.
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
                        aria-pressed={tab === 'huffman'}
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
                        aria-pressed={tab === 'rle'}
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
                            borderColor={
                                i === exampleIdx ? activeBorder : cardBorder
                            }
                            aria-pressed={i === exampleIdx}
                            onClick={() => selectExample(i)}
                            cursor="pointer"
                            _hover={{ borderColor: activeBorder }}
                            transition="border-color 0.2s"
                        >
                            <Text fontWeight="bold" fontSize="sm" mb={0.5}>
                                {ex.name}
                            </Text>
                            <Text
                                fontSize="xs"
                                color={subtleText}
                                noOfLines={1}
                            >
                                {ex.description}
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>

                {/* Custom text input */}
                {example.name === 'Custom' && (
                    <Input
                        aria-label="Text to compress"
                        maxLength={2000}
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
                        <Flex
                            align="center"
                            justify="space-between"
                            wrap="wrap"
                            gap={3}
                        >
                            <HStack>
                                <IconButton
                                    aria-label="Previous step"
                                    icon={<ChevronLeftIcon boxSize={6} />}
                                    onClick={() =>
                                        setStepIdx((i: number) =>
                                            Math.max(0, i - 1)
                                        )
                                    }
                                    isDisabled={stepIdx === 0}
                                    variant="outline"
                                    colorScheme="orange"
                                />
                                <Text
                                    fontFamily="mono"
                                    fontSize="sm"
                                    minW="100px"
                                    textAlign="center"
                                >
                                    Step {stepIdx + 1} / {totalSteps}
                                </Text>
                                <IconButton
                                    aria-label="Next step"
                                    icon={<ChevronRightIcon boxSize={6} />}
                                    onClick={() =>
                                        setStepIdx((i: number) =>
                                            Math.min(totalSteps - 1, i + 1)
                                        )
                                    }
                                    isDisabled={stepIdx === totalSteps - 1}
                                    variant="outline"
                                    colorScheme="orange"
                                />
                            </HStack>
                            {tab === 'huffman' &&
                                currentStep &&
                                'phase' in currentStep && (
                                    <HStack>
                                        <Text fontSize="sm" color={subtleText}>
                                            Phase:
                                        </Text>
                                        <Badge
                                            colorScheme={
                                                PHASE_COLORS[
                                                    (
                                                        currentStep as CompressionStep
                                                    ).phase
                                                ] ?? 'gray'
                                            }
                                            fontSize="sm"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                            textTransform="capitalize"
                                        >
                                            {(
                                                currentStep as CompressionStep
                                            ).phase.replace('-', ' ')}
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
                                <Box
                                    bg={cardBg}
                                    p={5}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={cardBorder}
                                >
                                    {tab === 'huffman' &&
                                        currentStep &&
                                        'phase' in currentStep && (
                                            <>
                                                <Heading size="md" mb={2}>
                                                    {
                                                        (
                                                            currentStep as CompressionStep
                                                        ).title
                                                    }
                                                </Heading>
                                                <Text
                                                    color={subtleText}
                                                    lineHeight="tall"
                                                >
                                                    {
                                                        (
                                                            currentStep as CompressionStep
                                                        ).description
                                                    }
                                                </Text>
                                            </>
                                        )}
                                    {tab === 'rle' &&
                                        currentStep &&
                                        'currentRun' in currentStep && (
                                            <>
                                                <Heading size="md" mb={2}>
                                                    Step{' '}
                                                    {
                                                        (currentStep as RLEStep)
                                                            .stepNumber
                                                    }
                                                    : Run of &apos;
                                                    {(currentStep as RLEStep)
                                                        .currentRun.char === ' '
                                                        ? 'SPACE'
                                                        : (
                                                              currentStep as RLEStep
                                                          ).currentRun.char}
                                                    &apos;
                                                </Heading>
                                                <Text
                                                    color={subtleText}
                                                    lineHeight="tall"
                                                >
                                                    Found{' '}
                                                    {
                                                        (currentStep as RLEStep)
                                                            .currentRun.count
                                                    }{' '}
                                                    consecutive &apos;
                                                    {(currentStep as RLEStep)
                                                        .currentRun.char === ' '
                                                        ? 'SPACE'
                                                        : (
                                                              currentStep as RLEStep
                                                          ).currentRun.char}
                                                    &apos; character
                                                    {(currentStep as RLEStep)
                                                        .currentRun.count > 1
                                                        ? 's'
                                                        : ''}{' '}
                                                    starting at position{' '}
                                                    {
                                                        (currentStep as RLEStep)
                                                            .position
                                                    }
                                                    .
                                                </Text>
                                            </>
                                        )}
                                </Box>
                            </MotionBox>
                        </AnimatePresence>

                        {/* Main Visualization */}
                        {tab === 'huffman' &&
                            currentStep &&
                            'phase' in currentStep && (
                                <Flex
                                    direction={{ base: 'column', lg: 'row' }}
                                    gap={6}
                                >
                                    {/* Left: Tree */}
                                    <Box flex={1}>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            mb={3}
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                        >
                                            Huffman Tree
                                        </Text>
                                        <HuffmanTreeSVG
                                            tree={
                                                (currentStep as CompressionStep)
                                                    .tree
                                            }
                                            highlightPath={
                                                (currentStep as CompressionStep)
                                                    .highlightPath
                                            }
                                        />
                                    </Box>

                                    {/* Right: Stats */}
                                    <Box
                                        w={{ base: '100%', lg: '320px' }}
                                        flexShrink={0}
                                    >
                                        <StatsPanel
                                            step={
                                                currentStep as CompressionStep
                                            }
                                            input={inputText}
                                        />
                                    </Box>
                                </Flex>
                            )}

                        {tab === 'huffman' &&
                            currentStep &&
                            'phase' in currentStep &&
                            (currentStep as CompressionStep).encodedBits && (
                                <EncodedBitsDisplay
                                    step={currentStep as CompressionStep}
                                    input={inputText}
                                />
                            )}

                        {tab === 'rle' &&
                            currentStep &&
                            'currentRun' in currentStep && (
                                <RLEVisualization
                                    step={currentStep as RLEStep}
                                />
                            )}
                    </>
                )}
            </VStack>
        </Container>
    );
}
