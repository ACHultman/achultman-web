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

export type ActivationFn = 'sigmoid' | 'relu' | 'tanh';

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function sigmoidDeriv(a: number): number {
  return a * (1 - a);
}

function relu(x: number): number {
  return Math.max(0, x);
}

function reluDeriv(x: number): number {
  return x > 0 ? 1 : 0;
}

function tanhFn(x: number): number {
  return Math.tanh(x);
}

function tanhDeriv(x: number): number {
  const t = Math.tanh(x);
  return 1 - t * t;
}

function applyActivation(x: number, activation: ActivationFn): number {
  switch (activation) {
    case 'relu':
      return relu(x);
    case 'tanh':
      return tanhFn(x);
    case 'sigmoid':
    default:
      return sigmoid(x);
  }
}

function applyActivationDeriv(
  z: number,
  a: number,
  activation: ActivationFn
): number {
  switch (activation) {
    case 'relu':
      return reluDeriv(z);
    case 'tanh':
      return tanhDeriv(z);
    case 'sigmoid':
    default:
      return sigmoidDeriv(a);
  }
}

// --- Forward pass ---

export function forwardPass(
  inputs: number[],
  config: NetworkConfig,
  activation: ActivationFn = 'sigmoid'
): number[][] {
  const activations: number[][] = [inputs];

  let current = inputs;
  for (let l = 0; l < config.weights.length; l++) {
    const layerWeights = config.weights[l];
    const layerBiases = config.biases[l];
    const next: number[] = [];
    // Use sigmoid for the output layer always (needed for BCE loss),
    // use selected activation for hidden layers
    const isOutputLayer = l === config.weights.length - 1;
    const layerActivation = isOutputLayer ? 'sigmoid' : activation;
    for (let j = 0; j < layerWeights!.length; j++) {
      let sum = layerBiases![j]!;
      for (let i = 0; i < current.length; i++) {
        sum += current[i]! * layerWeights![j]![i]!;
      }
      next.push(applyActivation(sum, layerActivation));
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
  batchSize: number = 4,
  activation: ActivationFn = 'sigmoid'
): { config: NetworkConfig; loss: number; gradients: number[][][] } {
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
      // Output layer always uses sigmoid for BCE loss compatibility
      const isOutputLayer = l === numLayers - 1;
      const layerActivation = isOutputLayer ? 'sigmoid' : activation;
      for (let j = 0; j < layerW.length; j++) {
        let sum = layerB[j]!;
        for (let i = 0; i < current.length; i++) {
          sum += current[i]! * layerW[j]![i]!;
        }
        nextZ.push(sum);
        nextA.push(applyActivation(sum, layerActivation));
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
      const isOutputLayer = l === numLayers - 1;
      const layerActivation = isOutputLayer ? 'sigmoid' : activation;
      for (let j = 0; j < config.weights[l]!.length; j++) {
        const z = zValues[l]![j]!;
        const a = activations[l + 1]![j]!;
        const deriv = applyActivationDeriv(z, a, layerActivation);
        let sum = 0;
        for (let k = 0; k < nextLayerW.length; k++) {
          sum += deltas[l + 1]![k]! * nextLayerW[k]![j]!;
        }
        deltas[l]![j] = sum * deriv;
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

  // Compute averaged absolute gradient magnitudes (same shape as weights)
  const gradients: number[][][] = weightGrads.map((layer) =>
    layer!.map((neuron) =>
      neuron!.map((g) => Math.abs(g) / batchSize)
    )
  );

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
    gradients,
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
  resolution: number = 30,
  activation: ActivationFn = 'sigmoid'
): BoundaryCell[] {
  const cells: BoundaryCell[] = [];
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (i / (resolution - 1)) * 2 - 1; // range [-1, 1]
      const y = (j / (resolution - 1)) * 2 - 1;
      const activations = forwardPass([x, y], config, activation);
      const output = activations[activations.length - 1]![0]!;
      cells.push({ x, y, value: output });
    }
  }
  return cells;
}

// --- Utility: compute accuracy ---

export function computeAccuracy(
  config: NetworkConfig,
  dataset: Dataset,
  activation: ActivationFn = 'sigmoid'
): number {
  let correct = 0;
  for (const point of dataset.points) {
    const activations = forwardPass([point.x, point.y], config, activation);
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

// Moons dataset: two crescent shapes offset from each other
export const MOONS_DATASET: Dataset = {
  name: 'Moons',
  points: (() => {
    const pts: DataPoint[] = [];
    // Upper moon (class 0)
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI;
      const r = 0.5 + Math.sin(i * 11) * 0.05;
      pts.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        label: 0,
      });
    }
    // Lower moon (class 1), shifted right and flipped
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI + Math.PI;
      const r = 0.5 + Math.sin(i * 13) * 0.05;
      pts.push({
        x: Math.cos(angle) * r + 0.5,
        y: Math.sin(angle) * r + 0.3,
        label: 1,
      });
    }
    return pts;
  })(),
};

