import {
    Badge,
    Box,
    Button,
    Flex,
    HStack,
    SimpleGrid,
    Text,
    Tooltip,
    useToken,
} from '@chakra-ui/react';
import { DATASETS, type BoundaryCell } from '@data/neuralNetData';

import type { useNeuralNetwork } from '../../../hooks/useNeuralNetwork';
type Props = Pick<
    ReturnType<typeof useNeuralNetwork>,
    | 'config'
    | 'datasetKey'
    | 'customPoints'
    | 'setCustomPoints'
    | 'pointX'
    | 'setPointX'
    | 'pointY'
    | 'setPointY'
    | 'activations'
    | 'animatingLayer'
    | 'isTraining'
    | 'showGradients'
    | 'setShowGradients'
    | 'gradientMagnitudes'
    | 'drawMode'
    | 'setDrawMode'
    | 'paintClass'
    | 'setPaintClass'
    | 'dataset'
    | 'boundary'
    | 'cardBg'
    | 'borderColor'
    | 'dimText'
    | 'svgBg'
    | 'handleBoundaryClick'
    | 'handleBoundaryMouseDown'
    | 'handleBoundaryMouseMove'
    | 'handleBoundaryMouseUp'
    | 'svgWidth'
    | 'svgHeight'
    | 'layerCount'
    | 'layerSpacing'
    | 'nodePositions'
    | 'connections'
    | 'getNodeColor'
    | 'isLayerActive'
    | 'cellColor'
    | 'gradientColor'
    | 'maxGradient'
