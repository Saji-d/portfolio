"use client";

import { useEffect, useRef } from "react";

export default function TimelineProgress({
  center = false,
}: {
  center?: boolean;
}) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastP = -1;

    const transform = (p: number) =>
      `${center ? "translateX(-50%) " : ""}scaleY(${p.toFixed(4)})`;

    const update = () => {
      raf = 0;
      if (reduced) {
        if (lastP !== 1) {
          lastP = 1;
          el.style.transform = transform(1);
        }
        return;
      }
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const start = vh * 0.75;
      const end = vh * 0.55;
      const range = rect.height + (start - end);
      const p = Math.min(1, Math.max(0, (start - rect.top) / range));
      if (p === lastP) return;
      lastP = p;
      el.style.transform = transform(p);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [center]);

  return (
    <div
      ref={lineRef}
      aria-hidden="true"
      className={`absolute w-px origin-top bg-accent ${
        center ? "bottom-0 left-1/2 top-0" : "bottom-1 left-[15px] top-2"
      }`}
      style={{ transform: center ? "translateX(-50%) scaleY(0)" : "scaleY(0)" }}
    />
  );
}
