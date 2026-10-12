import { useColorModeValue } from '@chakra-ui/react';
import {
    computeAccuracy,
    countParams,
    DATASETS,
    forwardPass,
    generateDecisionBoundary,
    PRESET_NETWORKS,
    randomizeWeights,
    trainStep,
    type ActivationFn,
    type DataPoint,
    type Dataset,
    type NetworkConfig,
} from '@data/neuralNetData';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { startFrameLoop } from '../lib/tools/frame-loop';
export function useNeuralNetwork() {
    const [presetIdx, setPresetIdx] = useState(0);
    const [config, setConfig] = useState<NetworkConfig>(
        PRESET_NETWORKS[0]!.config
    );
    const [datasetKey, setDatasetKey] = useState(
        PRESET_NETWORKS[0]!.datasetKey
    );
    const [customPoints, setCustomPoints] = useState<DataPoint[]>([]);
    const [pointX, setPointX] = useState(0);
    const [pointY, setPointY] = useState(0);
    const [activations, setActivations] = useState<number[][] | null>(null);
    const [animatingLayer, setAnimatingLayer] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Training state
    const [isTraining, setIsTraining] = useState(false);
    const [stepsPerFrame, setStepsPerFrame] = useState(10);
    const [learningRate, setLearningRate] = useState(0.5);
    const [epoch, setEpoch] = useState(0);
    const [lossHistory, setLossHistory] = useState<number[]>([]);

    // Activation function state
    const [activationFn, setActivationFn] = useState<ActivationFn>('sigmoid');

    // Gradient flow heatmap state
    const [showGradients, setShowGradients] = useState(false);
    const [gradientMagnitudes, setGradientMagnitudes] = useState<
        number[][][] | null
    >(null);

    // Paint mode state
    const [drawMode, setDrawMode] = useState(false);
    const [paintClass, setPaintClass] = useState<0 | 1>(1);
    const isDrawingRef = useRef(false);
    const lastPaintPosRef = useRef<{ x: number; y: number } | null>(null);

    // Refs for training loop to avoid stale closures
    const configRef = useRef(config);
    const epochRef = useRef(0);
    const lossHistoryRef = useRef<number[]>([]);
    const stepsPerFrameRef = useRef(stepsPerFrame);
    const learningRateRef = useRef(learningRate);
    const activationFnRef = useRef<ActivationFn>(activationFn);

    // Keep refs in sync
    useEffect(() => {
        configRef.current = config;
    }, [config]);
    useEffect(() => {
        stepsPerFrameRef.current = stepsPerFrame;
    }, [stepsPerFrame]);
    useEffect(() => {
        learningRateRef.current = learningRate;
    }, [learningRate]);
    useEffect(() => {
        activationFnRef.current = activationFn;
    }, [activationFn]);

    // Combine base dataset with custom points
    const dataset: Dataset = useMemo(() => {
        const base = DATASETS[datasetKey]!;
        if (customPoints.length === 0) return base;
        return {
            name: base.name,
            points: [...base.points, ...customPoints],
        };
    }, [datasetKey, customPoints]);

    const boundary = useMemo(
        () => generateDecisionBoundary(config, 30, activationFn),
        [config, activationFn]
    );

    const accuracy = useMemo(
        () => computeAccuracy(config, dataset, activationFn),
        [config, dataset, activationFn]
    );

    const totalParams = useMemo(() => countParams(config), [config]);

    // Colors
    const cardBg = useColorModeValue('gray.50', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const dimText = useColorModeValue('gray.600', 'gray.400');
    const svgBg = useColorModeValue('#fafafa', '#1a1a2e');
    const controlBg = useColorModeValue('white', 'gray.700');
    const lossBg = useColorModeValue('gray.100', 'gray.900');
    const accentGreen = useColorModeValue('green.600', 'green.300');
    const pulseColor = useColorModeValue('green.500', 'green.300');

    // --- Training loop using requestAnimationFrame ---
    const trainingStep = useCallback(() => {
        const ds = DATASETS[datasetKey]!;
        const fullDs: Dataset =
            customPoints.length > 0
                ? { name: ds.name, points: [...ds.points, ...customPoints] }
                : ds;

        let currentConfig = configRef.current;
        let totalLoss = 0;
        let latestGradients: number[][][] | null = null;
        const steps = stepsPerFrameRef.current;

        for (let s = 0; s < steps; s++) {
            const result = trainStep(
                currentConfig,
                fullDs,
                learningRateRef.current,
                Math.min(8, fullDs.points.length),
                activationFnRef.current
            );
            currentConfig = result.config;
            totalLoss += result.loss;
            latestGradients = result.gradients;
        }

        const avgLoss = totalLoss / steps;
        epochRef.current += steps;
        configRef.current = currentConfig;

        const newHistory = [...lossHistoryRef.current, avgLoss].slice(-100);
        lossHistoryRef.current = newHistory;

        // Batch state updates
        setConfig(currentConfig);
        setEpoch(epochRef.current);
        setLossHistory(newHistory);
        if (latestGradients) {
            setGradientMagnitudes(latestGradients);
        }
    }, [datasetKey, customPoints]);

    useEffect(() => {
        if (!isTraining) return;
        return startFrameLoop(trainingStep);
    }, [isTraining, trainingStep]);
    const startTraining = useCallback(() => setIsTraining(true), []);
    const stopTraining = useCallback(() => setIsTraining(false), []);

    const selectPreset = useCallback(
        (idx: number) => {
            stopTraining();
            setPresetIdx(idx);
            const newConfig = PRESET_NETWORKS[idx]!.config;
            setConfig(newConfig);
            configRef.current = newConfig;
            setDatasetKey(PRESET_NETWORKS[idx]!.datasetKey);
            setCustomPoints([]);
            setActivations(null);
            setAnimatingLayer(null);
            setIsAnimating(false);
            setEpoch(0);
            epochRef.current = 0;
            setLossHistory([]);
            lossHistoryRef.current = [];
            setGradientMagnitudes(null);
            setActivationFn('sigmoid');
            activationFnRef.current = 'sigmoid';
            if (animationRef.current) clearTimeout(animationRef.current);
        },
        [stopTraining]
    );

    const handleResetAndLearn = useCallback(() => {
        stopTraining();
        const { weights, biases } = randomizeWeights(config.layers);
        const newConfig: NetworkConfig = { ...config, weights, biases };
        setConfig(newConfig);
        configRef.current = newConfig;
        setActivations(null);
        setAnimatingLayer(null);
        setEpoch(0);
        epochRef.current = 0;
        setLossHistory([]);
        lossHistoryRef.current = [];
        setGradientMagnitudes(null);

        setIsTraining(true);
    }, [config, stopTraining]);

    const handleRandomize = useCallback(() => {
        stopTraining();
        const { weights, biases } = randomizeWeights(config.layers);
        const newConfig: NetworkConfig = { ...config, weights, biases };
        setConfig(newConfig);
        configRef.current = newConfig;
        setActivations(null);
        setAnimatingLayer(null);
        setEpoch(0);
        epochRef.current = 0;
        setLossHistory([]);
        lossHistoryRef.current = [];
        setGradientMagnitudes(null);
    }, [config, stopTraining]);

    const handleForwardPass = useCallback(() => {
        if (isAnimating || isTraining) return;
        const point =
            dataset.points[Math.floor(Math.random() * dataset.points.length)]!;
        const result = forwardPass([point.x, point.y], config, activationFn);
        setIsAnimating(true);

        let layer = 0;
        const animateNext = () => {
            if (layer > config.layers.length - 1) {
                setIsAnimating(false);
                setAnimatingLayer(null);
                return;
            }
            setActivations(result);
            setAnimatingLayer(layer);
            layer++;
            animationRef.current = setTimeout(animateNext, 400);
        };
        animateNext();
    }, [isAnimating, isTraining, dataset, config, activationFn]);

    // Utility to get data coords from SVG mouse event
    const getDataCoordsFromEvent = useCallback(
        (e: React.MouseEvent<SVGSVGElement>): { cx: number; cy: number } => {
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;
            const x = (px / rect.width) * 2 - 1;
            const y = 1 - (py / rect.height) * 2;
            return {
                cx: Math.max(-1, Math.min(1, x)),
                cy: Math.max(-1, Math.min(1, y)),
            };
        },
        []
    );

    // Click on decision boundary to add a custom point
    const handleBoundaryClick = useCallback(
        (e: React.MouseEvent<SVGSVGElement>) => {
            // In draw mode, mousedown/mousemove handles it
            if (drawMode) return;
            const { cx, cy } = getDataCoordsFromEvent(e);
            // Shift-click for class 0, regular click for class 1
            const label = e.shiftKey ? 0 : 1;
            setCustomPoints((prev: DataPoint[]) => [
                ...prev,
                { x: cx, y: cy, label },
            ]);
        },
        [drawMode, getDataCoordsFromEvent]
    );

    // Paint mode: mouse down
    const handleBoundaryMouseDown = useCallback(
        (e: React.MouseEvent<SVGSVGElement>) => {
            if (!drawMode) return;
            e.preventDefault();
            isDrawingRef.current = true;
            const { cx, cy } = getDataCoordsFromEvent(e);
            lastPaintPosRef.current = { x: cx, y: cy };
            setCustomPoints((prev: DataPoint[]) => [
                ...prev,
                { x: cx, y: cy, label: paintClass },
            ]);
        },
        [drawMode, paintClass, getDataCoordsFromEvent]
    );

    // Paint mode: mouse move (throttled by distance)
    const handleBoundaryMouseMove = useCallback(
        (e: React.MouseEvent<SVGSVGElement>) => {
            if (!drawMode || !isDrawingRef.current) return;
            const { cx, cy } = getDataCoordsFromEvent(e);
            const last = lastPaintPosRef.current;
            if (last) {
                // Distance in data coords; 15px ~ 15/270*2 ≈ 0.111 in data space
                const dx = cx - last.x;
                const dy = cy - last.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 0.11) return; // throttle: ~15px minimum distance
            }
            lastPaintPosRef.current = { x: cx, y: cy };
            setCustomPoints((prev: DataPoint[]) => [
                ...prev,
                { x: cx, y: cy, label: paintClass },
            ]);
        },
        [drawMode, paintClass, getDataCoordsFromEvent]
    );

    // Paint mode: mouse up
    const handleBoundaryMouseUp = useCallback(() => {
        isDrawingRef.current = false;
        lastPaintPosRef.current = null;
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationRef.current) clearTimeout(animationRef.current);
        };
    }, []);

    // --- SVG Network Diagram ---
    const svgWidth = 360;
    const svgHeight = 280;
    const layerCount = config.layers.length;
    const layerSpacing = svgWidth / (layerCount + 1);

    const nodePositions: { x: number; y: number }[][] = config.layers.map(
        (size: number, li: number) => {
            const x = layerSpacing * (li + 1);
            return Array.from({ length: size }, (_, ni) => {
                const totalHeight = (size - 1) * 48;
                const y = svgHeight / 2 - totalHeight / 2 + ni * 48;
                return { x, y };
            });
        }
    );

    // Build connections
    const connections: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        weight: number;
        layerIdx: number;
        toNeuron: number;
        fromNeuron: number;
    }[] = [];
    for (let l = 0; l < config.weights.length; l++) {
        const layerW = config.weights[l]!;
        for (let j = 0; j < layerW.length; j++) {
            const neuronW = layerW[j]!;
            for (let i = 0; i < neuronW.length; i++) {
                const from = nodePositions[l]![i]!;
                const to = nodePositions[l + 1]![j]!;
                connections.push({
                    x1: from.x,
                    y1: from.y,
                    x2: to.x,
                    y2: to.y,
                    weight: neuronW[i]!,
                    layerIdx: l,
                    toNeuron: j,
                    fromNeuron: i,
                });
            }
        }
    }

    const getNodeColor = (layerIdx: number, neuronIdx: number): string => {
        if (!activations || activations.length <= layerIdx) return '#888';
        const val = activations[layerIdx]![neuronIdx];
        if (val === undefined) return '#888';
        const r = Math.round(val * 220 + 35);
        const b = Math.round((1 - val) * 220 + 35);
        const g = 60;
        return `rgb(${r},${g},${b})`;
    };

    const isLayerActive = (li: number) =>
        animatingLayer !== null && li <= animatingLayer;

    // Decision boundary cell color
    const cellColor = (value: number): string => {
        if (value < 0.5) {
            const t = value / 0.5;
            const r = Math.round(30 + t * 80);
            const g = Math.round(80 + t * 60);
            const b = Math.round(220 - t * 60);
            return `rgb(${r},${g},${b})`;
        } else {
            const t = (value - 0.5) / 0.5;
            const r = Math.round(180 + t * 60);
            const g = Math.round(80 - t * 40);
            const b = Math.round(80 - t * 40);
            return `rgb(${r},${g},${b})`;
        }
    };

    // Gradient heatmap color: blue → yellow → red
    const gradientColor = (magnitude: number, maxMag: number): string => {
        if (maxMag === 0) return 'rgb(50,50,200)';
        const t = Math.min(magnitude / maxMag, 1);
        if (t < 0.5) {
            // blue to yellow
            const s = t / 0.5;
            const r = Math.round(50 + s * 205);
            const g = Math.round(50 + s * 205);
            const b = Math.round(200 - s * 200);
            return `rgb(${r},${g},${b})`;
        } else {
            // yellow to red
            const s = (t - 0.5) / 0.5;
            const r = Math.round(255);
            const g = Math.round(255 - s * 215);
            const b = Math.round(0);
            return `rgb(${r},${g},${b})`;
        }
    };

    // Compute max gradient magnitude for normalization
    const maxGradient = useMemo(() => {
        if (!gradientMagnitudes) return 0;
        let max = 0;
        for (const layer of gradientMagnitudes) {
            for (const neuron of layer!) {
                for (const g of neuron!) {
                    if (g! > max) max = g!;
                }
            }
        }
        return max;
    }, [gradientMagnitudes]);

    // Loss sparkline
    const lossSparkline = useMemo(() => {
        if (lossHistory.length < 2) return null;
        const maxLoss = Math.max(...lossHistory, 0.01);
        const w = 400;
        const h = 60;
        const points = lossHistory
            .map((loss: number, i: number) => {
                const x = (i / (lossHistory.length - 1)) * w;
                const y = h - (Math.min(loss, maxLoss) / maxLoss) * (h - 4);
                return `${x},${y}`;
            })
            .join(' ');
        // Gradient fill area
        const areaPoints = `0,${h} ${points} ${w},${h}`;
        return { points, areaPoints, w, h, maxLoss };
    }, [lossHistory]);

    return {
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
    };
}