>;
export default function NeuralVisualization({
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
    isTraining,
    showGradients,
    setShowGradients,
    gradientMagnitudes,
    drawMode,
    setDrawMode,
    paintClass,
    setPaintClass,
    dataset,
    boundary,
    cardBg,
    borderColor,
    dimText,
    svgBg,
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
}: Props) {
    const [labelColor] = useToken('colors', [dimText]);
    return (
        <>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* LEFT: Network Diagram */}
                <Box
                    bg={cardBg}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                    p={4}
                    overflow="hidden"
                >
                    <HStack justify="space-between" mb={2}>
                        <Text fontWeight="bold" fontSize="sm" color={dimText}>
                            Network Architecture
                        </Text>
                        <HStack spacing={2}>
                            <Button
                                colorScheme={showGradients ? 'yellow' : 'gray'}
                                variant={showGradients ? 'solid' : 'subtle'}
                                fontSize="xs"
                                size="xs"
                                aria-pressed={showGradients}
                                onClick={() =>
                                    setShowGradients((v: boolean) => !v)
                                }
                                _hover={{ opacity: 0.8 }}
                            >
                                {showGradients
                                    ? 'Gradients ON'
                                    : 'Show Gradients'}
                            </Button>
                            {isTraining && (
                                <Badge
                                    colorScheme="green"
                                    variant="subtle"
                                    fontSize="xs"
                                >
                                    Training...
                                </Badge>
                            )}
                        </HStack>
                    </HStack>
                    <Box overflow="auto">
                        <svg
                            role="img"
                            aria-label={`Network architecture with ${config.layers.join(' / ')} neurons per layer`}
                            width={svgWidth}
                            height={svgHeight}
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            style={{
                                background: svgBg,
                                borderRadius: 8,
                                display: 'block',
                                margin: '0 auto',
                            }}
                        >
                            {/* Glow filter for training */}
                            <defs>
                                <filter id="glow">
                                    <feGaussianBlur
                                        stdDeviation="3"
                                        result="coloredBlur"
                                    />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Connections */}
                            {connections.map((c, idx) => {
                                const absW = Math.abs(c.weight);
                                const active =
                                    animatingLayer !== null &&
                                    c.layerIdx < animatingLayer;
                                const trainingGlow = isTraining && absW > 2;

                                // Gradient overlay mode
                                const gradMag =
                                    showGradients && gradientMagnitudes
                                        ? (gradientMagnitudes[c.layerIdx]?.[
                                              c.toNeuron
                                          ]?.[c.fromNeuron] ?? 0)
                                        : null;
                                const useGradientColor =
                                    showGradients &&
                                    gradMag !== null &&
                                    isTraining;

                                const stroke = useGradientColor
                                    ? gradientColor(gradMag, maxGradient)
                                    : c.weight > 0
                                      ? '#38A169'
                                      : '#E53E3E';
                                const strokeWidth = useGradientColor
                                    ? Math.min(
                                          1.5 +
                                              (maxGradient > 0
                                                  ? (gradMag / maxGradient) * 5
                                                  : 0),
                                          7
                                      )
                                    : Math.min(absW * 2.5, 6);
                                const opacity = useGradientColor
                                    ? Math.max(
                                          0.1,
                                          Math.min(
                                              maxGradient > 0
                                                  ? gradMag / maxGradient
                                                  : 0.1,
                                              1
                                          )
                                      )
                                    : isTraining
                                      ? Math.min(0.3 + absW * 0.15, 0.95)
                                      : active
                                        ? 0.9
                                        : 0.25;

                                return (
                                    <line
                                        key={idx}
                                        x1={c.x1}
                                        y1={c.y1}
                                        x2={c.x2}
                                        y2={c.y2}
                                        stroke={stroke}
                                        strokeWidth={strokeWidth}
                                        opacity={opacity}
                                        strokeLinecap="round"
                                        filter={
                                            trainingGlow
                                                ? 'url(#glow)'
                                                : undefined
                                        }
                                    />
                                );
                            })}

                            {/* Nodes */}
                            {nodePositions.map((layer, li) =>
                                layer.map((pos, ni) => {
                                    const active = isLayerActive(li);
                                    const fill = active
                                        ? getNodeColor(li, ni)
                                        : '#888';
                                    return (
                                        <g key={`${li}-${ni}`}>
                                            {isTraining && (
                                                <circle
                                                    cx={pos.x}
                                                    cy={pos.y}
                                                    r={20}
                                                    fill="none"
                                                    stroke="#38A169"
                                                    strokeWidth={1}
                                                    opacity={0.3}
                                                />
                                            )}
                                            <circle
                                                cx={pos.x}
                                                cy={pos.y}
                                                r={16}
                                                fill={fill}
                                                stroke={
                                                    animatingLayer === li
                                                        ? '#FFD700'
                                                        : isTraining
                                                          ? '#38A169'
                                                          : '#555'
                                                }
                                                strokeWidth={
                                                    animatingLayer === li
                                                        ? 3
                                                        : isTraining
                                                          ? 2
                                                          : 1.5
                                                }
                                                opacity={
                                                    isTraining || active
                                                        ? 1
                                                        : 0.5
                                                }
                                            />
                                            {active &&
                                                activations &&
                                                activations[li] && (
                                                    <text
                                                        x={pos.x}
                                                        y={pos.y + 4}
                                                        textAnchor="middle"
                                                        fontSize="9"
                                                        fill="white"
                                                        fontWeight="bold"
                                                    >
                                                        {activations[li]![
                                                            ni
                                                        ]?.toFixed(1)}
                                                    </text>
                                                )}
                                        </g>
                                    );
                                })
                            )}

                            {/* Layer labels */}
                            {config.layers.map((_size: number, li: number) => {
                                const x = layerSpacing * (li + 1);
                                const label =
                                    li === 0
                                        ? 'Input'
                                        : li === layerCount - 1
                                          ? 'Output'
                                          : `Hidden ${li}`;
                                return (
                                    <text
                                        key={li}
                                        x={x}
                                        y={svgHeight - 8}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill={labelColor}
                                    >
                                        {label}
                                    </text>
                                );
                            })}
                        </svg>
                    </Box>
                </Box>

                {/* RIGHT: Decision Boundary */}
                <Box
                    bg={cardBg}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                    p={4}
                >
                    <HStack justify="space-between" mb={2}>
                        <Text fontWeight="bold" fontSize="sm" color={dimText}>
                            Decision Boundary
                        </Text>
                        <Tooltip
                            label={
                                drawMode
                                    ? 'Hold mouse and drag to paint points'
                                    : 'Click to add class 1 points. Shift-click for class 0.'
                            }
                            fontSize="xs"
                        >
                            <Badge
                                as="button"
                                type="button"
                                aria-pressed={drawMode}
                                minH="32px"
                                colorScheme={drawMode ? 'orange' : 'purple'}
                                variant={drawMode ? 'solid' : 'subtle'}
                                fontSize="xs"
                                cursor="pointer"
                                onClick={() => setDrawMode((v: boolean) => !v)}
                                _hover={{ opacity: 0.8 }}
                            >
                                {drawMode ? 'Draw Mode ON' : 'Draw Mode'}
                            </Badge>
                        </Tooltip>
                    </HStack>
                    {drawMode && (
                        <HStack spacing={2} mb={2} justify="center">
                            <Button
                                size="xs"
                                colorScheme={paintClass === 0 ? 'blue' : 'gray'}
                                variant={paintClass === 0 ? 'solid' : 'outline'}
                                onClick={() => setPaintClass(0)}
                            >
                                Draw Class 0
                            </Button>
                            <Button
                                size="xs"
                                colorScheme={paintClass === 1 ? 'red' : 'gray'}
                                variant={paintClass === 1 ? 'solid' : 'outline'}
                                onClick={() => setPaintClass(1)}
                            >
                                Draw Class 1
                            </Button>
                        </HStack>
                    )}
                    <Box
                        position="relative"
                        mx="auto"
                        w="270px"
                        h="270px"
                        cursor="crosshair"
                    >
                        <svg
                            width={270}
                            height={270}
                            viewBox="0 0 270 270"
                            style={{
                                borderRadius: 8,
                                display: 'block',
                                userSelect: 'none',
                            }}
                            onClick={handleBoundaryClick}
                            onMouseDown={handleBoundaryMouseDown}
                            onMouseMove={handleBoundaryMouseMove}
                            onMouseUp={handleBoundaryMouseUp}
                            onMouseLeave={handleBoundaryMouseUp}
                        >
                            {/* Grid cells */}
                            {boundary.map((cell: BoundaryCell, idx: number) => {
                                const col = idx % 30;
                                const row = Math.floor(idx / 30);
                                return (
                                    <rect
                                        key={idx}
                                        x={col * 9}
                                        y={(29 - row) * 9}
                                        width={9}
                                        height={9}
                                        fill={cellColor(cell.value)}
                                        opacity={0.85}
                                    />
                                );
                            })}

                            {/* Data points from dataset */}
                            {dataset.points.map((pt, idx) => {
                                const px = ((pt.x + 1) / 2) * 270;
                                const py = (1 - (pt.y + 1) / 2) * 270;
                                const isCustom =
                                    idx >=
                                    (DATASETS[datasetKey]?.points.length ?? 0);
                                return (
                                    <circle
                                        key={idx}
                                        cx={px}
                                        cy={py}
                                        r={isCustom ? 4.5 : 3.5}
                                        fill={
                                            pt.label === 0
                                                ? '#3182CE'
                                                : '#E53E3E'
                                        }
                                        stroke={isCustom ? '#FFD700' : 'white'}
                                        strokeWidth={isCustom ? 1.5 : 1}
                                    />
                                );
                            })}
                        </svg>
                    </Box>
                    <Box as="fieldset" mt={4}>
                        <legend>Add a training point</legend>
                        <Flex gap={2} wrap="wrap" mt={2}>
                            <label>
                                X{' '}
                                <input
                                    type="number"
                                    min={-1}
                                    max={1}
                                    step={0.1}
                                    value={pointX}
                                    onChange={(event) =>
                                        setPointX(Number(event.target.value))
                                    }
                                    style={{
                                        width: '5em',
                                        color: 'inherit',
                                        background: 'transparent',
                                        border: '1px solid currentColor',
                                        padding: '6px',
                                    }}
                                />
                            </label>
                            <label>
                                Y{' '}
                                <input
                                    type="number"
                                    min={-1}
                                    max={1}
                                    step={0.1}
                                    value={pointY}
                                    onChange={(event) =>
                                        setPointY(Number(event.target.value))
                                    }
                                    style={{
                                        width: '5em',
                                        color: 'inherit',
                                        background: 'transparent',
                                        border: '1px solid currentColor',
                                        padding: '6px',
                                    }}
                                />
                            </label>
                            {[0, 1].map((label) => (
                                <Button
                                    key={label}
                                    size="sm"
                                    onClick={() => {
                                        if (
                                            Number.isFinite(pointX) &&
                                            Number.isFinite(pointY) &&
                                            Math.abs(pointX) <= 1 &&
                                            Math.abs(pointY) <= 1
                                        )
                                            setCustomPoints((previous) => [
                                                ...previous,
                                                {
                                                    x: pointX,
                                                    y: pointY,
                                                    label,
                                                },
                                            ]);
                                    }}
                                >
                                    Add class {label}
                                </Button>
                            ))}
                        </Flex>
                        <Text
                            fontSize="sm"
                            role="status"
                            aria-label="Custom training points"
                        >
                            {customPoints.length} custom points
                        </Text>
                    </Box>
                    {customPoints.length > 0 && (
                        <HStack justify="center" mt={2}>
                            <Button
                                size="xs"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => setCustomPoints([])}
                            >
                                Clear custom points ({customPoints.length})
                            </Button>
                        </HStack>
                    )}
                </Box>
            </SimpleGrid>
        </>
    );
}
