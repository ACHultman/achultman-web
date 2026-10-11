import { ArrowBackIcon } from '@chakra-ui/icons';
import {
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    SlideFade,
    Text,
    VStack,
} from '@chakra-ui/react';
import { PageSeo } from '@components/Editorial';
import NeuralVisualization from '@components/labs/neural-network/NeuralVisualization';
import TrainingControls from '@components/labs/neural-network/TrainingControls';
import TrainingMetrics from '@components/labs/neural-network/TrainingMetrics';
import Paragraph from '@components/Paragraph';
import { PRESET_NETWORKS, type ActivationFn } from '@data/neuralNetData';
import NextLink from 'next/link';
import { labPages } from '../../data/labPages';

import { useNeuralNetwork } from '../../hooks/useNeuralNetwork';
export default function NeuralNetPlayground() {
    const {
        presetIdx,
        config,
        datasetKey,
        customPoints,
        setCustomPoints,
        pointX,
        setPointX,
        pointY,
        setPointY,
        activations,
        animatingLayer,
        isAnimating,
        isTraining,
        stepsPerFrame,
        setStepsPerFrame,
        learningRate,
        setLearningRate,
        epoch,
        lossHistory,
        activationFn,
        setActivationFn,
        showGradients,
        setShowGradients,
        gradientMagnitudes,
        drawMode,
        setDrawMode,
        paintClass,
        setPaintClass,
        activationFnRef,
        dataset,
        boundary,
        accuracy,
        totalParams,
        cardBg,
        borderColor,
        dimText,
        svgBg,
        controlBg,
        lossBg,
        accentGreen,
        pulseColor,
        startTraining,
        stopTraining,
        selectPreset,
        handleResetAndLearn,
        handleRandomize,
        handleForwardPass,
        handleBoundaryClick,
        handleBoundaryMouseDown,
        handleBoundaryMouseMove,
        handleBoundaryMouseUp,
        svgWidth,
        svgHeight,
        layerCount,
        layerSpacing,
        nodePositions,
        connections,
        getNodeColor,
        isLayerActive,
        cellColor,
        gradientColor,
        maxGradient,
        lossSparkline,
    } = useNeuralNetwork();
    return (
        <Container maxW="container.lg" py={10}>
            <PageSeo {...labPages['neural-net']} />
            <SlideFade in offsetY={20}>
                <VStack spacing={8} align="stretch">
                    {/* Header */}
                    <HStack spacing={4}>
                        <IconButton
                            as={NextLink}
                            href="/labs"
                            minH="44px"
                            minW="44px"
                            aria-label="Back to labs"
                            icon={<ArrowBackIcon />}
                            variant="ghost"
                            size="sm"
                        />
                        <Badge colorScheme="cyan" fontSize="xs">
                            ML Experiment
                        </Badge>
                    </HStack>

                    <Box>
                        <Heading as="h1" size="xl" mb={2}>
                            {'🧠 Neural Network Playground'}
                        </Heading>
                        <Text fontSize="lg" color={dimText}>
                            Watch a neural network learn in real time
                        </Text>
                    </Box>

                    <Paragraph>
                        Explore how neural networks classify data. Select a
                        preset, then hit{' '}
                        <strong>Reset &amp; Watch it Learn</strong> to see the
                        network train from random weights using backpropagation.
                        Click on the decision boundary to add your own data
                        points (shift-click for class 0).
                    </Paragraph>

                    {/* Preset Selector */}
                    <HStack spacing={3} flexWrap="wrap">
                        {PRESET_NETWORKS.map((preset, idx) => (
                            <Badge
                                as="button"
                                type="button"
                                key={preset.config.name}
                                colorScheme={
                                    presetIdx === idx ? 'cyan' : 'gray'
                                }
                                variant={presetIdx === idx ? 'solid' : 'subtle'}
                                fontSize="sm"
                                px={3}
                                py={1}
                                borderRadius="full"
                                cursor="pointer"
                                onClick={() => selectPreset(idx)}
                                _hover={{ opacity: 0.8 }}
                            >
                                {preset.config.name} (
                                {preset.config.layers.join('-')})
                            </Badge>
                        ))}
                    </HStack>

                    {/* Activation Function Selector */}
                    <HStack spacing={3} flexWrap="wrap">
                        <Text fontSize="sm" color={dimText} fontWeight="medium">
                            Activation:
                        </Text>
                        {(['sigmoid', 'relu', 'tanh'] as ActivationFn[]).map(
                            (fn) => (
                                <Badge
                                    as="button"
                                    type="button"
                                    key={fn}
                                    colorScheme={
                                        activationFn === fn ? 'purple' : 'gray'
                                    }
                                    variant={
                                        activationFn === fn ? 'solid' : 'subtle'
                                    }
                                    fontSize="sm"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    cursor="pointer"
                                    onClick={() => {
                                        setActivationFn(fn);
                                        activationFnRef.current = fn;
                                    }}
                                    _hover={{ opacity: 0.8 }}
                                >
                                    {fn === 'tanh'
                                        ? 'tanh'
                                        : fn === 'relu'
                                          ? 'ReLU'
                                          : 'Sigmoid'}
                                </Badge>
                            )
                        )}
                    </HStack>

                    {/* Hero Action */}
                    <Flex justify="center" gap={3} flexWrap="wrap">
                        <Button
                            colorScheme="green"
                            size="lg"
                            onClick={handleResetAndLearn}
                            px={8}
                            fontWeight="bold"
                            shadow="md"
                            _hover={{
                                shadow: 'lg',
                                transform: 'translateY(-1px)',
                            }}
                            transition="all 0.2s"
                        >
                            Reset &amp; Watch it Learn
                        </Button>
                    </Flex>

                    <Divider />

                    <NeuralVisualization
                        config={config}
                        datasetKey={datasetKey}
                        customPoints={customPoints}
                        setCustomPoints={setCustomPoints}
                        pointX={pointX}
                        setPointX={setPointX}
                        pointY={pointY}
                        setPointY={setPointY}
                        activations={activations}
                        animatingLayer={animatingLayer}
                        isTraining={isTraining}
                        showGradients={showGradients}
                        setShowGradients={setShowGradients}
                        gradientMagnitudes={gradientMagnitudes}
                        drawMode={drawMode}
                        setDrawMode={setDrawMode}
                        paintClass={paintClass}
                        setPaintClass={setPaintClass}
                        dataset={dataset}
                        boundary={boundary}
                        cardBg={cardBg}
                        borderColor={borderColor}
                        dimText={dimText}
                        svgBg={svgBg}
                        handleBoundaryClick={handleBoundaryClick}
                        handleBoundaryMouseDown={handleBoundaryMouseDown}
                        handleBoundaryMouseMove={handleBoundaryMouseMove}
                        handleBoundaryMouseUp={handleBoundaryMouseUp}
                        svgWidth={svgWidth}
                        svgHeight={svgHeight}
                        layerCount={layerCount}
                        layerSpacing={layerSpacing}
                        nodePositions={nodePositions}
                        connections={connections}
                        getNodeColor={getNodeColor}
                        isLayerActive={isLayerActive}
                        cellColor={cellColor}
                        gradientColor={gradientColor}
                        maxGradient={maxGradient}
                    />

                    <TrainingControls
                        isAnimating={isAnimating}
                        isTraining={isTraining}
                        stepsPerFrame={stepsPerFrame}
                        setStepsPerFrame={setStepsPerFrame}
                        learningRate={learningRate}
                        setLearningRate={setLearningRate}
                        epoch={epoch}
                        lossHistory={lossHistory}
                        borderColor={borderColor}
                        dimText={dimText}
                        controlBg={controlBg}
                        startTraining={startTraining}
                        stopTraining={stopTraining}
                        handleRandomize={handleRandomize}
                        handleForwardPass={handleForwardPass}
                    />

                    <TrainingMetrics
                        config={config}
                        isTraining={isTraining}
                        epoch={epoch}
                        lossHistory={lossHistory}
                        dataset={dataset}
                        accuracy={accuracy}
                        totalParams={totalParams}
                        cardBg={cardBg}
                        borderColor={borderColor}
                        dimText={dimText}
                        lossBg={lossBg}
                        accentGreen={accentGreen}
                        pulseColor={pulseColor}
                        lossSparkline={lossSparkline}
                    />

                    <Divider />

                    {/* How it works */}
                    <Box>
                        <Heading as="h2" size="md" mb={4}>
                            How it works
                        </Heading>
                        <VStack spacing={3} align="stretch">
                            <Paragraph>
                                A neural network is a series of layers of
                                interconnected neurons. Each connection has a{' '}
                                <strong>weight</strong> that determines how
                                strongly one neuron influences another. During a{' '}
                                <strong>forward pass</strong>, input values are
                                multiplied by weights, summed with a bias, and
                                passed through a sigmoid activation function to
                                produce outputs between 0 and 1.
                            </Paragraph>
                            <Paragraph>
                                During <strong>training</strong>, the network
                                learns by adjusting its weights through{' '}
                                <strong>backpropagation</strong>. For each data
                                point, the network computes its prediction
                                (forward pass), then calculates how wrong it was
                                using <strong>binary cross-entropy loss</strong>
                                . The error signal propagates backward through
                                the network, computing gradients — how much each
                                weight contributed to the error. Weights are
                                then nudged in the direction that reduces the
                                loss using{' '}
                                <strong>stochastic gradient descent</strong>.
                            </Paragraph>
                            <Paragraph>
                                The <strong>decision boundary</strong>{' '}
                                visualization shows how the network partitions
                                the 2D input space. Blue regions indicate
                                outputs below 0.5 (class 0), while red regions
                                indicate outputs above 0.5 (class 1). Watch how
                                the boundary evolves from random noise into
                                clean separation as the network trains. The{' '}
                                <strong>learning rate</strong> controls how big
                                each weight update is — too high and the network
                                overshoots, too low and it learns slowly.
                            </Paragraph>
                            <Paragraph>
                                In the network diagram,{' '}
                                <strong>green connections</strong> represent
                                positive weights (excitatory) and{' '}
                                <strong>red connections</strong> represent
                                negative weights (inhibitory). Thicker lines
                                indicate larger weight magnitudes. During
                                training, connections glow to show the network
                                is actively learning. Try adding your own data
                                points by clicking on the decision boundary and
                                watch the network adapt.
                            </Paragraph>
                        </VStack>
                    </Box>
                </VStack>
            </SlideFade>
        </Container>
    );
}
