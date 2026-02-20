import { useCallback, useRef, useEffect } from 'react';

export const BAR_COUNT = 7;
const REST_SCALE = 0.12;
const REST_OPACITY = 0.25;

const barConfigs = [
  { minScale: 0.2, maxScale: 0.55, speed: 0.43, phase: 0 },
  { minScale: 0.25, maxScale: 0.85, speed: 0.31, phase: 1.2 },
  { minScale: 0.3, maxScale: 1.0, speed: 0.37, phase: 0.5 },
  { minScale: 0.2, maxScale: 0.7, speed: 0.53, phase: 2.1 },
  { minScale: 0.35, maxScale: 0.95, speed: 0.29, phase: 1.7 },
  { minScale: 0.2, maxScale: 0.8, speed: 0.47, phase: 0.8 },
  { minScale: 0.15, maxScale: 0.5, speed: 0.41, phase: 1.4 },
];

function getAnimatedScale(time: number, i: number) {
  const c = barConfigs[i];
  const sin1 = Math.sin(time * c.speed * 0.01 + c.phase);
  const sin2 = Math.sin(time * c.speed * 0.007 + c.phase * 1.5);
  return c.minScale + (c.maxScale - c.minScale) * ((sin1 + sin2 + 2) * 0.25);
}

export function useMusicBars(active: boolean) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  const scalesRef = useRef<number[]>(Array(BAR_COUNT).fill(REST_SCALE));
  const introRef = useRef(false);
  const introStartRef = useRef(0);
  const prevActiveRef = useRef(false);

  const applyBar = useCallback((bar: HTMLDivElement, scale: number) => {
    bar.style.transform = `scaleY(${scale})`;
    bar.style.opacity = '1';
    bar.style.background = '#ffffff';
  }, []);

  const animate = useCallback((time: number) => {
    if (!prevActiveRef.current) return;

    const bars = barsRef.current;

    if (introRef.current) {
      const elapsed = time - introStartRef.current;
      const progress = Math.min(elapsed / 450, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      bars.forEach((bar, i) => {
        if (!bar) return;
        const from = scalesRef.current[i];
        const target = getAnimatedScale(time, i);
        applyBar(bar, from + (target - from) * ease);
      });

      if (progress >= 1) introRef.current = false;
    } else {
      bars.forEach((bar, i) => {
        if (!bar) return;
        const scale = getAnimatedScale(time, i);
        scalesRef.current[i] = scale;
        applyBar(bar, scale);
      });
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [applyBar]);

  useEffect(() => {
    barsRef.current.forEach((bar) => {
      if (bar) applyBar(bar, REST_SCALE);
    });
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [applyBar]);

  useEffect(() => {
    if (active === prevActiveRef.current) return;
    prevActiveRef.current = active;

    if (active) {
      introRef.current = true;
      introStartRef.current = performance.now();
      rafRef.current = requestAnimationFrame(animate);
      if (glowRef.current) {
        glowRef.current.style.opacity = '0';
      }
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;

      const animationDuration = BAR_COUNT * 35 + 350;

      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const delay = (BAR_COUNT - 1 - i) * 35;
        bar.style.transition = `transform 0.35s cubic-bezier(0.55, 0, 1, 0.45) ${delay}ms, opacity 0.3s ease ${delay}ms, background 0.3s ease ${delay}ms`;
        applyBar(bar, REST_SCALE);
      });

      setTimeout(() => {
        if (glowRef.current) {
          glowRef.current.style.opacity = '0';
        }
        barsRef.current.forEach((bar) => {
          if (bar) bar.style.transition = 'none';
        });
        scalesRef.current.fill(REST_SCALE);
      }, animationDuration);
    }
  }, [active, animate, applyBar]);

  return { barsRef, glowRef };
}
