// Neural Network Playground data and utilities

export interface Neuron {
  id: string;
  activation: number;
  bias: number;
}

export interface Connection {
  from: string;
  to: string;
  weight: number;
}

export interface Layer {
  neurons: Neuron[];
}

export interface NetworkConfig {
  name: string;
  layers: number[];
  weights: number[][][]; // weights[layerIdx][toNeuron][fromNeuron]
  biases: number[][]; // biases[layerIdx][neuronIdx]
}

export interface DataPoint {
  x: number;
  y: number;
  label: number; // 0 or 1
}

export interface Dataset {
  name: string;
  points: DataPoint[];
}

// --- Activation ---

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// --- Forward pass ---

export function forwardPass(
  inputs: number[],
  config: NetworkConfig
): number[][] {
  const activations: number[][] = [inputs];

  let current = inputs;
  for (let l = 0; l < config.weights.length; l++) {
    const layerWeights = config.weights[l];
    const layerBiases = config.biases[l];
    const next: number[] = [];
    for (let j = 0; j < layerWeights!.length; j++) {
      let sum = layerBiases![j]!;
      for (let i = 0; i < current.length; i++) {
        sum += current[i]! * layerWeights![j]![i]!;
      }
      next.push(sigmoid(sum));
    }
    activations.push(next);
    current = next;
  }

  return activations;
}

// --- Backpropagation training step ---

export function trainStep(
  config: NetworkConfig,
  dataset: Dataset,
  learningRate: number = 0.5,
  batchSize: number = 4
): { config: NetworkConfig; loss: number } {
  const numLayers = config.weights.length;

  // Initialize gradient accumulators (same shape as weights/biases)
  const weightGrads: number[][][] = config.weights.map((layer) =>
    layer!.map((neuron) => neuron!.map(() => 0))
  );
  const biasGrads: number[][] = config.biases.map((layer) =>
    layer!.map(() => 0)
  );

  let totalLoss = 0;

  // Sample batchSize random points
  for (let b = 0; b < batchSize; b++) {
    const idx = Math.floor(Math.random() * dataset.points.length);
    const point = dataset.points[idx]!;
    const target = point.label;

    // --- Forward pass (store pre-activation z and activation a) ---
    const activations: number[][] = [[point.x, point.y]];
    const zValues: number[][] = []; // pre-activation values

    let current = [point.x, point.y];
    for (let l = 0; l < numLayers; l++) {
      const layerW = config.weights[l]!;
      const layerB = config.biases[l]!;
      const nextA: number[] = [];
      const nextZ: number[] = [];
      for (let j = 0; j < layerW.length; j++) {
        let sum = layerB[j]!;
        for (let i = 0; i < current.length; i++) {
          sum += current[i]! * layerW[j]![i]!;
        }
        nextZ.push(sum);
        nextA.push(sigmoid(sum));
      }
      zValues.push(nextZ);
      activations.push(nextA);
      current = nextA;
    }

    // Output value
    const output = activations[activations.length - 1]![0]!;
    // Clamp for numerical stability
    const clampedOutput = Math.max(1e-7, Math.min(1 - 1e-7, output));
    totalLoss +=
      -(target * Math.log(clampedOutput) +
        (1 - target) * Math.log(1 - clampedOutput));

    // --- Backpropagation ---
    // deltas[l][j] = dLoss/dz for layer l, neuron j
    const deltas: number[][] = [];
    for (let l = 0; l < numLayers; l++) {
      deltas.push(config.weights[l]!.map(() => 0));
    }

    // Output layer delta: dL/dz = (a - target) for sigmoid + BCE loss
    const outputLayerIdx = numLayers - 1;
    deltas[outputLayerIdx]![0] = output - target;

    // Hidden layer deltas (backpropagate)
    for (let l = numLayers - 2; l >= 0; l--) {
      const nextLayerW = config.weights[l + 1]!;
      for (let j = 0; j < config.weights[l]!.length; j++) {
        const a = activations[l + 1]![j]!;
        const sigmoidDeriv = a * (1 - a);
        let sum = 0;
        for (let k = 0; k < nextLayerW.length; k++) {
          sum += deltas[l + 1]![k]! * nextLayerW[k]![j]!;
        }
        deltas[l]![j] = sum * sigmoidDeriv;
      }
    }

    // Accumulate gradients
    for (let l = 0; l < numLayers; l++) {
      const prevActivation = activations[l]!;
      for (let j = 0; j < config.weights[l]!.length; j++) {
        const d = deltas[l]![j]!;
        biasGrads[l]![j]! += d;
        for (let i = 0; i < config.weights[l]![j]!.length; i++) {
          weightGrads[l]![j]![i]! += d * prevActivation[i]!;
        }
      }
    }
  }

  // Average gradients and update weights/biases (pure — create new arrays)
  const newWeights = config.weights.map((layer, l) =>
    layer!.map((neuron, j) =>
      neuron!.map(
        (w, i) => w - (learningRate * weightGrads[l]![j]![i]!) / batchSize
      )
    )
  );

  const newBiases = config.biases.map((layer, l) =>
    layer!.map((b, j) => b - (learningRate * biasGrads[l]![j]!) / batchSize)
  );

  return {
    config: {
      ...config,
      weights: newWeights,
      biases: newBiases,
    },
    loss: totalLoss / batchSize,
  };
}

