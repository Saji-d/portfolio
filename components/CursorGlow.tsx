"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const glowEl: HTMLDivElement = el;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx;
    let y = ty;
    let lastMove = 0;
    let visible = !document.hidden;

    function tick() {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (performance.now() - lastMove > 3000) return;
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glowEl.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
    }

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      lastMove = performance.now();
      glowEl.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      glowEl.style.opacity = "0";
      lastMove = 0;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && lastMove) {
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] opacity-0 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(circle, rgba(79,209,197,0.07) 0%, rgba(124,125,255,0.04) 40%, transparent 65%)",
      }}
    />
  );
}
