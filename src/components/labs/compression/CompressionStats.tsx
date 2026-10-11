import {
    Box,
    Divider,
    HStack,
    SimpleGrid,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { type CompressionStep } from '@data/compressionData';

export default function StatsPanel({
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

    const originalBits = new TextEncoder().encode(input).length * 8;
    const compressedBits = step.encodedBits.length;
    const ratio =
        originalBits > 0
            ? ((1 - compressedBits / originalBits) * 100).toFixed(1)
            : '0';

    // Build frequency map from nodes
    const freqEntries = step.nodes
        .filter((n) => n.char !== null)
        .sort((a, b) => b.freq - a.freq);
    const maxFreq = freqEntries.length > 0 ? freqEntries[0]!.freq : 1;

    // Color palette for characters
    const CHAR_COLORS = [
        'blue.400',
        'green.400',
        'purple.400',
        'orange.400',
        'cyan.400',
        'pink.400',
        'teal.400',
        'red.400',
        'yellow.400',
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
            <Text
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
            >
                Statistics
            </Text>

            <SimpleGrid columns={2} spacing={2}>
                <Box>
                    <Text fontSize="xs" color={subtleText}>
                        Original
                    </Text>
                    <Text fontWeight="bold" fontFamily="mono" fontSize="sm">
                        {Array.from(input).length} chars ({originalBits} bits)
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color={subtleText}>
                        Compressed
                    </Text>
                    <Text fontWeight="bold" fontFamily="mono" fontSize="sm">
                        {compressedBits > 0 ? `${compressedBits} bits` : '--'}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color={subtleText}>
                        Ratio
                    </Text>
                    <Text
                        fontWeight="bold"
                        fontFamily="mono"
                        fontSize="sm"
                        color={
                            Number(ratio) > 0 ? 'accessible.green' : undefined
                        }
                    >
                        {compressedBits > 0 ? `${ratio}% saved` : '--'}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color={subtleText}>
                        Unique chars
                    </Text>
                    <Text fontWeight="bold" fontFamily="mono" fontSize="sm">
                        {freqEntries.length}
                    </Text>
                </Box>
            </SimpleGrid>

            <Divider />

            <Text
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
            >
                Frequencies
            </Text>

            <VStack spacing={1} align="stretch" maxH="200px" overflowY="auto">
                {freqEntries.map((entry, i) => {
                    const color = CHAR_COLORS[i % CHAR_COLORS.length]!;
                    const barWidth = `${(entry.freq / maxFreq) * 100}%`;
                    return (
                        <HStack
                            key={`${entry.char}-${i}`}
                            spacing={2}
                            fontSize="sm"
                        >
                            <Text
                                fontFamily="mono"
                                fontWeight="bold"
                                w="24px"
                                textAlign="center"
                            >
                                {entry.char === ' ' ? 'SP' : entry.char}
                            </Text>
                            <Box
                                flex={1}
                                bg={barBg}
                                borderRadius="sm"
                                h="16px"
                                position="relative"
                            >
                                <Box
                                    bg={color}
                                    h="100%"
                                    borderRadius="sm"
                                    w={barWidth}
                                    transition="width 0.3s"
                                />
                            </Box>
                            <Text
                                fontFamily="mono"
                                fontSize="xs"
                                w="24px"
                                textAlign="right"
                                color={subtleText}
                            >
                                {entry.freq}
                            </Text>
                            {entry.code && (
                                <Text
                                    fontFamily="mono"
                                    fontSize="xs"
                                    color={subtleText}
                                    w="60px"
                                    textAlign="right"
                                >
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