// --- Decision boundary ---

export interface BoundaryCell {
  x: number;
  y: number;
  value: number;
}

export function generateDecisionBoundary(
  config: NetworkConfig,
  resolution: number = 30
): BoundaryCell[] {
  const cells: BoundaryCell[] = [];
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (i / (resolution - 1)) * 2 - 1; // range [-1, 1]
      const y = (j / (resolution - 1)) * 2 - 1;
      const activations = forwardPass([x, y], config);
      const output = activations[activations.length - 1]![0]!;
      cells.push({ x, y, value: output });
    }
  }
  return cells;
}

// --- Utility: compute accuracy ---

export function computeAccuracy(config: NetworkConfig, dataset: Dataset): number {
  let correct = 0;
  for (const point of dataset.points) {
    const activations = forwardPass([point.x, point.y], config);
    const output = activations[activations.length - 1]![0]!;
    const predicted = output >= 0.5 ? 1 : 0;
    if (predicted === point.label) correct++;
  }
  return dataset.points.length > 0 ? correct / dataset.points.length : 0;
}

// --- Utility: count params ---

export function countParams(config: NetworkConfig): number {
  let total = 0;
  for (let l = 0; l < config.weights.length; l++) {
    for (let j = 0; j < config.weights[l]!.length; j++) {
      total += config.weights[l]![j]!.length; // weights
    }
    total += config.biases[l]!.length; // biases
  }
  return total;
}

// --- Utility: randomize weights ---

export function randomizeWeights(layers: number[]): {
  weights: number[][][];
  biases: number[][];
} {
  const weights: number[][][] = [];
  const biases: number[][] = [];
  for (let l = 1; l < layers.length; l++) {
    const layerW: number[][] = [];
    const layerB: number[] = [];
    for (let j = 0; j < layers[l]!; j++) {
      const neuronW: number[] = [];
      for (let i = 0; i < layers[l - 1]!; i++) {
        neuronW.push((Math.random() - 0.5) * 4);
      }
      layerW.push(neuronW);
      layerB.push((Math.random() - 0.5) * 2);
    }
    weights.push(layerW);
    biases.push(layerB);
  }
  return { weights, biases };
}

// --- Datasets ---

export const XOR_DATASET: Dataset = {
  name: 'XOR',
  points: [
    { x: -0.8, y: -0.8, label: 0 },
    { x: -0.8, y: 0.8, label: 1 },
    { x: 0.8, y: -0.8, label: 1 },
    { x: 0.8, y: 0.8, label: 0 },
  ],
};

// Circle dataset: points inside radius ~0.5 are class 0, outside are class 1
export const CIRCLE_DATASET: Dataset = {
  name: 'Circle',
  points: (() => {
    const pts: DataPoint[] = [];
    // Inner ring (class 0)
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const r = 0.2 + Math.sin(i * 7) * 0.1;
      pts.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        label: 0,
      });
    }
    // Outer ring (class 1)
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const r = 0.65 + Math.sin(i * 5) * 0.12;
      pts.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        label: 1,
      });
    }
    return pts;
  })(),
};

