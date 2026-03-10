// ── Neural Network Engine ─────────────────────────────────────────
// Pure TypeScript feedforward neural network with backpropagation.
// No external dependencies.

export type ActivationFn = 'relu' | 'sigmoid' | 'tanh';

export interface NeuralNetwork {
  layers: number[];
  weights: number[][][];
  biases: number[][];
  activations: number[][];
  preActivations: number[][];
  activation: ActivationFn;
}

// ── Activation helpers ───────────────────────────────────────────

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
}

function activate(x: number, fn: ActivationFn): number {
  switch (fn) {
    case 'relu':
      return Math.max(0, x);
    case 'sigmoid':
      return sigmoid(x);
    case 'tanh':
      return Math.tanh(x);
  }
}

function activateDerivative(x: number, fn: ActivationFn): number {
  switch (fn) {
    case 'relu':
      return x > 0 ? 1 : 0;
    case 'sigmoid': {
      const s = sigmoid(x);
      return s * (1 - s);
    }
    case 'tanh': {
      const t = Math.tanh(x);
      return 1 - t * t;
    }
  }
}

// ── Network creation ─────────────────────────────────────────────

export function createNetwork(
  layers: number[],
  activation: ActivationFn,
): NeuralNetwork {
  const weights: number[][][] = [];
  const biases: number[][] = [];
  const activations: number[][] = [];
  const preActivations: number[][] = [];

  for (let l = 0; l < layers.length; l++) {
    const size = layers[l];
    if (size === undefined) throw new Error('Invalid layer');
    activations.push(new Array<number>(size).fill(0));
    preActivations.push(new Array<number>(size).fill(0));

    if (l === 0) {
      weights.push([]);
      biases.push([]);
      continue;
    }

    const prevSize = layers[l - 1];
    if (prevSize === undefined) throw new Error('Invalid prev layer');

    // He initialization for ReLU, Xavier for others
    const scale =
      activation === 'relu'
        ? Math.sqrt(2 / prevSize)
        : Math.sqrt(1 / prevSize);

    const layerWeights: number[][] = [];
    const layerBiases: number[] = [];

    for (let n = 0; n < size; n++) {
      const neuronWeights: number[] = [];
      for (let p = 0; p < prevSize; p++) {
        neuronWeights.push(gaussianRandom() * scale);
      }
      layerWeights.push(neuronWeights);
      layerBiases.push(0);
    }

    weights.push(layerWeights);
    biases.push(layerBiases);
  }

  return { layers, weights, biases, activations, preActivations, activation };
}

