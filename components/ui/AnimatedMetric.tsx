"use client";

import { useEffect, useRef } from "react";

interface ParsedMetric {
  value: number;
  decimals: number;
  suffix: string;
  useGrouping: boolean;
}

function parseMetric(raw: string): ParsedMetric | null {
  const match = raw.match(/^(-?[\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, numPart, suffix] = match;
  const value = parseFloat(numPart.replace(/,/g, ""));
  if (Number.isNaN(value)) return null;
  const decimalMatch = numPart.match(/\.(\d+)/);
  return {
    value,
    decimals: decimalMatch ? decimalMatch[1].length : 0,
    suffix,
    useGrouping: numPart.includes(","),
  };
}

const DURATION_MS = 1200;

// Renders the final value server-side (so there's no layout shift and no
// content if JS never runs), then counts up from 0 once it enters the
// viewport. Values that don't parse as numeric (e.g. "EfficientNet-B0")
// are left exactly as given — this only ever animates real metrics.
// A fill fraction only makes sense for bounded metrics (percentages, or a
// ratio already on a 0–1 scale like ROC-AUC) — a raw count such as "2,237"
// has no natural ceiling, so it gets no bar rather than a meaningless one.
function fillFraction(parsed: ParsedMetric): number | null {
  if (parsed.suffix === "%") return Math.min(1, parsed.value / 100);
  if (parsed.suffix === "" && parsed.value > 0 && parsed.value <= 1) return parsed.value;
  return null;
}

export default function AnimatedMetric({
  value,
  className,
  showBar = false,
}: {
  value: string;
  className?: string;
  showBar?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const parsed = parseMetric(value);
  const fraction = parsed ? fillFraction(parsed) : null;

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;
    const { value: target, decimals, suffix, useGrouping } = parsed;

    const format = (n: number) =>
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping,
      }) + suffix;

    const setBar = (p: number) => {
      if (barRef.current && fraction !== null) {
        barRef.current.style.transform = `scaleX(${(fraction * p).toFixed(4)})`;
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = format(target);
      setBar(1);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / DURATION_MS);
          const eased = 1 - Math.pow(1 - p, 3);
          if (p < 1) {
            el.textContent = format(target * eased);
            setBar(eased);
            raf = requestAnimationFrame(tick);
          } else {
            el.textContent = format(target);
            setBar(1);
          }
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <span ref={ref} className={className}>
        {value}
      </span>
      {showBar && fraction !== null && (
        <span
          aria-hidden="true"
          className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-line"
        >
          <span
            ref={barRef}
            className="block h-full w-full origin-left scale-x-0 rounded-full bg-accent transition-transform duration-100"
          />
        </span>
      )}
    </>
  );
}