// Checkerboard dataset: 2x2 grid pattern
export const CHECKERBOARD_DATASET: Dataset = {
  name: 'Checkerboard',
  points: (() => {
    const pts: DataPoint[] = [];
    // 4 quadrants, ~20 points each
    for (let i = 0; i < 20; i++) {
      const px = -0.7 + Math.sin(i * 7) * 0.2;
      const py = -0.7 + Math.sin(i * 11) * 0.2;
      pts.push({ x: px, y: py, label: 0 }); // bottom-left
    }
    for (let i = 0; i < 20; i++) {
      const px = 0.5 + Math.sin(i * 7) * 0.2;
      const py = -0.7 + Math.sin(i * 13) * 0.2;
      pts.push({ x: px, y: py, label: 1 }); // bottom-right
    }
    for (let i = 0; i < 20; i++) {
      const px = -0.7 + Math.sin(i * 9) * 0.2;
      const py = 0.5 + Math.sin(i * 11) * 0.2;
      pts.push({ x: px, y: py, label: 1 }); // top-left
    }
    for (let i = 0; i < 20; i++) {
      const px = 0.5 + Math.sin(i * 9) * 0.2;
      const py = 0.5 + Math.sin(i * 7) * 0.2;
      pts.push({ x: px, y: py, label: 0 }); // top-right
    }
    return pts;
  })(),
};

// Gaussian Clusters dataset: 4 clusters, 2 per class
export const GAUSSIAN_CLUSTERS_DATASET: Dataset = {
  name: 'Gaussian Clusters',
  points: (() => {
    const pts: DataPoint[] = [];
    // Cluster 0a: top-left (class 0)
    for (let i = 0; i < 20; i++) {
      pts.push({
        x: -0.6 + Math.sin(i * 17) * 0.15,
        y: 0.6 + Math.sin(i * 23) * 0.15,
        label: 0,
      });
    }
    // Cluster 0b: bottom-right (class 0)
    for (let i = 0; i < 20; i++) {
      pts.push({
        x: 0.6 + Math.sin(i * 19) * 0.15,
        y: -0.6 + Math.sin(i * 29) * 0.15,
        label: 0,
      });
    }
    // Cluster 1a: top-right (class 1)
    for (let i = 0; i < 20; i++) {
      pts.push({
        x: 0.6 + Math.sin(i * 13) * 0.15,
        y: 0.6 + Math.sin(i * 31) * 0.15,
        label: 1,
      });
    }
    // Cluster 1b: bottom-left (class 1)
    for (let i = 0; i < 20; i++) {
      pts.push({
        x: -0.6 + Math.sin(i * 37) * 0.15,
        y: -0.6 + Math.sin(i * 41) * 0.15,
        label: 1,
      });
    }
    return pts;
  })(),
};

// Donut dataset: thick ring (class 1) vs center (class 0)
export const DONUT_DATASET: Dataset = {
  name: 'Donut',
  points: (() => {
    const pts: DataPoint[] = [];
    // Center cluster (class 0)
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const r = 0.1 + Math.sin(i * 7) * 0.08 + (i % 3) * 0.04;
      pts.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        label: 0,
      });
    }
    // Thick ring (class 1)
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const r = 0.55 + Math.sin(i * 11) * 0.15;
      pts.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
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
  moons: MOONS_DATASET,
  checkerboard: CHECKERBOARD_DATASET,
  gaussianClusters: GAUSSIAN_CLUSTERS_DATASET,
  donut: DONUT_DATASET,
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

// Moons Classifier: 2-4-2-1
// Two crescent shapes separated by a curved boundary
const MOONS_NETWORK: NetworkConfig = {
  name: 'Moons Classifier',
  layers: [2, 4, 2, 1],
  weights: [
    // Layer 0->1 (4 neurons, each 2 inputs)
    [
      [4.0, 3.5],
      [-3.5, 4.0],
      [3.0, -3.8],
      [-4.2, -2.5],
    ],
    // Layer 1->2 (2 neurons, each 4 inputs)
    [
      [3.5, -4.0, 2.8, -3.0],
      [-3.0, 3.5, -2.5, 4.0],
    ],
    // Layer 2->3 (1 neuron, 2 inputs)
    [
      [5.0, -5.0],
    ],
  ],
  biases: [
    [-1.0, 0.5, -0.8, 0.3],
    [-0.5, 0.8],
    [-0.3],
  ],
};

