"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 3.91, decimals: 2, suffix: "", label: "CGPA / 4.00" },
  { value: 5, decimals: 0, suffix: "x", label: "Dean's Award" },
  { value: 20, decimals: 0, suffix: "+", label: "Projects built" },
  { value: 2, decimals: 0, suffix: "+", label: "Years building" },
];

const DURATION_MS = 1400;

// Four centred stats: each value counts up from zero and pops in with a short
// stagger when the block scrolls into view; the label sits centred beneath it.
export default function HeroStats() {
  const gridRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [shown, setShown] = useState(false);

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(true);
      setFinal();
      return;
    }

    // Start every number at zero, then count up.
    STATS.forEach((s, i) => {
      const el = valueRefs.current[i];
      if (el) el.textContent = (0).toFixed(s.decimals);
    });

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(true);
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
          style={{ transitionDelay: `${i * 110}ms` }}
          className={`flex flex-col items-center gap-1.5 text-center transition-all duration-700 ease-out ${
            shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-90 opacity-0"
          }`}
        >
          <span
            ref={(el) => {
              valueRefs.current[i] = el;
            }}
            className="font-display text-[1.6rem] font-semibold tabular-nums tracking-tight text-text-primary lg:text-[2.25rem]"
          >
            {s.value.toFixed(s.decimals) + s.suffix}
          </span>
          <span className="card-meta whitespace-nowrap">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