// Spiral dataset: two interleaved spirals
export const SPIRAL_DATASET: Dataset = {
  name: 'Spiral',
  points: (() => {
    const pts: DataPoint[] = [];
    for (let i = 0; i < 50; i++) {
      const t = (i / 50) * 2 * Math.PI;
      const r = (i / 50) * 0.8 + 0.1;
      // Spiral 0
      pts.push({
        x: Math.cos(t) * r,
        y: Math.sin(t) * r,
        label: 0,
      });
      // Spiral 1 (offset by pi)
      pts.push({
        x: Math.cos(t + Math.PI) * r,
        y: Math.sin(t + Math.PI) * r,
        label: 1,
      });
    }
    return pts;
  })(),
};

export const DATASETS: Record<string, Dataset> = {
  xor: XOR_DATASET,
  circle: CIRCLE_DATASET,
  spiral: SPIRAL_DATASET,
};

// --- Preset Networks with pre-trained weights ---

// XOR Simple: 2-2-1
// Trained weights that solve XOR well
const XOR_NETWORK: NetworkConfig = {
  name: 'XOR Simple',
  layers: [2, 2, 1],
  weights: [
    // Layer 0->1 (2 neurons, each with 2 inputs)
    [
      [5.8, 5.8],   // hidden neuron 0: AND-like
      [-5.8, -5.8],  // hidden neuron 1: NOR-like
    ],
    // Layer 1->2 (1 neuron, 2 inputs)
    [
      [-7.5, -7.5],  // output: NAND of hidden
    ],
  ],
  biases: [
    [-2.5, 8.0],  // hidden biases
    [10.5],         // output bias
  ],
};

// Circle Classifier: 2-4-1
// Weights that approximate x^2 + y^2 > threshold
const CIRCLE_NETWORK: NetworkConfig = {
  name: 'Circle Classifier',
  layers: [2, 4, 1],
  weights: [
    // Layer 0->1 (4 neurons, each 2 inputs)
    [
      [4.5, 0.3],    // responds to +x
      [-4.5, -0.3],  // responds to -x
      [0.3, 4.5],    // responds to +y
      [-0.3, -4.5],  // responds to -y
    ],
    // Layer 1->2 (1 neuron, 4 inputs)
    [
      [6.0, 6.0, 6.0, 6.0],
    ],
  ],
  biases: [
    [-2.0, -2.0, -2.0, -2.0],
    [-8.5],
  ],
};

// Spiral Deep: 2-6-4-1
// More complex network for spiral classification
const SPIRAL_NETWORK: NetworkConfig = {
  name: 'Spiral Deep',
  layers: [2, 6, 4, 1],
  weights: [
    // Layer 0->1 (6 neurons, each 2 inputs)
    [
      [3.2, 1.8],
      [-2.5, 3.5],
      [3.8, -2.2],
      [-1.5, -3.8],
      [4.0, 0.5],
      [-0.5, 4.2],
    ],
    // Layer 1->2 (4 neurons, each 6 inputs)
    [
      [2.5, -3.0, 1.8, -2.2, 3.5, -1.5],
      [-2.0, 2.8, -3.2, 1.5, -1.8, 3.0],
      [1.5, -1.8, 2.5, 3.2, -2.8, -2.0],
      [-3.0, 1.2, -1.5, 2.8, 2.0, -3.5],
    ],
    // Layer 2->3 (1 neuron, 4 inputs)
    [
      [5.5, -5.0, 4.5, -4.8],
    ],
  ],
  biases: [
    [-1.0, -0.5, -0.8, 0.3, -1.2, -0.2],
    [-1.5, 0.8, -0.5, 1.0],
    [-0.5],
  ],
};

export const PRESET_NETWORKS: { config: NetworkConfig; datasetKey: string }[] = [
  { config: XOR_NETWORK, datasetKey: 'xor' },
  { config: CIRCLE_NETWORK, datasetKey: 'circle' },
  { config: SPIRAL_NETWORK, datasetKey: 'spiral' },
];
