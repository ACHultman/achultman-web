import {
    Box,
    Button,
    Flex,
    HStack,
    Select,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text,
} from '@chakra-ui/react';

import type { useNeuralNetwork } from '../../../hooks/useNeuralNetwork';
const LEARNING_RATES = [0.01, 0.1, 0.5, 1.0];
type Props = Pick<
    ReturnType<typeof useNeuralNetwork>,
    | 'isAnimating'
    | 'isTraining'
    | 'stepsPerFrame'
    | 'setStepsPerFrame'
    | 'learningRate'
    | 'setLearningRate'
    | 'epoch'
    | 'lossHistory'
    | 'borderColor'
    | 'dimText'
    | 'controlBg'
    | 'startTraining'
    | 'stopTraining'
    | 'handleRandomize'
    | 'handleForwardPass'
>;
export default function TrainingControls({
    isAnimating,
    isTraining,
    stepsPerFrame,
    setStepsPerFrame,
    learningRate,
    setLearningRate,
    epoch,
    lossHistory,
    borderColor,
    dimText,
    controlBg,
    startTraining,
    stopTraining,
    handleRandomize,
    handleForwardPass,
}: Props) {
    return (
        <>
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
                            aria-label="Training steps per frame"
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
                            aria-label="Learning rate"
                            size="xs"
                            value={learningRate}
                            onChange={(e) =>
                                setLearningRate(parseFloat(e.target.value))
                            }
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
                        <Text
                            as="output"
                            aria-label="Training steps"
                            aria-live="off"
                            fontSize="sm"
                            fontWeight="bold"
                            fontFamily="mono"
                        >
                            {epoch.toLocaleString()}
                        </Text>
                    </HStack>

                    {/* Current loss */}
                    {lossHistory.length > 0 && (
                        <HStack spacing={2}>
                            <Text fontSize="xs" color={dimText}>
                                Loss:
                            </Text>
                            <Text
                                fontSize="sm"
                                fontWeight="bold"
                                fontFamily="mono"
                            >
                                {lossHistory[lossHistory.length - 1]!.toFixed(
                                    4
                                )}
                            </Text>
                        </HStack>
                    )}
                </Flex>
            </Box>
        </>
    );
}
