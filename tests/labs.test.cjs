const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/load.cjs');

const sorting = load('src/data/sortingData.ts');
for (const name of [
    'Bubble',
    'Selection',
    'Insertion',
    'Merge',
    'Quick',
    'Heap',
]) {
    test(`${name} sort preserves its input and sorts duplicates, negatives and empty arrays`, () => {
        for (const values of [[], [1], [3, -1, 3, 0, -5], [5, 4, 3, 2, 1]]) {
            const input = [...values];
            const steps = sorting[`generate${name}SortSteps`](input);
            assert.deepEqual(input, values);
            if (values.length) {
                assert.deepEqual(
                    Array.from(steps.at(-1).array),
                    [...values].sort((a, b) => a - b)
                );
            }
        }
    });
}

test('Huffman output round-trips repeated symbols, whitespace and Unicode', () => {
    const { generateHuffmanSteps } = load('src/data/compressionData.ts');
    assert.equal(generateHuffmanSteps('').length, 0);
    for (const input of ['aaaa', 'ABRACADABRA', 'hello world', 'é🧠é']) {
        const result = generateHuffmanSteps(input).at(-1);
        const codes = new Map(
            result.nodes.map((node) => [node.code, node.char])
        );
        let pending = '',
            decoded = '';
        for (const bit of result.encodedBits) {
            pending += bit;
            if (codes.has(pending)) {
                decoded += codes.get(pending);
                pending = '';
            }
        }
        assert.equal(pending, '');
        assert.equal(decoded, input);
    }
});

test('neural training reduces binary cross entropy without mutating its starting weights', () => {
    const { trainStep, forwardPass } = load('src/data/neuralNetData.ts');
    const initial = {
        name: 'One neuron',
        layers: [2, 1],
        weights: [[[0, 0]]],
        biases: [[0]],
    };
    const dataset = {
        name: 'Single positive',
        points: [{ x: 1, y: 1, label: 1 }],
    };
    let config = initial;
    let firstLoss;
    let lastLoss;
    for (let i = 0; i < 20; i++) {
        const step = trainStep(config, dataset, 0.1, 1);
        firstLoss ??= step.loss;
        lastLoss = step.loss;
        assert.ok(Number.isFinite(step.loss));
        config = step.config;
    }
    assert.ok(lastLoss < firstLoss / 2);
    assert.ok(forwardPass([1, 1], config).at(-1)[0] > 0.75);
    assert.equal(initial.weights[0][0][0], 0);
});

function frameHarness() {
    let nextId = 0;
    const queued = new Map();
    return {
        globals: {
            requestAnimationFrame: (callback) => {
                queued.set(++nextId, callback);
                return nextId;
            },
            cancelAnimationFrame: (id) => queued.delete(id),
        },
        advance(time) {
            const callbacks = [...queued.values()];
            queued.clear();
            callbacks.forEach((callback) => callback(time));
        },
        queued,
    };
}

test('training loop cancels on teardown and cannot restart from an already queued callback', () => {
    const frames = frameHarness();
    const { startFrameLoop } = load(
        'src/lib/labs/frame-loop.ts',
        {},
        frames.globals
    );
    let steps = 0;
    const stop = startFrameLoop(() => steps++);
    frames.advance(16);
    assert.equal(steps, 1);
    const stale = [...frames.queued.values()][0];
    stop();
    stale();
    assert.equal(steps, 1);
    assert.equal(frames.queued.size, 0);
});

