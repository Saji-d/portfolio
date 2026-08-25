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
  { value: 15, decimals: 0, suffix: "+", label: "Projects Built" },
  { value: 2, decimals: 0, suffix: "+", label: "Years Building" },
];

const DURATION_MS = 1400;

// A compact closing block beneath the hero's left-column copy, sized to its
// content (inline-grid) rather than stretching across the section - it
// belongs to the text column, not the full hero width. Large value type
// with a subordinate mono label stacked underneath, hairline dividers
// between items instead of individual progress bars.
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
      className="inline-grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-9 sm:gap-y-0 lg:gap-x-10"
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className="relative flex flex-col gap-1.5 sm:pl-7 sm:first:pl-0 lg:pl-8"
        >
          {i > 0 && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-0.5 hidden h-7 w-px shrink-0 bg-line sm:block lg:h-8"
            />
          )}
          <span
            ref={(el) => {
              valueRefs.current[i] = el;
            }}
            className="font-display text-[1.6rem] font-semibold tracking-tight text-text-primary lg:text-[2.25rem]"
          >
            {s.value.toFixed(s.decimals) + s.suffix}
          </span>
          <span className="card-meta whitespace-nowrap">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
