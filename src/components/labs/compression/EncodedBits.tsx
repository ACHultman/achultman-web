import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { type CompressionStep } from '@data/compressionData';
import { useMemo } from 'react';

const ENCODED_CHAR_COLORS = [
    'blue',
    'green',
    'purple',
    'orange',
    'cyan',
    'pink',
    'teal',
    'red',
    'yellow',
];

export default function EncodedBitsDisplay({
    step,
    input,
}: {
    step: CompressionStep;
    input: string;
}) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorder = useColorModeValue('gray.200', 'gray.700');
    const subtleText = useColorModeValue('gray.600', 'gray.400');

    // Build a color map per character
    const charColorMap = useMemo(() => {
        const map = new Map<string, string>();
        const uniqueChars = [...new Set(Array.from(input))];
        uniqueChars.forEach((ch, i) => {
            map.set(ch, ENCODED_CHAR_COLORS[i % ENCODED_CHAR_COLORS.length]!);
        });
        return map;
    }, [input]);

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
    for (const ch of input) {
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
            <Text
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                mb={2}
            >
                Original Text
            </Text>
            <HStack spacing={0} mb={3} flexWrap="wrap">
                {Array.from(input).map((ch, i) => {
                    const color = charColorMap.get(ch) ?? 'gray';
                    const isCurrent =
                        step.currentChar === ch && step.phase === 'encoding';
                    return (
                        <Box
                            key={i}
                            px={1}
                            py={0.5}
                            fontFamily="mono"
                            fontSize="sm"
                            bg={isCurrent ? `${color}.200` : 'transparent'}
                            color={isCurrent ? 'gray.900' : undefined}
                            borderRadius="sm"
                            fontWeight={isCurrent ? 'bold' : 'normal'}
                        >
                            {ch === ' ' ? '\u00B7' : ch}
                        </Box>
                    );
                })}
            </HStack>

            <Text
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                mb={2}
            >
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
                        color={`accessible.${seg.color}`}
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