test('shader pause freezes time, failed compilation retains the last program, and teardown releases GPU resources', () => {
    const frames = frameHarness();
    let now = 0,
        shaderValid = true,
        nextId = 0;
    const deleted = { shaders: [], programs: [], buffers: [] };
    const times = [];
    const gl = {
        ARRAY_BUFFER: 1,
        STATIC_DRAW: 2,
        VERTEX_SHADER: 3,
        FRAGMENT_SHADER: 4,
        COMPILE_STATUS: 5,
        LINK_STATUS: 6,
        FLOAT: 7,
        TRIANGLE_STRIP: 8,
        createBuffer: () => ({ id: ++nextId }),
        createShader: () => ({ id: ++nextId }),
        createProgram: () => ({ id: ++nextId }),
        getShaderParameter: () => shaderValid,
        getProgramParameter: () => true,
        getShaderInfoLog: () => 'Invalid shader',
        getUniformLocation: (_program, name) => name,
        getAttribLocation: () => 0,
        uniform1f: (name, value) => {
            if (name === 'u_time') times.push(value);
        },
        deleteShader: (value) => deleted.shaders.push(value),
        deleteProgram: (value) => deleted.programs.push(value),
        deleteBuffer: (value) => deleted.buffers.push(value),
    };
    for (const name of [
        'bindBuffer',
        'bufferData',
        'shaderSource',
        'compileShader',
        'attachShader',
        'linkProgram',
        'viewport',
        'useProgram',
        'uniform2f',
        'enableVertexAttribArray',
        'vertexAttribPointer',
        'drawArrays',
    ])
        gl[name] = () => {};
    const { createShaderRenderer } = load(
        'src/lib/labs/shader-renderer.ts',
        {
            '../../data/shaderData': { DEFAULT_VERTEX_SHADER: 'vertex' },
        },
        { ...frames.globals, performance: { now: () => now } }
    );
    const errors = [];
    const renderer = createShaderRenderer(
        {
            getContext: () => gl,
            width: 100,
            height: 100,
            clientWidth: 100,
            clientHeight: 100,
        },
        {
            onError: (error) => errors.push(error),
            onCompile() {},
            onFrameStats() {},
            audio: () => ({ bass: 0, mid: 0, treble: 0 }),
        }
    );
    renderer.compile('valid');
    now = 1000;
    frames.advance(now);
    renderer.setPaused(true);
    now = 2000;
    frames.advance(now);
    assert.equal(times.at(-1), 1);
    renderer.setPaused(false);
    now = 2500;
    frames.advance(now);
    assert.equal(times.at(-1), 1.5);
    shaderValid = false;
    renderer.compile('invalid');
    assert.equal(errors.at(-1), 'Invalid shader');
    assert.equal(deleted.programs.length, 0);
    now = 2600;
    frames.advance(now);
    assert.equal(times.at(-1), 1.6);
    renderer.dispose();
    renderer.dispose();
    assert.equal(deleted.programs.length, 1);
    assert.equal(deleted.buffers.length, 1);
    assert.equal(deleted.shaders.length, 3);
    assert.equal(frames.queued.size, 0);
});

test('microphone permission resolving after unmount stops the stream without opening an audio context', async () => {
    let resolve,
        stops = 0,
        contexts = 0;
    const { createMicrophone } = load(
        'src/lib/labs/microphone.ts',
        {},
        {
            navigator: {
                mediaDevices: {
                    getUserMedia: () =>
                        new Promise((done) => {
                            resolve = done;
                        }),
                },
            },
            AudioContext: class {
                constructor() {
                    contexts++;
                }
            },
        }
    );
    const microphone = createMicrophone();
    const pending = microphone.enable();
    microphone.dispose();
    resolve({ getTracks: () => [{ stop: () => stops++ }] });
    assert.equal(await pending, false);
    assert.equal(stops, 1);
    assert.equal(contexts, 0);
});

test('microphone initialization failure releases the acquired stream and audio context', async () => {
    let stops = 0,
        closes = 0;
    const { createMicrophone } = load(
        'src/lib/labs/microphone.ts',
        {},
        {
            navigator: {
                mediaDevices: {
                    getUserMedia: async () => ({
                        getTracks: () => [{ stop: () => stops++ }],
                    }),
                },
            },
            AudioContext: class {
                createAnalyser() {
                    throw new Error('Audio unavailable');
                }
                async close() {
                    closes++;
                }
            },
        }
    );
    await assert.rejects(createMicrophone().enable(), /Audio unavailable/);
    assert.equal(stops, 1);
    assert.equal(closes, 1);
});

test('run-length steps preserve Unicode symbols and run boundaries', () => {
    const { generateRLESteps } = load('src/data/compressionData.ts');
    const steps = generateRLESteps('🧠🧠ééé');
    assert.equal(steps.length, 2);
    assert.equal(steps[0].currentRun.char, '🧠');
    assert.equal(steps[0].currentRun.count, 2);
    assert.equal(steps[1].position, 2);
    assert.equal(steps[1].currentRun.count, 3);
    assert.equal(
        steps
            .map((step) => step.currentRun.char.repeat(step.currentRun.count))
            .join(''),
        '🧠🧠ééé'
    );
});