// Checkerboard Classifier: 2-8-4-1
// Needs more capacity for the XOR-like 2x2 grid pattern
const CHECKERBOARD_NETWORK: NetworkConfig = {
  name: 'Checkerboard Classifier',
  layers: [2, 8, 4, 1],
  weights: [
    // Layer 0->1 (8 neurons, each 2 inputs)
    [
      [4.5, 0.5],
      [-4.5, 0.5],
      [0.5, 4.5],
      [0.5, -4.5],
      [3.8, 3.8],
      [-3.8, 3.8],
      [3.8, -3.8],
      [-3.8, -3.8],
    ],
    // Layer 1->2 (4 neurons, each 8 inputs)
    [
      [2.5, -2.5, 2.5, -2.5, 1.5, -1.5, 1.5, -1.5],
      [-2.5, 2.5, -2.5, 2.5, -1.5, 1.5, -1.5, 1.5],
      [1.8, -1.8, -1.8, 1.8, 3.0, -3.0, -3.0, 3.0],
      [-1.8, 1.8, 1.8, -1.8, -3.0, 3.0, 3.0, -3.0],
    ],
    // Layer 2->3 (1 neuron, 4 inputs)
    [
      [4.5, -4.5, 4.0, -4.0],
    ],
  ],
  biases: [
    [-1.5, -1.5, -1.5, -1.5, -0.5, -0.5, -0.5, -0.5],
    [0.5, -0.5, 0.3, -0.3],
    [-0.2],
  ],
};

// Gaussian Clusters Classifier: 2-6-4-1
// Four clusters with diagonal class assignment
const GAUSSIAN_CLUSTERS_NETWORK: NetworkConfig = {
  name: 'Gaussian Clusters Classifier',
  layers: [2, 6, 4, 1],
  weights: [
    // Layer 0->1 (6 neurons, each 2 inputs)
    [
      [4.0, 0.2],
      [-4.0, -0.2],
      [0.2, 4.0],
      [-0.2, -4.0],
      [3.5, 3.5],
      [-3.5, 3.5],
    ],
    // Layer 1->2 (4 neurons, each 6 inputs)
    [
      [2.0, -2.0, 2.0, -2.0, -3.0, 3.0],
      [-2.0, 2.0, -2.0, 2.0, 3.0, -3.0],
      [1.5, -1.5, -1.5, 1.5, 2.5, 2.5],
      [-1.5, 1.5, 1.5, -1.5, -2.5, -2.5],
    ],
    // Layer 2->3 (1 neuron, 4 inputs)
    [
      [-5.0, 5.0, -4.5, 4.5],
    ],
  ],
  biases: [
    [-1.0, -1.0, -1.0, -1.0, -0.5, -0.5],
    [0.5, -0.5, 0.3, -0.3],
    [0.2],
  ],
};

// Donut Classifier: 2-4-1
// Radial boundary — similar to circle but with thicker ring
const DONUT_NETWORK: NetworkConfig = {
  name: 'Donut Classifier',
  layers: [2, 4, 1],
  weights: [
    // Layer 0->1 (4 neurons, each 2 inputs)
    [
      [5.0, 0.5],    // responds to +x
      [-5.0, -0.5],  // responds to -x
      [0.5, 5.0],    // responds to +y
      [-0.5, -5.0],  // responds to -y
    ],
    // Layer 1->2 (1 neuron, 4 inputs)
    [
      [5.5, 5.5, 5.5, 5.5],
    ],
  ],
  biases: [
    [-1.5, -1.5, -1.5, -1.5],
    [-7.0],
  ],
};

export const PRESET_NETWORKS: { config: NetworkConfig; datasetKey: string }[] = [
  { config: XOR_NETWORK, datasetKey: 'xor' },
  { config: CIRCLE_NETWORK, datasetKey: 'circle' },
  { config: SPIRAL_NETWORK, datasetKey: 'spiral' },
  { config: MOONS_NETWORK, datasetKey: 'moons' },
  { config: CHECKERBOARD_NETWORK, datasetKey: 'checkerboard' },
  { config: GAUSSIAN_CLUSTERS_NETWORK, datasetKey: 'gaussianClusters' },
  { config: DONUT_NETWORK, datasetKey: 'donut' },
];