function gaussianRandom(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// ── Forward pass ─────────────────────────────────────────────────

export function forward(net: NeuralNetwork, input: number[]): number {
  const firstLayer = net.activations[0];
  if (!firstLayer) return 0;
  for (let i = 0; i < input.length; i++) {
    firstLayer[i] = input[i] ?? 0;
  }
  const firstPre = net.preActivations[0];
  if (firstPre) {
    for (let i = 0; i < input.length; i++) {
      firstPre[i] = input[i] ?? 0;
    }
  }

  for (let l = 1; l < net.layers.length; l++) {
    const layerSize = net.layers[l];
    const prevLayer = net.activations[l - 1];
    const layerWeights = net.weights[l];
    const layerBiases = net.biases[l];
    const layerActivations = net.activations[l];
    const layerPreAct = net.preActivations[l];

    if (!layerSize || !prevLayer || !layerWeights || !layerBiases || !layerActivations || !layerPreAct)
      continue;

    const isOutput = l === net.layers.length - 1;

    for (let n = 0; n < layerSize; n++) {
      const nWeights = layerWeights[n];
      const bias = layerBiases[n];
      if (!nWeights || bias === undefined) continue;

      let sum = bias;
      for (let p = 0; p < prevLayer.length; p++) {
        const w = nWeights[p];
        const a = prevLayer[p];
        if (w !== undefined && a !== undefined) {
          sum += w * a;
        }
      }

      layerPreAct[n] = sum;
      // Output layer always uses sigmoid for binary classification
      layerActivations[n] = isOutput ? sigmoid(sum) : activate(sum, net.activation);
    }
  }

  const outputLayer = net.activations[net.layers.length - 1];
  return outputLayer?.[0] ?? 0;
}

// ── Training step (backpropagation) ──────────────────────────────

export function trainStep(
  net: NeuralNetwork,
  data: Array<[number, number, number]>,
  lr: number,
): { loss: number; accuracy: number } {
  const numLayers = net.layers.length;

  // Accumulate gradients
  const weightGrads: number[][][] = [];
  const biasGrads: number[][] = [];

  for (let l = 0; l < numLayers; l++) {
    const layerSize = net.layers[l] ?? 0;
    if (l === 0) {
      weightGrads.push([]);
      biasGrads.push([]);
      continue;
    }
    const prevSize = net.layers[l - 1] ?? 0;
    const wg: number[][] = [];
    const bg: number[] = new Array<number>(layerSize).fill(0);
    for (let n = 0; n < layerSize; n++) {
      wg.push(new Array<number>(prevSize).fill(0));
    }
    weightGrads.push(wg);
    biasGrads.push(bg);
  }

  let totalLoss = 0;
  let correct = 0;

  for (const sample of data) {
    const x0 = sample[0];
    const x1 = sample[1];
    const label = sample[2];
    if (x0 === undefined || x1 === undefined || label === undefined) continue;

    const output = forward(net, [x0, x1]);
    const clipped = Math.max(1e-7, Math.min(1 - 1e-7, output));
    totalLoss += -(label * Math.log(clipped) + (1 - label) * Math.log(1 - clipped));

    if ((output >= 0.5 ? 1 : 0) === label) correct++;

    // Backpropagation
    const deltas: number[][] = [];
    for (let l = 0; l < numLayers; l++) {
      deltas.push(new Array<number>(net.layers[l] ?? 0).fill(0));
    }

    // Output layer delta
    const outputDelta = deltas[numLayers - 1];
    if (outputDelta) {
      outputDelta[0] = output - label; // derivative of BCE + sigmoid
    }

    // Hidden layer deltas
    for (let l = numLayers - 2; l >= 1; l--) {
      const layerSize = net.layers[l] ?? 0;
      const nextLayerSize = net.layers[l + 1] ?? 0;
      const nextWeights = net.weights[l + 1];
      const nextDeltas = deltas[l + 1];
      const currentDeltas = deltas[l];
      const currentPreAct = net.preActivations[l];

      if (!nextWeights || !nextDeltas || !currentDeltas || !currentPreAct) continue;

      for (let n = 0; n < layerSize; n++) {
        let error = 0;
        for (let nn = 0; nn < nextLayerSize; nn++) {
          const w = nextWeights[nn]?.[n];
          const d = nextDeltas[nn];
          if (w !== undefined && d !== undefined) {
            error += w * d;
          }
        }
        const pre = currentPreAct[n];
        if (pre !== undefined) {
          currentDeltas[n] = error * activateDerivative(pre, net.activation);
        }
      }
    }

    // Accumulate gradients
    for (let l = 1; l < numLayers; l++) {
      const layerSize = net.layers[l] ?? 0;
      const prevActs = net.activations[l - 1];
      const layerDeltas = deltas[l];
      const wg = weightGrads[l];
      const bg = biasGrads[l];

      if (!prevActs || !layerDeltas || !wg || !bg) continue;

      for (let n = 0; n < layerSize; n++) {
        const d = layerDeltas[n];
        if (d === undefined) continue;
        const nwg = wg[n];
        if (!nwg) continue;

        for (let p = 0; p < prevActs.length; p++) {
          const a = prevActs[p];
          if (a !== undefined) {
            nwg[p] = (nwg[p] ?? 0) + d * a;
          }
        }
        bg[n] = (bg[n] ?? 0) + d;
      }
    }
  }

  // Apply gradients
  const n = data.length || 1;
  for (let l = 1; l < numLayers; l++) {
    const layerSize = net.layers[l] ?? 0;
    const prevSize = net.layers[l - 1] ?? 0;
    const lw = net.weights[l];
    const lb = net.biases[l];
    const wg = weightGrads[l];
    const bg = biasGrads[l];

    if (!lw || !lb || !wg || !bg) continue;

    for (let nn = 0; nn < layerSize; nn++) {
      const nw = lw[nn];
      const nwg = wg[nn];
      if (!nw || !nwg) continue;

      for (let p = 0; p < prevSize; p++) {
        const g = nwg[p];
        if (g !== undefined && nw[p] !== undefined) {
          nw[p] = nw[p]! - (lr * g) / n;
        }
      }
      const bg_n = bg[nn];
      if (bg_n !== undefined && lb[nn] !== undefined) {
        lb[nn] = lb[nn]! - (lr * bg_n) / n;
      }
    }
  }

  return {
    loss: totalLoss / n,
    accuracy: correct / n,
  };
}

// ── Decision boundary ────────────────────────────────────────────

export function getDecisionBoundary(
  net: NeuralNetwork,
  resolution: number,
): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < resolution; r++) {
    const row: number[] = [];
    const y = (r / (resolution - 1)) * 2 - 1; // -1 to 1
    for (let c = 0; c < resolution; c++) {
      const x = (c / (resolution - 1)) * 2 - 1;
      row.push(forward(net, [x, y]));
    }
    grid.push(row);
  }
  return grid;
}

// ── Dataset generators ───────────────────────────────────────────

export type DataPoint = [x: number, y: number, label: number];

export function generateXOR(count: number = 200): DataPoint[] {
  const points: DataPoint[] = [];
  const perCorner = Math.floor(count / 4);
  const corners: Array<[number, number, number]> = [
    [-0.7, -0.7, 0],
    [0.7, 0.7, 0],
    [-0.7, 0.7, 1],
    [0.7, -0.7, 1],
  ];
  for (const [cx, cy, label] of corners) {
    for (let i = 0; i < perCorner; i++) {
      points.push([
        cx + gaussianRandom() * 0.15,
        cy + gaussianRandom() * 0.15,
        label,
      ]);
    }
  }
  return points;
}

export function generateSpiral(count: number = 200): DataPoint[] {
  const points: DataPoint[] = [];
  const half = Math.floor(count / 2);
  for (let i = 0; i < half; i++) {
    const t = (i / half) * 2 * Math.PI;
    const r = (i / half) * 0.8;
    const noise = gaussianRandom() * 0.08;
    points.push([
      r * Math.cos(t) + noise,
      r * Math.sin(t) + noise,
      0,
    ]);
    points.push([
      r * Math.cos(t + Math.PI) + noise,
      r * Math.sin(t + Math.PI) + noise,
      1,
    ]);
  }
  return points;
}

export function generateMoons(count: number = 200): DataPoint[] {
  const points: DataPoint[] = [];
  const half = Math.floor(count / 2);
  for (let i = 0; i < half; i++) {
    const angle = (i / half) * Math.PI;
    const noise = gaussianRandom() * 0.08;
    // Upper moon (class 0)
    points.push([
      Math.cos(angle) * 0.7 + noise,
      Math.sin(angle) * 0.7 + noise - 0.1,
      0,
    ]);
    // Lower moon (class 1)
    points.push([
      1 - Math.cos(angle) * 0.7 + noise - 0.5,
      -Math.sin(angle) * 0.7 + noise + 0.3,
      1,
    ]);
  }
  return points;
}
