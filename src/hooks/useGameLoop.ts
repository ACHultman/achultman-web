import { useEffect, useRef, useCallback } from 'react';

export function useGameLoop(
  callback: (deltaTime: number) => void,
  active: boolean
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const loop = useCallback((time: number) => {
    const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 1000, 0.05) : 1 / 60;
    lastTimeRef.current = time;
    callbackRef.current(dt);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (active) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, loop]);
}

export function useKeyboard(keys: string[]) {
  const pressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) {
        e.preventDefault();
        pressed.current[e.key] = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) {
        pressed.current[e.key] = false;
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [keys]);

  return pressed;
}
