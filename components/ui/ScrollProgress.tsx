"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const update = () => {
      raf.current = 0;
      const bar = barRef.current;
      if (!bar) return;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? Math.min(1, el.scrollTop / max) : 0;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-2 shadow-[0_0_12px_rgba(79,209,197,0.6)] transition-transform duration-150 ease-out will-change-transform"
      />
    </div>
  );
}
