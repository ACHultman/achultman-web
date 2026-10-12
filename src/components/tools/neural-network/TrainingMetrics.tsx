import { Box, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import type { useNeuralNetwork } from '../../../hooks/useNeuralNetwork';
const MotionBox = motion(Box);
const MotionText = motion(Text);
type Props = Pick<
    ReturnType<typeof useNeuralNetwork>,
    | 'config'
    | 'isTraining'
    | 'epoch'
    | 'lossHistory'
    | 'dataset'
    | 'accuracy'
    | 'totalParams'
    | 'cardBg'
    | 'borderColor'
    | 'dimText'
    | 'lossBg'
    | 'accentGreen'
    | 'pulseColor'
    | 'lossSparkline'
>;
export default function TrainingMetrics({
    config,
    isTraining,
    epoch,
    lossHistory,
    dataset,
    accuracy,
    totalParams,
    cardBg,
    borderColor,
    dimText,
    lossBg,
    accentGreen,
    pulseColor,
    lossSparkline,
}: Props) {
    return (
        <>
            {lossSparkline && (
                <Box
                    bg={lossBg}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                    p={4}
                >
                    <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color={dimText}
                        mb={2}
                    >
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
                                <stop
                                    offset="0%"
                                    stopColor="#E53E3E"
                                    stopOpacity="0.3"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#E53E3E"
                                    stopOpacity="0.02"
                                />
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
                        <text
                            x="0"
                            y={lossSparkline.h + 12}
                            fontSize="8"
                            fill="#999"
                        >
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
                                color={pulseColor}
                                animate={{ scale: 1 }}
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
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                fontFamily="mono"
                            >
                                {epoch.toLocaleString()}
                            </Text>
                            <Text fontSize="xs" color={dimText}>
                                Training Steps
                            </Text>
                        </VStack>
                        <VStack spacing={1}>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color={accentGreen}
                            >
                                {isTraining ? 'Learning' : 'Idle'}
                            </Text>
                            <Text fontSize="xs" color={dimText}>
                                Status
                            </Text>
                        </VStack>
                    </SimpleGrid>
                </MotionBox>
            </AnimatePresence>
        </>
    );
}
