import { useCallback, useEffect, useRef, useState } from 'react';
import { createShaderRenderer } from '../lib/labs/shader-renderer';
import { createMicrophone } from '../lib/labs/microphone';

export function useShaderCanvas(code: string, paused: boolean) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderer = useRef<ReturnType<typeof createShaderRenderer> | null>(
        null
    );
    const microphone = useRef<ReturnType<typeof createMicrophone> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        fps: 0,
        elapsed: 0,
        width: 0,
        height: 0,
        bands: { bass: 0, mid: 0, treble: 0 },
    });
    const [compileTimeMs, setCompileTimeMs] = useState<number | null>(null);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const mic = createMicrophone();
        microphone.current = mic;
        try {
            renderer.current = createShaderRenderer(canvasRef.current, {
                onError: setError,
                onFrameStats: setStats,
                onCompile: setCompileTimeMs,
                audio: () => mic.readBands(),
            });
        } catch (error) {
            // Report an external browser capability failure after setup completes.
            queueMicrotask(() =>
                setError(
                    error instanceof Error
                        ? error.message
                        : 'WebGL initialization failed'
                )
            );
        }
        return () => {
            mic.dispose();
            microphone.current = null;
            renderer.current?.dispose();
            renderer.current = null;
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => renderer.current?.compile(code), 500);
        return () => clearTimeout(timer);
    }, [code]);
    useEffect(() => renderer.current?.setPaused(paused), [paused]);

    const handleToggleAudio = useCallback(async () => {
        const mic = microphone.current;
        if (!mic) return;
        if (audioEnabled) {
            mic.disable();
            setAudioEnabled(false);
            setAudioError(null);
            return;
        }
        try {
            const enabled = await mic.enable();
            if (microphone.current !== mic) return;
            setAudioEnabled(enabled);
            setAudioError(null);
        } catch (error) {
            if (microphone.current !== mic) return;
            setAudioError(
                error instanceof Error
                    ? error.message
                    : 'Microphone access denied'
            );
            setAudioEnabled(false);
        }
    }, [audioEnabled]);

    const recompile = useCallback(
        (source: string) => renderer.current?.compile(source),
        []
    );
    return {
        canvasRef,
        error,
        setError,
        ...stats,
        compileTimeMs,
        audioEnabled,
        audioError,
        handleToggleAudio,
        recompile,
    };
}
