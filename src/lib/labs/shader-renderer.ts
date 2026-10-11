import { DEFAULT_VERTEX_SHADER } from '../../data/shaderData';

export type AudioBands = { bass: number; mid: number; treble: number };

export function createShaderRenderer(
    canvas: HTMLCanvasElement,
    callbacks: {
        onError: (error: string | null) => void;
        onCompile: (milliseconds: number) => void;
        onFrameStats: (stats: {
            fps: number;
            elapsed: number;
            width: number;
            height: number;
            bands: AudioBands;
        }) => void;
        audio: () => AudioBands;
    }
) {
    const context = canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        preserveDrawingBuffer: false,
    });
    if (!context) throw new Error('WebGL is not supported in your browser.');
    const gl = context;

    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('Unable to allocate a WebGL buffer.');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
    );
    let program: WebGLProgram | null = null;
    let frame = 0;
    let disposed = false;
    let paused = false;
    let elapsed = 0;
    let previous = performance.now();
    let lastFps = previous;
    let frames = 0;

    function compileShader(source: string, type: number) {
        const shader = gl.createShader(type);
        if (!shader) throw new Error('Unable to allocate a shader.');
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const message =
                gl.getShaderInfoLog(shader) || 'Shader compilation failed';
            gl.deleteShader(shader);
            throw new Error(message);
        }
        return shader;
    }

    function compile(source: string) {
        if (disposed) return;
        const started = performance.now();
        let vertex: WebGLShader | null = null;
        let fragment: WebGLShader | null = null;
        let next: WebGLProgram | null = null;
        try {
            vertex = compileShader(DEFAULT_VERTEX_SHADER, gl.VERTEX_SHADER);
            fragment = compileShader(source, gl.FRAGMENT_SHADER);
            next = gl.createProgram();
            if (!next) throw new Error('Unable to allocate a shader program.');
            gl.attachShader(next, vertex);
            gl.attachShader(next, fragment);
            gl.linkProgram(next);
            if (!gl.getProgramParameter(next, gl.LINK_STATUS)) {
                throw new Error(
                    gl.getProgramInfoLog(next) || 'Program link failed'
                );
            }
            if (program) gl.deleteProgram(program);
            program = next;
            next = null;
            callbacks.onError(null);
            callbacks.onCompile(Math.round(performance.now() - started));
        } catch (error) {
            callbacks.onError(
                error instanceof Error
                    ? error.message
                    : 'Shader compilation failed'
            );
        } finally {
            if (vertex) gl.deleteShader(vertex);
            if (fragment) gl.deleteShader(fragment);
            if (next) gl.deleteProgram(next);
        }
    }

    function render(now: number) {
        if (disposed) return;
        if (!paused) elapsed += Math.max(0, now - previous) / 1000;
        previous = now;
        if (program) {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }
            gl.useProgram(program);
            const time = gl.getUniformLocation(program, 'u_time');
            const resolution = gl.getUniformLocation(program, 'u_resolution');
            if (time !== null) gl.uniform1f(time, elapsed);
            if (resolution !== null) gl.uniform2f(resolution, width, height);
            const bands = callbacks.audio();
            for (const name of ['bass', 'mid', 'treble'] as const) {
                const location = gl.getUniformLocation(program, `u_${name}`);
                if (location !== null) gl.uniform1f(location, bands[name]);
            }
            const position = gl.getAttribLocation(program, 'a_position');
            if (position >= 0) {
                gl.enableVertexAttribArray(position);
                gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
            frames++;
        }
        if (now - lastFps >= 1000) {
            callbacks.onFrameStats({
                fps: Math.round((frames * 1000) / (now - lastFps)),
                elapsed,
                width: canvas.width,
                height: canvas.height,
                bands: callbacks.audio(),
            });
            frames = 0;
            lastFps = now;
        }
        frame = requestAnimationFrame(render);
    }
    frame = requestAnimationFrame(render);

    return {
        compile,
        setPaused(value: boolean) {
            paused = value;
            previous = performance.now();
        },
        dispose() {
            if (disposed) return;
            disposed = true;
            cancelAnimationFrame(frame);
            if (program) gl.deleteProgram(program);
            gl.deleteBuffer(buffer);
            program = null;
        },
    };
}
