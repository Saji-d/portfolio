"use client";

import { useEffect, useRef } from "react";

interface Stat {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 3.92, decimals: 2, suffix: "", label: "CGPA / 4.00" },
  { value: 5, decimals: 0, suffix: "x", label: "Dean's Award" },
  { value: 12, decimals: 0, suffix: "+", label: "Projects Built" },
  { value: 2, decimals: 0, suffix: "+", label: "Years Building" },
];

const DURATION_MS = 1000;

export default function HeroStats() {
  const gridRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const finalText = (s: Stat) => s.value.toFixed(s.decimals) + s.suffix;
    const setFinal = () => {
      STATS.forEach((s, i) => {
        const el = valueRefs.current[i];
        if (el) el.textContent = finalText(s);
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFinal();
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(Math.max((now - t0) / DURATION_MS, 0), 1);
          const eased = 1 - Math.pow(1 - p, 3);
          if (p < 1) {
            STATS.forEach((s, i) => {
              const el = valueRefs.current[i];
              if (el) el.textContent = (s.value * eased).toFixed(s.decimals);
            });
            raf = requestAnimationFrame(tick);
          } else {
            setFinal();
          }
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    observer.observe(grid);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-1"
    >
      {STATS.map((s, i) => (
        <div key={s.label}>
          <div className="font-display text-2xl font-medium tracking-tight text-text-primary sm:text-3xl">
            <span ref={(el) => { valueRefs.current[i] = el; }}>
              {s.value.toFixed(s.decimals) + s.suffix}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-text-muted">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
