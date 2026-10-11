import {
    Box,
    HStack,
    SimpleGrid,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { type RLEStep } from '@data/compressionData';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
export default function RLEVisualization({ step }: { step: RLEStep }) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorder = useColorModeValue('gray.200', 'gray.700');
    const highlightBg = useColorModeValue('orange.100', 'orange.800');
    const activeBg = useColorModeValue('orange.200', 'orange.700');
    const subtleText = useColorModeValue('gray.600', 'gray.400');

    return (
        <VStack spacing={6} align="stretch">
            {/* Input string with position highlighted */}
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
                    mb={3}
                >
                    Input String
                </Text>
                <HStack spacing={0} flexWrap="wrap">
                    {Array.from(step.input).map((ch, i) => {
                        const inRun =
                            i >= step.position &&
                            i < step.position + step.currentRun.count;
                        const isStart = i === step.position;
                        return (
                            <Box
                                key={i}
                                px={2}
                                py={1}
                                fontFamily="mono"
                                fontSize="md"
                                fontWeight={inRun ? 'bold' : 'normal'}
                                bg={
                                    isStart
                                        ? activeBg
                                        : inRun
                                          ? highlightBg
                                          : 'transparent'
                                }
                                borderRadius="sm"
                                borderWidth={inRun ? '2px' : '1px'}
                                borderColor={
                                    inRun ? 'orange.400' : 'transparent'
                                }
                                transition="all 0.2s"
                            >
                                {ch === ' ' ? '\u00B7' : ch}
                            </Box>
                        );
                    })}
                </HStack>
                <Text fontSize="xs" color={subtleText} mt={2}>
                    Current run: &apos;
                    {step.currentRun.char === ' '
                        ? 'SPACE'
                        : step.currentRun.char}
                    &apos; x {step.currentRun.count}
                </Text>
            </Box>

            {/* Encoded output building up */}
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
                    mb={3}
                >
                    RLE Encoded Output
                </Text>
                <HStack spacing={0} flexWrap="wrap">
                    {step.encoded.split('').map((ch, i) => {
                        const isNew =
                            i >=
                            Array.from(step.encoded).length -
                                (step.currentRun.char.length +
                                    String(step.currentRun.count).length);
                        return (
                            <MotionBox
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                px={1}
                                py={0.5}
                                fontFamily="mono"
                                fontSize="lg"
                                fontWeight={isNew ? 'bold' : 'normal'}
                                color={isNew ? 'accessible.orange' : undefined}
                            >
                                {ch}
                            </MotionBox>
                        );
                    })}
                </HStack>
                <Text fontSize="xs" color={subtleText} mt={2}>
                    {Array.from(step.encoded).length} characters (
                    {Array.from(step.input).length} original)
                </Text>
            </Box>

            {/* Stats */}
            <SimpleGrid columns={3} spacing={4}>
                <Box
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={cardBorder}
                    borderRadius="lg"
                    p={4}
                    textAlign="center"
                >
                    <Text fontSize="xs" color={subtleText}>
                        Original
                    </Text>
                    <Text fontWeight="bold" fontFamily="mono" fontSize="lg">
                        {Array.from(step.input).length}
                    </Text>
                    <Text fontSize="xs" color={subtleText}>
                        chars
                    </Text>
                </Box>
                <Box
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={cardBorder}
                    borderRadius="lg"
                    p={4}
                    textAlign="center"
                >
                    <Text fontSize="xs" color={subtleText}>
                        Encoded
                    </Text>
                    <Text fontWeight="bold" fontFamily="mono" fontSize="lg">
                        {Array.from(step.encoded).length}
                    </Text>
                    <Text fontSize="xs" color={subtleText}>
                        chars
                    </Text>
                </Box>
                <Box
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={cardBorder}
                    borderRadius="lg"
                    p={4}
                    textAlign="center"
                >
                    <Text fontSize="xs" color={subtleText}>
                        Ratio
                    </Text>
                    <Text
                        fontWeight="bold"
                        fontFamily="mono"
                        fontSize="lg"
                        color={
                            Array.from(step.encoded).length <
                            Array.from(step.input).length
                                ? 'accessible.green'
                                : 'accessible.red'
                        }
                    >
                        {(
                            (1 -
                                Array.from(step.encoded).length /
                                    Array.from(step.input).length) *
                            100
                        ).toFixed(0)}
                        %
                    </Text>
                    <Text fontSize="xs" color={subtleText}>
                        saved
                    </Text>
                </Box>
            </SimpleGrid>
        </VStack>
    );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
