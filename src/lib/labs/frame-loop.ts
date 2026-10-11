/** Own one animation loop and make cleanup safe even during a frame callback. */
export function startFrameLoop(step: () => void) {
    let stopped = false;
    let frame: number;
    function tick() {
        if (stopped) return;
        step();
        if (!stopped) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => {
        stopped = true;
        cancelAnimationFrame(frame);
    };
}
