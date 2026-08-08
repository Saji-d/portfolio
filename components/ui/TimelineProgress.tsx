"use client";

import { useEffect, useRef } from "react";

export default function TimelineProgress() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastP = -1;

    const update = () => {
      raf = 0;
      if (reduced) {
        if (lastP !== 1) {
          lastP = 1;
          el.style.transform = "scaleY(1)";
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
      el.style.transform = `scaleY(${p.toFixed(4)})`;
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
  }, []);

  return (
    <div
      ref={lineRef}
      aria-hidden="true"
      className="absolute bottom-0 left-4 top-0 w-px origin-top bg-accent sm:left-1/2"
      style={{ transform: "scaleY(0)" }}
    />
  );
}
