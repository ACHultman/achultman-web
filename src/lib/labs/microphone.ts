import type { AudioBands } from './shader-renderer';

export function createMicrophone() {
    let context: AudioContext | undefined;
    let stream: MediaStream | undefined;
    let analyser: AnalyserNode | undefined;
    let bins: Uint8Array<ArrayBuffer> | undefined;
    let generation = 0;
    let disposed = false;

    function disable() {
        generation++;
        stream?.getTracks().forEach((track) => track.stop());
        stream = undefined;
        void context?.close().catch(() => {});
        context = undefined;
        analyser = undefined;
        bins = undefined;
    }

    return {
        async enable() {
            if (disposed) return false;
            disable();
            const attempt = generation;
            const acquired = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            if (disposed || attempt !== generation) {
                acquired.getTracks().forEach((track) => track.stop());
                return false;
            }
            stream = acquired;
            try {
                context = new AudioContext();
                analyser = context.createAnalyser();
                analyser.fftSize = 2048;
                analyser.smoothingTimeConstant = 0.8;
                context.createMediaStreamSource(stream).connect(analyser);
                bins = new Uint8Array(analyser.frequencyBinCount);
                return true;
            } catch (error) {
                disable();
                throw error;
            }
        },
        disable,
        readBands(): AudioBands {
            if (!analyser || !bins || !context)
                return { bass: 0, mid: 0, treble: 0 };
            analyser.getByteFrequencyData(bins);
            const binHz = context.sampleRate / analyser.fftSize;
            const bassEnd = Math.min(Math.floor(200 / binHz), bins.length);
            const midEnd = Math.min(Math.floor(2000 / binHz), bins.length);
            const average = (start: number, end: number) => {
                let sum = 0;
                for (let i = start; i < end; i++) sum += bins![i]!;
                return sum / (Math.max(1, end - start) * 255);
            };
            return {
                bass: average(0, bassEnd),
                mid: average(bassEnd, midEnd),
                treble: average(midEnd, bins.length),
            };
        },
        dispose() {
            disposed = true;
            disable();
        },
    };
}
